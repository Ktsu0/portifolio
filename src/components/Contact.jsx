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

  const handleFinalSend = async () => {
    if (selectedOption === "email") {
      // Se não configurou EmailJS ainda, usa mailto direto (mais confiável para o usuário agora)
      const isConfigured = "service_id" !== "service_id"; // Lógica interna apenas

      if (isConfigured) {
        setIsSending(true);
        try {
          const templateParams = {
            from_name: name,
            message: message,
            to_email: "gabrielwag971@gmail.com",
          };

          await emailjs.send(
            "service_id",
            "template_id",
            templateParams,
            "public_key",
          );
          alert("Mensagem enviada com sucesso!");
          setShowModal(false);
          setName("");
          setMessage("");
          setIsSending(false);
          return;
        } catch (error) {
          console.error("Erro no EmailJS:", error);
        }
      }

      // Fallback robusto: Abre o email de forma profissional
      const subject = encodeURIComponent(`Contato Profissional - ${name}`);
      // Usando %0D%0A para quebras de linha (padrão RFC)
      const body = encodeURIComponent(
        `Olá Gabriel,%0D%0A%0D%0AMe chamo ${name}.%0D%0A%0D%0A${message}%0D%0A%0D%0AAtenciosamente,%0D%0A${name}`,
      );
      const mailtoUrl = `mailto:gabrielwag971@gmail.com?subject=${subject}&body=${body}`;

      // Tenta abrir o email sem disparar o bloqueador de popup
      window.location.assign(mailtoUrl);

      setShowModal(false);
      setIsSending(false);
      setName("");
      setMessage("");
      return;
    }

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
        break;
    }

    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      setShowModal(false);
      setName("");
      setMessage("");
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
