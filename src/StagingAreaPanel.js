import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import Git from 'nodegit';

class gitFunctions {

	static refreshIndex(repoName) {
		let index;
		let oid;
		let repo;

		repoName = "../"+repoName;

		let pathToRepo = require('path').resolve(repoName);

		Git.Repository.open(pathToRepo)
			.then(function(repoResult) {
				repo = repoResult;
				return repo.refreshIndex();
			})
			.then(function(indexResult) {
				index = indexResult;
			})
			.then(function() {
			  return index.addAll();
			})
			.then(function() {
			  return index.write();
			})
			.then(function() {
			  return index.writeTree();
			})
			.then(function(oidResult) {
			  oid = oidResult;
			  return Git.Reference.nameToId(repo, "HEAD");
			})
			.then(function(head) {
			  return repo.getCommit(head);
			})
			.then(function(parent) {
				const currTimeInSecs = (new Date()).getTime()/1000;
			  let author = Git.Signature.create("Author name",
			    "emailid@domain.com", currTimeInSecs , 0);
			  let committer = Git.Signature.create("Author name",
			    "emailid@domain.com", currTimeInSecs , 0);

			  return repo.createCommit("HEAD", author, committer, "message", oid, [parent]);
			})
			.done(function(commitId) {
				StagingArea.refreshIndex(commitId);
			});
	}

	static globalgetStatus(repoName) {

		repoName = "../"+repoName;

		let pathToRepo = require('path').resolve(repoName);
		console.log("repoName="+pathToRepo);

		Git.Repository.open(pathToRepo)
		  .then(function(repo) {
		    repo.getStatus().then(function(statuses) {
		      function statusToText(status) {
		        var words = [];
		        if (status.isNew()) { words.push("NEW"); }
		        if (status.isModified()) { words.push("MODIFIED"); }
		        if (status.isTypechange()) { words.push("TYPECHANGE"); }
		        if (status.isRenamed()) { words.push("RENAMED"); }
		        if (status.isIgnored()) { words.push("IGNORED"); }

		        return words.join(" ");
		      }

		      statuses.forEach(function(file) {
		        console.log(file.path() + " " + statusToText(file));
		      });
		    });
		});
	}
}


class StagingArea extends React.Component {
	constructor(props) {
		super(props);
	}

	static refreshIndex(commitId) {
		console.log('Commit Hash:'+commitId);
	}

	getStatus = () => {
		(globalgetStatus.bind(this))(this.props.repo);
	}

	render = () => {
		return (
			<div>
				<RaisedButton label='Create Commit!' onMouseDown={gitFunctions.refreshIndex.bind(gitFunctions,this.props.repo)} />
				<RaisedButton label='Get status!' onMouseDown={this.getStatus} />
			</div>
		)
	};
}

export default StagingArea;