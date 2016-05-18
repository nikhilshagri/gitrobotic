import express from 'express';

var app = express();

app.use(express.static(__dirname + '/src'));

app.listen(3000, function() {
  console.log("Express listening on port 3000");
});
