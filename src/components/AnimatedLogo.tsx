import Image from "next/image";
import styles from "./AnimatedLogo.module.css";

export default function AnimatedLogo() {
  return (
    <div className={styles.wrap}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.floatWrap}>
        <Image
          src="/images/logo-transparent.png"
          alt="Rynex Security"
          width={220}
          height={220}
          className={styles.logoImg}
        />
      </div>
    </div>
  );
}
