interface PrintButtonProps {
  onPrintClick: () => void;
  onCloseClick: () => void;
}

export default function PrintButton({
  onPrintClick,
  onCloseClick,
}: PrintButtonProps) {
  return (
    <div className="button-container">
      <button onClick={onPrintClick} className="print-button">
        PRINT UR BRAIDS
      </button>
      <button onClick={onCloseClick} className="close-print-button">
        X
      </button>
    </div>
  );
}
