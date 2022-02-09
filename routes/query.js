const path = require('path');
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); //Setting up the fetch module
const rootDir = require('../util/path');
const _ = require('underscore'); // Used this to filter duplicate entries.


const router = express.Router();


// Route handling middlewares
// Default routes for /api and / direct to homepage
router.get('/api', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'index.html'));
  });

// Default
router.get('/', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views','index.html'));
});

// Ping Route
router.get('/api/ping', (req, res, next) => {
  res.status(200).json({"success": true});
});
  
// api/posts route
router.get('/api/posts', (req, res, next) => {
  let urlVariables = req._parsedUrl.query; //get the query variables

  let params = new URLSearchParams(urlVariables);
  
  // case where no queries are passed
  if (params == ''){
    res.status(400).json({"error": "No query values"}); 
    res.end();
  }else{
  sortParameter = params.get('sortBy');
  sortDirection = params.get('direction');


  // Error handling
  //tags is not present or is empty throw error
  if ((params.get('tags') === '')||(params.get('tags') === null)||(params.has('tags') !== true)){
    res.status(400).json({"error": "Tags parameter is required"}); 
    res.end();
  }else{
  // sortby or direction has an invalid value ||(params.get('direction')!=='desc'))
  if ((params.get('direction')===('asc'))||(params.get('direction')===('desc'))){
    // sortby has an invalid value
    if ((params.get('sortBy')==='id')||(params.get('sortBy')==='likes')||(params.get('sortBy')==='popularity')||(params.get('sortBy')==='reads')){
      
      //count number of tags and update tag varible
      let queryValues = urlVariables;
      let count = (queryValues.match(/tags/g) || []).length;
      
      let urlVariablesArray = urlVariables.split('&tags='); //Split to get the tags differently
      otherQueries = urlVariablesArray.shift(); //Take out first element in the array and store in a variable

      if (count==1){ //sent via link comma seperated
        tagValues = params.get('tags');
        tags = tagValues.split(',')
      }else{ //sent from html
        tags = urlVariablesArray;
      }
      urlAddress = "https://api.hatchways.io/assessment/blog/posts?";

      // Generate the queries.
      parallelQuery(req, res, sortParameter, sortDirection); // pass in req and res to send result from promise
      async function parallelQuery(req, res, sortParameter, sortDirection){

      let promises = [];
      let result = [];
      let tagNum = 0;

      // Push all tag queries into promises array
      while(tagNum < tags.length){
        urlValue = urlAddress + 'tag=' + tags[tagNum] + '&' + otherQueries;
        promises.push(fetch(urlValue));
        tagNum++;
      }
      
      // resolve promises in parallel
      Promise.all(promises).then(function (responses) {
        // Get a JSON object from each of the responses
        return Promise.all(responses.map(function (response) {
          return response.json();
        }));
      }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
          value = data[i].posts;
          result.push(...value); // Join the json results together
        }
        result =  _.uniq(result, function(d){ return d.id }); // remove duplicate posts
        result = _.sortBy(result,sortParameter); // sort by the sortBY parameter specified

        // reverse results if sort direction is descending
        if (sortDirection == 'desc'){
          result = result.reverse();
        }

        // send resut to page
        res.send(result);
      }).catch(function (error) {
        console.log(error);
      });
      }
    }else{
      console.log('invalid sortby');
      res.status(400).json({"error": "sortby parameter is invalid"});
    }
  }else{
    res.status(400).json({"error": "direction parameter is invalid"});
    res.end();

  }} 
}
});





module.exports = router;