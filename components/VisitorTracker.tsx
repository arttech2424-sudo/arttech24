"use client";

import { useEffect } from "react";

export function VisitorTracker({ path }: { path: string }) {
  useEffect(() => {
    const start = Date.now();

    const post = (event: "view" | "exit", durationMs?: number) => {
      navigator.sendBeacon(
        "/api/track",
        JSON.stringify({ path, event, durationMs })
      );
    };

    post("view");

    const onBeforeUnload = () => {
      post("exit", Date.now() - start);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      post("exit", Date.now() - start);
    };
  }, [path]);

  return null;
}
