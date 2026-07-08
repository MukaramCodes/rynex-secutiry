"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import ApplicationForm from "./ApplicationForm";

// Flip to true to reopen applications — the working form/API below stays intact either way.
const APPLICATIONS_OPEN = false;

export default function ApplyButton({ variant = "primary" as "primary" | "onDark" }) {
  const [open, setOpen] = useState(false);

  if (!APPLICATIONS_OPEN) {
    return (
      <Button variant={variant} disabled>
        Applications Closed
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={variant} icon="fa-arrow-right">
        Apply Now
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Apply — Rynex Security Internship 2026">
        <ApplicationForm onSuccess={() => setTimeout(() => setOpen(false), 1500)} />
      </Modal>
    </>
  );
}
