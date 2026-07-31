"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const LinearRegressionApp = dynamic(() => import('./LinearRegressionApp'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#0f172a] text-white flex-1 min-h-[800px]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-medium tracking-wide">Loading Visualizer...</div>
      </div>
    </div>
  )
});

export default function LinearRegressionWrapper() {
  return <LinearRegressionApp />;
}
