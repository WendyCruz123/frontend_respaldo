import clsx from "clsx";

export const StyledBurgerButton = () =>
  clsx(
    "flex flex-col gap-1 cursor-pointer",
    "w-6 h-6",
    "justify-center items-center",
    "bg-white p-2 rounded-md shadow-md", // visibilidad y estilo
    "fixed top-4 left-4 z-50"            // posición en pantalla
  );