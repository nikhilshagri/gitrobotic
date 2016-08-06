import React from 'react';

import SidePanel from './utils/SidePanel';
import CommitTree from './CommitTreePanel';
import StagingArea from './StagingAreaPanel';

import Git from 'nodegit';

class GitFunctions {
  static getBranchRefs(repoPath) {
    // the name of the function says that it gets refs, but
    // the function actually returns an 'open repo' promise only
    const pathToRepo = require('path').resolve(repoPath);
    return Git.Repository.open(repoPath);

  }
}

class RepoOps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'CommitTree',
      refsData: [],
      currBranchRef: {},
    };
  }

  getBranchRefs = (props) => {
    let refsData = [];
    let repoTop;
    let promise = GitFunctions.getBranchRefs(props.repo.path);
    let currBranchRef;

    promise.then( (repo) => {
      repoTop = repo;
      return repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
    })
    .then( (referenceNames) => {

      let promises = [];

      referenceNames.forEach( (referenceName) => {
        promises.push(repoTop.getReference(referenceName).then( (reference) => {
          if (reference.isConcrete()) {

            const refObj = {
              name: reference.shorthand(),
              type: reference.isBranch()?'LOCAL':'NOT LOCAL',
              sha: reference.target().tostrS()
            };

            if(refObj.name === 'master')
              currBranchRef = refObj;
            refsData.push(refObj);

          } else if (reference.isSymbolic()) {
          }
        }));
      });

      return Promise.all(promises);
    })
    .done(() => {
      this.setState({
        refsData: refsData,
        currBranchRef: currBranchRef
      });
    });
  }

  setCurrentBranchCB = (ref) => {
    this.setState({
      currBranchRef: ref,
    });
  }

  componentDidMount = () => {
    if(this.props.repo)
      this.getBranchRefs(this.props);
  }

  render = () => {

    let children = React.Children.map( this.props.children, child => {
      if(child.type === CommitTree) {

        return React.cloneElement(child, {
          repo: this.props.repo,
          branchRef: this.state.currBranchRef,
        });

      }
      else {

        return React.cloneElement(child, {
          repo: this.props.repo,
        });

      }
    });

    const styles = {
      main: {
        display: 'flex',
        height: 500,
        overflow: 'hidden'
      },
      sidePanel: {
        width: '20%',
        overflow: 'hidden'
      },
      tabs: {
        overflow: 'hidden',
        height: 500,
        width: '80%',
      }
    };

    return (
      <div style={styles.main} >
        <SidePanel {...this.props}
          styleInherited={styles.sidePanel}
          refsData={this.state.refsData}
          setCurrentBranchCB={this.setCurrentBranchCB} />
        <div style={styles.tabs} >
          {children || <CommitTree repo={this.props.repo} branchRef={this.state.currBranchRef} />}
        </div>
      </div>
    );
  }
}

export default RepoOps;