"use client";

import dynamic from "next/dynamic";
import React from "react";

const Chart = dynamic(
  () => import("../charts/steam").then((mod) => mod.Steam),
  {
    ssr: false,
  }
);
export const Content = () => (
  <div className="relative w-full min-h-screen overflow-x-hidden">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="fixed top-0 left-0 w-full h-full object-cover z-0"
    >
      <source src="/login-bg.mp4" type="video/mp4" />
    </video>

    {/* Si quieres, puedes poner contenido encima del video */}
    <div className="h-full flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Statistics</h3>
          <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 ">
            <Chart />
          </div>
        </div>
      </div>
);
