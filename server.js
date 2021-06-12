const express = require('express')
const serveStatic = require('serve-static')
const serveIndex = require('serve-index')
const open = require('open')
const cors = require('cors')



const PORT = 3000;

const staticBasePath = './';

const app = express();

app.use(cors());
app.use(serveStatic(staticBasePath, { 'index': false }))
app.use(serveIndex(staticBasePath, { 'icons': true }))
app.listen(PORT);

console.log(`Static server listening on port ${PORT}.`);
open(`http://localhost:${PORT}/samples/`);