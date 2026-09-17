import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import styles from "./Projects.module.scss";
import { useModalA11y } from "../hooks/useModalA11y";
import financeiroCover from "./../assets/covers/financeiro.jpg";
import termoInfinitoCover from "./../assets/covers/termoInfinito.jpg";
import mysticCover from "./../assets/covers/mystic.jpg";
import rpgLostWorldCover from "./../assets/covers/rpgLostWorld.jpg";
import rpgSenshiCover from "./../assets/covers/rpgSenshi.jpg";
import apiNestCover from "./../assets/covers/apiNest.jpg";
import antesDeDormirCover from "./../assets/covers/antesDeDormirCover.jpg";
import templateImobiliarioCover from "./../assets/covers/templateImobiliario.jpg";
import fazendaProCover from "./../assets/covers/fazendaPro.jpg";
import encontreSaudeCover from "./../assets/covers/encontreSaude.jpg";

const projects = [
  {
    title: "Financeiro — Dashboard de Gestão Financeira",
    image: financeiroCover,
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
    image: termoInfinitoCover,
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
    image: mysticCover,
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
    image: rpgLostWorldCover,
    description:
      "RPG de turnos que nasceu como um jogo de console em texto e evoluiu para uma reconstrução visual jogável direto no navegador, com deploy automático no GitHub Pages a cada push (testes como gate de qualidade no pipeline). O motor original de combate, exploração e progressão de personagem foi mantido como núcleo lógico e ganhou integração com a API do Google Gemini para geração de conteúdo dinâmico, enquanto a camada web (Vite) desacoplou a lógica de uma interface gráfica com estética retrô.",
    tech: [
      "JavaScript (Node.js + Vite)",
      "Google Gemini API (@google/genai)",
      "Vitest (suíte de testes como gate de CI)",
      "CI/CD: GitHub Actions + GitHub Pages",
      "Game Loop & State Management",
      "Turn-based Combat & Progression Systems",
    ],
    github: "https://github.com/Ktsu0/RPG---THE-LOST-WORLD",
    external: "https://ktsu0.github.io/RPG---THE-LOST-WORLD/",
  },
  {
    title: "API - Nest Ecomerce",
    image: apiNestCover,
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
  {
    title: "Antes de Dormir",
    image: antesDeDormirCover,
    description:
      "Aplicação web voltada à criação e consumo de relatos anônimos e aleatórios, projetada para oferecer uma experiência simples, envolvente e segura. O projeto integra frontend e backend através da API do Supabase, utilizando autenticação via Google para gerenciamento de usuários e controle de acesso. A arquitetura prioriza organização, clareza de responsabilidades e escalabilidade, com foco em boas práticas, desempenho e facilidade de manutenção. O sistema permite criação de relatos, categorização, interação do usuário e consumo dinâmico de conteúdo, atuando como uma base sólida para evolução futura da plataforma.",
    tech: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Supabase REST API",
      "Authentication (Google OAuth)",
      "Relational Database (PostgreSQL via Supabase)",
      "Environment Variables (.env)",
      "Backend Automation: ActivePieces + Google Gemini (geração automática de relatos)",
    ],
    github: "https://github.com/Ktsu0/antes-de-dormir",
    external: "https://antes-de-dormir-ktsu.vercel.app/",
  },
  {
    title: "Template Imobiliário Configurável",
    image: templateImobiliarioCover,
    description:
      "Esqueleto Next.js config-driven para sites de imobiliárias, onde cada cliente é um deploy separado apontando para um arquivo de configuração próprio, sem nenhum componente carregando marca, cor ou conteúdo fixo. Inclui um pipeline próprio de geração de mídia a partir de vídeo bruto: o hero é recodificado sem perda para reprodução contínua, enquanto a seção de jornada (controlada por scroll) usa codificação all-intra para permitir scrub de vídeo sem travamentos, substituindo uma versão anterior que chegava a pesar 23MB em stills. Onboarding de um novo cliente é feito duplicando um arquivo de configuração e apontando fotos e vídeos reais, sem tocar em nenhum componente.",
    tech: [
      "Next.js 14 + React 18",
      "TypeScript",
      "Zustand (state management)",
      "Tailwind CSS",
      "Lenis (smooth scroll)",
      "Arquitetura Multi-tenant Config-Driven",
      "Pipeline de vídeo (FFmpeg, encoding all-intra para scrub)",
      "Sharp (processamento de imagem)",
      "Vitest + Testing Library",
      "Deploy: Vercel",
    ],
    github: "https://github.com/Ktsu0/templateImobiliario",
    external: "https://template-imobiliario-swart.vercel.app",
  },
  {
    title: "Fazenda Pro — Harvest Programmer",
    image: fazendaProCover,
    description:
      "Jogo de fazenda incremental no estilo Harvest Moon, construído em JavaScript puro dividido em módulos de estado, lógica de jogo, interface e persistência. O jogador planta e colhe uma cadeia de culturas (trigo, cenoura, batata, pimentão...), gerencia um drone automatizado de colheita e investe em uma árvore de upgrades com múltiplas categorias — terreno, capacidade e velocidade do drone, robótica avançada, multiplicadores de colheita, sementes, água e um sistema de console/depuração próprio. Toda a simulação de crescimento, inventário e progressão roda no cliente, sem backend.",
    tech: [
      "JavaScript (ES6 Modules)",
      "Game Loop & State Management",
      "Sistema de Upgrades / Tech Tree",
      "Simulação de Recursos e Progressão",
      "Tailwind CSS (camada de utilidades)",
      "Deploy: Vercel",
    ],
    github: "https://github.com/Ktsu0/HarvestProgrammer",
    external: "https://harvest-programmer.vercel.app/",
  },
  {
    title: "RPG Senshi no Kokuin — Bot de Telegram",
    image: rpgSenshiCover,
    description:
      "RPG completo funcionando inteiramente dentro de um bot de Telegram, orquestrado sem uma linha de backend tradicional: todo o motor de jogo foi montado como um fluxo de automação no ActivePieces, com mais de 160 etapas encadeadas. O sistema cobre cadastro e boas-vindas de jogador, exploração com achados de item, ganho de XP e level up, combate por turnos contra monstros aleatórios e chefes, fuga, uso de poções e itens, geração e conclusão de missões, diálogo com múltiplos NPCs, cassino/apostas e descanso — todo o estado do jogador é persistido em banco de dados e roteado por uma árvore de decisões condicionais construída visualmente.",
    tech: [
      "ActivePieces (automação/orquestração visual)",
      "Telegram Bot API",
      "Máquina de estados via banco de dados",
      "Lógica condicional complexa (roteamento por árvore de decisão)",
      "Design de sistemas de RPG (combate, XP, missões, inventário)",
    ],
    external: "https://t.me/RpgKtsuBot",
  },
  {
    title: "EncontreSaúde — Bot de Triagem de Sintomas",
    image: encontreSaudeCover,
    description:
      "Chatbot de Telegram para triagem inicial de sintomas, construído como um fluxo de automação no ActivePieces. A cada mensagem, o fluxo consulta o histórico da conversa em banco de dados, decide se está diante de uma triagem nova, incompleta ou de uma mensagem comum, conduz as perguntas necessárias e devolve uma orientação sobre os próximos passos com base nos sintomas relatados, mantendo o estado da conversa entre mensagens.",
    tech: [
      "ActivePieces (automação/orquestração visual)",
      "Telegram Bot API",
      "Gerenciamento de estado conversacional (banco de dados)",
      "Lógica de triagem e classificação de sintomas",
    ],
    external: "https://t.me/EncontreSaudeBot",
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

  useModalA11y(!!selectedProject, handleDetailsClose);
  useModalA11y(showModal, handleModalClose);

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
                    loading="lazy"
                    decoding="async"
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
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver código no GitHub"
                    >
                      <FaGithub />
                    </a>
                  )}
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
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-details-title"
              >
                <div className={styles.modalImageWrapper}>
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className={styles.modalFullImage}
                    loading="lazy"
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
                  <h3 id="project-details-title" className={styles.detailsTitle}>
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
                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionButton}
                      >
                        <FaGithub /> Ver Código
                      </a>
                    )}
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
                      <FaExternalLinkAlt />{" "}
                      {selectedProject.github ? "Ver Projeto" : "Testar no Telegram"}
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
                role="dialog"
                aria-modal="true"
                aria-labelledby="launch-modal-title"
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

                <h3 id="launch-modal-title" className={styles.modalTitle}>
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
