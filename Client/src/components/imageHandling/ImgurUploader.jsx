import React, { useState } from "react";

export default function ImgurUploader({ onImageUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }
    setSelectedImage(file);
    setError("");
    setUploadSuccess(false);
  };

  const uploadToImgur = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch("/api/imgur/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      const parsedData = typeof data === "string" ? JSON.parse(data) : data;

      if (parsedData.success) {
        onImageUpload(parsedData.data.link);
        setUploadSuccess(true);
        setSelectedImage(null); // Reset the file input
      } else {
        throw new Error(parsedData.data?.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">Add Image</label>
      <input
        type="file"
        className="form-control mb-2"
        accept="image/*"
        onChange={handleImageSelect}
      />

      {selectedImage && (
        <button
          onClick={uploadToImgur}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      )}

      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {uploadSuccess && (
        <div className="alert alert-success mt-2">
          Image uploaded successfully!
        </div>
      )}
    </div>
  );
}
