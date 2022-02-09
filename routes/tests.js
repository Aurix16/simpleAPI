const express = require('express');
const request = require("supertest"); // module for testing routes
const query = require("../routes/query"); // require the file to be tested

const testApp = express();

// testApp.use(express.urlencoded({ extended: false }));
testApp.use(query);

// test api/ping route
 request(testApp)
  .get("/api/ping")
  .expect("Content-Type", /json/)
  .expect({ "success": true })
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });

// test /api route
request(testApp)
  .get("/api")
  .expect("Content-Type", 'text/html; charset=UTF-8')
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });

// test / route default route
request(testApp)
.get("/")
.expect("Content-Type", 'text/html; charset=UTF-8')
.expect(200)
.end(function(err, res) {
  if (err) throw err;
});

// test "/" route i.e default route
request(testApp)
.get("/api/posts")
.expect("Content-Type", /json/)
.expect(400)
.end(function(err, res) {
  if (err) throw err;
});

// test "/" route i.e route with invalid query
request(testApp)
.get("/api/posts?")
.expect("Content-Type", /json/)
.expect(400)
.end(function(err, res) {
  if (err) throw err;
});

// test "/" route i.e route with query from html file
request(testApp)
.get("/api/posts?sortBy=reads&direction=dsc&tags=science&tags=design")
.expect("Content-Type", /json/)
.expect(400)
.end(function(err, res) {
  if (err) throw err;
});

// test "/" route i.e route with query from manually typing link
request(testApp)
.get("/api/posts?sortBy=reads&direction=desc&tags=science,design")
.expect("Content-Type", /json/)
.expect(200)
.end(function(err, res) {
  if (err) throw err;
});