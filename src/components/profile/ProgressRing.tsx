/** Radial progress meter — primary fill on a lighter step of the same ramp. */
export function ProgressRing({
  value,
  size = 76,
  strokeWidth = 7,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const clamped = Math.min(Math.max(value, 0), 100);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      role="img"
      aria-label={`${clamped}% complete`}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e0e3ff"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#4f3ddb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="absolute font-display text-sm font-bold text-neutral-900">
        {clamped}%
      </span>
    </div>
  );
}
