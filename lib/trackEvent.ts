export type TrackPayload = {
  path: string;
  event: "click" | "article_view" | "faq_view";
  section?: string;
  target?: string;
  label?: string;
};

export function trackEvent(payload: TrackPayload) {
  if (typeof navigator === "undefined") {
    return;
  }

  const body = JSON.stringify(payload);
  const blob = new Blob([body], { type: "application/json" });

  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon("/api/track", blob);
    return;
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Ignore non-blocking analytics failures.
  });
}
