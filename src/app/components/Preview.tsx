import { hexToLch } from '@/lib'
import clsx from 'clsx'
import { CSSProperties, HTMLAttributes, useMemo } from 'react'

function Slot({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'flex flex-col place-content-center place-items-center gap-y-1.5',
        'rounded-md shadow-lg p-5',
        'text-balance text-xs leading-none',
        className
      )}
      {...props}
    />
  )
}

export default function Preview({
  className,
  convert,
  values,
  ...props
}: PreviewProps) {
  const bg = useMemo(() => {
    const acc = []

    if (!convert) {
      acc.push(...hexToLch(values[0]))
    } else {
      const [l0, c0, h0] = hexToLch(values[0])
      const [l1, c1, h1] = hexToLch(values[1])

      const f = (prefix: string, v0: number, v1: number) =>
        `calc(${prefix} ${v1 - v0 >= 0 ? '+' : '-'} ${Math.abs(v1 - v0).toFixed(2)})`

      acc.push(
        `from var(--base)`,
        f('l', l0, l1),
        f('c', c0, c1),
        f('h', h0, h1)
      )
    }

    return `lch(${acc.map(i => (typeof i === 'number' ? i.toFixed(2) : i)).join(' ')})`
  }, [values])

  const palette = useMemo(
    () => ({
      '900': `color-mix(in lch, var(--bg), black 70%)`,
      '800': `color-mix(in lch, var(--bg), black 52.5%)`,
      '700': `color-mix(in lch, var(--bg), black 35%)`,
      '600': `color-mix(in lch, var(--bg), black 17.5%)`,
      '500': 'var(--bg)',
      '400': `color-mix(in lch, var(--bg), transparent 17.5%)`,
      '300': `color-mix(in lch, var(--bg), transparent 35%)`,
      '200': `color-mix(in lch, var(--bg), transparent 52.5%)`,
      '100': `color-mix(in lch, var(--bg), transparent 70%)`
    }),
    []
  )

  return (
    <div
      className={clsx(
        'grid grid-cols-2 gap-3 w-full h-full overflow-hidden',
        className
      )}
      style={{ '--base': values[0], '--bg': bg } as CSSProperties}
      {...props}>
      <Slot
        className={clsx(
          'bg-[var(--bg)] text-[color-mix(in_lch,_var(--bg),_white_70%)]'
        )}>
        <strong>500</strong>
        --bg: {bg}
        {convert && <div>--base: {values[0]}</div>}
      </Slot>

      <div className={clsx('flex flex-col gap-y-0.5')}>
        {Object.entries(palette).map(([k, v]) => (
          <Slot
            key={`slot-${k}`}
            style={
              {
                '--bg1': v
              } as CSSProperties
            }
            className={clsx(
              'bg-[var(--bg1)] text-[color-mix(in_lch,_var(--bg1),_white_50%)]'
            )}>
            <strong>{k}</strong>
            --bg: {v}
          </Slot>
        ))}
      </div>
    </div>
  )
}

interface PreviewProps extends HTMLAttributes<HTMLDivElement> {
  values: [string, string]
  convert?: boolean
}
