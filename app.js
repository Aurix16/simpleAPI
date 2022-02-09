const express = require("express");
const app = express();
const path = require('path');

const queryRoutes = require('./routes/query');
const testRoutes = require('./routes/tests');

app.use(queryRoutes);
// app.use(testRoutes);

app.use(express.static(__dirname));

// Creating a server
app.listen(4000);