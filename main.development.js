//electron entry-point

var app =require('app');
var BrowserWindow = require('browser-window');
var path = require( "path" );

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}

app.on( 'ready',function() {
  var mainWindow = new BrowserWindow({
  });
   mainWindow.loadURL('file://' + __dirname + '/src/index-electron.html');

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

});
