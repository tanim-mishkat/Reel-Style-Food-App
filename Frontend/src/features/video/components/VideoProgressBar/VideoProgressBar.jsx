import React from 'react';
import styles from './VideoProgressBar.module.css';

const VideoProgressBar = ({ currentTime, duration }) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.progressContainer}>
      <div 
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default VideoProgressBar;