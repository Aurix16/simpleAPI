A simpleAPI that querys an endpoint and returns result built using node
- The results are sorted based on the sortBy values (id, popularity, reads and likes) either in ascending or descending order, whichever is specified.
- This aoolication uses the supertest module to run tests on the routes.

Improvements:
- Would be nice to redirect back to the home page and display results in a formatted way i.e using tables
- Would be great to put in caching, to reduce number of calls made to the server.