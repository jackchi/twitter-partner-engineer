// Shared Mongo Collections
Places = new Mongo.Collection("places");
Debug = new Mongo.Collection("debug");

if (Meteor.isClient) {
  // avail = Meteor.call("trendAvailable", function(error, results) {
  //       console.log("ClientAvail: " + results.content); 
  //   });

  // place = Meteor.call("trendPlace", 1, function(error, results) {
  //       console.log("ClientPlace: " + results.content); 
  //   });

  var map = null;
  var geojson2 = []; 
  var featureLayer = null;

  Template.map.rendered= function() { 
    L.mapbox.accessToken = 'pk.eyJ1IjoiamFja2NoaSIsImEiOiJtRzZOaVZ3In0.kDJ3_YRuaTSYJAOZW7xR0A';
    map = L.mapbox.map('map', 'jackchi.jc0138k5', {center: [25, -20], zoom: 2, tileLayer: {continuousWorld: false}})
      .addControl(L.mapbox.geocoderControl('mapbox.places-v1')); 
    
    /*
      Subscribe to Places collection 
      Places GeoJson Markers on the Map when Collection is ready
      Updates Trends of a Place when Marker is clicked
     */
    Meteor.subscribe("places", function() {
      var j = Places.find().map(function(n) { return {geometry: n.geometry, properties: n.properties, type: n.type}});
      
      /* Markers - FeatureLayer */
      featureLayer = L.mapbox.featureLayer()
        .setGeoJSON(j)
        .on('click', function(e){
          console.log(e);
          console.log(e.layer.feature.properties.title + ":" + e.layer.feature.properties.woeid);
          map.panTo(e.layer.getLatLng());
        })
        .addTo(map);
      
    });     

    /* GeoLocation Controls */ 
    L.control.locate({locateOptions:{ maxZoom: 5}}).addTo(map);
    map.on("locationfound", function(e){
        console.log(e);
        Meteor.call("getClosest", e.latitude, e.longitude, function(error, results){
          if(!error){
            console.log(results.data);
          } else {  
            console.log("Error Retrieving Closest Place: " + error);
          }
        });
      })
      .on("locationerror", function(e){
        console.log(e);
        alert("Location Access Denied");
      });
  };

  Template.map.events({
      'click' : function(e) {
        var updateTrendsHandle = Meteor.call("updateTrends");
        
      }
  });

}

if (Meteor.isServer) {
  // OAuth2 Tokens
  var OAuth2 = Meteor.npmRequire('OAuth').OAuth2,
      oauth2 = new OAuth2('oddsxvxeiaQWTj4zwhNn3JJoP', '0ffj8eeImgevD7TlAERGRzVukYo3SdA4jx0zhrqfDpgQYpzaGu', 'https://api.twitter.com/', null, 'oauth2/token', null),
      token = "" ;  

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
        "title": "Jakarta",
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


   
   

  function getToken() {
    var token = Async.runSync(function(done) {
        oauth2.getOAuthAccessToken('', {'grant_type': 'client_credentials'}, function (err, access_token) {
           done(err, access_token);
          });  
      });
      return token.result;
  }

  Meteor.startup(function() {
    /* Acquire Client-Application Access Token */
    token = getToken();
    console.log("Token: "+token);

    /* Update Trends In Our Places*/  
    // var trendsPlacesHandle = Meteor.call('updateTrends');
    
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
                              Meteor.publish("places", function () {
                                return Places.find();
                              });
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
