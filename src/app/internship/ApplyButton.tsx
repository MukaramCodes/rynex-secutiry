"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import ApplicationForm from "./ApplicationForm";

export default function ApplyButton({ variant = "primary" as "primary" | "onDark" }) {
  const [open, setOpen] = useState(false);

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
