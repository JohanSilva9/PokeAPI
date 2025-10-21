import { useEffect, useState } from "react";

export function useFetch(url: string, dependencies: any[] = []) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error en la solicitud");
        const result = await response.json();
        if (mounted) setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}
