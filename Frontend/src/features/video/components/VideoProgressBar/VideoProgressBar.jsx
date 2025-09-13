import React from "react";
import styles from "./VideoProgressBar.module.css";

const VideoProgressBar = ({ currentTime, duration }) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={styles.progressContainer}
      style={{ "--progress": `${progress}%` }}
    >
      <div className={styles.progressBar} />
    </div>
  );
};

export default VideoProgressBar;
