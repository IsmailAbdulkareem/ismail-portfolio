"use client";

import type { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./button-styles";

type SubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pendingLabel?: string;
};

export function SubmitButton({
  variant = "primary",
  size = "md",
  pendingLabel,
  className,
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
      className={buttonClass(variant, size, className)}
      {...props}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
