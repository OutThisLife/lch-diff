import clsx from 'clsx'
import { InputHTMLAttributes } from 'react'

export default function Input({
  className,
  type = 'text',
  label,
  ...props
}: InputProps) {
  return (
    <div className={clsx('relative w-full', className)}>
      {label && (
        <label
          htmlFor={label}
          className={clsx(
            'absolute -top-2 left-2',
            'inline-block px-1',
            'bg-white text-xs font-medium text-gray-900'
          )}>
          {label}
        </label>
      )}

      <input
        className={clsx(
          'block w-full rounded-md shadow-sm cursor-pointer',
          'border-0 text-gray-900 sm:text-sm sm:leading-6',
          'ring-1 ring-inset ring-gray-300',
          'placeholder:text-gray-400 focus:ring-2',
          'focus:ring-inset focus:ring-indigo-400',
          'disabled:bg-gray-100 disabled:text-gray-700'
        )}
        {...{ type, ...props }}
      />

      <input
        type="color"
        className={clsx(
          'absolute inset-y-[.2em] right-[.2em]',
          'w-10 h-auto',
          'appearance-none cursor-pointer'
        )}
        {...props}
      />
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}
