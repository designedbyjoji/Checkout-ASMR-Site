/** 小小的聲波動畫（播放中會跳動） */
export function MiniWave({ active, className = 'text-aurora-mint/70' }: { active: boolean; className?: string }) {
  const bars = [40, 70, 45, 90, 55, 80, 35, 65, 50, 75, 40, 60]
  return (
    <span className={`flex h-6 items-center gap-[3px] ${className}`} aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className={`block w-[2px] rounded-full bg-current transition-opacity ${active ? 'animate-wave opacity-100' : 'opacity-30'}`}
          style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
        />
      ))}
    </span>
  )
}
