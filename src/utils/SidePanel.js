import React from 'react';

import { Link } from 'react-router'

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';

const constStyles = {
  fontFamily: `apple-system,
          BlinkMacSystemFont,"Segoe UI",
          Roboto,Helvetica,Arial,sans-serif,
          "Apple Color Emoji","Segoe UI Emoji",
          "Segoe UI Symbol"`,
  darkRed: '#b60a0a',
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
      color: 'white',
      padding: 10,
      paddingLeft: 40,
      fontSize: 14,
      cursor: 'pointer',
      width: '100%',
    };

    const focus={
      ...notFocus,
      backgroundColor: '#900606'
    };

    return (
      <div
      style={this.state.focus?focus:notFocus}
      onMouseEnter={this.toggleFocus} onMouseLeave={this.toggleFocus}
      onClick={this.props.clickCB} >
        <div style={{paddingLeft: 15}}
        containerElement={<Link to='repoOps/commitTree' />}
        linkButton={true}>{this.props.name}</div>
      </div>
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
    const styles = {
      main: {
        ...this.props.styleInherited,
        border: '2px solid'+constStyles.darkRed,
        fontFamily: constStyles.fontFamily,
        backgroundColor: constStyles.darkRed,
        overflow: 'scroll',
        height: 450
      },
      listComponent: {
        fontFamily: constStyles.fontFamily,
        color: 'white',
        fontWeight: 600,
      },
      listItem: {
        display: 'flex',
        alignItems: 'center',
        fontFamily: constStyles.fontFamily,
        color: 'white',
        padding: 10,
        paddingLeft: 40,
        fontSize: 14,
        cursor: 'pointer',
      }
    };

    this.props.refsData.forEach( (ref, index) => {

      const listItem =
      <ListElement
      name={ref.name}
      link='repoOps/commitTree'
      key={index}
      clickCB={() => {this.listItemClick(ref);}} />;

      if(ref.type === 'LOCAL')
        locals.push(listItem);
      else if(ref.name.match(/\/+/g))
        remotes.push(listItem);
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
            <ListItem primaryText='Remote' primaryTogglesNestedList={true}
            nestedItems={remotes}
            style={styles.listComponent}/>
          </List>
      </List>
    </List>
    </div>
    );
  }
}

export default SidePanel;