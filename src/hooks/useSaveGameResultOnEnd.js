"use client";

import { useEffect, useRef } from "react";

import { saveGameResult } from "@/lib/saveGameResult";

/**
 * Записва резултат от игра веднъж, когато `ready` стане true.
 * @param {boolean} ready
 * @param {() => Parameters<typeof saveGameResult>[0] | null | undefined} getPayload
 */
export default function useSaveGameResultOnEnd(ready, getPayload) {
  const savedRef = useRef(false);
  const getPayloadRef = useRef(getPayload);

  useEffect(() => {
    getPayloadRef.current = getPayload;
  });

  useEffect(() => {
    if (!ready) {
      savedRef.current = false;
      return;
    }
    if (savedRef.current) return;
    const payload =
      typeof getPayloadRef.current === "function" ? getPayloadRef.current() : null;
    if (!payload?.game?.slug) return;
    savedRef.current = true;
    void saveGameResult(payload);
  }, [ready]);
}
