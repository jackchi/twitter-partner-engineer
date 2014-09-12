/**
 * Global Declarations
 */
Places = new Mongo.Collection("places"); // shared mongo collection
world = {city: "Worldwide", woeid: "1"}; // worldwide World On Earth ID

if (Meteor.isClient) {

  // Default SelectedMarker is 'The World' ; when no marker is selected
  Session.setDefault("SelectedMarker", world);
  Session.setDefault("SelectedTrends", { trends: [{name: "", url: ""}], created_at : ""});

  Tracker.autorun(function(){
    console.log("autorun");
    Meteor.call('getTrendPlace', world.woeid, function(error, results) {
            var trendsArray = [];
            if(!error){
              results.data[0].trends.forEach(function(element, index, array) {
                trendsArray.push({ name: element.name, url: element.url});
              });
              Session.set("SelectedTrends", {trends : trendsArray, created_at : results.data[0].created_at});
            } else {
              console.log(error);
            }
    });  
  });

  Meteor.startup(function() {
    console.log("dom loaded");
  });

  Template.registerHelper("SelectedTrends", function() {
    return Session.get("SelectedTrends");
  });

  Template.map.helpers({
    citySelected : function() {
      return Session.get("SelectedMarker").city;
    }, 
    lastUpdated : function(dateString) {
      return moment(dateString).fromNow();
    }  
  });

  Template.map.rendered= function() { 
    console.log("map rendered");

    /* MapBox Resources*/
    var map = null;
    var featureLayer = null;
    L.mapbox.accessToken = 'pk.eyJ1IjoiamFja2NoaSIsImEiOiJtRzZOaVZ3In0.kDJ3_YRuaTSYJAOZW7xR0A';

    /**
     * [MapBox Object containing our Map] 
     * @type {[https://www.mapbox.com/mapbox.js/api/v2.1.0/]}
     * 
     * Initialzies center to lattitude & longitude with default zoom level and disable continousWorld wrap
     * Adds the geo-search control button
     * Adds the geo-locate control button
     */    
    map = L.mapbox.map('map', 'jackchi.jc0138k5', {center: [25, -20], zoom: 2, tileLayer: {continuousWorld: false}})
      .addControl(L.mapbox.geocoderControl('mapbox.places-v1')); 
    L.control.locate({locateOptions:{ maxZoom: 5}}).addTo(map);

    markerClickevent = function(e){
          var cityName = e.layer.feature.properties.title,
              cityWoeid = e.layer.feature.properties.woeid;
          Session.set("SelectedMarker", {city: cityName, woeid: cityWoeid});
          Meteor.call('getTrendPlace', cityWoeid, function(error, results) {
            var trendsArray = [];
            if(!error){
              // console.log(results.data[0]);
              results.data[0].trends.forEach(function(element, index, array) {
                trendsArray.push({name: element.name, url: element.url});
              });
              Session.set("SelectedTrends", {trends : trendsArray, created_at : results.data[0].created_at});
            } else {
              console.log(error);
            }
            map.panTo(e.layer.getLatLng());
          });
    }

    // Geo-Locate Button
    // TODO: To fix WOEID to Longitude and Latitude location
    map.on("locationfound", function(e){
        console.log(e);
        Meteor.call("getClosest", e.latitude, e.longitude, function(error, results){
          if(!error){
            console.log(results.data);
            var j = {
                      "type": "Feature",
                      "geometry": {
                        "type": "Point",
                        "coordinates": [e.longitude, e.latitude]
                      },
                      "properties": {
                        "title": results.data[0].name,
                        "description": "",
                        "woeid": results.data[0].woeid,
                        "marker-color": "#fc4353",
                        "marker-size": "large",
                        "marker-symbol": "city"
                      }
                    };
            L.mapbox.featureLayer(j)
              .on('click', markerClickevent)
              .addTo(map);
            d = Places.insert(j);    
            console.log(d);
          } else {  
            console.log("Error Retrieving Closest Place: " + error);
          }
        });
      })
      .on("locationerror", function(e){
        console.log(e);
        alert("Location Access Denied");
      });

    /**
     * Subscribes to 'Places' Mongo Collection 
     * Async callback when 'Places' is ready():
     *   - Finds 'Places' Collection
     *   - Initializes MapBox FeatureLayer
     */
    Meteor.subscribe("places", function() {
      // Extract relevant geoJSON data from Places Mongo Collection
      var geojson = Places.find().map(function(n) { return { geometry: n.geometry, properties: n.properties, type: n.type}});
      
      /**
       * [FeatureLayer contains our GeoJSON Markers]
       * @type {[https://www.mapbox.com/mapbox.js/api/v2.1.0/l-mapbox-featurelayer/]}
       *
       * Sets GeoJson from extracted 'Places' Collection
       * Attaches 'click' event to the markers
       *  - Sets Session 'SelectedMarker' 
       */
      featureLayer = L.mapbox.featureLayer()
        .setGeoJSON(geojson)
        .on('mouseover', function(e){
          e.layer.openPopup();
        })
        .on('popupclose', function(e){
          Session.set("SelectedMarker", world);
        })
        .on('click', markerClickevent)
        .addTo(map);
    });  

    
  };

}

