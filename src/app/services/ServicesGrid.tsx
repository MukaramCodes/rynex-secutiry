import Link from "next/link";

import { services } from "@/lib/site-data";
import styles from "./services.module.css";

export default function ServicesGrid() {
  return (
    <div className={styles.grid}>
      {services.map((service) => (
        <Link
          key={service.slug}
          href={`/services/${service.slug}`}
          className={styles.card}
          aria-label={`View ${service.title} service`}
        >
          <div className={styles.titleRow}>
            <i
              className={`fas ${service.icon} ${styles.icon}`}
              aria-hidden="true"
            />
            <h3 className={styles.title}>
              {service.title}
            </h3>
          </div>

          <p className={styles.text}>
            {service.description}
          </p>

          <span className={styles.learnMore}>
            View service

            <i
              className="fas fa-arrow-right"
              aria-hidden="true"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}