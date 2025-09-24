import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { StatusCard } from './components/StatusCard';
import { FinancialOverview } from './components/FinancialOverview';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-6" style={{ fontFamily: 'var(--font-opensans)' }}>
      <div className="flex gap-6 h-full">
        <div className="relative">
          <Sidebar />
        </div>
        <main className="flex-1 flex flex-col rounded-2xl bg-white   overflow-hidden">
          <TopBar />
          <section className="flex-1 p-6">
            <h3 className="text-sm font-semibold mb-6 text-black" style={{ fontFamily: 'var(--font-helvetica)' }}>Estado general</h3>
            <FinancialOverview />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
              <StatusCard title="" />
              <StatusCard title="" />
              <StatusCard title="" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
