// components/PrintChat.tsx

import React from 'react';

interface PrintChatProps {
  chatId: string;
}

const PrintChat: React.FC<PrintChatProps> = ({ chatId }) => {
  const handlePrint = () => {
    // Print only the content of the specified chatId
    const printContents = document.getElementById(chatId)?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload the page to reset after print
    }
  };

  return (
    <button onClick={handlePrint} className="chat-button">
      Print Chat / Save as PDF
    </button>
  );
};

export default PrintChat;
