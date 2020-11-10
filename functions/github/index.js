export * from "./files";
export * from "./repository";
/*
import { findUnstagedFiles, stageFiles } from "./files";
import { cloneRepository, createNewCommit, pushToRemote } from "./repository";

const commitAndPushUnstagedFiles = async (filePaths) => {
  const unstagedFiles = await findUnstagedFiles(filePaths);

  if (unstagedFiles.length === 0) {
    console.log("There is no unstaged file!");
    return;
  }

  await stageFiles(unstagedFiles);
  await createNewCommit("chore: sync application data");
  await pushToRemote();
};

export { cloneRepository, commitAndPushUnstagedFiles };
*/
