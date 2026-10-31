/* eslint-disable @next/next/no-img-element */

export type TeamCardData = {
  id: string;
  name: string;
  role: string;
  oab: string | null;
  oabVerified: boolean;
  bio: string;
  photo: string | null;
  areas: { title: string }[];
};

export function TeamCard({ member }: { member: TeamCardData }) {
  const initials = member.name
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  return (
    <article className="group">
      <div className="arch relative aspect-[4/5] bg-brown-900">
        {member.photo ? (
          <img src={member.photo} alt={member.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        ) : (
          <div aria-hidden className="texture-dark flex h-full w-full items-center justify-center font-serif text-6xl text-gold/70">{initials}</div>
        )}
      </div>
      <div className="mt-6">
        <h3 className="text-2xl text-brown-900">{member.name}</h3>
        {member.role && <p className="mt-1 text-xs font-bold tracking-[0.16em] text-gold-dark uppercase">{member.role}</p>}
        {member.oab && member.oabVerified && <p className="mt-1 text-sm text-muted">OAB {member.oab}</p>}
        {member.bio && <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-ink/80">{member.bio}</p>}
        {member.areas.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {member.areas.map((a) => (
              <li key={a.title} className="border border-line px-2.5 py-1 text-[0.7rem] font-semibold text-brown-700">
                {a.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
