import React, { memo } from "react";
import PropTypes from "prop-types";
import { useKeyPressEvent } from "react-use";
import classnames from "classnames";

import "./Pagination.css";

const Pagination = ({
  title,
  activePage,
  numberOfPages,
  onPageChange,
  ...props
}) => {
  const isFirstPage = activePage === 1;
  const isLastPage = activePage >= numberOfPages;

  const wrapperClasses = classnames({ hidden: numberOfPages === 0 });
  const prevButtonClasses = classnames({ disabled: isFirstPage });
  const nextButtonClasses = classnames({ disabled: isLastPage });

  const goToPreviousPage = () => {
    if (activePage > 1) {
      onPageChange(activePage - 1);
    }
  };

  const goToNextPage = () => {
    if (activePage < numberOfPages) {
      onPageChange(activePage + 1);
    }
  };

  useKeyPressEvent("ArrowLeft", goToPreviousPage);
  useKeyPressEvent("ArrowRight", goToNextPage);

  return (
    <div id="pagination" className={wrapperClasses} {...props}>
      <span id="prev" className={prevButtonClasses} onClick={goToPreviousPage}>
        &lt;{" "}
      </span>
      <div id="pages">
        <span id="title">{title}</span>
        <span id="page-numbers">
          {numberOfPages && activePage} / {numberOfPages}
        </span>
      </div>
      <span id="next" className={nextButtonClasses} onClick={goToNextPage}>
        {" "}
        &gt;
      </span>
    </div>
  );
};

Pagination.propTypes = {
  title: PropTypes.string.isRequired,
  activePage: PropTypes.number.isRequired,
  numberOfPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default memo(Pagination);
