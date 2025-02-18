/* eslint-disable react/no-unescaped-entities */
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
    `♥♥♥ Hi There ✦✦✦✦✦`,
    `✦✦✦ I'm Beyonce ✦✦✦`,
    `✿✿✿ What would you like to know about Braids? ✿✿✿`,
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



 


    </div>
  );
}