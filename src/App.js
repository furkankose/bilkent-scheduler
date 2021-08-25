import React, { useState, useRef } from "react";
import { useLocalStorage, useUpdateEffect, useEffectOnce } from "react-use";
import ReactGA from "react-ga";

import {
  Container,
  Grid,
  Paper,
  Icon,
  IconButton,
  Link,
  Box,
} from "@material-ui/core";
import { GitHub as GitHubIcon } from "@material-ui/icons";

import SemesterSelector from "./components/SemesterSelector";
import CourseSelector from "./components/CourseSelector/CourseSelector";
import Courses from "./components/Courses";
import InstructorSelector from "./components/InstructorSelector";
import Schedule from "./components/Schedule";
import Pagination from "./components/Pagination";
import Logo from "./components/Logo";

import {
  reduceOfferings,
  prepareSchedules,
  exportScheduleAsPNG,
} from "./schedule";

import displayUserGuide from "./guide";

import "./App.css";

const App = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [excludedTimeslots, setExcludedTimeslots] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(0);
  const [isUserGuideOpened, setIsUserGuideOpened] = useState(false);

  const [isInstructorSelectorOpened, setIsInstructorSelectorOpened] = useState(
    false
  );
  const [isUserGuideCompleted, setIsUserGuideCompleted] = useLocalStorage(
    "isUserGuideCompleted",
    false
  );

  const previousStates = useRef();

  const { courses, timeslots } = schedules[selectedSchedule] || {};
  const isThereAnyExcludedTimeSlot = !!Object.values(excludedTimeslots).length;

  const includeOrExcludeTimeslot = (timeslot) => {
    if (excludedTimeslots[timeslot]) {
      const tempExcludedTimeslots = { ...excludedTimeslots };
      delete tempExcludedTimeslots[timeslot];

      setExcludedTimeslots(tempExcludedTimeslots);
    } else {
      setExcludedTimeslots({ ...excludedTimeslots, [timeslot]: true });
    }
  };
  const removeCourse = (courseIndex) => {
    setSelectedCourses([
      ...selectedCourses.slice(0, courseIndex),
      ...selectedCourses.slice(courseIndex + 1),
    ]);
  };

  const resetStates = () => {
    setSelectedCourses([]);
    setExcludedTimeslots({});
    setSchedules([]);
    setSelectedSchedule(0);
  };

  const storeStates = () => {
    previousStates.current = {
      selectedSemester,
      selectedCourses,
      excludedTimeslots,
      selectedSchedule,
    };
  };

  const closeUserGuide = () => {
    setSelectedSemester(previousStates.current.selectedSemester);
    setSelectedCourses(previousStates.current.selectedCourses);
    setExcludedTimeslots(previousStates.current.excludedTimeslots);
    setSelectedSchedule(previousStates.current.selectedSchedule);

    setIsUserGuideOpened(false);
    setIsUserGuideCompleted(true);
  };

  const fetchSemesters = async () => {
    const response = await fetch(`data/semesters.json`);
    const data = await response.json();
    const [currentSemester] = data;

    setSemesters(data);
    setSelectedSemester(currentSemester);
  };

  const fetchOfferings = async () => {
    const response = await fetch(
      `data/offerings/${selectedSemester.code}.json`
    );

    const data = await response.json();
    const reducedOfferings = Object.entries(data).reduce(reduceOfferings, []);

    setOfferings(reducedOfferings);
  };

  useUpdateEffect(() => {
    resetStates();
    fetchOfferings();
  }, [selectedSemester]);

  useUpdateEffect(() => {
    if (offerings) {
      const preparedSchedules = prepareSchedules(
        excludedTimeslots,
        selectedCourses
      );
      setSchedules(preparedSchedules);
      setSelectedSchedule(0);
    }
  }, [offerings, excludedTimeslots, selectedCourses]);

  useEffectOnce(() => {
    fetchSemesters();

    if (process.env.NODE_ENV === "production") {
      ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
      ReactGA.pageview(window.location.pathname + window.location.search);
    }

    if (!isUserGuideCompleted) {
      setIsUserGuideOpened(true);
    }
  });

  useUpdateEffect(() => {
    if (isUserGuideOpened && offerings.length) {
      storeStates();

      if (selectedCourses.length === 0) {
        setSelectedCourses([offerings[0]]);
      }

      if (!isThereAnyExcludedTimeSlot) {
        setExcludedTimeslots({ 26: true, 31: true, 36: true });
      }
    }
  }, [isUserGuideOpened, offerings]);

  useUpdateEffect(() => {
    if (schedules.length && isUserGuideOpened && isThereAnyExcludedTimeSlot) {
      displayUserGuide(closeUserGuide);
    }
  }, [schedules]);

  return (
    <>
      <Container id="container">
        <Paper id="selectors" elevation={6} data-html2canvas-ignore>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} md={4} lg={3}>
              <SemesterSelector
                {...{
                  semesters,
                  selectedSemester,
                  onChange: setSelectedSemester,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={5} lg={7}>
              <CourseSelector
                {...{
                  offerings,
                  selectedCourses,
                  onChange: setSelectedCourses,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <ReactGA.OutboundLink
                eventLabel="coffee-button"
                to="http://www.buymeacoffee.com/scheduler"
                target="_blank"
                id="coffee-button"
                className="background"
              >
                <img
                  src="/icons/cup.png"
                  alt="Buy me a coffee"
                  id="coffee-icon"
                />
                Buy me a coffee
              </ReactGA.OutboundLink>
            </Grid>
          </Grid>
        </Paper>

        <Grid id="main" container>
          <Grid id="schedule-details" item xs={12} sm={4} lg={3}>
            <Paper className="paper pb-0" elevation={6}>
              <Courses
                {...{
                  courses,
                  timeslots,
                  isFailed: !courses && selectedCourses.length > 0,
                  onCourseEdit: () => setIsInstructorSelectorOpened(true),
                  onCourseRemove: removeCourse,
                }}
              />
              <Box display="flex">
                <IconButton
                  href="https://github.com/furkankose/bilkent-scheduler"
                  data-html2canvas-ignore
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton
                  href="mailto:furkankose@alumni.bilkent.edu.tr"
                  data-html2canvas-ignore
                >
                  <Icon>email</Icon>
                </IconButton>
                <IconButton
                  onClick={() => setIsUserGuideOpened(true)}
                  data-html2canvas-ignore
                >
                  <Icon>help</Icon>
                </IconButton>
                <IconButton
                  id="capture-button"
                  color="primary"
                  onClick={exportScheduleAsPNG}
                  data-html2canvas-ignore
                >
                  <Icon>photo_camera</Icon>
                </IconButton>
              </Box>
            </Paper>
          </Grid>
          <Grid id="schedule-table" item xs={12} sm={8} lg={9}>
            <Paper className="paper" elevation={6}>
              <Schedule
                {...{
                  courses,
                  timeslots,
                  excludedTimeslots,
                  onCellClick: includeOrExcludeTimeslot,
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Pagination
          title="SCHEDULES"
          numberOfPages={schedules.length}
          activePage={selectedSchedule + 1}
          onPageChange={(i) => setSelectedSchedule(i - 1)}
          data-html2canvas-ignore
        />

        <InstructorSelector
          show={isInstructorSelectorOpened}
          courses={selectedCourses}
          onApply={setSelectedCourses}
          onClose={() => setIsInstructorSelectorOpened(false)}
        />
      </Container>

      <Box id="logo">
        <Link
          href="https://www.youtube.com/watch?v=XiLBOnqhGdY"
          target="_blank"
        >
          <Logo />
        </Link>
      </Box>
    </>
  );
};

export default App;
