import React, { memo } from "react";

import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

const getOptionLabel = (selectedSemester, { code, name, year }) => {
  return selectedSemester.code === code ? `${name} / ${year}` : name;
};

const renderInput = (params) => (
  <TextField {...params} label="SEMESTER" variant="outlined" />
);

const SemesterSelector = ({ semesters, selectedSemester, onChange }) => (
  <Autocomplete
    {...{
      id: "semester-selector",
      size: "small",
      value: selectedSemester,
      options: semesters,
      groupBy: ({ year }) => year,
      onChange: (_, value) => onChange(value),
      disableClearable: true,
      openOnFocus: true,
      getOptionLabel: (semester) => getOptionLabel(selectedSemester, semester),
      renderInput,
    }}
  />
);

export default memo(SemesterSelector);
