import { useState, useEffect } from "react";
import { permissionsApi } from "@/lib/api/permissions";

export function usePermission(permission: string): { hasPermission: boolean; loading: boolean } {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    permissionsApi
      .checkPermission(permission)
      .then((r) => setHasPermission(r.hasPermission))
      .catch(() => setHasPermission(false))
      .finally(() => setLoading(false));
  }, [permission]);

  return { hasPermission, loading };
}
