import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  FaWhatsapp,
  FaInstagram,
  FaEnvelope,
  FaDiscord,
  FaRegPaperPlane,
} from "react-icons/fa";
import styles from "./Contact.module.scss";

const Contact = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("whatsapp");
  const [isSending, setIsSending] = useState(false);

  const contactOptions = [
    { id: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp /> },
    { id: "instagram", label: "Instagram", icon: <FaInstagram /> },
    { id: "email", label: "Email", icon: <FaEnvelope /> },
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
    setIsSending(false);
  };

  const handleFinalSend = async () => {
    if (!name || !message) return;

    if (selectedOption === "email") {
      const EMAIL_CONFIG = {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      };

      const isConfigured =
        EMAIL_CONFIG.serviceId &&
        EMAIL_CONFIG.templateId &&
        EMAIL_CONFIG.publicKey;

      // ===== ENVIO REAL VIA EMAILJS =====
      if (isConfigured) {
        setIsSending(true);

        try {
          await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            {
              from_name: name,
              message,
              reply_to: "gabrielwag971@gmail.com",
            },
            EMAIL_CONFIG.publicKey,
          );

          alert("Mensagem enviada com sucesso!");
          closeAndReset();
          return;
        } catch (err) {
          console.warn("EmailJS falhou, usando mailto fallback", err);
        } finally {
          setIsSending(false);
        }
      }

      // ===== FALLBACK MAILTO LIMPO =====
      const subject = encodeURIComponent(`Contato Profissional - ${name}`);
      const body = encodeURIComponent(
        `Olá Gabriel,

Me chamo ${name}.

${message}

Atenciosamente,
${name}`,
      );

      window.location.assign(
        `mailto:gabrielwag971@gmail.com?subject=${subject}&body=${body}`,
      );

      closeAndReset();
      return;
    }

    // ===== OUTROS CANAIS =====
    const encodedMessage = encodeURIComponent(`Olá, sou ${name}. ${message}`);
    let targetUrl = null;

    switch (selectedOption) {
      case "whatsapp":
        targetUrl = `https://wa.me/5546991213122?text=${encodedMessage}`;
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

    window.open(targetUrl, "_blank", "noopener,noreferrer");
    closeAndReset();
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
                  Por onde você prefere enviar essa mensagem?
                </p>

                <div className={styles.optionsList}>
                  {contactOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`${styles.optionItem} ${selectedOption === option.id ? styles.selected : ""}`}
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
                  className={`${styles.confirmButton} ${isSending ? styles.loading : ""}`}
                  onClick={handleFinalSend}
                  disabled={isSending}
                >
                  {isSending ? "Enviando..." : "Enviar Agora"}
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
