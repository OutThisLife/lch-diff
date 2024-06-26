'use client'

import clsx from 'clsx'
import { useState } from 'react'
import Input from './components/Input'
import Preview from './components/Preview'

export default function Index() {
  const [values, setValue] = useState<[string, string]>(['#0000ff', '#ff0000'])

  return (
    <main
      className={clsx(
        'grid grid-rows-[auto_1fr] gap-4',
        'min-h-svh overflow-hidden',
        'px-4 py-8 sm:p-10'
      )}>
      <form
        className={clsx(
          'flex flex-col sm:flex-row gap-2 place-items-center place-content-between'
        )}>
        <Input
          label="From"
          required
          onChange={e => setValue(st => [e.target.value, st[1]])}
          placeholder="#f00"
          value={values[0]}
        />

        <Input
          label="To"
          required
          onChange={e => setValue(st => [st[0], e.target.value])}
          placeholder="#00f"
          value={values[1]}
        />
      </form>

      <aside
        className={clsx(
          'grid grid-cols-2 place-content-stretch place-items-stretch gap-0.5'
        )}>
        <Preview {...{ values }} />
        <Preview convert {...{ values }} />
      </aside>
    </main>
  )
}
