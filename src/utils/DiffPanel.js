import React from 'react';

import Promise from 'promise';
import Diff from './Diff';

class DiffPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diffTree: [],
    };
  }

  formatDiffs = (props) => {

    const LINESTATUS = {
      UNMODIFIED: 32,
      ADDED: 43,
      DELETED: 45,
    };

    if(props.diffs) {

      const diffs = props.diffs;
      let formattedDiffs = [];
      let patches;

      let promises1 = [];
      diffs.forEach( (diff, index) => {
          // push all promises to get the patches from every diff
          promises1.push( diff.patches().then((retPatches) => {
            patches = retPatches;
          }) );
        });

      // perform operation on those patches after you get them
      return Promise.all(promises1)
      .then( () => {
        if(patches) {

          let promises2 = [];
          patches.forEach( (patch, index) => {

            // this array stores all the lines and their corresponding headers
            // belonging to a single diff
            let diffLines = [];
            // obtain promises for all the hunks belonging to a single
            // patch. Each patch corresponds to a single file
            promises2.push( patch.hunks().then( (hunks) => {

              let promises3 = [];
              hunks.forEach( (hunk) => {

                // obtain promises for getting the lines from each hunk
                promises3.push(
                  hunk.lines().then( (lines) => {
                  diffLines.push(hunk.header());
                  lines.forEach( (line) => {
                      diffLines.push(String.fromCharCode(line.origin())+line.content());
                  });
                }) );
              });

              //return promises for inserting the lines into diffLines
              return Promise.all(promises3);
            })
            .then( () => {
              let filePath = 'old:'+patch.oldFile().path()+' new:'+patch.newFile().path();
              formattedDiffs.push({lines: diffLines, path: filePath });
            }));
          });

          // return promises for inserting ALL the diffLines belonging to ALL the patches
          return Promise.all(promises2);
        }
      })
      .done( () => {
         this.setState({
          diffTree: formattedDiffs.map((diff, index) => {
                      return (<Diff diff={diff} key={index} />);
                    }),
          });
      });
    }
  }

  componentDidMount = () => {
    this.formatDiffs(this.props);
  }

  componentWillReceiveProps = (newprops) => {
    this.formatDiffs(newprops);
  }

  render = () => {

    const styles = {
      main: {
        width: '100%',
        border: '1px solid black',
      },
    };
    return(
      <div style={styles.main}>{this.state.diffTree}</div>
    );
  }
}

export default DiffPanel;