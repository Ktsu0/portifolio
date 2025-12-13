import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import styles from './Projects.module.scss';

const projects = [
  {
    title: "Projeto Exemplo 1",
    description: "Uma breve descrição do que esse projeto faz e as tecnologias utilizadas.",
    tech: ["React", "Node.js", "MongoDB"],
    github: "#",
    external: "#"
  },
  {
    title: "Projeto Exemplo 2",
    description: "Um aplicativo incrível que resolve um problema real.",
    tech: ["Vue.js", "Firebase"],
    github: "#",
    external: "#"
  },
  {
    title: "Projeto Exemplo 3",
    description: "Design system criado do zero para escalar aplicações.",
    tech: ["TypeScript", "CSS Modules"],
    github: "#",
    external: "#"
  }
];

const Projects = () => {
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
              <div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
              </div>
              
              <div>
                <ul className={styles.techList}>
                  {project.tech.map((t, i) => (
                    <li key={i} className={styles.techTag}>
                      {t}
                    </li>
                  ))}
                </ul>

                <div className={styles.projectLinks}>
                  <a href={project.github}><FaGithub /></a>
                  <a href={project.external}><FaExternalLinkAlt /></a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
