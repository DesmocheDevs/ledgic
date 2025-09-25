import Image from 'next/image';

export function QuickActionCard() {
  return (
    <div className="relative group">
      {/* Card container */}
    <div className="bg-teal rounded-2xl p-5 w-full h-full flex flex-col justify-end overflow-hidden border border-black/20 shadow-md">
        {/* Decorative gradient shape using clip-path (replaces previous abstract white blob) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute left-0 bottom-0 w-[300px] h-[300px] opacity-80 bg-white"
            style={{
              

              clipPath: 'path("M 0,165 L 0,285 C 0,280 0,300 50,300 L 240,300 C 260,290 270,270 270,250 C 265,210 255,180 210,150 C 160,120 100,135 90,135 C 60,140 30,150 0,165 Z")',
              transform: 'scale(0.7)',
              transformOrigin: 'bottom left'
            }}
          />
        </div>

        {/* Icon */}
        <div className="relative mb-3 ml-1">
          <Image src="/maraca.png" alt="Facturar" width={38} height={38} className="drop-shadow" />
        </div>

        {/* Text */}
        <div className="relative z-10 ml-1">
          <p className="text-base leading-tight font-semibold text-black font-helvetica">Facturar producto</p>
          <p className="text-[11px] text-black/70" style={{fontFamily:'var(--font-opensans)'}}>Facturación rápida</p>
        </div>
      </div>

      {/* Floating action button */}
      <button
        aria-label="Ir a facturación"
        className="absolute -top-5 right-4 w-16 h-16 rounded-full bg-white border-4 border-black flex items-center justify-center text-black text-xl shadow-lg transition-transform group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black/40"
      >
        ↗
      </button>
    </div>
  );
}
