Twitter Partner Engineer
========================


## Question 1: HTTP Cache Control
Write a program that determines the cache control settings for the top 100 websites.

```bash
$ python topsites.py
```

Some URLs in automatically parsed topsites cannot be reached by http.get() and used as headers. For those problems, I put the string 'not reachable'


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

