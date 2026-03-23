import { useState, useCallback } from "react";

export function useToast() {
  const [aviso, setAviso] = useState("");

  const mostrarAviso = useCallback((msg: string) => {
    setAviso(msg);
  }, []);

  const fecharAviso = useCallback(() => {
    setAviso("");
  }, []);

  return { aviso, mostrarAviso, fecharAviso };
}
