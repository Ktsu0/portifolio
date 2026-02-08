import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import styles from "./Projects.module.scss";

const projects = [
  {
    title: "Financeiro — Dashboard de Gestão Financeira",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
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
    external: "http://financeiro-wagner.vercel.app/",
  },
  {
    title: "Termo Infinito — Modo Ilimitado",
    image:
      "data:image/jpeg;base64,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",
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
    title: "Mystic — Plataforma de Agendamentos e Serviços",
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop",
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
    title: "RPG — The Lost World",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC7DeMh38Gsx_tHijP44EewweMAQVopTGytw&s",
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
    title: "API - Nest Ecomerce",
    image:
      "data:image/jpeg;base64,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",
    description:
      "API backend desenvolvida com NestJS e TypeScript, projetada para servir aplicações frontend de forma segura, escalável e bem estruturada. O projeto implementa uma arquitetura modular baseada em controllers, services e injeção de dependências, com persistência de dados em banco relacional SQL via Supabase, utilizando Prisma ORM para modelagem, tipagem forte e gerenciamento de migrations. A aplicação atua como camada central de regras de negócio, autenticação e comunicação entre frontend e banco de dados, priorizando organização, manutenibilidade, integração frontend-backend e boas práticas modernas de desenvolvimento backend.",
    tech: [
      "Node.js",
      "TypeScript",
      "NestJS",
      "REST API Architecture",
      "Prisma ORM",
      "Databases (SQL & NoSQL)",
      "Dependency Injection",
      "Modular Architecture (Modules, Controllers, Services)",
      "Express (NestJS HTTP Adapter)",
      "Environment Variables (.env)",
      "ESLint & Prettier",
      "Jest (Testing Framework)",
    ],
    github: "https://github.com/Ktsu0/API_Nest",
    external: "https://api-nest-iota.vercel.app/",
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
                <div className={styles.projectImageContainer}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className={styles.projectImage}
                  />
                </div>
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
                <div className={styles.modalImageWrapper}>
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className={styles.modalFullImage}
                  />
                  <div className={styles.imageGradient}></div>
                  <button
                    className={styles.closeButton}
                    onClick={handleDetailsClose}
                    aria-label="Fechar"
                  >
                    <svg
                      width="32"
                      height="32"
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
                </div>

                <div className={styles.detailsContentWrapper}>
                  <h3 className={styles.detailsTitle}>
                    {selectedProject.title}
                  </h3>

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
                    width="32"
                    height="32"
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

                <h3 className={styles.modalTitle}>
                  Projeto aguardando lançamento
                </h3>

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
