export default function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow?: string
  title: string
}) {
  return (
    <div className='mb-4'>
      {eyebrow && (
        <span className='block font-mono text-[10px] uppercase tracking-[0.25em] text-signal/80'>
          {eyebrow}
        </span>
      )}
      <h2 className='mt-1 font-display text-xl font-semibold text-white sm:text-2xl'>
        {title}
      </h2>
    </div>
  )
}
