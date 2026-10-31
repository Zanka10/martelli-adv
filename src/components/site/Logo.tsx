/* eslint-disable @next/next/no-img-element */

type Props = { name: string; logo?: string; tone?: "light" | "dark"; className?: string };

export function Logo({ name, logo, tone = "light", className = "" }: Props) {
  if (logo) return <img src={logo} alt={name} className={`h-12 w-auto object-contain ${className}`} />;

  const [first, ...rest] = name.trim().split(/\s+/);
  const main = tone === "light" ? "text-cream" : "text-brown-900";
  const sub = tone === "light" ? "text-gold-light/80" : "text-brown-700";

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span className="relative flex h-11 w-9 shrink-0 items-end justify-center rounded-t-full border border-gold pb-1">
        <span className={`font-serif text-2xl leading-none font-semibold ${tone === "light" ? "text-gold-light" : "text-brown-900"}`}>
          {first.charAt(0)}
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-[1.45rem] font-semibold tracking-[0.14em] uppercase ${main}`}>{first}</span>
        {rest.length > 0 && (
          <span className={`mt-1 text-[0.6rem] font-semibold tracking-[0.28em] uppercase ${sub}`}>{rest.join(" ")}</span>
        )}
      </span>
    </span>
  );
}
