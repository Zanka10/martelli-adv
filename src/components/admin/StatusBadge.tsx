const STYLES: Record<string, string> = {
  PUBLISHED: "bg-[#eef6ec] text-[#2d5a26] border-[#b9d3b4]",
  SCHEDULED: "bg-[#eef2fa] text-[#29457a] border-[#bccbe6]",
  DRAFT: "bg-sand text-brown-700 border-line",
  ACTIVE: "bg-[#eef6ec] text-[#2d5a26] border-[#b9d3b4]",
  INACTIVE: "bg-sand text-muted border-line",
};

export function StatusBadge({ state, label }: { state: string; label: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center border px-2 py-0.5 text-[0.68rem] font-bold tracking-wide uppercase ${STYLES[state] ?? STYLES.DRAFT}`}>
      {label}
    </span>
  );
}
