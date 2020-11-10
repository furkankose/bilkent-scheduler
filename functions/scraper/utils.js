import { promises as fs } from "fs";

const writeJsonToFile = async (directory, fileName, json) => {
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(`${directory}/${fileName}.json`, JSON.stringify(json));
};

export { writeJsonToFile };
