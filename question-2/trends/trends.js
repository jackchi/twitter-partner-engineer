if (Meteor.isClient) {
  // avail = Meteor.call("trendAvailable", function(error, results) {
  //       console.log("ClientAvail: " + results.content); 
  //   });

  place = Meteor.call("trendPlace", 1, function(error, results) {
        console.log("ClientPlace: " + results.content); 
    });

}

if (Meteor.isServer) {
  // OAuth2 Tokens
  var OAuth2 = Meteor.npmRequire('OAuth').OAuth2,
      oauth2 = new OAuth2('oddsxvxeiaQWTj4zwhNn3JJoP', '0ffj8eeImgevD7TlAERGRzVukYo3SdA4jx0zhrqfDpgQYpzaGu', 'https://api.twitter.com/', null, 'oauth2/token', null),
      token = "" ; 

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
    'trendAvailable' : function() {
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
    'trendPlace' : function(woeid) {
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
    }
  });
}  
