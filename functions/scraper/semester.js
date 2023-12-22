import merge from "merge-deep";
import moment from "moment";
import { promises as fs } from "fs";

const semesterNames = { 1: "Fall", 2: "Spring", 3: "Summer" };

const findRegistrationDates = (academicCalendarData) => {
  const registrationDateDescriptions = [
    "Departments finalize schedules, quotas, and elective pools",
    "Course requests for Summer School through SRS",
  ];

  const registrationDates = [];

  for (const { date, description } of academicCalendarData) {
    const isRegistrationDate = registrationDateDescriptions.includes(
      description
    );

    if (isRegistrationDate) {
      registrationDates.push(date);
    }
  }

  return registrationDates;
};

const findCurrentSemester = (registrationDates) => {
  const [beginningDateOfAcademicYear] = registrationDates;
  const academicYear = beginningDateOfAcademicYear.split(" ").pop();

  const currentSemesterIndex = registrationDates
    .map((date) => moment() > moment(date, "D MMMM YYYY").subtract(1, "months"))
    .lastIndexOf(true);

  if (currentSemesterIndex === -1) {
    return {
      year: academicYear - 1,
      number: 3,
    };
  }

  // Semester numbers
  // Fall -> 1
  // Spring -> 2
  // Summer -> 3
  return {
    year: parseInt(academicYear, 10),
    number: currentSemesterIndex + 1,
  };
};

const getSemesters = (academicCalendar) => {
  const registrationDates = findRegistrationDates(academicCalendar);
  const currentSemester = findCurrentSemester(registrationDates);
  const semesters = [];

  for (
    let semesterYear = currentSemester.year;
    semesterYear >= 2000;
    semesterYear -= 1
  ) {
    const isCurrentSemesterYear = semesterYear === currentSemester.year;

    for (
      let semesterNumber = isCurrentSemesterYear ? currentSemester.number : 3;
      semesterNumber >= 1;
      semesterNumber -= 1
    ) {
      const semester = {
        year: `${semesterYear}-${semesterYear + 1}`,
        code: `${semesterYear}${semesterNumber}`,
        name: semesterNames[semesterNumber],
      };

      semesters.push(semester);
    }
  }

  return semesters;
};

const findSemestersNotFetchedBefore = async (offeringsDirectory, semesters) => {
  let isOfferingsFolderCreated = true;

  try {
    await fs.access(offeringsDirectory, fs.F_OK);
  } catch (error) {
    console.log(error);
    isOfferingsFolderCreated = false;
  }

  if (!isOfferingsFolderCreated) {
    return [];
  }

  const offeringsFiles = await fs.readdir(offeringsDirectory);

  return semesters.filter(
    (semester) => !offeringsFiles.includes(`${semester.code}.json`)
  );
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

export {
  getSemesters,
  findSemestersNotFetchedBefore,
  mergeOfferingsIntoObject,
};
