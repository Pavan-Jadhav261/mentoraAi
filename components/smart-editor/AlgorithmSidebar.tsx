import React from "react";
import { ALGORITHMS, AlgorithmDef } from "./algorithms";
import { Search } from "lucide-react";

interface AlgorithmSidebarProps {
  selectedId: string;
  onSelect: (alg: AlgorithmDef) => void;
}

export function AlgorithmSidebar({ selectedId, onSelect }: AlgorithmSidebarProps) {
  const [search, setSearch] = React.useState("");

  const filtered = ALGORITHMS.filter((alg) =>
    alg.title.toLowerCase().includes(search.toLowerCase()) ||
    alg.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, alg) => {
    if (!acc[alg.category]) acc[alg.category] = [];
    acc[alg.category].push(alg);
    return acc;
  }, {} as Record<string, AlgorithmDef[]>);

  return (
    <div className="w-full md:w-64 border-r border-border bg-background flex flex-col h-full overflow-hidden shrink-0">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Algorithms</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary text-foreground text-sm rounded-md pl-9 pr-3 py-2 border border-border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {Object.entries(grouped).map(([category, algs]) => (
          <div key={category} className="mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              {category}
            </h3>
            <div className="space-y-1">
              {algs.map((alg) => (
                <button
                  key={alg.id}
                  onClick={() => onSelect(alg)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 transition-colors ${
                    selectedId === alg.id
                      ? "bg-blue-500/10 text-blue-500"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      selectedId === alg.id ? "bg-blue-500" : "bg-transparent border border-muted-foreground"
                    }`}
                  />
                  {alg.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
