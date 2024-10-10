"use client"; // Ensure this is a client-side component

import { useState, useEffect } from "react";
import Image from "next/image";
import BraidForm from "../components/BraidForm";
import Link from "next/link";

// Fetch images from the JSON file
export default function DataGallery() {
  const [columns, setColumns] = useState(8);
  const [images, setImages] = useState<
    { url: string; alt: string; tags: string[]; date: string }[]
  >([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); // State for modal
  const [isModalVisible, setIsModalVisible] = useState(false); // To control the smooth transition

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch("/images.json");
      const data = await response.json();
      setImages(data);
    };

    fetchImages();
  }, []);

  const handleZoomIn = () => {
    if (columns > 4) {
      setColumns(columns - 1); // Reduce columns but not below 4
    }
  };

  const handleZoomOut = () => {
    if (columns < 8) {
      setColumns(columns + 1); // Increase columns but not above 8
    }
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const openHelpModal = () => {
    setIsHelpModalOpen(true); // Make modal visible
    setTimeout(() => {
      setIsModalVisible(true); // Add show class after a small delay to trigger the transition
    }, 10); // Small timeout to ensure the modal opens with animation
  };

  const closeHelpModal = () => {
    setIsModalVisible(false); // Hide the modal with transition
    setTimeout(() => {
      setIsHelpModalOpen(false); // Completely remove modal after transition ends
    }, 400); // Match the timeout with the transition duration (0.4s)
  };

  const filteredImages =
    selectedTag === "All"
      ? images
      : images.filter((image) => image.tags.includes(selectedTag));

  const allTags = Array.from(new Set(images.flatMap((image) => image.tags)));

  return (
    <div>
      <div className="title-section">
        <div className="title-wrapper">
          <span className="title">
            BRAIDS DATA BRAIDS DATA BRAIDS DATA BRAIDS DATA BRAIDS DATA BRAIDS
            DATA BRAIDS DATA BRAIDS DATA BRAIDS DATA BRAIDS DATA BRAIDS DATA
          </span>
        </div>
      </div>

      {/* Zoom controls and filter */}
      <div className="controls">
        <div className="zoom-controls">
          <button onClick={handleZoomIn}>+</button>
          <button className="right-zoom" onClick={handleZoomOut}>
            -
          </button>
          {/* Help button to open modal */}
          <button className="help-button" onClick={openHelpModal}>
            ?
          </button>
        </div>

        {/* Custom dropdown for filter */}
        <div className="filter-controls">
          <button
            className="dropdown-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            FILTER +
          </button>

          {/* Dropdown content */}
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => handleTagChange("All")}>All</li>
              {allTags.map((tag, index) => (
                <li key={index} onClick={() => handleTagChange(tag)}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal with smooth transition */}
      {isHelpModalOpen && (
        <div
          className={`dataa-modal-overlay ${isModalVisible ? "show" : ""}`}
          onClick={closeHelpModal}
        >
          <div
            className={`dataa-modal-content ${isModalVisible ? "show" : ""}`}
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside it
          >
            <button className="dataa-close-button" onClick={closeHelpModal}>
              X
            </button>
            <div className="modal-column">
              <h2>OPT-IN UR DATA</h2>

              <p>
                Da Braidr's image generation engine relies on real-world image
                data to encode and reproduce the patterns found in contemporary
                Black braided hairstyles. The community-contributed images on
                this portal have been instrumental in refining Da Braidr's image
                generation system. To keep up with the latest trends, I
                fine-tune Da Braidr on a bi-monthly basis. I'm always seeking
                images of unique braids that'll help optimize Da Braidr’s
                ability to model the ethnomathematical principles that braiders
                intuitively employ. Please consider submitting an image of your
                hairstyle to support this growing dataset.
              </p>

              <p>
                Below are image submission guidelines:
                <ol type="1">
                  <li>Clear, high-quality images.</li>
                  <li>Include different angles (front, back, sides view).</li>
                  <li> Do not include your recognizable facial features.</li>
                  <li>Only share images that belong to you.</li>
                </ol>
                {/* Required Checkbox */}{" "}
                <div className="checkbox-section">
                  <label>
                    <input type="checkbox" required />{" "}
                    {/* Required attribute ensures it must be checked */}
                    Yes, finetune Da Braidr's vision model with my braid.
                  </label>
                </div>
                <div className="checkbox-section">
                  <label>
                    <input type="checkbox" />{" "}
                    {/* Required attribute ensures it must be checked */}
                    Yes, include my image(s) in the publicly accessible image
                    library.
                  </label>
                </div>
                <p>
                  Have questions about data submission? Email data [at] dabraidr
                  [dot] info
                </p>
              </p>
            </div>
            <div className="modal-column  border">
              <h2>DATA FORM</h2>
              <BraidForm />
            </div>
          </div>
        </div>
      )}

      {/* Gallery grid where columns are controlled by state */}
      <div
        className="gallery-grid"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {filteredImages.map((image, index) => (
          <div key={index} className="gallery-item">
            {/* Index overlay */}
            <div className="image-index">{index + 1}</div>

            {/* Image */}
            <Image src={image.url} alt={image.alt} width={200} height={200} />

            {/* Display tags and date under the image */}
            <div className="image-info">
              <small>Tags: {image.tags.join(", ")}</small>
              <br />
              <small>Date: {new Date(image.date).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
