"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trash2, Crosshair, Sparkles } from 'lucide-react';

interface Point {
  id: string;
  x: number;
  y: number;
}

export default function LinearRegressionApp() {
  const [points, setPoints] = useState<Point[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Constants for coordinate mapping
  const width = 1000;
  const height = 600;
  const padding = 60;

  // Map absolute SVG coordinates to a 0-10 Cartesian plane for math
  const toMathCoords = (svgX: number, svgY: number) => {
    return {
      x: ((svgX - padding) / (width - padding * 2)) * 10,
      y: 10 - ((svgY - padding) / (height - padding * 2)) * 10
    };
  };

  const toSvgCoords = (mathX: number, mathY: number) => {
    return {
      x: padding + (mathX / 10) * (width - padding * 2),
      y: padding + ((10 - mathY) / 10) * (height - padding * 2)
    };
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    // Ignore clicks if they fall on buttons or UI elements (handled by z-index/propagation usually, but good to be safe)
    if ((e.target as Element).tagName === 'BUTTON' || (e.target as Element).closest('button')) return;

    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;

    // Check bounds to ensure points are within the padded graph area
    if (svgX < padding || svgX > width - padding || svgY < padding || svgY > height - padding) {
        return; 
    }

    const { x, y } = toMathCoords(svgX, svgY);

    const newPoint: Point = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y
    };

    setPoints([...points, newPoint]);
  };

  // Calculate Ordinary Least Squares Regression
  const regression = useMemo(() => {
    if (points.length < 2) return { m: 0, b: 5, mse: 0, valid: false };

    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    points.forEach(p => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
    });

    const denominator = (n * sumXX - sumX * sumX);
    if (denominator === 0) return { m: 0, b: sumY / n, mse: 0, valid: true }; // Vertical stack edge case

    const m = (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / n;

    // Calculate MSE
    let sumSquaredError = 0;
    points.forEach(p => {
      const predictedY = m * p.x + b;
      sumSquaredError += Math.pow(p.y - predictedY, 2);
    });
    const mse = sumSquaredError / n;

    return { m, b, mse, valid: true };
  }, [points]);

  // Calculate SVG coordinates for the regression line
  const lineStart = toSvgCoords(0, regression.m * 0 + regression.b);
  const lineEnd = toSvgCoords(10, regression.m * 10 + regression.b);

  const generateRandomPoints = () => {
    const newPoints: Point[] = [];
    const baseSlope = (Math.random() * 1.5) + 0.2; // 0.2 to 1.7
    const baseIntercept = Math.random() * 4;
    
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() * 9) + 0.5; // 0.5 to 9.5
      // y = mx + b + noise
      const noise = (Math.random() - 0.5) * 4;
      let y = (baseSlope * x) + baseIntercept + noise;
      
      // Clamp y
      y = Math.max(0.5, Math.min(9.5, y));
      
      newPoints.push({
        id: Math.random().toString(36).substr(2, 9),
        x,
        y
      });
    }
    setPoints(newPoints);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-6xl flex gap-8 z-10 h-[80vh]">
        
        {/* Left Side: Interactive Canvas */}
        <div className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden relative group">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full cursor-crosshair"
            onClick={handleSvgClick}
          >
            {/* Grid Lines */}
            <g className="text-slate-700/30">
              {[...Array(11)].map((_, i) => (
                <React.Fragment key={`grid-${i}`}>
                  <line x1={padding} y1={padding + (i * (height - 2*padding)/10)} x2={width - padding} y2={padding + (i * (height - 2*padding)/10)} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1={padding + (i * (width - 2*padding)/10)} y1={padding} x2={padding + (i * (width - 2*padding)/10)} y2={height - padding} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                </React.Fragment>
              ))}
            </g>

            {/* Axes */}
            <g className="text-slate-500">
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" strokeWidth="2" />
              <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" strokeWidth="2" />
            </g>

            {/* Regression Line */}
            {regression.valid && (
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  x1: lineStart.x,
                  y1: lineStart.y,
                  x2: lineEnd.x,
                  y2: lineEnd.y
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                stroke="#8b5cf6" /* purple-500 */
                strokeWidth="4"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
              />
            )}

            {/* Residuals (Error Lines) */}
            <AnimatePresence>
              {regression.valid && points.map(p => {
                const predictedY = regression.m * p.x + regression.b;
                const pSvg = toSvgCoords(p.x, p.y);
                const predSvg = toSvgCoords(p.x, predictedY);
                return (
                  <motion.line
                    key={`res-${p.id}`}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ 
                      opacity: 0.6, 
                      pathLength: 1,
                      x1: pSvg.x,
                      y1: pSvg.y,
                      x2: predSvg.x,
                      y2: predSvg.y
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    stroke="#ef4444" /* red-500 */
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                )
              })}
            </AnimatePresence>

            {/* Data Points */}
            <AnimatePresence>
              {points.map(p => {
                const { x, y } = toSvgCoords(p.x, p.y);
                return (
                  <motion.circle
                    key={p.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, cx: x, cy: y }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    r="8"
                    fill="#3b82f6" /* blue-500 */
                    className="drop-shadow-[0_0_10px_rgba(59,130,246,0.6)] cursor-pointer hover:fill-blue-400 transition-colors"
                  />
                );
              })}
            </AnimatePresence>
          </svg>

          {/* Empty State Overlay */}
          <AnimatePresence>
            {points.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                <div className="bg-slate-900/80 p-6 rounded-2xl backdrop-blur-md border border-slate-700/50 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-2">
                    <Crosshair size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Click anywhere to drop data points</h3>
                  <p className="text-slate-400 text-sm max-w-[250px]">
                    Place at least 2 points to see the Line of Best Fit instantly adapt.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Metrics & Controls Panel */}
        <div className="w-[380px] bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="text-purple-400" /> Linear Regression
          </h2>
          
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Metrics Dashboard */}
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
              <h3 className="text-sm uppercase tracking-wider font-semibold text-slate-400 mb-4">Regression Metrics</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Mean Squared Error (MSE)</span>
                    <span className="text-red-400 font-mono font-medium">{regression.mse.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-red-500" 
                      animate={{ width: `${Math.min(100, (regression.mse / 15) * 100)}%` }} 
                      transition={{ type: "spring" }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Slope (m)</span>
                    <span className="text-purple-400 font-mono font-medium">{regression.m.toFixed(3)}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Y-Intercept (b)</span>
                    <span className="text-purple-400 font-mono font-medium">{regression.b.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Equation Display */}
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 flex flex-col items-center justify-center gap-2">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400">Equation of the Line</h3>
              <div className="font-mono text-xl text-white font-medium tracking-wide">
                y = <span className="text-purple-400">{regression.m.toFixed(2)}</span>x + <span className="text-blue-400">{regression.b.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={generateRandomPoints}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-3.5 rounded-xl font-semibold transition-all active:scale-[0.98]"
            >
              <RefreshCw size={18} /> Generate Data
            </button>
            <button
              onClick={() => setPoints([])}
              disabled={points.length === 0}
              className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
