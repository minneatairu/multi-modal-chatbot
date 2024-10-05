"use client"; // Ensure this is a client-side component

import { useEffect, useRef } from "react";

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

  // Conditionally apply inline styles for the black background
  const overlayStyle = {
    backgroundColor: className === "modal-bottom-right" ? "blue" : "white",
    ...(className === "modal-bottom-right" && {
      display: "flex", // Ensure flexbox is applied
      justifyContent: "center", // Horizontally center the content
      alignItems: "center", // Vertically center the content
    }),
  };

  return (
    <div
      className="modal-overlay"
      style={overlayStyle} // Apply conditional style for background color
      onClick={handleOverlayClick} // Close the modal when clicking on the overlay
    >
      <div
        ref={modalRef} // Ref to modal content for click detection
        className={`modal-content ${className} ${positionClass}`}
      >
        <span className="close-button" onClick={onClose}>
          X
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
