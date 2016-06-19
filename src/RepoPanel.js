import React from 'react';
import ReactDOM from 'react-dom';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import Paper from 'material-ui/Paper';

class Repo extends React.Component {
	constructor(props) {
		super(props);
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
					<div style={styles.selectDiv} >
						<div style={styles.containerDiv} >
							<Paper style={styles.paper} onClick={this.dirSelect}>
								<FolderIcon style={styles.folder} />
								<p style={styles.para1}>SELECT A FOLDER</p>
							</Paper>
							<p style={styles.para1} >OR..</p>
							<p style={styles.para2} >enter absolute path to repository:</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Repo;