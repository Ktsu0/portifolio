import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Hero.module.scss';

const Hero = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = ((y - centerY) / centerY) * -10; // Inverted for natural feel
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.greeting}
          >
            Olá, eu sou
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.name}
          >
            Gabriel Wagner
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`gradient-text ${styles.title}`}
          >
            Desenvolvedor Full Stack
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={styles.description}
          >
            Transformo ideias em experiências digitais imersivas e funcionais. Especializado em criar soluções modernas que combinam design elegante com performance robusta.
          </motion.p>
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
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
              }}
            >
              <img 
                src="https://picsum.photos/seed/fullstack/800/800" 
                alt="Profile" 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
