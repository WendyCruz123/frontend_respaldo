"use client";

import React from "react";
import './home.css'; // importante importar el CSS

export const Content = () => {
  const texto = 'BIENVENIDOS  AL  SISTEMA  DE  RESPALDOS  DE POSGRADO';

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/login-bg.mp4" type="video/mp4" />
      </video>

      {/* Logo + Texto animado en cascada al lado derecho y centrado vertical */}
      <div
        className="absolute right-32 z-10 text-right flex flex-col items-end"
        style={{
  top: '50%',
  transform: 'translateY(-50%)',
 fontFamily: "'Archivo Black', sans-serif",
fontStyle: 'italic',
fontWeight: 700,
letterSpacing: '0em', // no le des separación extra

  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', // ✅ un poco más grande para dar más presencia
  color: '#0056b3',
  whiteSpace: 'normal',
  maxWidth: '630px',
  width: '900%',
  lineHeight: '1.2',
}}

      >
        {/* Logo arriba */}
       <img
  src="/logo.png"
  alt="Logo Posgrado"
  className="logo-animado"
  style={{
    width: '450px',
    marginBottom: '20px',
    animationDelay: '0s', // empieza de inmediato
  }}
/>


        {/* Texto en cascada */}
        <div className="texto-cascada">
          {texto.split(' ').map((word, index) => (
            <span
              key={index}
              style={{
                marginRight: '8px',
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
