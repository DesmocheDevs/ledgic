import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QuickActionCard } from './QuickActionCard';

interface NavItem {
  label: string;
  href: string;
  section: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems: NavItem[] = [
  { label: 'Hogar', href: '/dashboard', section: 'hogar' },
  { label: 'Producción', href: '/dashboard/produccion', section: 'produccion' },
  { label: 'Ventas', href: '/dashboard/ventas', section: 'ventas' },
  { label: 'Trabajadores', href: '/dashboard/trabajadores', section: 'trabajadores' },
  { label: 'Clientes', href: '/dashboard/clientes', section: 'clientes' },
  { label: 'Productos', href: '/dashboard/productos', section: 'productos' },
  { label: 'Reportes e IA', href: '/dashboard/reportes', section: 'reportes' },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const router = useRouter();

  const handleNavClick = (item: NavItem) => {
    if (item.section === 'hogar') {
      // For 'hogar', always navigate to the main dashboard
      router.push(item.href);
      onSectionChange(item.section);
    } else {
      // For other sections, navigate to their specific pages
      router.push(item.href);
    }
  };
  return (
    <aside className="flex flex-col w-60 bg-black/95 backdrop-blur text-white rounded-2xl py-6 px-5 gap-8 shadow-xl shadow-black/30 border border-black/60" aria-label="Sidebar principal">
      <div className="flex items-center gap-2 pl-2">
        <Image src="/ledgic_logo.png" alt="Ledgic texto" width={120} height={24} className="object-contain" />
      </div>
      <nav className="flex-1">
        <ul className="flex flex-col gap-2">
          {navItems.map(item => (
            <li key={item.label}>
              <button
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors
                ${activeSection === item.section ? 'bg-red-600 text-white' : 'hover:bg-white/10 text-white'}`}
                aria-current={activeSection === item.section ? 'page' : undefined}
              >
                {item.label}
              </button>
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
