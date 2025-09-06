import React from 'react';
import styles from './VideoControls.module.css';

const VideoControls = ({ 
  isPaused, 
  isMuted, 
  onPlayPause, 
  onMute 
}) => {
  return (
    <div className={styles.videoControls}>
      <button className={styles.muteBtn} onClick={onMute}>
        {isMuted ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.63 3.63c-.39.39-.39 1.02 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l4.18 4.18c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default VideoControls;