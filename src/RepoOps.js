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
    };
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
            refsData.push({
              name: reference.shorthand(),
              type: reference.isBranch()?'LOCAL':'NOT LOCAL',
              sha: reference.target().tostrS()
            });
          } else if (reference.isSymbolic()) {
            // console.log("Reference symbtarget:", referenceName, reference.symbolicTarget());
          }
        }));
      });

      return Promise.all(promises);
    })
    .done(() => {
      console.log(refsData);
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

  render = () => {

    let children = React.Children.map( this.props.children, child => {

        return React.cloneElement(child, {
          repo: this.props.repo,
        });
    });

    const styles = {
      main: {
        display: 'flex',
      },
      sidePanel: {
        width: '20%',
      },
      tabs: {
        overflow: 'hidden',
        width: '80%',
      }
    };

    return (
      <div style={styles.main} >
        <SidePanel {...this.props} styleInherited={styles.sidePanel} refsData={this.state.refsData} />
        <div style={styles.tabs} >
          {children || <CommitTree repo={this.props.repo} />}
        </div>
      </div>
    );
  }
}

export default RepoOps;