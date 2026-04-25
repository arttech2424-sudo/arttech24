"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/trackEvent";

type TrackedLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  path: string;
  section: string;
  target: string;
  label?: string;
};

export function TrackedLink({ href, className, children, path, section, target, label }: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent({
          path,
          event: "click",
          section,
          target,
          label,
        })
      }
    >
      {children}
    </Link>
  );
}
