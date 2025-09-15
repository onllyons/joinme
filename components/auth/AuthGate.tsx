import React, { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { hydrateAuth, isAuthenticated, subscribeAuth } from "@/utils/Auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await hydrateAuth();
      setAuthed(isAuthenticated());
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    const unsub = subscribeAuth(setAuthed);
    return unsub;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const inAuthGroup = segments[0] === "(auth)";
    const page = segments[1];
    const allowWhileAuthed = ["change-password"];

    if (!authed && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (authed && inAuthGroup && !allowWhileAuthed.includes(page)) {
      router.replace("/(tabs)");
    }
  }, [ready, authed, segments]);

  if (!ready) return null;
  return <>{children}</>;
}
