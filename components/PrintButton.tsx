interface PrintButtonProps {
  onPrintClick: () => void;
  onCloseClick: () => void;
  isFromGptChatModal?: boolean;
  isPrintEnabled: boolean; // New prop to control if the print is enabled
}

export default function PrintButton({
  onPrintClick,
  onCloseClick,
  isFromGptChatModal = false,
  isPrintEnabled, // Receiving the new prop
}: PrintButtonProps) {
  return (
    <div className="button-container">
      <button
        onClick={isPrintEnabled ? onPrintClick : undefined} // Disable click if print is not enabled
        className={`print-button ${!isPrintEnabled ? "disabled" : ""}`} // Add a disabled class if needed
        disabled={!isPrintEnabled} // Disable the button if print is not enabled
      >
        {isFromGptChatModal ? "GPT PRINT" : "PRINT UR BRAIDS"}
      </button>
      <button onClick={onCloseClick} className="close-print-button">
        X
      </button>
    </div>
  );
}
