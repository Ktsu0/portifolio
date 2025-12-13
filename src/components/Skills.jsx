import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaServer, FaPaintBrush, FaChevronDown } from 'react-icons/fa';
import { SiHtml5, SiCss3, SiReact, SiTypescript, SiNodedotjs, SiNestjs, SiPostgresql, SiPython, SiFigma, SiMiro, SiCanva, SiGit, SiGithub, SiTailwindcss, SiSass, SiJavascript, SiThreedotjs } from 'react-icons/si';
import { TbApi } from 'react-icons/tb';
import styles from './Skills.module.scss';

const skillCategories = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    subtitle: 'HTML, CSS, React, etc.',
    icon: <FaCode />,
    skills: [
      { name: 'HTML', icon: <SiHtml5 color="#E34F26" /> },
      { name: 'CSS', icon: <SiCss3 color="#1572B6" /> },
      { name: 'JavaScript', icon: <SiJavascript color="#F7DF1E" /> },
      { name: 'React', icon: <SiReact color="#61DAFB" /> },
      { name: 'TypeScript', icon: <SiTypescript color="#3178C6" /> },
      { name: 'Tailwind CSS', icon: <SiTailwindcss color="#06B6D4" /> },
      { name: 'Module SCSS', icon: <SiSass color="#CC6699" /> },
      { name: 'Three.js', icon: <SiThreedotjs color="#FFFFFF" /> },
    ]
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    subtitle: 'Node, APIs, Python',
    icon: <FaServer />,
    skills: [
      { name: 'Node.js', icon: <SiNodedotjs color="#339933" /> },
      { name: 'NestJS', icon: <SiNestjs color="#E0234E" /> },
      { name: 'SQL', icon: <SiPostgresql color="#336791" /> },
      { name: 'API REST', icon: <TbApi /> },
      { name: 'Python', icon: <SiPython color="#3776AB" /> },
    ]
  },
  {
    id: 'ui-ux',
    title: 'UI / UX Design',
    subtitle: 'Figma, Miro, Canva',
    icon: <FaPaintBrush />,
    skills: [
      { name: 'Figma', icon: <SiFigma color="#F24E1E" /> },
      { name: 'Miro', icon: <SiMiro color="#050038" /> },
      { name: 'Canva', icon: <SiCanva color="#00C4CC" /> },
    ]
  },
  {
    id: 'tools',
    title: 'Ferramentas & DevOps',
    subtitle: 'Git, GitHub, VS Code',
    icon: <SiGit color="#F05032" />,
    skills: [
      { name: 'Git', icon: <SiGit color="#F05032" /> },
      { name: 'GitHub', icon: <SiGithub color="#ffffff" /> },
    ]
  }
];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleCategory = (id) => {
    setActiveCategory(activeCategory === id ? null : id);
  };

  return (
    <section id="skills" className={`section ${styles.skillsSection}`}>
      <div className={`container ${styles.container}`}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.title}
        >
          Minha Experiência
        </motion.h2>

        <div className={styles.categoriesContainer}>
          {skillCategories.map((category) => (
            <div key={category.id} className={styles.categoryWrapper}>
              <motion.button
                onClick={() => toggleCategory(category.id)}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                whileTap={{ scale: 0.98 }}
                className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
              >
                <div className={styles.categoryHeader}>
                  <div className={`${styles.categoryIcon} ${activeCategory === category.id ? styles.active : ''}`}>
                    {category.icon}
                  </div>
                  <div className={styles.categoryInfo}>
                    <h3 className={styles.categoryTitle}>{category.title}</h3>
                    <p className={`${styles.categorySubtitle} ${activeCategory === category.id ? styles.active : ''}`}>
                      {category.subtitle}
                    </p>
                  </div>
                </div>
                <div className={`${styles.chevron} ${activeCategory === category.id ? styles.rotated : ''}`}>
                  <FaChevronDown />
                </div>
              </motion.button>

              <AnimatePresence>
                {activeCategory === category.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.expandedContent}
                  >
                    <div className={styles.skillsGrid}>
                      <div className={styles.gridContainer}>
                        {category.skills.map((skill, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={styles.skillItem}
                          >
                            <div className={styles.skillHeader}>
                              {skill.icon}
                              <span className={`notranslate ${styles.skillName}`} translate="no">
                                {skill.name}
                              </span>
                            </div>
                            <div className={styles.progressBar}>
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                transition={{ duration: 1, delay: 0.2 + (index * 0.05) }}
                                className={styles.progressFill}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
