import { skills } from "@/lib/data"

const allSkills = skills.flatMap((cat) => cat.items.map((s) => s.name))
const mid = Math.ceil(allSkills.length / 2)
const row1 = allSkills.slice(0, mid)
const row2 = allSkills.slice(mid)

function MarqueeRow({
  items,
  reverse,
}: {
  items: string[]
  reverse?: boolean
}) {
  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div
        className={`flex w-max items-center gap-6 ${reverse ? "animate-marquee-right" : "animate-marquee-left"}`}
      >
        {doubled.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className={`whitespace-nowrap text-xl font-medium md:text-2xl ${
              i % 2 === 0
                ? "text-foreground/70"
                : "text-muted-foreground/50"
            }`}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SkillsMarquee() {
  return (
    <div className="mt-auto shrink-0 w-full min-h-[60px] pb-12">
      <div className="flex flex-col gap-4">
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>
    </div>
  )
}
