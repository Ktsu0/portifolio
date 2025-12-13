import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WhatsAppButton.module.scss';

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href="#contact"
      className={styles.whatsappButton}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className={styles.tooltip}
          >
            Entrar em contato
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }}
        whileTap={{ scale: 0.9 }}
        className={styles.iconContainer}
      >
        <FaWhatsapp className={styles.icon} />
      </motion.div>
    </a>
  );
};

export default WhatsAppButton;
