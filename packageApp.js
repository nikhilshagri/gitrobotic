var packager = require('electron-packager');

const options = {
  dir: '.',
  arch: 'x64',
  download: {
    cache: './electron-cache'
  },
  out: './dist',
  ignore: /dist/,
  overwrite: 'true',
  platform: 'linux',
  tmpdir: './tmpdir',
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