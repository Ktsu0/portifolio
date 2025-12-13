import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './Contact.module.scss';

const Contact = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !message) return;

    const phoneNumber = "5546991213122";
    const text = `Olá, meu nome é ${name}. ${message}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    
    window.open(url, '_blank');
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
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Seu Nome</label>
            <input 
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>Mensagem</label>
            <textarea 
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva sua mensagem aqui..."
              rows={5}
              className={styles.textarea}
            />
          </div>

          <button 
            type="submit"
            className={styles.submitButton}
          >
            <FaWhatsapp /> Enviar para WhatsApp
          </button>

        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
