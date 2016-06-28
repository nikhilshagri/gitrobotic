import React from 'react';

import { Link } from 'react-router'

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';

import Git from 'nodegit';

class GitFunctions {
  static getBranchRefs(repoPath) {
    // the name of the function says that it gets refs, but
    // the function actually returns an 'open repo' promise only
    const pathToRepo = require('path').resolve(repoPath);
    return Git.Repository.open(repoPath);

  }
}

class SidePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      refsData: [],
    }
  }

  getBranchRefs = (props) => {
    let refsData = [];
    let repoTop;
    let promise = GitFunctions.getBranchRefs(props.repo.path);

    promise.then( (repo) => {
      repoTop = repo;
      return repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
    })
    .then( (referenceNames) => {

      let promises = [];

      referenceNames.forEach( (referenceName) => {
        promises.push(repoTop.getReference(referenceName).then( (reference) => {
          if (reference.isConcrete()) {
            // console.log("Reference target:", referenceName, reference.target());
            refsData.push({name: reference.shorthand(), type: reference.isBranch()?'LOCAL':'REMOTE' });
          } else if (reference.isSymbolic()) {
            // console.log("Reference symbtarget:", referenceName, reference.symbolicTarget());
          }
        }));
      });

      return Promise.all(promises);
    })
    .done(() => {
      // console.log('refsData',refsData);
      this.setState({
        refsData: refsData,
      });
      console.log('done');
    });
  }

  componentDidMount = () => {
    console.log('mounting!');
    if(this.props.repo)
      this.getBranchRefs(this.props);
  }

  componentWillReceiveProps = (newprops) => {
  }

  render = () => {

    let locals = [];
    let remotes = [];

    this.state.refsData.forEach( (ref, index) => {
      if(ref.type === 'LOCAL')
        locals.push(<ListItem key={index} primaryText={ref.name} />);
      else
        remotes.push(<ListItem key={index} primaryText={ref.name} />);
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