interface CardProps {
  title: string;
  amount: string;
  variant?: 'primary' | 'alert';
}

function AmountCard({ title, amount, variant = 'primary' }: CardProps) {
  const base = 'rounded-xl border p-5 md:p-6 flex flex-col justify-between min-h-[160px]';
  const variants: Record<string,string> = {
    primary: 'bg-teal-strong/20 border-teal-strong text-black',
    alert: 'bg-white border-red text-black'
  };
  return (
    <div className={base + ' ' + variants[variant]}> 
      <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-opensans)' }}>{title}</span>
      <span className="mt-4 text-2xl md:text-3xl font-bold leading-tight" style={{ fontFamily: 'var(--font-helvetica)' }}>{amount}</span>
    </div>
  );
}

export function FinancialOverview() {
  return (
    <section className="mb-10">
      <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-helvetica)' }}>
        Estado general de la salud financiera
      </h2>
      <p className="text-sm mb-6" style={{ fontFamily: 'var(--font-opensans)' }}>
        Foto financiera: Situación financiera según:
      </p>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-3xl">
        <AmountCard title="Lo que tengo" amount="C$ 143,568.00" variant="primary" />
        <AmountCard title="Lo que debo" amount="C$ 58,420.00" variant="alert" />
      </div>
    </section>
  );
}
