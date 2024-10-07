"use client"; // This is a client-side component

import React, { useState } from "react";

export default function BraidForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <form className="braid-form">
      {/* Text Input Fields */}
 
      {/* Braid Type Section */}

      <div className="braid-type-container">
        {[
          "Spiral",
          "Wavy",
          "Criss-cross",
          "Zig-Zag",
          "Two-strand",
          "Three-strand",
          "Geometric",
          "Cornrow",
          "Boho",
          "Knotless",

          "Senegalese",
          "Bob Box",
          "Box",
          "Triangle",
          "Daimond",
          "Goddess",
        ].map((type) => (
          <div className="braidtag" key={type}>
            <input
              type="checkbox"
              id={type}
              name="tags"
              value={type.toLowerCase()}
            />
            <label htmlFor={type}>{type}</label>
          </div>
        ))}
      </div>

      <input
        className="datasub url"
        type="url"
        placeholder="Paste image URL here"
      />

      {/* OR Text */}
      <p className="or-text">OR</p>

      {/* Drag & Drop Circle */}
      <label htmlFor="file-upload" className="upload-label">
        Drag & Drop braid here
        <br />
        (PNG/JPG/WEBP)
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="file-upload"
          onChange={handleFileChange}
        />
      </label>

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
}
