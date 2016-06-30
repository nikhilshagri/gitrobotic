import React from 'react';
import ReactDOM from 'react-dom';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import Paper from 'material-ui/Paper';


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
        margin: 5,
        marginTop: 10,
        cursor: 'pointer',
        backgroundColor: '#C6C6C6',
        // width: '30%',
      },
      main:{
        width: '20%',
        height: '100%',
        // backgroundColor: 'black',
        // borderTop: '1px solid #464646',
        boxShadow: '7px 7px 7px #FFFFFF',
      }
    };

    let rows = [];
    this.props.repos.forEach((function(repo, index) {
        rows.push(
          <Card style={styles.card} key={index} onMouseDown={this.handleClick.bind(this, index)} >
            <CardHeader title={repo.name} />
          </Card>
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
    const style = {
      margin:10
    };

    return (
      <div style={style} >
        <input style={{width: 300, height: 30, fontSize: 20}} type="text" placeholder="Enter Repo path here..." ref="textField"
        value={this.state.value} onChange={this.updateValue} onKeyDown={this.sendQuery} />
        <RaisedButton label="Get Commits!"  onMouseDown={this.sendQuery} />
      </div>
    )
  }
}

class Repo extends React.Component {
  constructor(props) {
    super(props);
  }

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
    console.log('filechange!',event.target.files);
  }

  render = () => {

    const styles={
      main:{
        display:'flex',
        height: '100%'
      },
      selectDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: '#EAEAEA',
        width: '100%',
      },
      para2: {
        fontFamily: '"Roboto", sans-serif',
        fontSize: 15,
        fontWeight: 700,
      },
      para1: {
        fontFamily: '"Roboto", sans-serif',
        fontSize: 20,
        fontWeight: 700,
      },
      containerDiv: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        // position: 'absolute',
        height: 'auto',
        // left: '50%',
        // top: '50%',
      },
      paper: {
        textAlign: 'center',
        height: 200,
        width: 200,
        border: '4px dotted black',
        cursor: 'pointer',
      },
      folder: {
        width: 120,
        height: 120,
      },
    };
    return (
      <div style={this.props.style }>
        <div style={styles.main} >
          <RepoTable {...this.props} />
          <div style={styles.selectDiv} >
            <div style={styles.containerDiv} >
              <Paper style={styles.paper} onClick={this.dirSelect}>
                <FolderIcon style={styles.folder} />
                <p style={styles.para1}>SELECT A FOLDER</p>
              </Paper>
              <p style={styles.para1} >OR..</p>
              <p style={styles.para2} >enter absolute path to repository:</p>
              <SearchBar pathToRepo={this.props.pathToRepo} onKeyPress={this.props.onKeyPress} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Repo;