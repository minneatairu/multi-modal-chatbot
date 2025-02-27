"use client";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="art-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="art-modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
                <div onClick={onClose} className="close-button" style={{ marginTop: "20px" }}>
              Close
            </div>
            <h2>TITLE GOES HERE</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at
              velit nec leo consequat gravida. Integer auctor, ex a dapibus
              fermentum, urna mauris blandit sapien, non aliquam arcu quam in
              turpis. Sed ultrices turpis vitae nibh ullamcorper, nec consequat
              nisl aliquam. Curabitur vel cursus lorem, ac blandit dui. Integer
              aliquet sapien sit amet libero aliquam, ut mollis lorem interdum.
              Mauris a sem ut ante sollicitudin sollicitudin nec in lectus. Donec
              volutpat, odio id consequat fermentum, odio justo posuere ex, nec
              imperdiet lorem nisi vel magna. Quisque euismod, ligula ut lacinia
              luctus, mi ipsum sollicitudin purus, vel congue erat lorem eget
              libero.
            </p>
        
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
