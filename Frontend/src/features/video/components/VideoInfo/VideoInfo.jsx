import React from "react";
import { Link } from "react-router-dom";
import styles from "./VideoInfo.module.css";

const VideoInfo = ({ video, onDescriptionClick }) => {
  return (
    <div className={styles.videoInfoBottom} onClick={onDescriptionClick}>
      <p className={styles.videoDescription}>{video.description}</p>
      <Link
        to={`/food-partner/${video.foodPartner?._id || video.foodPartner}`}
        className={styles.visitStoreBtn}
        onClick={(e) => e.stopPropagation()}
      >
        Visit store
      </Link>
    </div>
  );
};

export default VideoInfo;
