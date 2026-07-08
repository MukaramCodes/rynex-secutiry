import Link from "next/link";
import styles from "./Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "onDark";
  disabled?: boolean;
  type?: "button" | "submit";
  icon?: string;
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  icon = "fa-arrow-right",
}: ButtonProps) {
  const className = `${styles.btn} ${styles[variant]} ${disabled ? styles.disabled : ""}`;

  const content = (
    <>
      <span>{children}</span>
      {variant !== "ghost" && <i className={`fas ${icon}`} aria-hidden="true" />}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
