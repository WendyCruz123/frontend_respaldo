"use client";

import React from "react";

export const Content = () => (
  <div className="relative w-full h-screen overflow-hidden">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
    >
      <source src="/login-bg.mp4" type="video/mp4" />
    </video>

    {/* Si quieres, puedes poner contenido encima del video */}
    {/* <div className="relative z-10 text-white text-4xl font-bold">
      Bienvenido a mi Dashboard
    </div> */}
  </div>
);
