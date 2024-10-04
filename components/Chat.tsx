import { useState, useEffect } from "react";

export default function Chat() {
  const [loading, setLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<
    { sender: "user" | "ai"; content: string }[]
  >([]);
  const [prompt, setPrompt] = useState<string>("");
  const [introWords, setIntroWords] = useState<JSX.Element[]>([]);
  const [formVisible, setFormVisible] = useState<boolean>(false); // Control form visibility

  const fullIntroText = [
    `✦✦✦✦✦ I'm Da Braidr ✦✦✦✦✦`,
    `♥♥♥ Ur Psychohairapist ♥♥♥`,
    `✿✿✿ Let's talk about Braids ✿✿✿`,
  ];

  useEffect(() => {
    const introWithLineBreaks = fullIntroText.map((text, lineIndex) => (
      <span key={lineIndex} style={{ display: "block" }}>
        {text.split(" ").map((word, wordIndex) => (
          <span
            key={wordIndex}
            className="fade-word"
            style={{
              animationDelay: `${(wordIndex + lineIndex * 5) * 0.2}s`, // Delay each line
              opacity: 0,
            }}
          >
            {word}&nbsp;
          </span>
        ))}
        <br />
      </span>
    ));

    setIntroWords(introWithLineBreaks);

    // Trigger form to appear after intro animation
    setTimeout(() => {
      setFormVisible(true);
    }, 3000); // Delay the appearance of the form by 3 seconds
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setConversation((prev) => [...prev, { sender: "user", content: prompt }]);
    setLoading(true);
    setPrompt(""); // Clear input

    try {
      // Call the API route defined in app/api/chat/route.ts
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }), // Send user input as the request body
      });

      const data = await res.json();

      // Add AI response to conversation
      setConversation((prev) => [
        ...prev,
        { sender: "ai", content: data.reply },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setConversation((prev) => [
        ...prev,
        { sender: "ai", content: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">
        {/* Render intro text with word-by-word fade animation */}
        {introWords}
      </h1>

      <div className="chat-box">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user" : "ai"}`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className={`chat-input-form ${formVisible ? "visible" : "hidden"}`}
      >
        <textarea
          className="chat-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your question..."
          required
        />
        <button type="submit" className="chat-button" disabled={loading}>
          {loading ? "Loading..." : "ASK UR QUESTION"}
        </button>
      </form>

      {/* Add your CSS styles here */}
      <style jsx>{`
        .fade-word {
          animation: fadeIn 0.5s forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Form visibility classes */
        .chat-input-form {
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.5s ease;
        }

        .chat-input-form.visible {
          opacity: 1;
          visibility: visible;
        }

        .chat-input-form.hidden {
          opacity: 0;
          visibility: hidden;
        }
      `}</style>
    </div>
  );
}
