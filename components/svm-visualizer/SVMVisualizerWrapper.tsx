"use client";

import dynamic from 'next/dynamic';

const SVMVisualizer = dynamic(() => import('./SVMApp'), {
  ssr: false,
  loading: () => (
    <div className="h-[800px] w-full flex items-center justify-center bg-slate-900 rounded-3xl border border-border animate-pulse">
      <div className="text-white text-xl">Loading SVM visualizer...</div>
    </div>
  )
});

export default function SVMVisualizerWrapper() {
  return <SVMVisualizer />;
}
