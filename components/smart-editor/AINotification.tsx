import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type Severity = "none" | "hint" | "warning" | "error" | "success";

interface AINotificationProps {
  message: string;
  severity: Severity;
  onClose: () => void;
}

export function AINotification({ message, severity, onClose }: AINotificationProps) {
  if (severity === "none" || !message) return null;

  const getStyles = () => {
    switch (severity) {
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "hint":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "success":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getIcon = () => {
    switch (severity) {
      case "error":
        return <XCircle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      case "hint":
        return <Info className="w-5 h-5" />;
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className={`absolute bottom-4 right-4 max-w-sm w-full backdrop-blur-md border rounded-lg shadow-lg p-4 flex items-start gap-3 z-50 ${getStyles()}`}
      >
        <div className="shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 text-sm font-medium leading-tight">
          {message}
        </div>
        <button
          onClick={onClose}
          className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
