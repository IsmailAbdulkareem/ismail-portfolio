import { buttonClasses } from "@/components/ui/Button";
import { RESUME_PATH } from "@/data/profile";

type ResumeLinkProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  className?: string;
  label?: string;
};

// A plain <a download>: next/link would try to client-navigate to the PDF.
export function ResumeLink({ variant = "secondary", size = "md", className, label = "Download CV" }: ResumeLinkProps) {
  return (
    <a
      href={RESUME_PATH}
      download="Ismail_Abdul_Kareem_CV.pdf"
      className={buttonClasses(variant, size, className)}
    >
      {label}
      <svg aria-hidden viewBox="0 0 16 16" fill="none" className="size-4 transition-transform duration-300 group-hover:translate-y-0.5">
        <path d="M8 3v8m0 0 3.5-3.5M8 11 4.5 7.5M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
