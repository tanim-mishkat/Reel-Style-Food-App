import React from "react";
import styles from "./Loading.module.css";

export const Loading = ({ center = true, pad = true, children }) => (
  <div className={center ? styles.center : ""}>
    <div className={pad ? styles.smallPad : ""}>{children || "Loading..."}</div>
  </div>
);

export default Loading;
