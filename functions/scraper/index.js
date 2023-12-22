import {
  fetchAcademicCalendar,
  fetchDepartments,
  fetchOfferings,
} from "./service";

import {
  getSemesters,
  findSemestersNotFetchedBefore,
  mergeOfferingsIntoObject,
} from "./semester";

import { writeJsonToFile } from "./utils";

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

export { scrape };
