"use client";

import { useEffect, useState } from "react";

export function useDelayedPresence(open: boolean, exitDelay = 180) {
  const [present, setPresent] = useState(open);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let exitTimeout: number | undefined;

    const frameTimeout = window.setTimeout(() => {
      if (open) {
        setPresent(true);
        setLeaving(false);
        return;
      }

      if (!present) {
        return;
      }

      setLeaving(true);

      exitTimeout = window.setTimeout(() => {
        setPresent(false);
        setLeaving(false);
      }, exitDelay);
    }, 0);

    return () => {
      window.clearTimeout(frameTimeout);

      if (exitTimeout !== undefined) {
        window.clearTimeout(exitTimeout);
      }
    };
  }, [exitDelay, open, present]);

  return { present, leaving };
}
