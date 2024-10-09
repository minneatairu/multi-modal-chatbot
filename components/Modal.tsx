"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // Optional className for custom styles
  position?: string; // Optional position (e.g., "bottom-right")
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  children,
  className,
  position,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const positionClass = position ? `modal-${position}` : ""; // Handle different positions

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // Close modal if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Close modal when clicking on the overlay (outside the modal content)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close modal when clicking on the overlay
    }
  };

  // Ensure background is black by default and fade in the modal content
  const overlayStyle = {
    backgroundColor: "black", // Ensure black background from the start
    display: "flex", // Ensure flexbox is applied
    justifyContent: "center", // Horizontally center the content
    alignItems: "center", // Vertically center the content
  };

  // Style for the close button based on background color
  const closeButtonStyle = {
    color: "white", // White text to contrast with black background
    cursor: "pointer",
    fontSize: "24px", // Example styling for the close button
    position: "absolute" as "absolute", // Make it absolute for positioning
    top: "10px", // Adjust as needed
    right: "10px", // Adjust as needed
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        style={overlayStyle} // Apply the black background immediately
        onClick={handleOverlayClick} // Close the modal when clicking on the overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          ref={modalRef} // Ref to modal content for click detection
          className={`modal-content ${className} ${positionClass}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundColor: "black" }} // Ensure modal content background is also black
        >
          <span className="close-button" style={closeButtonStyle} onClick={onClose}>
            X
          </span>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
