import git from "isomorphic-git";
import config from "./config";

const cloneRepository = async (repositoryUrl) => {
  return git.clone({
    ...config,
    url: repositoryUrl,
    corsProxy: "https://cors.isomorphic-git.org",
    singleBranch: true,
    depth: 1,
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

export { cloneRepository, createNewCommit, pushToRemote };
