import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWhatsapp,
  FaInstagram,
  FaEnvelope,
  FaDiscord,
  FaRegPaperPlane,
  FaGoogle,
} from "react-icons/fa"; // Adicionei o ícone do Google se quiser ser mais específico
import styles from "./Contact.module.scss";

const Contact = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("whatsapp");

  const MY_EMAIL = "gabrielwag971@gmail.com";

  const contactOptions = [
    { id: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp /> },
    { id: "instagram", label: "Instagram", icon: <FaInstagram /> },
    { id: "email", label: "Gmail / Email", icon: <FaEnvelope /> }, // Rótulo genérico
    { id: "discord", label: "Discord", icon: <FaDiscord /> },
  ];

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!name || !message) return;
    setShowModal(true);
  };

  const closeAndReset = () => {
    setShowModal(false);
    setName("");
    setMessage("");
  };

  // Função para detectar se é dispositivo móvel (opcional, para decidir entre app ou web)
  const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const handleFinalSend = () => {
    if (!name || !message) return;

    // Prepara os textos seguros para URL
    const subject = encodeURIComponent(`Contato Profissional - ${name}`);
    const bodyContent = `Olá Gabriel,\n\nMe chamo ${name}.\n\n${message}\n\nAtenciosamente,\n${name}`;
    const encodedBody = encodeURIComponent(bodyContent);

    let targetUrl = "";

    switch (selectedOption) {
      case "email":
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${MY_EMAIL}&su=${subject}&body=${encodedBody}`;
        const mailtoUrl = `mailto:${MY_EMAIL}?subject=${subject}&body=${encodedBody}`;

        if (isMobile()) {
          window.location.href = mailtoUrl;
          closeAndReset();
          return;
        } else {
          targetUrl = gmailUrl;
        }
        break;

      case "whatsapp":
        const whatsMsg = encodeURIComponent(`Olá, sou ${name}. ${message}`);
        targetUrl = `https://wa.me/5546991213122?text=${whatsMsg}`;
        break;

      case "instagram":
        targetUrl = "https://instagram.com/gabr1el_wag";
        break;

      case "discord":
        targetUrl = "https://discord.com/users/555803479675895838";
        break;

      default:
        return;
    }

    // Abre em nova aba
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      closeAndReset();
    }
  };

  return (
    <section id="contact" className={`section ${styles.contactSection}`}>
      <div className={`container ${styles.container}`}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.title}
        >
          Vamos Conversar?
        </motion.h2>

        <motion.form
          onSubmit={handleInitialSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Seu Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Mensagem
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva sua mensagem aqui..."
              rows={5}
              className={styles.textarea}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            <FaRegPaperPlane /> Enviar Mensagem
          </button>
        </motion.form>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.modalBackdrop}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.closeButton}
                  onClick={() => setShowModal(false)}
                  aria-label="Fechar"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <h3 className={styles.modalTitle}>Escolha o canal</h3>
                <p className={styles.modalDescription}>
                  Por onde enviamos essa mensagem?
                </p>

                <div className={styles.optionsList}>
                  {contactOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`${styles.optionItem} ${
                        selectedOption === option.id ? styles.selected : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="contactMethod"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => setSelectedOption(option.id)}
                        className={styles.radioInput}
                      />
                      <span className={styles.customRadio}></span>
                      <span className={styles.iconWrapper}>{option.icon}</span>
                      <span
                        className={`${styles.optionLabel} notranslate`}
                        translate="no"
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  className={styles.confirmButton}
                  onClick={handleFinalSend}
                >
                  {selectedOption === "email" && !isMobile()
                    ? "Abrir no Gmail"
                    : "Enviar Agora"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Contact;
