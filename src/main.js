import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import ActivityArea from './ActivityArea'

import Git from 'nodegit';

var pathToRepo = require('path').resolve('../js-reporters');

var getMostRecentCommit = function(repository) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function(commit) {
  return commit.message();
};

Git.Repository.open(pathToRepo).then(getMostRecentCommit)
.then(getCommitMessage)
.then(function(message) {
  console.log(message);
})
.catch(function(error) {
  console.log("ERROR: "+error);
});


const darkMuiTheme = getMuiTheme(darkBaseTheme);

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={darkMuiTheme}>
         <div>
           <RaisedButton label="Deflt" />
           <div> qwerty </div>
         </div>
      </MuiThemeProvider>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('app')
);
