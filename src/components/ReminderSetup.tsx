"use client";

import { useEffect, useState } from "react";

export default function ReminderSetup({ reminderTime }: { reminderTime: string }) {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    "default"
  );

  useEffect(() => {
    if (typeof Notification === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: syncing with a browser API that has no event to subscribe to
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
  }, []);

  useEffect(() => {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

    const interval = setInterval(() => {
      const now = new Date();
      const current = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      const todayKey = `pt_notified_${now.toISOString().slice(0, 10)}`;

      if (current === reminderTime && !localStorage.getItem(todayKey)) {
        new Notification("PocketTrack reminder", {
          body: "Aaj ka expense daala kya? Daal de, 10 second ka kaam hai.",
        });
        localStorage.setItem(todayKey, "1");
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [reminderTime]);

  async function enable() {
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  if (permission === "unsupported" || permission === "granted") return null;

  return (
    <button
      onClick={enable}
      className="rounded-full border border-border bg-surface-2 px-4 py-1.5 text-xs text-teal transition hover:border-teal"
    >
      Turn on daily reminder
    </button>
  );
}
