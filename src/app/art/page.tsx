"use client";

import {
  AttachmentIcon,
  BotIcon,
  UserIcon,
  VercelIcon,
} from "@/components/icons";
import { useChat } from "ai/react";
import { DragEvent, useEffect, useRef, useState } from "react";

import Chat from "@/components/Chat";
import PrintButton from "@/components/PrintButton";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import Modal from "@/components/Modal"; // Adjust path as needed

// Custom Markdown renderer based on user or bot role
const MarkdownRenderer = ({ content, role }) => {
  return (
    <ReactMarkdown
      components={{
        p: ({ node, children }) => (
          <motion.p
            className={role === "assistant" ? "bot-message" : "user-message"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
            }}
          >
            {children}
          </motion.p>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const getTextFromDataUrl = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1];
  return window.atob(base64);
};

function TextFilePreview({ file }: { file: File }) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setContent(typeof text === "string" ? text.slice(0, 100) : "");
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div>
      {content}
      {content.length >= 100 && "..."}
    </div>
  );
}

export default function Home() {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat({
      onError: () =>
        toast.error("You've been rate limited, please try again later!"),
    });

  const [files, setFiles] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Hidden input ref for camera capture
  const cameraInputRef = useRef<HTMLInputElement>(null);
  // Hidden input ref for manual file upload
  const manualInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;

    if (items) {
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) {
        const validFiles = files.filter(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("text/")
        );

        if (validFiles.length === files.length) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          setFiles(dataTransfer.files);
        } else {
          toast.error("Only image and text files are allowed");
        }
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const droppedFilesArray = Array.from(droppedFiles);
    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/")
      );

      if (validFiles.length === droppedFilesArray.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed!");
      }

      setFiles(droppedFiles);
    }
    setIsDragging(false);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handler for when an image is captured with the camera
  const handleCameraCapture = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const capturedFiles = event.target.files;
    if (capturedFiles) {
      setFiles(capturedFiles);
    }
  };

  // Handler for when a file is manually uploaded
  const handleManualUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const manualFiles = event.target.files;
    if (manualFiles) {
      setFiles(manualFiles);
    }
  };

  // Trigger the hidden camera input when button is clicked
  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  // Trigger the hidden manual upload input when button is clicked
  const openManualUpload = () => {
    manualInputRef.current?.click();
  };

  // Toggle modal open/close
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      {/* Top left button for modal */}
      <button
        className="art-button"
        onClick={toggleModal}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: 1100,
        }}
      >
      ABOUT
      </button>

      {/* Use the Modal component (text is now built in) */}
      <Modal isOpen={isModalOpen} onClose={toggleModal} />

      <div className="main-container">
        <div
          className="art-container"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <AnimatePresence>
            {isDragging && (
              <motion.div
                className="art-drag-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div>Drag and drop files here</div>
                <div className="gpt-drag-subtext">{"(images and text)"}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="art-message-container">
            {messages.length > 0 ? (
              <div className="art-message-list">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`gpt-message ${
                      message.role === "assistant" ? "assistant" : "user"
                    }`}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="art-name">
                      {message.role === "assistant" ? (
                        <span>Art Assistant</span>
                      ) : (
                        <span>You</span>
                      )}
                    </div>

                    <div className="art-message-content">
                      <div className="gpt-text">
                        <MarkdownRenderer
                          content={message.content}
                          role={message.role}
                        />
                      </div>

                      <div className="art-attachments">
                        {message.experimental_attachments?.map((attachment) =>
                          attachment.contentType?.startsWith("image") ? (
                            <img
                              className="art-image"
                              key={attachment.name}
                              src={attachment.url}
                              alt={attachment.name}
                            />
                          ) : attachment.contentType?.startsWith("text") ? (
                            <div className="art-text-preview">
                              {getTextFromDataUrl(attachment.url)}
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isLoading &&
                  messages[messages.length - 1].role !== "assistant" && (
                    <div className="gpt-loading-message">
                      <div className="art-icon-container">
                        <BotIcon />
                      </div>
                      <div className="gpt-loading-text">
                        <div>hmm...</div>
                      </div>
                    </div>
                  )}

                <div ref={messagesEndRef} />
              </div>
            ) : (
              <motion.div className="gpt-empty-message-container">
                <div className="gpt-empty-message-box">
                  <p className="gpt-empty-message-text"></p>
                </div>
              </motion.div>
            )}

            <form
              className="art-input-form"
              onSubmit={(event) => {
                const options = files
                  ? { experimental_attachments: files }
                  : {};
                handleSubmit(event, options);
                setFiles(null);
              }}
            >
              {/* Button Container Above the Text Input */}
              <div className="art-upload-buttons">
                {/* Camera capture button */}
                <button
                  type="button"
                  className="art-button"
                  onClick={openCamera}
                >
                  SCAN ARTWORK
                </button>

                {/* Manual upload button */}
                <button
                  type="button"
                  className="art-button"
                  onClick={openManualUpload}
                >
                  UPLOAD ARTWORK
                </button>
              </div>

              {/* Preview of uploaded files */}
              <AnimatePresence>
                {files && files.length > 0 && (
                  <div className="art-file-preview">
                    {Array.from(files).map((file) =>
                      file.type.startsWith("image") ? (
                        <div key={file.name}>
                          <motion.img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="art-file-image"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{
                              y: -10,
                              scale: 1.1,
                              opacity: 0,
                              transition: { duration: 0.2 },
                            }}
                          />
                        </div>
                      ) : file.type.startsWith("text") ? (
                        <motion.div
                          key={file.name}
                          className="art-file-text-preview"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{
                            y: -10,
                            scale: 1.1,
                            opacity: 0,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <TextFilePreview file={file} />
                        </motion.div>
                      ) : null
                    )}
                  </div>
                )}
              </AnimatePresence>


              <div className="text-container">
              {/* Main text input */}
              <input
                ref={inputRef}
                className="art-input"
                placeholder="TYPE A QUESTION"
                value={input}
                onChange={handleInputChange}
                onPaste={handlePaste}
              />

              {/* Hidden file input for camera capture */}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraInputRef}
                onChange={handleCameraCapture}
                style={{ display: "none" }}
              />

              {/* Hidden file input for manual upload */}
              <input
                type="file"
                accept="image/*,text/*"
                ref={manualInputRef}
                onChange={handleManualUpload}
                style={{ display: "none" }}
                multiple
              />

    
                <button type="submit" className="art-button">
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
