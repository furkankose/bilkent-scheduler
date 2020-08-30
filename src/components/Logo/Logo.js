import React, { memo } from "react";

import "./Logo.css";

const Logo = () => (
  <div id="bilkent-scheduler">
    <img
      id="bilkent-logo"
      className="shadow"
      src={`${process.env.PUBLIC_URL}/icons/bilkent-72x72.png`}
      alt="Bilkent University Logo"
    />
    <span id="scheduler-title">
      BILKENT
      <br />
      SCHEDULER
    </span>
  </div>
);

export default memo(Logo);
