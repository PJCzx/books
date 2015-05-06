console.log("Running 'api.js'");
var elasticsearch = require('elasticsearch');
var express = require('express');
var express = express();

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  //log: 'trace'
});


//Ping the cluster
client.ping({
  requestTimeout: 30000,

  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});


//*******API*******

//add headers (found @ http://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue)
express.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:2403');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


express.get('/', function(req, res) {
  res.type('text/plain');
  res.send('API is running');
});

express.get('/books/count', function(req, res) {
  res.type('application/json');
  client.count({
        index: 'books'
    }, function (error, response) {
        if(error) {
            res.status(400).json({ error: 'message' });
        }
        else {
            res.json({ count: response.count })
        }
    });
});

express.get('/showreq', function (req, res) {
  console.log(req.body);
  res.json(req.body);
})

express.get('/api/fulltext/books', function(req, res) {
    res.type('application/json');
    client.search({
      index: 'books',
      type: 'book',
      body: {
        query: {
          match: {
            _all: req.query.text 
          }
        }
      }
    }).then(function (resp) {
        var hits = resp.hits.hits;
        res.json(resp.hits.hits);
    }, function (err) {
        console.trace(err.message);
        res.send(err);
    });
});

express.get('/api/books/geodistance', function(req, res) {
    res.type('application/json');
    client.search({
      index: 'books',
      type: 'book',
      body: {
        query: {
          filtered: {
              filter: {
                  geo_distance: {
                      distance: req.query.distance,
                      location: {
                          lat: req.query.lat,
                          lon: req.query.lon
                      }
                      
                  }
              }
          }
        }
      }
    }).then(function (resp) {
        var hits = resp.hits.hits;
        res.json(resp.hits.hits);
    }, function (err) {
        console.trace(err.message);
        res.send(err);
    });
});

express.get('/api/book', function(req, res) {
    res.type('application/json');
    
    var book = req.query;
    console.log("BOOOOK:", book);
    console.log(req.query)
    
    client.create({
        index: 'books',
        type: 'book',
        body: {
            title: book.title || "",
            creationDate: Date.now(),
            location : {
                lat : book.lat,
                lon : book.lon
            }
        }
    }, function (error, response) {
        if(error) {
            console.log("error", error);
            res.json(error);

        }
        else {
            console.log("response", response);
            res.json(response);

        }
    });
});

express.listen(process.env.PORT || 4730);
console.log("now providing API on port 4730, Elastic search must be on port : 9200")


//newBook();
//bookCount();




function newBook(book) {
    
}

function bookCount() {
    return client.count({
        index: 'books'
    }, function (error, response) {
        console.log("bookCount: ", error ? "ERROR" : "", response);
    });
}

//******************CODE
"use strict";
var Book = function (receivedParams) {
    
    //default parameters
    var params = {
        title: "Default title"
    };
    
    //merging with received parameters
    for (var attrname in receivedParams) {params[attrname] = receivedParams[attrname];}
    
    //private property
    var title = params.title;
    
    //privileged methods
    this.getTitle = function() { return title; }
}
