import React, { memo } from "react";
import classnames from "classnames";

import "./Schedule.css";

import days from "../../constants/days";
import hours from "../../constants/hours";
import colors from "../../constants/colors";

const Schedule = ({
  courses = [],
  timeslots = [],
  excludedTimeslots,
  isCovidSemester,
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

  const TableCell = ({ rowIndex, columnIndex, key }) => {
    const cellIndex = rowIndex * 5 + columnIndex;
    const isEmpty = isTimeslotEmpty(cellIndex);

    const cellClasses = classnames({
      selected: !isEmpty,
      locked: excludedTimeslots[cellIndex],
    });

    return (
      <td
        className={cellClasses}
        onClick={() => onCellClick(cellIndex)}
        key={key}
      >
        {!isEmpty && (
          <>
            <b {...getColorStyle(cellIndex)}>{getCourseCode(cellIndex)}</b>
            <br />
            <small>{getClassroom(cellIndex)}</small>
          </>
        )}
      </td>
    );
  };

  return (
    <table id="schedule" {...props}>
      <thead>
        <tr>
          <th>&nbsp;</th>
          {days.map((day) => (
            <th>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hours.map((hour, rowIndex) => (
          <tr key={hour}>
            <>
              <th>{hour}</th>
              {days.map((key, columnIndex) => (
                <TableCell {...{ rowIndex, columnIndex, key }} />
              ))}
            </>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default memo(Schedule);
