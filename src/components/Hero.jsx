import React, { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import styles from "./Hero.module.scss";
import heroCutout from "./../assets/imgPerfil.png";
import ShatterPortrait from "./shatter/ShatterPortrait";

const MAX_OFFSET_X = 22;
const MAX_OFFSET_Y = 14;

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const floatX = useSpring(rawX, { type: "spring", duration: 0.7, bounce: 0.15 });
  const floatY = useSpring(rawY, { type: "spring", duration: 0.7, bounce: 0.15 });

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const handlePointerMove = (e) => {
      const offsetX = (e.clientX / window.innerWidth - 0.5) * 2;
      const offsetY = (e.clientY / window.innerHeight - 0.5) * 2;
      rawX.set(offsetX * MAX_OFFSET_X);
      rawY.set(offsetY * MAX_OFFSET_Y);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [shouldReduceMotion, rawX, rawY]);

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

          <div className={styles.floatStage}>
            <div className={styles.glowOrb}></div>
            <motion.div
              className={styles.portraitStage}
              style={{ x: floatX, y: floatY }}
            >
              <ShatterPortrait photoUrl={heroCutout} label="Gabriel Wagner" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
