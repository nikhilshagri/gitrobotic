//electron entry-point

var app =require('app');
var BrowserWindow = require('browser-window');
var path = require( "path" );

app.on( 'ready',function() {
  var mainWindow = new BrowserWindow({
  });
   mainWindow.loadURL('file://' + __dirname + '/src/index-electron.html');
});
