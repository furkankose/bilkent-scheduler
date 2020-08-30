import React, { memo } from "react";
import PropTypes from "prop-types";

import TableCell from "./Cell";

import "./Schedule.css";

import days from "../../constants/days";
import hours from "../../constants/hours";
import colors from "../../constants/colors";

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
        {hours.map((hour, rowIndex) => (
          <tr key={hour}>
            <>
              <th>{hour}</th>
              {days.map((day, columnIndex) => (
                <TableCell
                  colorStyle={getColorStyle(rowIndex * 5 + columnIndex)}
                  courseCode={getCourseCode(rowIndex * 5 + columnIndex)}
                  classroom={getClassroom(rowIndex * 5 + columnIndex)}
                  isExcluded={excludedTimeslots[rowIndex * 5 + columnIndex]}
                  isEmpty={isTimeslotEmpty(rowIndex * 5 + columnIndex)}
                  onClick={() => onCellClick(rowIndex * 5 + columnIndex)}
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
