import git from "isomorphic-git";
import config from "./config";

const findUnstagedFiles = async (filepaths) => {
  let statusMatrix = await git.statusMatrix({
    ...config,
    filepaths,
  });

  const unstagedFiles = statusMatrix
    .filter(([, , workdir, stage]) => workdir !== stage)
    .map(([filename]) => filename);

  return unstagedFiles;
};

const stageFiles = async (filePaths) => {
  return Promise.all(
    filePaths.map((filepath) => git.add({ ...config, filepath }))
  );
};

export { findUnstagedFiles, stageFiles };