if (Meteor.isServer) {
  /**
   * Twitter Application-Only Authentication
   * https://dev.twitter.com/oauth/application-only
  */
  var OAuth2 = Meteor.npmRequire('OAuth').OAuth2,
      oauth2 = new OAuth2('oddsxvxeiaQWTj4zwhNn3JJoP', '0ffj8eeImgevD7TlAERGRzVukYo3SdA4jx0zhrqfDpgQYpzaGu', 'https://api.twitter.com/', null, 'oauth2/token', null),
      token = "" ;  

  /**
   * [Places Collection contains GeoJSON Markers]
   * @type {[GeoJSON]} Geographic Data Struction (http://geojson.org/)
   * @type {woeid} Yahoo 32-bit World On Earth ID (https://developer.yahoo.com/geo/geoplanet/guide/concepts.html)
   *
   * Note: Coordinate uses [longitude, latitude]
   */
  // TODO: Auto-pubulicate woeid
  // TODO: Auto-publish Places from Twitter's Available API
  if (Places.find({}).fetch().length == 0) {
    Places.insert({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.414, 37.776]
      },
      "properties": {
        "title": "San Francisco",
        "description": "",
        "woeid": 2487956,
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    });
    Places.insert({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-77.03238901390978,38.913188059745586]
      },
      "properties": {
        "title": "Washington DC",
        "description": "",
        "woeid" : 2514815,
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    });  
    Places.insert({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [2.3452377319335938, 48.853646831055556]
      }, 
      "properties": {
        "title": "Paris",
        "description": "",
        "woeid": 615702,
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    });
    Places.insert({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ 151.209115, -33.866300]
      }, 
      "properties": {
        "title": "Sydney",
        "woeid":1105779,
        "description": "",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    });
    Places.insert({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ 106.83380126953125, -6.169910324287827]
      }, 
      "properties": {
        "title": "Singapore",
        "woeid": 23424948,
        "description": "",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    });
    Places.insert({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ -43.20648193359375, -22.890092534815874]
      }, 
      "properties": {
        "title": "Rio de Janiero",
        "woeid":1047378,
        "description": "",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    });
    Places.insert({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ 28.9874267578125, 41.044145364313174]
      }, 
      "properties": {
        "title": "Istanbul",
        "woeid" : 2344116,
        "description": "",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    });
    Places.insert({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ 2.15606689453125, 41.38505194970683]
      }, 
      "properties": {
        "title": "Barcelona",
        "woeid": 395273,
        "description": "",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    });
    Places.insert( {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.005941, 40.712784]
      }, 
      "properties": {
        "title": "New York City",
        "woeid": 2459115,
        "description": "",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    });
    Places.insert({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [18.424055, -33.924869]
      }, 
      "properties": {
        "title": "Cape Town",
        "woeid": 23424942,
        "description": "",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    });
    Places.insert({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-0.200000, 5.550000]
      }, 
      "properties": {
        "title": "Accra",
        "woeid": 23424824,
        "description": "",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    });
  }

  /**
   * Grants and Returns Twitter OAuth2 Access Token
   */
  function getToken() {
    var token = Async.runSync(function(done) {
        oauth2.getOAuthAccessToken('', {'grant_type': 'client_credentials'}, function (err, access_token) {
           done(err, access_token);
          });  
      });
      return token.result;
  }

  Meteor.startup(function() {
    /* Acquire Client-Only Application Access Token */
    token = getToken();
    
    Meteor.publish("places", function () {
      return Places.find();
    });
  });

  Meteor.methods({
    'getTrendsAvailable' : function() {
      var avail = Async.runSync(function(done) {
        Meteor.http.call(
          "GET", 
          "https://api.twitter.com/1.1/trends/available.json", 
          { headers: { Authorization: 'Bearer ' + token }},
          function (err, results) {
            console.log("ServerAvailable: " + results.content);
            done(err, results);
          }
        );
      });  
      return avail.result;
    },
    'getClosest' : function(latitude, longitude) {
      var closest = Async.runSync(function(done) {
        Meteor.http.call(
          "GET",
          "https://api.twitter.com/1.1/trends/closest.json",
          { headers: { Authorization: 'Bearer ' + token},
            params: { lat: latitude, long: longitude} },
          function (err, results) {
            console.log("ServerClosest: " + results.content);
            done(err, results)
          }  
          );
      });
      return closest.result;
    }, 
    'getTrendPlace' : function(woeid) {
      var trends = Async.runSync(function(done) {
        Meteor.http.call(
          "GET", 
          "https://api.twitter.com/1.1/trends/place.json", 
          { headers: { Authorization: 'Bearer ' + token},
            params: { id: woeid } }, 
          function (err, results) { 
            console.log("ServerPlace: " + results.content);
            done(err, results)    
          });
        });
      return trends.result;
    },
    // TODO: Replaced by marker clicks for individual trend update
    //@deprecated: ran into problem of rate limit
    'updateTrends' : function() {
      var placesList = Places.find({}).map(function(n) {return { title: n.properties.title, woeid: n.properties.woeid}; });
      placesList.forEach(function(element, index, array) {
        var trend = Meteor.call("getTrendPlace", element.woeid, function (error, result) {
          if(!error){
            console.log(element.title + ": "  + result.data[0]);

            var description = "<i>last indexed: " + moment(result.data[0].as_of).fromNow() + "</i><br>";

            result.data[0].trends.forEach(function(e,i,a) {
              description+="<a href='"+e.url+"' target=new>"+e.name+"</a><br />";
            });

            Places.update({"properties.woeid": element.woeid}, 
                          {$set: {"properties.description" : description}}, 
                          function(error, docs){
                            if(!error){
                              console.log("Done Updating Places: " + docs);
                              return Places.find().fetch();
                            }
                            else
                              console.log(error);    
                          });
          } else {
            console.log(error);
            return error;
          }      
        });  
      });
    }
  });
}  
