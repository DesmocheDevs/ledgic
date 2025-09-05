import "reflect-metadata";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold text-center sm:text-left mb-8">Sistema de Gestión Ledgic</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          {/* Clients module removed */}
          <Link
            href="/inventory"
            className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-3 text-sm font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            Inventario
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-3 text-sm font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            Productos
          </Link>
          <Link
            href="/materials"
            className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-3 text-sm font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            Materiales
          </Link>
        </div>
      </main>
    </div>
  );
}
