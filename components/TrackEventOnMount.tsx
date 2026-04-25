"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/trackEvent";

type TrackEventOnMountProps = {
  path: string;
  event: "article_view" | "faq_view";
  section?: string;
  target?: string;
  label?: string;
};

export function TrackEventOnMount({ path, event, section, target, label }: TrackEventOnMountProps) {
  useEffect(() => {
    trackEvent({ path, event, section, target, label });
  }, [event, label, path, section, target]);

  return null;
}
