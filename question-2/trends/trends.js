if (Meteor.isClient) {
  Meteor.call("checkTwitter", function(error, results) {
        console.log(results); //results.data should be a JSON object
    });

}

if (Meteor.isServer) {
   Meteor.methods({
        checkTwitter: function () {
            this.unblock();
            return Meteor.http.call("GET", "https://api.twitter.com/1.1/trends/available.json");
        }
    });
}
