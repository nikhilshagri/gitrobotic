import React from 'react';
import ReactDOM from 'react-dom';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import Paper from 'material-ui/Paper';

const constStyles = {
  fontFamily: `apple-system,
          BlinkMacSystemFont,"Segoe UI",
          Roboto,Helvetica,Arial,sans-serif,
          "Apple Color Emoji","Segoe UI Emoji",
          "Segoe UI Symbol"`,
  darkRed: '#b60a0a',
  grey: '#f9f9f9',
  borderGrey: '#7e7e7e',
};

// import {dialog} from 'electron';
const {dialog} = require('electron').remote;

class RepoTable extends React.Component {

  constructor(props) {
    super(props);
  }

  handleClick = (i) => {
    this.props.selectRepo(i);
  }

  render() {
    const styles= {
      card:{
        margin: 10,
        marginTop: 4,
        marginBottom: 4,
        cursor: 'pointer',
        padding: 15,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: constStyles.darkRed,
        fontWeight: 600,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        borderLeft: '3px solid'+constStyles.darkRed,
      },
      main:{
        width: '17%',
        paddingTop: 7,
        backgroundColor: constStyles.grey,
        display: 'flex',
        flexDirection: 'column',
      }
    };

    let rows = [];
    this.props.repos.forEach((function(repo, index) {
        rows.push(
          <div style={styles.card}
          key={index}
          onMouseDown={this.handleClick.bind(this, index)} >
          {repo.name}
          </div>
        );
    }).bind(this));
    return (
        <div style={styles.main} >
          {rows}
        </div>
    )
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={ value:props.pathToRepo };
  }

  updateValue = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  sendQuery = (event) => {
    if(!event.which || (event.which && event.which === 13) )
      this.props.onKeyPress(this.state.value);
  }

  render() {
    const styles = {
      main: {
        margin: 10,
        marginTop: 20,
      },
      labelStyle: {
        color: constStyles.darkRed,
        fontFamily: constStyles.fontFamily,
        fontWeight: 700,
      },
      input: {
        width: 300,
        height: 30,
        fontSize: 20,
        color: constStyles.darkRed
      }
    };

    return (
      <div style={styles.main} >
        <input style={styles.input} type="text" placeholder="Enter Repo path here..." ref="textField"
        value={this.state.value} onChange={this.updateValue} onKeyDown={this.sendQuery} />
        <RaisedButton label="Get Commits!" labelStyle={styles.labelStyle} onMouseDown={this.sendQuery} />
      </div>
    )
  }
}

class Repo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusPaper: false
    }
  }

  toggleFocus = () => {
    this.setState((prevState) => {
      return  {
        focusPaper: !prevState.focusPaper
      };
    });
  };

  dirSelect = (event) => {
    let path = dialog.showOpenDialog({
      title:'title',
      buttonLabel: 'label',
      properties: [ 'openDirectory' ]
    });
    if(path) {
      path = path[0];
      this.props.onKeyPress(path);
    }
  }

  fileChange = (event) => {
  }

  render = () => {

    const paperStyle = {
      display: 'flex',
      alignItems: 'center',
      height: 50,
      padding: 15,
      fontSize: 30,
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: constStyles.fontFamily,
    };

    const styles={
      main:{
        display:'flex',
        height: '100%',
        fontFamily: constStyles.fontFamily,
        color:constStyles.darkRed,
      },
      selectDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        width: '83%',
      },
      para2: {
        fontSize: 15,
        fontWeight: 700,
      },
      containerDiv: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        height: 'auto',
      },
      paper: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        padding: 15,
        fontSize: 30,
        fontWeight: 700,
        fontFamily: constStyles.fontFamily,
        color:constStyles.darkRed,
        border: '2px solid'+constStyles.darkRed,
        cursor: 'pointer',
      },
      focus: {
        ...paperStyle,
        color:'white',
        backgroundColor: constStyles.darkRed,
        border: '3px solid white',
      },
      notFocus: {
        ...paperStyle,
        color:constStyles.darkRed,
        border: '3px solid'+constStyles.darkRed,
      }
    };
    return (
        <div style={styles.main} >
          <RepoTable {...this.props} />
          <div style={styles.selectDiv} >
            <div style={styles.containerDiv} >
              <Paper style={this.state.focusPaper?styles.focus:styles.notFocus}
              onClick={this.dirSelect}
              onMouseEnter={this.toggleFocus} onMouseLeave={this.toggleFocus} >
                <p style={styles.para1}>SELECT A FOLDER</p>
              </Paper>
              <p style={styles.para1} >OR..</p>
              <p style={styles.para2} >enter absolute path to repository:</p>
              <SearchBar pathToRepo={this.props.pathToRepo} onKeyPress={this.props.onKeyPress} />
            </div>
          </div>
        </div>
    );
  }
}

export default Repo;