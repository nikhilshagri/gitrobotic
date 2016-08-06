var Git = require("nodegit");


var getMostRecentCommit = function(repository) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function(commit) {
  return commit.message();
};

var pathToRepo = require("path").resolve("../dummy-repo");
Git.Repository.open(pathToRepo)
  .then(getMostRecentCommit)
  .then(getCommitMessage)
  .then(function(message) {
    console.log(message);
  })
  .catch((err) => {console.log(err);});