export function TopBar() {
  return (
    <header className="w-full flex items-center justify-between h-12 bg-white px-6 rounded-b-none" aria-label="Barra superior">
      <h2 className="text-xl font-bold text-black font-helvetica">Buen dia, Fulano Sutano</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-absolute-white rounded-full px-4 h-10 text-xs text-black min-w-[190px]">
          <span>Nombre de un negocio</span>
          <span className="rotate-90">›</span>
        </div>
        <button className="w-10 h-10 rounded-full bg-white border-2 border-black" aria-label="Usuario" />
      </div>
    </header>
  );
}
