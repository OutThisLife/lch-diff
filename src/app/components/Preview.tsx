import { hexToLch } from '@/lib'
import clsx from 'clsx'
import {
  CSSProperties,
  HTMLAttributes,
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'

function Slot({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'flex place-items-center place-content-between gap-1.5',
        'rounded-md shadow-lg p-5',
        'text-balance text-xs leading-none',
        className
      )}
      {...props}
    />
  )
}

export default function Preview({ convert, values, ...props }: PreviewProps) {
  const [copied, setCopied] = useState<boolean>(false)
  const alertRef = useRef<HTMLDivElement>(null!)

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
      900: `color-mix(in lch, var(--bg), black 70%)`,
      800: `color-mix(in lch, var(--bg), black 52.5%)`,
      700: `color-mix(in lch, var(--bg), black 35%)`,
      600: `color-mix(in lch, var(--bg), black 17.5%)`,
      500: bg,
      400: `color-mix(in lch, var(--bg), transparent 17.5%)`,
      300: `color-mix(in lch, var(--bg), transparent 35%)`,
      200: `color-mix(in lch, var(--bg), transparent 52.5%)`,
      100: `color-mix(in lch, var(--bg), transparent 70%)`
    }),
    [bg]
  )

  const onPointerDown = useCallback(
    (str: string) => async (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault()

      await navigator.clipboard.writeText(str)
      setCopied(true)

      alertRef.current?.style.setProperty('left', `${e.clientX}px`)
      alertRef.current?.style.setProperty('top', `${e.clientY}px`)

      setTimeout(() => setCopied(false), 1e3)
    },
    []
  )

  return (
    <>
      <div
        style={{ '--base': values[0], '--bg': bg } as CSSProperties}
        {...props}>
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
                'bg-[var(--bg1)]',
                Number(k) <= 300
                  ? `text-[color-mix(in_lch,_var(--bg1),_white_70%)]`
                  : `text-[color-mix(in_lch,_var(--bg1),_white_50%)]`,
                Number(k) === 500 && 'aspect-video'
              )}
              onPointerDown={onPointerDown(v)}>
              <strong>{k}</strong>
              <code className="text-[.7rem]">--bg: {v}</code>
            </Slot>
          ))}
        </div>
      </div>

      <div
        ref={alertRef}
        className={clsx(
          'absolute top-0 left-0 p-2 rounded-sm',
          'bg-black text-white text-xs',
          copied ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300'
        )}>
        Copied!
      </div>
    </>
  )
}

interface PreviewProps extends HTMLAttributes<HTMLDivElement> {
  values: [string, string]
  convert?: boolean
}
