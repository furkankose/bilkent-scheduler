import html2canvas from "html2canvas";

const reduceOfferings = (offerings, [departmentCode, departmentOfferings]) => {
  const courses = Object.entries(departmentOfferings).map(
    ([courseCode, course]) => ({
      selectedInstructor: "All",
      departmentCode,
      courseCode,
      ...course,
    })
  );

  return [...offerings, ...courses];
};

const areTimeslotsOverlapping = (...timeslots) => {
  const mergedTimeslots = new Set(timeslots.flat());

  const totalTimeslots = timeslots.reduce(
    (total, timeslot) => total + timeslot.length,
    0
  );

  return mergedTimeslots.size !== totalTimeslots;
};

const getNotOverlappingSections = (
  excludedTimeslots,
  courseSection,
  schedule = { timeslots: [], courses: [] }
) => {
  if (
    areTimeslotsOverlapping(
      Object.keys(excludedTimeslots),
      Object.keys(courseSection.schedule),
      Object.keys(schedule.timeslots)
    )
  ) {
    return null;
  }

  const course = {
    courseCode: courseSection.courseCode,
    instructor: courseSection.instructor,
  };

  const courseTimeslots = { ...courseSection.schedule };

  for (const key of Object.keys(courseTimeslots)) {
    courseTimeslots[key] = {
      classroom: courseSection.schedule[key],
      course: schedule.courses.length,
    };
  }

  return {
    courses: [...schedule.courses, course],
    timeslots: { ...schedule.timeslots, ...courseTimeslots },
  };
};

const prepareSchedules = (excludedTimeslots, selectedCourses) => {
  let schedules = [];

  for (const selectedCourse of selectedCourses) {
    const newSchedules = [];

    const { selectedInstructor } = selectedCourse;
    let sections = Object.entries(selectedCourse.sections);

    if (selectedInstructor !== "All") {
      sections = sections.filter(
        ([, courseSection]) => courseSection.instructor === selectedInstructor
      );
    }

    for (const [sectionCode, courseSection] of sections) {
      let i = 0;

      courseSection.courseCode = `${selectedCourse.courseCode}-${sectionCode}`;

      do {
        const newSchedule = getNotOverlappingSections(
          excludedTimeslots,
          courseSection,
          schedules[i]
        );

        if (newSchedule) {
          newSchedules.push(newSchedule);
        }

        i += 1;
      } while (i < schedules.length);
    }

    schedules = newSchedules;
  }

  return schedules;
};

const exportScheduleAsPNG = async () => {
  const canvas = await html2canvas(document.body, {});
  const link = document.createElement("a");
  const date = new Date().toLocaleString();

  link.href = canvas.toDataURL();
  link.download = `Bilkent Scheduler - ${date}.png`;

  link.click();
};

export {
  reduceOfferings,
  areTimeslotsOverlapping,
  getNotOverlappingSections,
  prepareSchedules,
  exportScheduleAsPNG,
};
