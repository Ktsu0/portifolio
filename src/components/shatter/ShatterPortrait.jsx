import React, { useEffect, useRef } from "react";
import styles from "./ShatterPortrait.module.scss";
import { createShatterPortrait } from "./createShatterPortrait";

const ShatterPortrait = ({ photoUrl, label }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    const controller = createShatterPortrait(rootRef.current, { photoUrl, classes: styles });
    return () => controller.destroy();
  }, [photoUrl]);

  return <div ref={rootRef} className={styles.root} role="img" aria-label={label} />;
};

export default ShatterPortrait;
