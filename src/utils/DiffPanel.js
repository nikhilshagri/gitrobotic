import React from 'react';

import Promise from 'promise';
import Diff from './Diff';

class DiffPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diffsArr: [],
    };
  }

  formatDiffs = (props) => {

    const LINESTATUS = {
      UNMODIFIED: 32,
      ADDED: 43,
      DELETED: 45,
    };

    if(props.diffs) {

      let diffsArr = [];
      let patches;

      let promises1 = [];
      props.diffs.forEach( (diff, index) => {
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

            // this array stores the Git line objects, header and file path
            // of a single diff
            let diffs = [];

            // obtain promises for all the hunks belonging to a single
            // patch. Each patch corresponds to a single file
            promises2.push( patch.hunks().then( (hunks) => {

              let promises3 = [];
              hunks.forEach( (hunk) => {

                // obtain promises for getting the lines from each hunk
                promises3.push(
                  hunk.lines().then( (lines) => {

                    // this makes it easier to stage hunks
                    diffs.push({
                      header: hunk.header(),
                      lines: lines,
                      path: patch.oldFile().path()
                    });
                  }) );
              });

              // return promises for inserting the lines into diffLines
              return Promise.all(promises3);
            })
            .then( () => {
              diffsArr.push({
                diffs: diffs,
                // diff already contains a path, but we need the old path as well as
                // the new one
                path: {
                  old: patch.oldFile().path(),
                  new: patch.newFile().path()
                }
              });
            }));
          });

          // return promises for inserting ALL the diffLines belonging to ALL the patches
          return Promise.all(promises2);
        }
      })
      .done( () => {

        /***
         * diffsArr: Array of diffFiles
         * diffFile: All the hunks from one single file
         *  |
         *  |-diffs: Array of diffs of ONE file
         *  |  diff: data of ONE hunk
         *  |   |
         *  |   |- header: string of header
         *  |   |- lines: array of Git line objects
         *  |   |- path: path of hunk
         *  |
         *  |-path: contains path of new and old file
         ***/

        this.setState({
          diffsArr: diffsArr
        });
      });
    }
  }

  checkboxCB = (data, path) => {
    if(Array.isArray(data))
      console.log(data.map((line) => {return line.content();}));
    else
      console.log(data.content());
    console.log(path, event);
  }

  componentDidMount = () => {
    this.formatDiffs(this.props);
  }

  componentWillReceiveProps = (newprops) => {
    this.formatDiffs(newprops);
  }

  render = () => {

    let diffTree = [];
    let diffSelect = [];

    this.state.diffsArr.forEach((diffFile, fileIndex) => {
      let { diffs, path } = diffFile;

      let formattedLines = [];

      diffs.forEach( (diff, diffIndex) => {
        let { header, lines, path } = diff;

        formattedLines.push(header);
        lines.forEach( (line) => {
            formattedLines.push(String.fromCharCode(line.origin())+line.content());
        });
      });

      // collecting all the header and lines of the hunks in a single file
      // and putting them in a diffDisplay object
      let diffDisplay = {
        lines:formattedLines,
        path: 'old:'+path.old+' new:'+path.new,
      };
      diffTree.push(<Diff diff={diffDisplay} key={fileIndex} />);

      // creating a column of checboxes to select individual lines/hunks
      diffSelect.push(

      // each div contains all the checkboxes of a single file
      <div key={fileIndex} >
        <div style={{height: 28}} />
        <div style={{ border: '1px solid white',}} >
        {diffs.map( (diff, diffIndex) => {
          let { header, lines, path } = diff;

          let callbackFn = (data, path) => {
            this.checkboxCB(data, path);
          }
          const styles = {
            checkbox: {
              height: 13,
              padding: 0,
              margin: 0,
              marginTop: 1,
              marginBottom: 1,
            }
          };
          // the header calls the callback with an array containing all the difflines
          // and the line calls the callback with its corresponding diffline
          return (
            <div key={diffIndex} >

            <input type='checkbox' style={styles.checkbox}
            onChange={() => {callbackFn(lines, path)}} />
              {lines.map( (line, lineIndex) => {
                return <input type='checkbox' style={styles.checkbox}
                key={lineIndex} onChange={(event) => {console.log(event.target); callbackFn(line, path, event);}} />;
              })}

            </div>
          );

        })}
        </div>
      </div>
      );

    });

    const styles = {
      main: {
        display: 'flex',
        width: '100%',
      },
      diffTree: {
        width: '100%',
        border: '1px solid black',
      }
    };
    return(
      <div style={styles.main}>
        {this.props.showSelect?
        <div>{diffSelect}</div>:
        null}
        <div>{diffTree}</div>
      </div>
    );
  }
}

export default DiffPanel;