"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { services, type Service } from "@/lib/site-data";
import styles from "./services.module.css";

export default function ServicesGrid() {
  const [activeService, setActiveService] = useState<Service | null>(null);

  return (
    <>
      <div className={styles.grid}>
        {services.map((service) => (
          <button
            key={service.slug}
            type="button"
            className={styles.card}
            onClick={() => setActiveService(service)}
          >
            <i className={`fas ${service.icon} ${styles.icon}`} aria-hidden="true" />
            <h3 className={styles.title}>{service.title}</h3>
            <p className={styles.text}>{service.description}</p>
            <span className={styles.learnMore}>
              Learn more <i className="fas fa-arrow-right" aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>

      <Modal
        isOpen={activeService !== null}
        onClose={() => setActiveService(null)}
        title={activeService?.title ?? ""}
      >
        {activeService && (
          <>
            <i className={`fas ${activeService.icon} ${styles.modalIcon}`} aria-hidden="true" />
            <p className={styles.modalText}>{activeService.description}</p>
          </>
        )}
      </Modal>
    </>
  );
}
