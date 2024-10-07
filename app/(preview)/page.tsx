/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import {
  AttachmentIcon,
  BotIcon,
  UserIcon,
  VercelIcon,
} from "@/components/icons";
import { useChat } from "ai/react";
import { DragEvent, useEffect, useRef, useState } from "react";
import Modal from "@/components/Modal";
import Chat from "@/components/Chat";
import VideoPlayer from "@/components/VideoPlayer";
import PrintButton from "@/components/PrintButton";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ImageGenerator from '@/components/ImageGenerator';

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
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState<string>("");

  // Audio references for each overlay
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);
  const audioRef3 = useRef<HTMLAudioElement>(null);
  const audioRef4 = useRef<HTMLAudioElement>(null);
  const [hasUserChatted, setHasUserChatted] = useState(false); // Track if user has submitted a chat message



  // List of hairstyle types
  const hairstyles = [
    "the Latest Corn Rolls",
    "Strategic Braids",
    "Godly Braids",
    "Divine Corn rolls",
    "Blessed Braids",
    "Miracle Braids",
    "Miracle Corn rolls",
    "Anointed Braids",
    "Expert Braids",
    "Divine Twists",
    "Heavenly Braids",
    "The Finger of God",
    "Holy Braids",
    "Holy Ghost Braids",
  ];

  // Reference to the textarea
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Reference to the form
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDivElement>(null); // Reference for the modal

  // Function to randomly select a hairstyle
  const getRandomHairstyle = () => {
    return hairstyles[Math.floor(Math.random() * hairstyles.length)];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isFormExpanded &&
        formRef.current &&
        !formRef.current.contains(event.target as Node)
      ) {
        setIsFormExpanded(false);
        setIsVideoVisible(true); // Show the video when clicking outside the form
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFormExpanded]);
  

  // Set current date
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  // Handle form expansion and ensure modal is closed
  const handleFocusOrPlaceholderClick = () => {
    setIsFormExpanded(true); // Expand the form
    setOpenModal(null); 
    setTimeout(() => {
      setIsVideoVisible(false);
    }, 100); // Delay hiding the video
    const selectedHairstyle = getRandomHairstyle();
    const text1 = `Let's generate images of`;
    const text2 = ` ✿✿✿ ${selectedHairstyle} ✿✿✿ `;
    const text3 = `Type ur description here`;

    // Split both sentences and concatenate them
    setWords([
      ...text1.split(" "),
      "<br>",
      ...text2.split(" "),
      "<br>",
      ...text3.split(" "),
    ]);

    // Programmatically focus the textarea when the placeholder or form is clicked
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from reloading the page
    setIsVideoVisible(false); // Hide the video when submitting the form
    setIsGridVisible(true); // Show the grid
  };
  

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setIsGridVisible(false); // Hide the grid
    setIsVideoVisible(true); // Show the video when grid is closed
  };

  // Handle modal opening and ensure form is closed
  const openModalHandler = (modalType: string) => {
    setOpenModal(modalType);
    setIsFormExpanded(false); 
    setTimeout(() => {
      setIsVideoVisible(false);
    }, 100); // Delay hiding the video

  };

  const handleCloseModal = () => {
    setOpenModal(null); // Close the modal
    setActiveButton(null); // Reset active button when modal is closed
    setIsVideoVisible(true); 
  };

  // Handle each overlay click with different sound
  const handleOverlayClick = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    handleFocusOrPlaceholderClick(); // Expand form
  };

  // Close the modal when clicking outside
  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        openModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpenModal(null); // Close the modal when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [openModal]);

  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat({
      onError: () =>
        toast.error("You've been rate limited, please try again later!"),
    });

  const [files, setFiles] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <>
      <div>
        {/* Audio elements for each overlay */}
        <audio ref={audioRef1} src="/mad.mp3" />
        <audio ref={audioRef2} src="/mad.mp3" />
        <audio ref={audioRef3} src="/mad.mp3" />
        <audio ref={audioRef4} src="/mad.mp3" />
        {/* Title Section */}

        <div className="title-section">
          <div className="title-wrapper">
            <span className="title">DA BRAIDR DA BRAIDR DA BRAIDR...</span>

          </div>
        </div>
        {/* Static Title for Print */}
        <h1 className="print-title" style={{ display: "none" }}>
          DA BRAIDR
          <br />
          <span
            style={{
              position: "absolute",
              bottom: 0,
             
              fontSize: "10px",
              fontFamily: "Kode Mono",
              textAlign: "center",
            }}
          >
           This AI-generated content was produced on {currentDate} using DA BRAIDR - a multimodal system designed by Minne Atairu
          </span>{" "}
        </h1>

        {/* Button Section */}
        <div className="button-section">
          <button
            className="animated-placeholder"
            onClick={handleFocusOrPlaceholderClick}
          >
            {"GENERATE UR BRAIDS".split(" ").map((word, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.5}s` }}>
                {word}&nbsp;
              </span>
            ))}
          </button>
          <button
            className="button-border animated-placeholder"
            onClick={() => openModalHandler("text")}
          >
            {" "}
            {"      TEXT DA BRAIDR".split(" ").map((word, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.5}s` }}>
                {word}&nbsp;
              </span>
            ))}
          </button>
        </div>
        {/* Info Modal */}
        {openModal === "info" && (
  <Modal onClose={handleCloseModal} className="modal-grid">
            {/* Modal content */}
            <div className="modal-column">
              <h2>WHAT IS DA BRAIDR?</h2>
              <p className="body-text">
                Da Braidr is a conceptual AI startup developed to investigate
                the socioeconomic impact of Generative AI on Black hair braiding
                communities. The system utilizes a multimodal generative
                architecture that integrates image generation, image
                recognition, and conversational agents. To design Da Braidr, I
                have drawn from my decade-long experience as a client to West
                African immigrant braiders in Harlem, New York. Through the
                business of braiding, my braiders sustain not only themselves
                but also their families-both near and far. A child’s request for
                yet another pair of limited-edition Air Jordans. A pregnant
                niece navigating the quiet shame of unmarried motherhood. An
                imprisoned son’s household. A once-employed daughter, now turned
                social media influencer. Tuition for a relative's ESL classes.
                Medical bills for a brother's partner. An aging parent's care.
                And in the background, their own bodies bear the costs of the
                craft, with chronic back, neck, and wrist pain—unrelenting
                reminders of the labor that sustains their livelihood.
              </p>
              <p className="body-text">
                The art of braiding cannot be divorced from its origins in
                resistance and survival. West African women, stripped of all
                belongings as they traversed the horrors of the Middle Passage,
                wove life-sustaining rice, okra, and other seeds into their
                cornrows. Some braided gold and other small valuables into their
                hair hoping to preserve some wealth even in dire circumstances.
                Enslaved Afro-Colombian women, too, braided maps and messages of
                escape into intricate cornrows. This tradition, passed through
                generations, is guided by intuitive ethnomathematical concepts.
                Translation determines the spacing between the rows,
                tessellation forms geometric patterns, rotation curves the
                braid’s path, reflection ensures symmetry, and dilation controls
                expansion/contraction.
              </p>
              <p className="body-text">
                Currently valued at $529.3 million, and projected to grow to
                $625.3 million by 2032, the Black hair braiding industry is a
                low-cost, high-return ecosystem. This economy, primarily driven
                by Black women entrepreneurs and sustained by the preferences of
                Black femme consumers thrives despite operating within "the
                bounds of the white supremacist patriarchal state,
                macrocosmically, and the Black male head of the patriarchal
                family, microcosmically." Hair discrimination—that
                all-too-familiar form of racial bias characterized by the
                hyperregulation and hypersurveillance of Black hair
                textures—plays a critical role in shaping both consumer demand
                and pricing models. Lightweight, non-voluminous braids made with
                human-like synthetic hair, often prized for their semblance to
                non-coily textures, command a median price of $250, double the
                cost of Afrocentric styles braided with kanekalon, a coarse,
                coily synthetic fiber.
              </p>

              <p className="body-text">
                Though the 2019 U.S. CROWN Act prohibits hair-based
                discrimination, the transactions between the braider and the
                braided remain tethered to the enduring weight of Eurocentric
                beauty standards. What might appear as a simple grooming choice
                is, in fact, a decision with far-reaching consequences for one’s
                economic and social mobility. As Joseph-Salisbury & Connelly
                (2018) remind us: 'If your hair is relaxed, white people are
                relaxed. If your hair is nappy, they're not happy". Which braid
                will pass the test of the White gaze? Will it conform to school
                dress codes or be condemned as "unkempt," "extreme...faddish and
                out of control"? Is it deemed appropriate in professional
                settings, for a job interview, or to ensure job security and
                advancement—or will it foreclose those opportunities? Can it be
                modified to minimize its association with "criminality" or the
                stereotype of "the angry Black woman"? Is it deemed "too ghetto"
                or "too ethnic"? Too "Afrocentric"? Can a particular braid
                pattern ensure quicker passage through TSA checkpoints? How will
                healthcare providers perceive it—unhygienic or unclean? Will the
                braid, ultimately, affect the quality of care a patient
                receives?
              </p>

<p className="body-text">
                What happens when these critical decisions between the braider
                and the braided are replaced by generative systems that
                abstract, optimize, and commodify them? What happens when the
                labor of hair braiding, long undervalued and overlooked, is
                severed from the expertise of Black women who have sustained it
                for centuries? Can such a system meaningfully model braiding
                traditions nurtured in backyards, courtyards, front porches, and
                stoops? And to what extent can a system serve the diverse
                grooming needs of Black femme consumers-from hairstyle
                selection, braider identification, synthetic fiber sourcing,
                hairstyle maintenance, hair product reviews, to recommendations?
                What happens when such a system, designed in the pursuit of
                capital, is planted within Black communities and harvested for
                profit?
              </p>
            </div>
            <div className="modal-column  border">
              <h2>NOTES ON MODEL FINE-TUNING</h2>

              <p className="body-text">
                The image generation system is fine-tuned using marketing
                language and visual references inspired by West African Braiders
                in Harlem. Inspired by the marketing language of West African
                Braiders in Harlem, the image generation system beckons:
                "Braiding Miss?" while promising visualizations of "the latest,"
                "Godly hairstyles," and even "corn rolls." These generated
                images are further refined using references from West African
                salon posters, which traditionally depict a variety of intricate
                braided styles.
              </p>
   
       
              <p className="body-text">
                The multimodal conversational interface includes an image recognition system. The system is finetuned to masquerades as a "PsychoHairapist"
                for clients seeking makeovers. The system is finetuned with
                research about psychohairapy-a community health model created to
                secure space for Black women to address mental health and
                well-being through hair care.
              </p>
              <br></br>
              <br></br>
              <h2>REFERENCES</h2>
              <p className="body-text">
                Ashley, W., & Brown, J. C. (2015). Attachment tHAIRapy: A
                culturally relevant treatment paradigm for African American
                foster youth. Journal of Black Studies, 46(6), 587-604.
              </p>
              <p className="body-text">
                Gilmer, G. (2007). Mathematical patterns in African American
                hairstyles. State University of New York at Buffalo, Mathematics
                Department.
              </p>
              <p className="body-text">
                Iromuanya, J. (2018). Are we all feminists? The global black
                hair industry and marketplace in Chimamanda Ngozi Adichie's
                Americanah. Meridians, 16(1), 163-183.
              </p>
              <p className="body-text">
                Jones, R. M. (2020). What the hair: Employment discrimination
                against Black people based on hairstyles. Harv. BL Law J., 36,
                27.
              </p>
              <p className="body-text">
                Joseph-Salisbury, R., & Connelly, L. (2018). ‘If your hair is
                relaxed, white people are relaxed. If your hair is nappy,
                they’re not happy’: Black hair as a site of ‘post-racial’ social
                control in English schools. Social Sciences, 7(11), 219.
              </p>
              <p className="body-text">
                Mbilishaka, A. (2018). PsychoHairapy: Using hair as an entry
                point into Black women’s spiritual and mental health. Meridians,
                16(2), 382-392.
              </p>
              <p className="body-text">
                Mbilishaka, A. M. (2018). Black Lives (and stories) Matter: Race
                narrative therapy in Black hair care spaces. Community
                Psychology in Global Perspective, 4(2), 22-33.
              </p>
              <p className="body-text">
                Mbilishaka, A. M. (2021). PsychoHairapy through beauticians and
                barbershops: The healing relational triad of Black hair care
                professionals, mothers, and daughters. Therapeutic Cultural
                Routines to Build Family Relationships: Talk, Touch & Listen
                While Combing Hair©, 173-181.
              </p>
              <p className="body-text">
                Thomas C. G. (2023). Carcinogenic materials in synthetic braids:
                An unrecognized risk of hair products for Black women. Lancet
                regional health. Americas, 22, 100517.
                https://doi.org/10.1016/j.lana.2023.100517
              </p>
            </div>
          </Modal>
        )}
        {/* Text Da Braidr Modal */}
        {openModal === "text" && (
       <Modal onClose={handleCloseModal} className="modal-bottom-right">

            <Chat />
            {messages.length > 0 && (
  <PrintButton onPrintClick={handlePrint} onCloseClick={handleClose} isFromGptChatModal={true} />
)}


            <div
              className="gpt-container"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    className="gpt-drag-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div>Drag and drop files here</div>
                    <div className="gpt-drag-subtext">
                      {"(images and text)"}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="gpt-message-container">
                {messages.length > 0 ? (
                  <div className="gpt-message-list">
                   {messages.map((message, index) => (
  <motion.div
    key={message.id}
    className={`gpt-message ${message.role === "assistant" ? "assistant" : "user"}`}
    initial={{ y: 5, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
  >
  <div className="gpt-name">
      {message.role === "assistant" ? (
        <span>Da Braidr</span>
      ) : (
        <span>You</span>
      )}
    </div>

    <div className="gpt-message-content">
    <div className="gpt-text">
    <MarkdownRenderer content={message.content} role={message.role} />

</div>

      <div className="gpt-attachments">
        {message.experimental_attachments?.map(attachment =>
          attachment.contentType?.startsWith("image") ? (
            <img
              className="gpt-image"
              key={attachment.name}
              src={attachment.url}
              alt={attachment.name}
            />
          ) : attachment.contentType?.startsWith("text") ? (
            <div className="gpt-text-preview">
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
                          <div className="gpt-icon-container">
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
                      <p className="gpt-empty-message-text">
           
        
                      </p>
                    </div>
                  </motion.div>
                )}

                <form
                  className="gpt-input-form"
                  onSubmit={(event) => {
                    const options = files
                      ? { experimental_attachments: files }
                      : {};
                    handleSubmit(event, options);
                    setFiles(null);
                  }}
                >
                  <AnimatePresence>
                    {files && files.length > 0 && (
                      <div className="gpt-file-preview">
                        {Array.from(files).map((file) =>
                          file.type.startsWith("image") ? (
                            <div key={file.name}>
                              <motion.img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="gpt-file-image"
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
                              className="gpt-file-text-preview"
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
                  <div className="uploadtips">
                 + Drag ur braid{" "}
                  </div>
                  <input
                    ref={inputRef}
                    className="gpt-input"
                    placeholder="✿ Ask a question/drag a braid ✿"
                    value={input}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                  />
                  
                      {/* Centered Submit Button */}
             <div className="button-container">
                    <button type="submit" className="chat-button">
                      SUBMIT
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="psycho">
              <a
                href="https://scholar.google.com/scholar?hl=en&as_sdt=0%2C33&q=pscyhohairapy&btnG="
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more from human Psychohairapy Researchers
              </a>
            </div>
          </Modal>
        )}

        {/* Text Prompt Form */}
        {isFormExpanded && (
          <form
            className="text-prompt-form expanded"
            onSubmit={handleFormSubmit}
            style={{
              backgroundColor: "black",
              color: "white",
              position: "relative",
              border: "none",
            }}
            ref={formRef}
          >
            <div className="animated-text-container">
              <div className="animated-text">
                {words.map((word, index) =>
                  word === "<br>" ? (
                    <br key={index} style={{ marginBottom: "20px" }} />
                  ) : (
                    <span
                      key={index}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {word}&nbsp;
                    </span>
                  )
                )}
              </div>
              <ImageGenerator />

              <textarea
                className="genetext"
                placeholder=""
                ref={textAreaRef}
                style={{ minHeight: "100px", width: "100%" }}
              />
            </div>

            <button className="genebtt expanded" type="submit">
              GENERATE
            </button>
          </form>
        )}

        {/* Print and Close Button */}
        {isGridVisible && (
          <PrintButton onPrintClick={handlePrint} onCloseClick={handleClose} />
        )}
        {/* Video with Overlay Text */}
        {isVideoVisible && (
          <div className="video-container">
            <VideoPlayer />
    
            <div
              className="video-overlay-text"
              onClick={() => openModalHandler("info")}
            >
              <h2>ABOUT DA BRAIDR</h2>
            </div>

            <div
              className="video-overlay-text-two"
              onClick={() => handleOverlayClick(audioRef2)}
            >
              <h2>
                CALL AYEESHA
                <br /> 808-666-3333
              </h2>
            </div>
            <div
              className="video-overlay-text-three"
              onClick={() => handleOverlayClick(audioRef3)}
            >
              <h2>
                FINE
                <br /> GEH
              </h2>
            </div>

            <div
              className="video-overlay-text-four"
              onClick={() => handleOverlayClick(audioRef4)}
            >
              <h2>
                THE FINGER
                <br /> OF GOD
              </h2>
            </div>
          </div>
        )}
        {/* Grid Section */}
        {isGridVisible && <div className="grid-section"></div>}
      </div>
    </>
  );
}
