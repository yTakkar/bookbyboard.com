import { CalendarIcon } from '@heroicons/react/outline'
import React, { useRef, useState } from 'react'
import { MonthPicker } from '../month-picker/MonthPicker'
import useOutsideClick from '../../hooks/useOutsideClick'
import { useRouter } from 'next/router'
import { getSelectedBookPageUrl } from '../../utils/routes'
import Tooltip from '../Tooltip'

interface IProps {
  month: number
  year: number
}

function CalendarView(props: IProps) {
  const { month: _month, year } = props

  // month picker starts from 1
  const month = _month + 1

  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const ref = useRef(null)

  const router = useRouter()

  useOutsideClick({
    ref,
    onOutsideClick: () => {
      setIsPickerOpen(false)
    },
  })

  return (
    <div className="relative" ref={ref}>
      <Tooltip content={'View past book selections'}>
        <CalendarIcon
          className="w-[18px] md:w-5 mr-3 cursor-pointer outline-0"
          onClick={() => setIsPickerOpen(!isPickerOpen)}
        />
      </Tooltip>
      {isPickerOpen && (
        <MonthPicker
          setIsOpen={setIsPickerOpen}
          selected={{
            month,
            year,
          }}
          onChange={(s: any) => {
            // s.month is 1-indexed
            const monthIndex = s.month - 1
            router.push(getSelectedBookPageUrl(`${monthIndex}-${s.year}`))
          }}
          size="small"
        />
      )}
    </div>
  )
}

export default CalendarView
