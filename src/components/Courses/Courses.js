import React, { memo } from "react";
import PropTypes from "prop-types";

import { Icon, IconButton } from "@material-ui/core";

import "./Courses.css";

import colors from "../../constants/colors";

const status = {
  0: {
    title: "No course selected yet!",
    message: "Really? Come on!",
  },
  1: {
    title: "No available schedule!",
    message: "Please, remove some of the courses.",
  },
};

const Courses = ({
  courses,
  isFailed,
  onCourseEdit,
  onCourseRemove,
  ...props
}) => {
  const getColorStyle = (colorIndex) => {
    return { style: { color: colors[colorIndex] } };
  };

  return (
    <table id="courses" {...props}>
      <thead>
        <tr>
          <td>
            <b>#</b>
          </td>
          <td>
            <b>[COURSE]-[SECTION]</b>
            <br />
            <small>Instructor</small>
          </td>
          <td width="45">
            {courses.length > 0 && (
              <IconButton
                id="filter"
                color="primary"
                onClick={onCourseEdit}
                data-html2canvas-ignore
              >
                <Icon>filter_list</Icon>
              </IconButton>
            )}
          </td>
        </tr>
      </thead>
      <tbody>
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <tr key={course.courseCode}>
              <td {...getColorStyle(index)}>
                <b>{index + 1}</b>
              </td>
              <td>
                <div className="instructor">
                  <b {...getColorStyle(index)}>{course.courseCode}</b>
                  <br />
                  <small>{course.instructor}</small>
                </div>
              </td>
              <td>
                <IconButton
                  className="clear"
                  color="primary"
                  onClick={() => onCourseRemove(index)}
                  data-html2canvas-ignore
                >
                  <Icon>clear</Icon>
                </IconButton>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>
              <b>?</b>
            </td>
            <td>
              <div className="instructor">
                <b>{status[+isFailed].title}</b>
                <br />
                <small>{status[+isFailed].message}</small>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

Courses.defaultProps = {
  courses: [],
};

Courses.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.object),
  isFailed: PropTypes.bool.isRequired,
  onCourseEdit: PropTypes.func.isRequired,
  onCourseRemove: PropTypes.func.isRequired,
};

export default memo(Courses);
