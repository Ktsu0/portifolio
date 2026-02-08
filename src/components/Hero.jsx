import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Hero.module.scss";
import fotoPerfil from "./../assets/fotoPerfil.png";

const Hero = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -10;
    const tiltY = ((x - centerX) / centerX) * 10;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section id="home" className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.greeting}
          >
            Olá, eu sou
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.name}
          >
            Gabriel Wagner
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={styles.title}
          >
            Desenvolvedor
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={styles.description}
          >
            Sou estudante do SENAC, atualmente cursando Técnico em Informática
            para Internet, com foco no desenvolvimento de soluções digitais
            modernas e bem estruturadas. Transformo ideias em experiências
            digitais funcionais e imersivas, unindo design elegante, boa
            usabilidade e desempenho sólido. Tenho perfil focado e organizado,
            com facilidade para aprender novas linguagens, tecnologias e
            explorar diferentes abordagens no uso de ferramentas que já domino.
            Busco constantemente evoluir como desenvolvedor, priorizando
            qualidade de código, escalabilidade e boas práticas, sempre atento
            às tendências e às necessidades reais do usuário.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={styles.ctaButtons}
          >
            <a href="#projects" className={styles.primaryBtn}>
              Ver Projetos
            </a>
            <a href="#skills" className={styles.primaryBtn}>
              Minhas Skills
            </a>
            <a href="#contact" className={styles.primaryBtn}>
              Entrar em Contato
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className={styles.imageContainer}
        >
          <div className={`${styles.decorativeChevron} ${styles.left}`}>
            &lt;
          </div>
          <div className={`${styles.decorativeChevron} ${styles.right}`}>
            &gt;
          </div>

          <div
            className={styles.ringContainer}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.gradientRing}></div>

            <div className={styles.innerGlow}></div>

            <div className={styles.particlesContainer}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={styles.particle}></div>
              ))}
            </div>

            <div
              className={styles.profileImage}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              <img src={fotoPerfil} alt="Profile" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
