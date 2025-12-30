type Props = {
  value: number;
  label?: string;
  showPercent?: boolean;
};

export default function ProgressBar({
  value,
  label,
  showPercent = true,
}: Props) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="w-full">
      <div
        className="w-full h-3 rounded-full bg-white/25 overflow-hidden"
        role="progressbar"
        aria-label={label || "Progresso"}
      >
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {(label || showPercent) && (
        <div className="mt-2 flex items-center justify-between text-sm text-white/90 min-w-0">
          <span className="truncate">{label ?? "Carregando..."}</span>
          {showPercent && (
            <span className="tabular-nums flex-none">{pct}%</span>
          )}
        </div>
      )}
    </div>
  );
}
