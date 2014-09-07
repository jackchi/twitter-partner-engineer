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
  
  // allPlaces = Meteor.call("publishPlaces", function(error, results) {
  //        console.log("ClientUpdateAllPlaces: " + results.content); 
  //    });
     

  var map = null;
  var geojson = null;
  var geojson2 = [ 
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ 2.15606689453125, 41.38505194970683]
      }, 
      "properties": {
        "title": "Barcelona, Spain",
        "description": "Barcelona, Spain",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ 28.9874267578125,
          41.044145364313174]
      }, 
      "properties": {
        "title": "Istanbul, Turkey",
        "woeid" : 2344116,
        "description": "Istanbul, Turkey",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ -43.20648193359375,
          -22.890092534815874]
      }, 
      "properties": {
        "title": "Jakarta, Indonesia",
        "description": "more trends",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ 106.83380126953125,
          -6.169910324287827]
      }, 
      "properties": {
        "title": "Istanbul, Turkey",
        "description": "Istanbul, Turkey",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ 139.833984375,
          35.8356283888737]
      }, 
      "properties": {
        "title": "Tokyo, Japan",
        "description": "<a href='http://www.google.com' target='new'>more trends</a>",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "city"
      }
    }   
    


      ];


  Template.map.rendered= function() { 
    L.mapbox.accessToken = 'pk.eyJ1IjoiamFja2NoaSIsImEiOiJtRzZOaVZ3In0.kDJ3_YRuaTSYJAOZW7xR0A';
    map = L.mapbox.map('map', 'jackchi.jc0138k5', {
    center: [40, 190],
    zoom: 2})
                  .addControl(L.mapbox.geocoderControl('mapbox.places-v1'), {keepOpen:true});
    L.control.locate().addTo(map);        

    console.log("map rendered");
    
    map.featureLayer.setGeoJSON(geojson2);

    // center on clicked marker
    map.featureLayer.on('click', function(e) {
        map.panTo(e.layer.getLatLng());
    });
    

      
  };

  Meteor.startup(function() {
    

    console.log("dom loaded");

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
    'publishPlaces' : function() {
      var placesList = Places.find({}).map(function(n) {return { title: n.properties.title, woeid: n.properties.woeid}; });
      placesList.forEach(function(element, index, array) {
        var trend = Meteor.call("getTrendPlace", element.woeid, function (error, result) {
          console.log(element.title + ": "  + result.data);
          Debug.insert(result.data);
        } );  
      });

    }
  });
}  
