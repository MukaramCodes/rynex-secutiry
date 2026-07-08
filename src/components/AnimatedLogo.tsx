import Image from "next/image";
import styles from "./AnimatedLogo.module.css";

export default function AnimatedLogo() {
  return (
    <div className={styles.wrap}>
      <div className={`${styles.ring} ${styles.ring1}`} />
      <div className={`${styles.ring} ${styles.ring2}`} />
      <div className={`${styles.ring} ${styles.ring3}`} />

      <div className={styles.orbit}>
        <span className={styles.orbitDot} />
      </div>
      <div className={`${styles.orbit} ${styles.orbitReverse}`}>
        <span className={styles.orbitDot} />
      </div>

      <div className={styles.floatWrap}>
        <div className={styles.spinInner}>
          <Image
            src="/images/logo.png"
            alt="Rynex Security"
            width={140}
            height={140}
            className={styles.logoImg}
          />
        </div>
      </div>

      <div className={styles.scanLine} aria-hidden="true" />
    </div>
  );
}
