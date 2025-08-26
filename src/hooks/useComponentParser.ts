import { useState, useCallback } from "react";
import { parseComponent } from "../lib/parser/componentParser";
import { ParsedComponent, ComponentError } from "../lib/utils/types";

export const useComponentParser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ComponentError | null>(null);

  const parseComponentCode = useCallback(
    async (code: string): Promise<ParsedComponent | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const parsed = parseComponent(code);
        return parsed;
      } catch (err) {
        const error: ComponentError = {
          type: "parse",
          message:
            err instanceof Error ? err.message : "Failed to parse component",
        };
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    parseComponent: parseComponentCode,
    isLoading,
    error,
    clearError,
  };
};
