//electron entry-point

import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var path = require( "path" );

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}

app.on( 'ready',function() {

installExtension(REACT_DEVELOPER_TOOLS)
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));

  var mainWindow = new BrowserWindow({
    width: 1200,
    height: 600
  });
   mainWindow.loadURL('file://' + __dirname + '/src/index-electron.html');

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

});
