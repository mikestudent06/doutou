/**
 * React hook for database initialization
 *
 * Use this hook in your root component to ensure
 * the database is initialized before the app loads.
 */

import { initDatabase } from "@/db";
import { useEffect, useState } from "react";

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        await initDatabase();
        if (mounted) {
          setIsReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Database initialization failed")
          );
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  return { isReady, error };
}
