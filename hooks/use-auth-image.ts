import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";

// Stored file URLs from the backend are relative (e.g. "/uploads/profiles/x.jpg")
// so they always resolve against whatever backend this app is currently
// configured to talk to, not whatever host happened to be configured at
// upload time. A raw fetch() of a relative path would otherwise resolve
// against this app's own origin, not the backend. Old data may still carry a
// full absolute URL from before this was fixed - those pass through unchanged.
function resolveFileUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

export function useAuthImage(url: string | null | undefined) {
  const token = useAuthStore((state) => state.token);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      setBlobUrl(null);
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setBlobUrl(null);

    const resolvedUrl = resolveFileUrl(url);

    fetch(resolvedUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[useAuthImage] Failed to load:", resolvedUrl, err);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url, token]);

  return { blobUrl, isLoading, error };
}
