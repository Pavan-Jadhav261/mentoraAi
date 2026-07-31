import { Star } from 'lucide-react'

export default function StarRating({ stars, max = 5 }: { stars: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${stars} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < stars ? 'fill-[var(--accent-yellow)] text-[var(--accent-yellow)]' : 'text-[var(--border)] fill-[var(--border)]'}
        />
      ))}
    </div>
  )
}
