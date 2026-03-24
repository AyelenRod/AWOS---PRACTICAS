"use client";

import { useState, useEffect } from "react";

export interface GenericItem {
  id: number | string;
  title: string;
  image: string;
  tag: string;
  subtitle?: string;
  details?: { label: string; value: string | number }[];
  badges?: string[];
  stats?: { name: string; value: number }[];
}

type Status = "idle" | "loading" | "success" | "error";

function StatBar({ name, value }: { name: string; value: number }) {
  const pct = Math.min(value, 100);
  const color = value >= 75 ? "#203F9A" : value >= 45 ? "#4E7CB2" : "#E84797";
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="capitalize font-medium" style={{ color: "#4E7CB2" }}>
          {name.replace(/-/g, " ")}
        </span>
        <span className="font-bold" style={{ color: "#203F9A" }}>{value}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#94C2DA33" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}


function SkeletonCard() {
  return (
    <div className="w-52 rounded-2xl overflow-hidden animate-pulse"
      style={{ border: "2px solid #94C2DA66", backgroundColor: "white" }}>
      <div className="h-40" style={{ backgroundColor: "#94C2DA33" }} />
      <div className="p-4 space-y-3">
        <div className="h-4 rounded-full w-1/3" style={{ backgroundColor: "#E7A0CC66" }} />
        <div className="h-5 rounded w-3/4" style={{ backgroundColor: "#94C2DA55" }} />
        <div className="h-3 rounded w-full" style={{ backgroundColor: "#94C2DA33" }} />
        <div className="h-9 rounded-xl w-full" style={{ backgroundColor: "#E7A0CC44" }} />
      </div>
    </div>
  );
}

function DetailModal({ item, onClose }: { item: GenericItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(32,63,154,0.7)" }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#EFE8E0", border: "2px solid #94C2DA" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative flex flex-col items-center pt-8 pb-6 px-6"
          style={{ backgroundColor: "#203F9A" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center
                       justify-center font-bold text-lg transition-all"
            style={{ color: "white" }}
          >✕</button>

          <div className="w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ border: "4px solid #4E7CB2", backgroundColor: "white" }}>
            <img src={item.image} alt={item.title}
              className="w-full h-full object-contain"
              onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/128x128/94C2DA/203F9A?text=?"; }} />
          </div>

          <h2 className="mt-4 text-2xl font-black text-white tracking-tight text-center">{item.title}</h2>
          {item.subtitle && <p className="text-sm mt-1" style={{ color: "#94C2DA" }}>{item.subtitle}</p>}

          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide text-white"
              style={{ backgroundColor: "#E84797" }}>{item.tag}</span>
            {item.badges?.map(b => (
              <span key={b} className="text-xs px-3 py-1 rounded-full capitalize text-white"
                style={{ backgroundColor: "#4E7CB2" }}>{b}</span>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-72 overflow-y-auto">
          {item.details && item.details.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4E7CB2" }}>
                Información
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {item.details.map(d => (
                  <div key={d.label} className="rounded-xl p-3"
                    style={{ backgroundColor: "white", border: "1px solid #94C2DA44" }}>
                    <div className="text-xs mb-1" style={{ color: "#4E7CB2" }}>{d.label}</div>
                    <div className="font-bold text-sm" style={{ color: "#203F9A" }}>{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.stats && item.stats.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4E7CB2" }}>
                Estadísticas
              </h3>
              {item.stats.map(s => <StatBar key={s.name} name={s.name} value={s.value} />)}
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-bold text-white transition-all
                       hover:opacity-90 active:scale-95 shadow-md"
            style={{ backgroundColor: "#E84797" }}
          >Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [items, setItems]     = useState<GenericItem[]>([]);
  const [status, setStatus]   = useState<Status>("idle");
  const [errorMsg, setError]  = useState("");
  const [selected, setSelected] = useState<GenericItem | null>(null);

  const loadItems = async () => {
    setStatus("loading");
    setError("");
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
      const res  = await fetch(`${base}/api/items`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Error ${res.status}`);
      }
      setItems(await res.json());
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión");
      setStatus("error");
    }
  };

  useEffect(() => { loadItems(); }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EFE8E0" }}>
      
      <main className="max-w-6xl mx-auto px-4 py-10">

        {status === "error" && (
          <div className="flex flex-col items-center gap-5 py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
              style={{ backgroundColor: "#E84797" }}>!</div>
            <h2 className="text-xl font-black" style={{ color: "#203F9A" }}>Algo salió mal</h2>
            <p className="text-sm text-center max-w-sm" style={{ color: "#4E7CB2" }}>{errorMsg}</p>
            <button onClick={loadItems}
              className="px-8 py-3 rounded-2xl font-bold text-white hover:opacity-90 active:scale-95 shadow-lg"
              style={{ backgroundColor: "#203F9A" }}>
              Reintentar
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="flex flex-wrap justify-center gap-6">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-wrap justify-center gap-6">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="w-52 bg-white rounded-2xl overflow-hidden group
                           transform transition-all duration-300
                           hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  border: "2px solid #94C2DA80",
                  animation: "fadeSlideUp 0.5s ease both",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div
                  className="h-40 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: "#94C2DA33" }}
                >
                  <img
                    src={item.image} alt={item.title}
                    className="w-28 h-28 object-contain relative z-10 drop-shadow-md
                               transition-transform duration-300 group-hover:scale-110"
                    onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/112x112/94C2DA/203F9A?text=?"; }}
                  />
                </div>

                <div className="p-4">
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full
                                   uppercase tracking-wide mb-2"
                    style={{ backgroundColor: "#E7A0CC", color: "#203F9A" }}>
                    {item.tag}
                  </span>
                  <h2 className="font-black text-base leading-tight mb-1"
                    style={{ color: "#203F9A" }}>
                    {item.title}
                  </h2>
                  {item.subtitle && (
                    <p className="text-xs mb-2" style={{ color: "#4E7CB2" }}>{item.subtitle}</p>
                  )}
                  <button
                    onClick={() => setSelected(item)}
                    className="w-full py-2 rounded-xl text-sm font-bold text-white mt-2
                               transition-all hover:opacity-90 active:scale-95 shadow-md"
                    style={{ backgroundColor: "#E84797" }}
                  >
                    Ver Detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}