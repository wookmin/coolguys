import type { RiskLevel } from '../types'

const config: Record<RiskLevel, { label: string; className: string }> = {
  normal: { label: '일반', className: 'bg-green-100 text-green-800 border-green-300' },
  caution: { label: '주의', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  warning: { label: '경고', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  emergency: { label: '응급', className: 'bg-red-100 text-red-800 border-red-300' },
}

export default function RiskBadge({ level, large }: { level: RiskLevel; large?: boolean }) {
  const { label, className } = config[level]
  return (
    <span className={`border rounded-full font-bold ${large ? 'px-4 py-1.5 text-base' : 'px-2.5 py-0.5 text-xs'} ${className}`}>
      {label}
    </span>
  )
}
