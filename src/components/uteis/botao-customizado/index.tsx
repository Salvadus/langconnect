import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import styles from "./styles.module.css";

export type BotaoVariant = "primary" | "secondary" | "danger" | "ghost" | "success";

export type BotaoCustomizadoProps = {
  texto?: string;
  children?: ReactNode;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  title?: string;
  className?: string;
  variant?: BotaoVariant;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onClick" | "type" | "disabled" | "title" | "className" | "color"
>;

export default function BotaoCustomizado({
  texto,
  children,
  onClick,
  type = "button",
  disabled = false,
  title,
  className,
  variant = "primary",
  backgroundColor,
  color,
  borderColor,
  style,
  ...rest
}: BotaoCustomizadoProps) {
  const customStyle: CSSProperties = {
    ...style,
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(color ? { color } : {}),
    ...(borderColor ? { borderColor } : {}),
  };

  const variantClass = styles[`variant_${variant}`] ?? styles.variant_primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[styles.botao, variantClass, className].filter(Boolean).join(" ")}
      style={customStyle}
      {...rest}
    >
      {children ?? texto}
    </button>
  );
}
