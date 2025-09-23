import Image from 'next/image';
import Link from 'next/link';
import { QuickActionCard } from './QuickActionCard';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Hogar', href: '#', active: true },
  { label: 'Producción', href: '#'},
  { label: 'Ventas', href: '#'},
  { label: 'Trabajadores', href: '#'},
  { label: 'Clientes', href: '#'},
  { label: 'Productos', href: '#'},
];

export function Sidebar() {
  return (
    <aside className="flex flex-col w-60 bg-black/95 backdrop-blur text-white rounded-2xl py-6 px-5 gap-8 shadow-xl shadow-black/30 border border-black/60" aria-label="Sidebar principal">
      <div className="flex items-center gap-2 pl-2">
        <Image src="/ledgic_logo.png" alt="Ledgic texto" width={120} height={24} className="object-contain" />
      </div>
      <nav className="flex-1">
        <ul className="flex flex-col gap-2">
          {navItems.map(item => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors
                ${item.active ? 'bg-red text-black' : 'hover:bg-white/10'}`}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <QuickActionCard />
      </div>
    </aside>
  );
}
