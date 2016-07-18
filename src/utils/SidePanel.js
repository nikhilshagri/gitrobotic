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
        fontFamily: constStyles.fontFamily,
        color: 'white',
        padding: 4,
        lineHeight: 0,
        fontSize: 14,
      }
    };

    this.props.refsData.forEach( (ref, index) => {

      const listItem = <ListItem key={index}
      style={styles.listItem}
      primaryText={ref.name}
      onClick={() => this.listItemClick(ref)}
      containerElement={<Link to='repoOps/commitTree' />}
      linkButton={true} />;

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