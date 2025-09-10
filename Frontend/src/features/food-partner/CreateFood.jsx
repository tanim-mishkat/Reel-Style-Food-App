import React, { useState, useRef, useEffect } from "react";
import { foodService } from "../../shared/services/api";
import "./CreateFood.css";

const CreateFood = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [posted, setPosted] = useState(false);
  const videoInputRef = useRef(null);

  // Cleanup video preview URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setVideo(null);
    setVideoPreview(null);
    setPosted(false);
    setSuccess("");
    setError("");
    // Reset file input using ref
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !description.trim() || !video) {
      setError("All fields are required");
      return;
    }

    if (name.trim().length < 2) {
      setError("Food name must be at least 2 characters long");
      return;
    }

    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters long");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("video", video);

    try {
      await foodService.createFood(formData);
      setSuccess("Food reel created successfully!");
      setPosted(true);

      // Auto-reset after 3 seconds
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create food reel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-food-container">
      <div className="create-food-wrapper">
        <div className="create-food-header">
          <div className="header-icon">🍽️</div>
          <h1 className="create-food-title">Create Food Reel</h1>
          <p className="create-food-subtitle">
            Share your culinary masterpiece with the world
          </p>
        </div>

        {posted ? (
          <div className="success-animation">
            <div className="success-icon">✓</div>
            <h2>Posted Successfully!</h2>
            <p>Your food reel is now live</p>
            <button onClick={resetForm} className="create-another-btn">
              Create Another Reel
            </button>
          </div>
        ) : (
          <div className="form-layout">
            <div className="preview-section">
              {videoPreview ? (
                <div className="video-preview">
                  <video
                    src={videoPreview}
                    controls
                    className="preview-video"
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280'%3EVideo Preview%3C/text%3E%3C/svg%3E"
                  />
                  <div className="preview-overlay">
                    <span className="preview-label">🎥 Preview</span>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">📹</div>
                  <p>Upload a video to see preview</p>
                </div>
              )}
            </div>

            <form className="create-food-form" onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-group">
                <label htmlFor="video-input" className="form-label">
                  🎥 Video Upload
                </label>
                <div className="file-input-wrapper">
                  <input
                    id="video-input"
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Validate file size (50MB limit)
                        if (file.size > 50 * 1024 * 1024) {
                          setError("Video file must be less than 50MB");
                          return;
                        }

                        // Clean up previous preview URL to prevent memory leaks
                        if (videoPreview) {
                          URL.revokeObjectURL(videoPreview);
                        }

                        setVideo(file);
                        setVideoPreview(URL.createObjectURL(file));
                        setError(""); // Clear any previous errors
                      } else {
                        setVideo(null);
                        if (videoPreview) {
                          URL.revokeObjectURL(videoPreview);
                        }
                        setVideoPreview(null);
                      }
                    }}
                    className="file-input-hidden"
                    required
                  />
                  <label htmlFor="video-input" className="file-input-button">
                    <span className="file-icon">📁</span>
                    {video ? video.name : "Choose Video File"}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  🍽️ Food Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What's this delicious dish called?"
                  className="form-input modern-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  📝 Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your creation, ingredients, or cooking process..."
                  className="form-textarea modern-textarea"
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !video}
                className="create-btn modern-btn"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating Reel...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Post Food Reel
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFood;
