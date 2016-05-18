import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import ActivityArea from './ActivityArea'

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
