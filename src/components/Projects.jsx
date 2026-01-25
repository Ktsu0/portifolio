import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import styles from "./Projects.module.scss";

const projects = [
  {
    title: "Financeiro — Dashboard de Gestão Financeira",
    description:
      "Aplicação full-stack para gestão financeira pessoal, projetada para registrar e organizar receitas, despesas e obrigações financeiras, incluindo controle de cartões de crédito. A plataforma oferece dashboards interativos para análise visual de dados, exportação estruturada em CSV, PDF e JSON, além de sincronização automática com Google Sheets, garantindo persistência, rastreabilidade e portabilidade das informações.",
    tech: [
      "Frontend: React + Vite",
      "Backend: Node.js + Express",
      "Google Sheets API",
      "Chart.js",
      "Data Export (CSV, PDF, JSON)",
    ],
    github: "https://github.com/Ktsu0/Financeiro",
    external: "#",
  },
  {
    title: "Termo Infinito — Modo Ilimitado",
    description:
      "Jogo web de adivinhação de palavras inspirado em Wordle, desenvolvido para oferecer partidas ilimitadas com feedback visual por letra em tempo real e validação de vocabulário por meio de integração com API de dicionário. A aplicação apresenta interface leve, responsiva e otimizada para desempenho, com deploy contínuo em Vercel para entrega rápida e estável.",
    tech: [
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "Fetch API / Custom Word Validation API",
      "Deploy: Vercel",
    ],
    github: "https://github.com/Ktsu0/termoInfinito",
    external: "https://termo-infinito.vercel.app/",
  },
  {
    title: "Mystic — Plataforma Interativa de Agendamentos e Serviços",
    description:
      "Aplicação web desenvolvida com React e Vite para apresentação e agendamento de serviços, estruturada como uma SPA com navegação fluida e modular. O sistema inclui calendário interativo para marcação de consultas, seções institucionais e área de feedback de usuários, além de integrações diretas com Instagram e WhatsApp. A interface é enriquecida com animações, efeitos de partículas e elementos 3D para proporcionar uma experiência visual imersiva e responsiva.",
    tech: [
      "Frontend: React 19 + Vite",
      "Routing: React Router",
      "3D & Visual Effects: Three.js / React Three Fiber",
      "Animations: Framer Motion, AOS, ScrollReveal",
      "UX & Performance: Intersection Observer, Lazy Loading",
      "UI Utilities: React Calendar, clsx",
      "Deploy: Vercel",
    ],
    github: "https://github.com/Ktsu0/siteMysticReact",
    external: "#",
  },
  {
    title: "RPG — The Lost World (Console Adventure)",
    description:
      "RPG de aventura baseado em texto, executado em ambiente de console, com sistemas estruturados de combate, exploração e progressão de personagem, além de narrativas interativas orientadas por estado. O projeto encontra-se em evolução para uma interface visual, com foco em migração da lógica central para uma camada gráfica desacoplada.",
    tech: [
      "JavaScript (Node.js)",
      "Text-based Game Logic",
      "Game Loop & State Management",
      "Console I/O",
      "Planned UI Enhancements (Canvas / Web UI / Game Library)",
    ],
    github: "https://github.com/Ktsu0/RPG---THE-LOST-WORLD",
    external: "#",
  },
  {
    title: "Projeto Exemplo 3",
    description: "Design system criado do zero para escalar aplicações.",
    tech: ["TypeScript", "CSS Modules"],
    github: "#",
    external: "#",
  },
];

const Projects = () => {
  const [showModal, setShowModal] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const handleProjectClick = (e, external) => {
    if (external === "#") {
      e.preventDefault();
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDetailsClose = () => {
    setSelectedProject(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setSelectedProject(null);
    }
  };

  return (
    <section id="projects" className={`section ${styles.projectsSection}`}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.title}
        >
          Meus Projetos
        </motion.h2>

        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className={styles.projectCard}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.projectTitle}>{project.title}</h3>

                <ul className={styles.techList}>
                  {project.tech.slice(0, 3).map((t, i) => (
                    <li key={i} className={styles.techTag}>
                      {t}
                    </li>
                  ))}
                  {project.tech.length > 3 && (
                    <li className={styles.techTag}>
                      +{project.tech.length - 3}
                    </li>
                  )}
                </ul>
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.moreInfoButton}
                  onClick={() => setSelectedProject(project)}
                >
                  Saiba Mais
                </button>

                <div className={styles.projectLinks}>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver código no GitHub"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href={project.external}
                    onClick={(e) => handleProjectClick(e, project.external)}
                    target={project.external !== "#" ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    title={
                      project.external !== "#"
                        ? "Ver projeto online"
                        : "Projeto aguardando lançamento"
                    }
                  >
                    <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal de Detalhes do Projeto */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.modalBackdrop}
              onClick={handleBackdropClick}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, type: "spring" }}
                className={`${styles.modalContent} ${styles.detailsModal}`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.closeButton}
                  onClick={handleDetailsClose}
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

                <h3 className={styles.detailsTitle}>{selectedProject.title}</h3>

                <div className={styles.detailsBody}>
                  <p className={styles.detailsDescription}>
                    {selectedProject.description}
                  </p>

                  <div className={styles.detailsTechSection}>
                    <h4>Tecnologias Utilizadas:</h4>
                    <ul className={styles.techListFull}>
                      {selectedProject.tech.map((t, i) => (
                        <li key={i} className={styles.techTagFull}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={styles.detailsActions}>
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionButton}
                  >
                    <FaGithub /> Ver Código
                  </a>
                  <a
                    href={selectedProject.external}
                    onClick={(e) => {
                      handleDetailsClose();
                      handleProjectClick(e, selectedProject.external);
                    }}
                    target={
                      selectedProject.external !== "#" ? "_blank" : "_self"
                    }
                    rel="noopener noreferrer"
                    className={`${styles.actionButton} ${styles.primaryAction}`}
                  >
                    <FaExternalLinkAlt /> Ver Projeto
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.modalBackdrop}
              onClick={handleBackdropClick}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring" }}
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.closeButton}
                  onClick={handleModalClose}
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

                <div className={styles.modalIcon}>
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 6v6l4 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h3 className={styles.modalTitle}>Projeto Concluído</h3>

                <p className={styles.modalDescription}>
                  Este projeto está totalmente desenvolvido e funcional, porém
                  ainda não foi disponibilizado publicamente.
                </p>

                <div className={styles.progressBar}>
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 10, ease: "linear" }}
                    className={styles.progressFill}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
