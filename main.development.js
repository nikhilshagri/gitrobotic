//electron entry-point

var app =require('app');
var BrowserWindow = require('browser-window');
var path = require( "path" );

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}

app.on( 'ready',function() {
  var mainWindow = new BrowserWindow({
	  // show: false,
    width: 1300,
    height: 900
  });
   mainWindow.loadURL('file://' + __dirname + '/src/index-electron.html');

  // mainWindow.webContents.on('did-finish-load', () => {
  //   mainWindow.show();
  //   mainWindow.focus();
  // });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

});
