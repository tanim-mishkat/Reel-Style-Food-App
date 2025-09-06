import React from 'react';
import styles from './VideoPlayer.module.css';

const VideoPlayer = ({ 
  video, 
  videoRef, 
  muted, 
  onTimeUpdate, 
  onLoadedMetadata,
  onVideoClick
}) => {
  return (
    <video
      ref={videoRef}
      className={styles.videoPlayer}
      src={video.video}
      loop
      playsInline
      muted={muted}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      onClick={onVideoClick}
    />
  );
};

export default VideoPlayer;