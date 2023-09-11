import * as functions from "firebase-functions";

import { scrape as scrapeApplicationData } from "./scraper";
import {
  cloneRepository,
  mergeMainInto,
  findModifiedFiles,
  checkoutFiles,
  findUnstagedFiles,
  stageFiles,
  createNewCommit,
  pushToRemote,
} from "./github";

const updateApplicationData = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "1GB",
  })
  .pubsub.schedule("every day 05:00")
  .timeZone("Europe/Istanbul")
  .onRun(async () => {
    console.log("Cloning repository...");
    await cloneRepository(process.env.GH_REPOSITORY_URL);

    console.log("Merging main into data...");
    await mergeMainInto(`heads/${process.env.GH_BRANCH}`);

    // isomorphic-git keeps the older version of the merged files in staging area
    // that's why we need to checkout those files
    const modifiedFiles = await findModifiedFiles();
    await checkoutFiles(modifiedFiles);

    console.log("Scraping application data...");
    await scrapeApplicationData(`${process.env.PROJECT_PATH}/public/data`);

    console.log("Finding unstaged files...");
    const unstagedFiles = await findUnstagedFiles(["public/data"]);

    if (unstagedFiles.length === 0) {
      console.log("No unstaged file found!");
      return;
    }

    console.log("Staging changes...");
    await stageFiles(unstagedFiles);

    console.log("Committing changes...");
    await createNewCommit("chore: sync application data");

    console.log("Pushing local branch to remote...");
    await pushToRemote();
  });

export { updateApplicationData };
