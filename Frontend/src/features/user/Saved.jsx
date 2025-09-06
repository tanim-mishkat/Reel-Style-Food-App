import React from "react";
import BottomNav from "../../components/common/BottomNav";
import "./Saved.css";

const Saved = () => {
  return (
    <div className="saved-container">
      <div className="saved-header">
        <h1>Saved Videos</h1>
      </div>
      
      <div className="saved-content">
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
          </svg>
          <h2>No saved videos yet</h2>
          <p>Videos you save will appear here</p>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Saved;