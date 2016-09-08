//electron entry-point
var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var path = require( "path" );
const {nativeImage} = require('electron');

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}

const gitrobotic_icon = nativeImage.createFromPath('./gitrobotic.png');

app.on('ready',function() {

  if(process.env.NODE_ENV === 'development') {
    const REACT_DEVELOPER_TOOLS = require('electron-devtools-installer').REACT_DEVELOPER_TOOLS;
    var installExtension = require('electron-devtools-installer').default;
    installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
  }

  var mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    icon: gitrobotic_icon
  });
  mainWindow.loadURL('file://' + __dirname + '/src/index-electron.html');

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  // }

});
