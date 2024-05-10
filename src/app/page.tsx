'use client'

import clsx from 'clsx'
import { useState } from 'react'
import Input from './components/Input'
import Preview from './components/Preview'

export default function Index() {
  const [values, setValue] = useState<[string, string]>(['#00f', '#f00'])

  return (
    <main
      className={clsx(
        'grid grid-rows-[auto_1fr] gap-5',
        'min-h-svh overflow-hidden',
        'p-10'
      )}>
      <form className={clsx('flex flex-col gap-y-3')}>
        <div
          className={clsx(
            'flex gap-x-3 place-items-center place-content-between'
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
        </div>
      </form>

      <aside
        className={clsx(
          'grid place-content-stretch place-items-stretch gap-y-3'
        )}>
        <Preview {...{ values }} />
        <Preview convert {...{ values }} />
      </aside>
    </main>
  )
}
