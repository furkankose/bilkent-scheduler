import git from "isomorphic-git";
import config from "./config";

const cloneRepository = async (repositoryUrl) => {
  return git.clone({
    ...config,
    url: repositoryUrl,
    corsProxy: "https://cors.isomorphic-git.org",
  });
};

const mergeMasterInto = async (branchName) => {
  return git.merge({
    ...config,
    ours: branchName,
    theirs: "remotes/origin/master",
  });
};

const createNewCommit = async (commitMessage) => {
  return git.commit({
    ...config,
    message: commitMessage,
  });
};

const pushToRemote = async () => {
  return git.push(config);
};

export { cloneRepository, mergeMasterInto, createNewCommit, pushToRemote };
