"use client";

import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

const SmartCodeEditor = dynamic(
  () => import("./SmartCodeEditor").then((mod) => mod.SmartCodeEditor),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-muted-foreground text-sm">Loading Smart Editor...</p>
      </div>
    )
  }
);

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    if (
      event.reason && 
      typeof event.reason === 'object' && 
      event.reason.type === 'cancelation' &&
      event.reason.msg === 'operation is manually canceled'
    ) {
      event.preventDefault();
    }
  });
}

export function SmartCodeEditorWrapper() {
  return <SmartCodeEditor />;
}

