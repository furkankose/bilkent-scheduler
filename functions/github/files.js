import git from "isomorphic-git";
import config from "./config";

const findModifiedFiles = async () => {
  const statusMatrix = await git.statusMatrix({ ...config });

  const modifiedFiles = statusMatrix
    .filter(([, head, workdir]) => head !== workdir)
    .map(([filename]) => filename);

  return modifiedFiles;
};

const checkoutFiles = async (filePaths) => {
  await Promise.all(
    filePaths.map((filepath) =>
      git.checkout({ ...config, force: true, filepath })
    )
  );
};

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

export { findModifiedFiles, checkoutFiles, findUnstagedFiles, stageFiles };
