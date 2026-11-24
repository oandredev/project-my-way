import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export function useFocusLoad(fetcher, initialValue) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { data, setData, loading, error, reload };
}
