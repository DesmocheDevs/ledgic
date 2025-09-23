interface StatusCardProps {
  title?: string;
}
export function StatusCard({ title }: StatusCardProps) {
  return (
    <div className="h-32 bg-black/10 rounded-sm border border-transparent flex items-center justify-center text-xs text-black/60">
      {title || '—'}
    </div>
  );
}
