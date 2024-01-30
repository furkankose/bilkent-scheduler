import reqque from "reqque";
import cheerio from "cheerio";
import merge from "merge-deep";

const WEBSITE_URL = "http://w3.bilkent.edu.tr";
const API_URL = "https://stars.bilkent.edu.tr/homepage/ajax";

const fetchPages = async (pageUrls) => {
  console.log("Total", pageUrls.length);
  const pages = await reqque(
    pageUrls,
    (pageUrl) => fetch(pageUrl).then((response) => response.ok && response.text()),
    {
      maxRetries: 10,
      batch: { size: { limit: 20 } },
      delay: { duration: { limit: 700 } },
    }
  );

  return pages.map(({ response }) => response);
};

const fetchAcademicCalendar = async () => {
  const response = await fetch(
    `${WEBSITE_URL}/bilkent/academic-calendar/`
  );

  if(!response.ok) {
    throw new Error('Fetch error (academic-calendar)');
  }

  const academicCalendarPage = await response.text()
  const $ = cheerio.load(academicCalendarPage);

  const academicCalendar = $(".tablepress tbody tr")
    .toArray()
    .map((row) => ({
      date: $(row).find("td:nth-child(1)").text().split(",").shift(),
      description: $(row).find("td:nth-child(2)").text(),
    }));

  return academicCalendar;
};

const fetchDepartments = async () => {
  const [departmentsPage] = await fetchPages([
    `${API_URL}/plainCourseCodes.php`,
  ]);


  const $ = cheerio.load(departmentsPage);

  const departments = $("#ccTable tbody tr")
    .toArray()
    .map((department) => ({
      code: $(department).find("td:nth-child(1)").text(),
      name: $(department).find("td:nth-child(2)").text(),
    }));

  return departments;
};

const fetchSchedules = async (sectionCodes, semesterCode) => {
  const pageUrls = sectionCodes.map(
    (sectionCode) =>
      `${API_URL}/schedule.php?COURSE=${sectionCode}&SEMESTER=${semesterCode}`
  );

  const schedulePages = await fetchPages(pageUrls);

  const schedules = schedulePages.map((offeringsPage) => {
    const $ = cheerio.load(offeringsPage);

    const timeslots = $("#schedule tbody td:not([align])")
      .toArray()
      .map((timeslot, index) => {
        const timeslotClass = $(timeslot).attr("class");
        const isTimeslotEmpty = !timeslotClass;

        if (isTimeslotEmpty) {
          return null;
        }

        const timeslotText = $(timeslot).text();
        const isClassroomAvailable = timeslotText.includes("-");
        const classroom = isClassroomAvailable ? timeslotText : "N/A";
        const isOnline = timeslotClass === "cl_ders_o";

        return {
          [index]: `${isOnline ? "Online" : classroom}`,
        };
      })
      .filter(Boolean);

    return { schedule: merge(...timeslots) };
  });

  return schedules;
};

const fetchOfferings = async (departmentCodes, semesterCode) => {
  const pageUrls = departmentCodes.map(
    (departmentCode) =>
      `${API_URL}/plainOfferings.php?COURSE_CODE=${departmentCode}&SEMESTER=${semesterCode}`
  );

  const offeringsPages = await fetchPages(pageUrls);

  const offeringsWithoutSchedules = offeringsPages.map((offeringsPage) => {
    const $ = cheerio.load(offeringsPage);

    return $("#poTable tbody tr")
      .toArray()
      .map((offering) => ({
        code: $(offering).find("td:nth-child(1)").text(),
        name: $(offering).find("td:nth-child(2)").text(),
        instructor: $(offering).find("td:nth-child(3)").text().trim(),
      }));
  });

  const schedules = await fetchSchedules(
    offeringsWithoutSchedules.flat().map(({ code }) => code),
    semesterCode
  );

  return merge(offeringsWithoutSchedules.flat(), schedules);
};

export { fetchAcademicCalendar, fetchDepartments, fetchOfferings };
