Twitter Partner Engineer
========================


## Question 1: HTTP Cache Control
Write a program that determines the cache control settings for the top 100 websites.

```bash
$ python topsites.py
```

Some URLs in automatically parsed topsites cannot be reached by http.get() and used as headers. For those problems, I put the string 'not reachable'

## Question 2: Twitter Trends
Write Code to interact with the Twitter API. 

* For this portion of the interview challenge, I chose to overlay [Twitter Trends](https://dev.twitter.com/docs/api/1.1) on top of [MapBox](https://www.mapbox.com/mapbox.js/api/v2.1.0/) API on the Browser with [Leaflet](http://leafletjs.com/reference.html) Plugin. 
* For Authentication I used a Node.js library [OAuth2](https://www.npmjs.org/package/oauth) client-application token authentication
* However, since most Meteor APIs are executed synchronously to get NPM's package to work in Meteor, we use
[Async](https://github.com/meteorhacks/npm#async-utilities) included in the MeteorHacks found on Meteor's package manager [Atmosphere](http://atmospherejs.com/meteorhacks/npm) 
* For Frameworks I chose [Meteor.js](http://www.meteor.com) for running server and client. 
I briefly used [Moment.js](http://momentjs.com/) for UTC to human-readable date string

```bash
$ meteor
```

Go to http://localhost:3000

## Question 3: Phonetic Search
Prepare a three-slide, five-minute presentation on a technical topic of passionate interest to you. 

Presentation [Slides](http://slides.com/jackchi/metaphone--2)
Using [DoubleMetaphone](https://github.com/hgoebl/doublemetaphone) to encode words to phoentic index


```bash
$ npm install
$ node doublemetaphone.js
```

	var DoubleMetaphone = require('doublemetaphone'),
    encoder = new DoubleMetaphone();

	console.log(encoder.doubleMetaphone('cemetery')); // correct spelling
	console.log(encoder.doubleMetaphone('cemetary')); // wrong spelling
	// Cemetery: { primary: 'SMTR', alternate: 'SMTR' }
	// Cemetary: { primary: 'SMTR', alternate: 'SMTR' }

