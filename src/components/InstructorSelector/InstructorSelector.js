import React, { memo, useEffect } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

import "./InstructorSelector.css";

const InstructorSelector = ({ show, courses, onApply, onClose }) => {
  const [tempCourses, setTempCourses] = React.useState([]);

  const getUniqueInstructorList = ({ sections }) => [
    ...new Set(Object.values(sections).map(({ instructor }) => instructor)),
  ];

  const selectInstructor = (instructorIndex, selectedInstructor) => {
    setTempCourses(
      Object.assign([], tempCourses, {
        [instructorIndex]: {
          ...tempCourses[instructorIndex],
          selectedInstructor,
        },
      })
    );
  };

  const applyChangesAndCloseDialog = () => {
    onApply(tempCourses);
    onClose();
  };

  useEffect(() => {
    setTempCourses(courses);
  }, [show, courses]);

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>Select course instructors</DialogTitle>
      <DialogContent>
        {tempCourses.map((course, index) => (
          <FormControl
            variant="outlined"
            style={{ width: "100%", marginBottom: 20 }}
            key={course.courseCode}
          >
            <InputLabel>{course.courseCode}</InputLabel>
            <Select
              label={course.courseCode}
              labelWidth={course.courseCode.length * 8.2}
              value={course.selectedInstructor}
              onChange={(e) => selectInstructor(index, e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              {getUniqueInstructorList(course).map((instructor) => (
                <MenuItem value={instructor} key={instructor}>
                  {instructor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={applyChangesAndCloseDialog} color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(InstructorSelector);
