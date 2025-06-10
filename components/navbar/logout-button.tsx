// components/navbar/logout-button.tsx

"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    // Eliminar cookies
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";

    // Eliminar sessionStorage
    sessionStorage.removeItem("refreshToken");

    // Redirigir al login
    router.replace("/login");
  }, [router]);

  return (
    <Button color="danger" className="text-white font-medium px-4 py-2 rounded-xl shadow-md hover:opacity-90"
        onPress={handleLogout}>
      Cerrar sesión
    </Button>

                
  );
};
