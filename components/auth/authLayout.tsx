'use client';

interface Props {
  children: React.ReactNode;
}

export const AuthLayoutWrapper = ({ children }: Props) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 🎥 Video de fondo pantalla completa */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/login-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>

      {/* 🟤 Capa oscura encima del video para contraste */}
     <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-0" />


      {/* Contenido */}
      <div className="relative z-10 flex h-full w-full">
  {/* Columna izquierda vacía */}
  <div className="hidden md:flex flex-1" />

  {/* Login en el lado derecho */}
  <div className="flex w-full md:w-1/2 items-center justify-center p-6">
    {children}
  </div>
</div>

    </div>
  );
};