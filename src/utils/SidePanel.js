import React from 'react';

import { Link } from 'react-router'

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';

var url = require("file!./../static/branchIcon.svg");
var urlFolder = require("file!./../static/folderIcon.svg");

const constStyles = {
  fontFamily: `apple-system,
          BlinkMacSystemFont,"Segoe UI",
          Roboto,Helvetica,Arial,sans-serif,
          "Apple Color Emoji","Segoe UI Emoji",
          "Segoe UI Symbol"`,
  darkRed: '#b60a0a',
  grey: '#ededed',
  borderGrey: '#7e7e7e',
};

class ListElement extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      focus: false
    };
  }

  toggleFocus = () => {
    this.setState( (prevState) => {
      return {focus: !prevState.focus };
    });
  };

  render = () => {

    // these two objects are not defined under a styles object
    const notFocus = {
      display: 'flex',
      alignItems: 'center',
      fontFamily: constStyles.fontFamily,
      color: 'black',
      padding: 10,
      fontWeight: 500,
      paddingLeft: 40,
      fontSize: 14,
      cursor: 'pointer',
      width: '100%',
        textDecoration: 'none'
    };

    const focus={
      ...notFocus,
      backgroundColor: '#c8c8c8'
    };

    return (
      <Link to='repoOps/commitTree'
      style={this.state.focus?focus:notFocus}
      onMouseEnter={this.toggleFocus} onMouseLeave={this.toggleFocus}
      onClick={this.props.clickCB} >
        <img style={{width: 8, height: 14}} src={url}></img>
        <div style={{paddingLeft: 15}} >{this.props.name}</div></Link>
    );
  }
}

class SidePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  listItemClick = (ref) => {
    this.props.setCurrentBranchCB(ref);
  }

  componentWillReceiveProps = (newprops) => {
  }

  render = () => {

    let locals = [];
    let remotes = [];
    let remoteNames = [];

    this.props.refsData.forEach( (ref, index) => {

      const listItem =
      <ListElement
      name={ref.name}
      link='repoOps/commitTree'
      key={index}
      clickCB={() => {this.listItemClick(ref);}} />;

      if(ref.type === 'LOCAL')
        locals.push(listItem);
      else if(ref.name.match(/\/+/g)) {
        let remoteName = ref.name.split('/')[0];
        const index = remoteNames.indexOf(remoteName);
        if(index === -1) {
          remoteNames.push(remoteName);
          remotes.push([]);
        }
        else {
         remotes[index].push(React.cloneElement(listItem,{name: ref.name.split('/')[1]}));
        }
      }
    });

    const styles = {
      main: {
        ...this.props.styleInherited,
        // border: '2px solid'+constStyles.borderGrey,
        fontFamily: constStyles.fontFamily,
        backgroundColor: constStyles.grey,
        overflow: 'scroll',
        height: 450
      },
      listComponent: {
        fontFamily: constStyles.fontFamily,
        color: 'black',
        fontWeight: 600,
      },
      listItem: {
        display: 'flex',
        alignItems: 'center',
        fontFamily: constStyles.fontFamily,
        fontWeight: 600,
        color: 'black',
        padding: 10,
        paddingLeft: 40,
        fontSize: 14,
        cursor: 'pointer',
      }
    };

    // construct list component for remotes
    // TODO: Insert custom made divs instead of ugly List components
    const listRemotes = remoteNames.map( (remoteName, index) => {
      if(remotes[index].length > 0) {
        return <ListItem primaryText={remoteName} primaryTogglesNestedList={true}
        leftIcon={<img style={{width: 15, height: 24, fill: 'black'}} src={urlFolder}></img>}
        nestedItems={remotes[index]} key={index}
        style={styles.listComponent}/>;
      }
    });

    return (
    <div style={styles.main} >
    <List>
      <List>
        <Subheader style={styles.listComponent}>Working Directory</Subheader>
        <ListItem
          primaryText='Staging Area'
          style={styles.listItem}
          containerElement={<Link to='repoOps/stagingArea' />}
          linkButton={true} />
      </List>
      <Divider />
      <List>
        <Subheader style={styles.listComponent}>Branches</Subheader>
          <List>
            <Subheader style={styles.listComponent}>Local</Subheader>
            {locals}
          </List>
          <List>
            <Subheader style={styles.listComponent}>Remotes</Subheader>
            {listRemotes}
          </List>
      </List>
    </List>
    </div>
    );
  }
}

export default SidePanel;