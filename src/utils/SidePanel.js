import React from 'react';

import { Link } from 'react-router'

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';

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

    this.props.refsData.forEach( (ref, index) => {

      const listItem = <ListItem key={index} primaryText={ref.name} onClick={() => this.listItemClick(ref)} />;

      if(ref.type === 'LOCAL')
        locals.push(listItem);
      else if(ref.name.match(/\/+/g))
        remotes.push(listItem);
    });

    const styles = {
      main: {
        ...this.props.styleInherited,
        border: '1px solid black',
        backgroundColor: 'grey',
        marginRight: 10,
      },
    };
    return (
    <div style={styles.main} >
      <List>
        <Subheader>Working Directory</Subheader>
        <FlatButton
          label='CommitTree'
          containerElement={<Link to='repoOps/commitTree' />}
          linkButton={true} />
        <FlatButton
          label='Staging Area'
          containerElement={<Link to='repoOps/stagingArea' />}
          linkButton={true} />
      </List>
      <Divider />
      <List>
        <Subheader>Branches</Subheader>
        <ListItem primaryText='Local' initiallyOpen={true} primaryTogglesNestedList={true}
          nestedItems={locals} />
        <ListItem primaryText='Remote' primaryTogglesNestedList={true}
          nestedItems={remotes} />
      </List>
    </div>
    );
  }
}

export default SidePanel;