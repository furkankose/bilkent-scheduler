import React, { memo } from "react";
import PropTypes from "prop-types";

import TableCell from "./Cell";

import "./Schedule.css";

import days from "../../constants/days";
import hours from "../../constants/hours";
import colors from "../../constants/colors";

const TOTAL_DAYS = days.length;

const Schedule = ({
  courses,
  timeslots,
  excludedTimeslots,
  onCellClick,
  ...props
}) => {
  const getCourseIndex = (timeslotIndex) => {
    if (timeslots[timeslotIndex] === undefined) {
      return undefined;
    }

    return timeslots[timeslotIndex].course;
  };

  const isTimeslotEmpty = (timeslotIndex) => {
    const courseIndex = getCourseIndex(timeslotIndex);

    return courseIndex === undefined;
  };

  const getCourseCode = (timeslotIndex) => {
    const courseIndex = getCourseIndex(timeslotIndex);
    const course = courses[courseIndex] || {};

    return course.courseCode;
  };

  const getClassroom = (timeslotIndex) => {
    const timeslot = timeslots[timeslotIndex] || {};

    return timeslot.classroom;
  };

  const getColorStyle = (timeslotIndex) => {
    const courseIndex = getCourseIndex(timeslotIndex);

    return { style: { color: colors[courseIndex] } };
  };

  return (
    <table id="schedule" {...props}>
      <thead>
        <tr>
          <th>&nbsp;</th>
          {days.map((day) => (
            <th key={`${day}`}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hours.map((hour, hIndex) => (
          <tr key={hour}>
            <>
              <th>{hour}</th>
              {days.map((day, dIndex) => (
                <TableCell
                  colorStyle={getColorStyle(hIndex * TOTAL_DAYS + dIndex)}
                  courseCode={getCourseCode(hIndex * TOTAL_DAYS + dIndex)}
                  classroom={getClassroom(hIndex * TOTAL_DAYS + dIndex)}
                  isExcluded={excludedTimeslots[hIndex * TOTAL_DAYS + dIndex]}
                  isEmpty={isTimeslotEmpty(hIndex * TOTAL_DAYS + dIndex)}
                  onClick={() => onCellClick(hIndex * TOTAL_DAYS + dIndex)}
                  key={`${hour}-${day}`}
                />
              ))}
            </>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Schedule.defaultProps = {
  courses: [],
  timeslots: {},
};

Schedule.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.object),
  timeslots: PropTypes.shape({}),
  excludedTimeslots: PropTypes.shape({}).isRequired,
  onCellClick: PropTypes.func.isRequired,
};

export default memo(Schedule);
