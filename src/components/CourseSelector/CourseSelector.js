import React, { memo } from "react";

import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

const renderInput = (params) => (
  <TextField
    {...params}
    label="COURSES"
    placeholder="Please select the courses that you want to take  (exm. CTIS 496)"
    variant="outlined"
  />
);

const filterOptions = (options, { inputValue }) => {
  if (inputValue.length === 0) {
    return options;
  }

  // to prevent possible turkish "ı" character related search issues
  const normalizedInput = inputValue.replace("ı", "i").toLowerCase();

  const filteredOptions = options.filter(({ courseCode }) => {
    return courseCode.toLowerCase().includes(normalizedInput);
  });

  return filteredOptions;
};

const CourseSelector = ({ offerings, selectedCourses, onChange }) => (
  <Autocomplete
    {...{
      id: "course-selector",
      size: "small",
      value: selectedCourses,
      options: offerings,
      getOptionLabel: ({ courseCode }) => courseCode.replace(" ", "-"),
      groupBy: ({ departmentCode }) => departmentCode,
      onChange: (_, value) => onChange(value),
      filterSelectedOptions: true,
      openOnFocus: true,
      multiple: true,
      filterOptions,
      renderInput,
    }}
  />
);

export default memo(CourseSelector);
