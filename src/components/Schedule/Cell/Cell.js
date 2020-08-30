import React, { memo } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const Cell = ({
  colorStyle,
  courseCode,
  classroom,
  isEmpty,
  isExcluded,
  onClick,
}) => {
  const cellClasses = classnames({
    selected: !isEmpty,
    locked: isExcluded,
  });

  return (
    <td className={cellClasses} onClick={onClick}>
      {!isEmpty && (
        <>
          <b {...colorStyle}>{courseCode}</b>
          <br />
          <small>{classroom}</small>
        </>
      )}
    </td>
  );
};

Cell.defaultProps = {
  courseCode: null,
  classroom: null,
  isExcluded: false,
};

Cell.propTypes = {
  colorStyle: PropTypes.shape({}).isRequired,
  courseCode: PropTypes.string,
  classroom: PropTypes.string,
  isEmpty: PropTypes.bool.isRequired,
  isExcluded: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default memo(Cell);
