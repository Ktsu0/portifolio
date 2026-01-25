import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoMenu, IoClose } from "react-icons/io5";
import TypingEffect from "./TypingEffect";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Início", href: "#home" },
    { name: "Tecnologias", href: "#skills" },
    { name: "Projetos", href: "#projects" },
    { name: "Contato", href: "#contact" },
  ];

  return (
    <nav className={`${styles.nav} notranslate`} translate="no">
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <div className={styles.typingWrapper}>
              <TypingEffect />
            </div>
          </div>
        </div>

        {!isMobile && (
          <div className={styles.desktopMenu}>
            <ul>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <a href={item.href}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.rightSection}>
          {!isMobile ? (
            <>
              <a
                href="https://github.com/Ktsu0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com/in/gabriel-wagner-00baaa381 "
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
            </>
          ) : (
            <button onClick={toggleMenu} className={styles.mobileToggle}>
              {isOpen ? <IoClose /> : <IoMenu />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className={styles.mobileMenuOverlay}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={styles.mobileMenuItem}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className={styles.mobileSocials}>
              <a
                href="https://github.com/Ktsu0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com/in/gabriel-wagner-00baaa381"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
