import merge from "merge-deep";
import { promises as fs } from "fs";
import { join } from "path";

import {
  fetchAcademicCalendar,
  fetchDepartments,
  fetchOfferings,
} from "./services/bilkent.service";

import {
  getSemesters,
  findSemestersNotFetchedBefore,
} from "./services/semester.service";

const writeJsonToFile = async (directory, fileName, json) => {
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(`${directory}/${fileName}.json`, JSON.stringify(json));
};

const mergeOfferingsIntoObject = (offerings) => {
  const offeringsObjects = offerings.map((offering) => {
    const { code, name, instructor, schedule } = offering;
    const [courseCode, sectionNumber] = code.split("-");
    const [departmentCode] = courseCode.split(" ");

    return {
      [departmentCode]: {
        [courseCode]: {
          name,
          sections: {
            [sectionNumber]: {
              instructor,
              schedule,
            },
          },
        },
      },
    };
  });

  return merge(...offeringsObjects);
};

const scrape = async (OUTPUT_DIRECTORY) => {
  const OFFERINGS_DIRECTORY = `${OUTPUT_DIRECTORY}/offerings`;

  const departments = await fetchDepartments();

  if (departments.length === 0) {
    throw new Error("No departments fetched!");
  }

  const academicCalendar = await fetchAcademicCalendar();
  const semesters = getSemesters(academicCalendar);

  const [currentSemester, ...oldSemesters] = semesters;
  const semestersNotFetchedBefore = await findSemestersNotFetchedBefore(
    OFFERINGS_DIRECTORY,
    oldSemesters
  );

  await Promise.all([
    writeJsonToFile(OUTPUT_DIRECTORY, "departments", departments),
    writeJsonToFile(OUTPUT_DIRECTORY, "semesters", semesters),
  ]);

  for (const semester of [currentSemester, ...semestersNotFetchedBefore]) {
    console.log("Semester", semester.code);

    const offerings = await fetchOfferings(
      departments.map(({ code }) => code),
      semester.code
    );

    if (offerings.length === 0) {
      throw new Error("No offerings fetched!");
    }

    const offeringsObject = mergeOfferingsIntoObject(offerings);

    await writeJsonToFile(OFFERINGS_DIRECTORY, semester.code, offeringsObject);
  }
};

(async () => {
  await scrape(join(__dirname, "../public/data"));
})();
