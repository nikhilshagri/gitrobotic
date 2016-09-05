var packager = require('electron-packager');

const options = {
  dir: __dirname,
  arch: 'x64',
  download: {
    cache: './electron-cache'
  },
  out: './dist/bin',
  overwrite: 'true',
  platform: 'linux',
  version: '1.2.1',
};

packager(options, (err, appPaths) => {
  if(err) {
    console.log(err);
  }
  else {
    console.log(appPaths);
  }
});