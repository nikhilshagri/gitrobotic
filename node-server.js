// #!/bin/env node

var express = require('express'); 
var app = express();
// app.set('view engine', 'jade');

app.use(express.static(__dirname + '/src'));

app.use('/build' , express.static(__dirname + '/build'));

// app.get('/', function(req, res) {
//     res.sendFile('src/index-electron.html', {root: __dirname });
// });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
