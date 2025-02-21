import React, { useEffect } from 'react'
import { useState } from 'react'
import styles from './MonthPicker.module.css'

export function MonthPicker(props: any) {
  const [month, setMonth] = useState(props.selected.month ? props.selected.month - 1 : new Date().getMonth())
  const [year, setYear] = useState(props.selected.year ?? new Date().getFullYear())

  const setActiveMonthBgColor = (r: any, color: any) => {
    r.style.setProperty('--month-active-bg-color', color)
  }

  useEffect(() => {
    const r = document.querySelector(':root') as any
    if (props.bgColorMonthActive) {
      setActiveMonthBgColor(r, props.bgColorMonthActive)
    }
    if (props.bgColorMonthHover) {
      r.style.setProperty('--month-hover-bg-color', props.bgColorMonthHover)
    }
    if (props.borderRadiusMonth) {
      r.style.setProperty('--month-border-radius', props.borderRadiusMonth)
    }
    if (props.bgColorPicker) {
      r.style.setProperty('--picker-bg-color', props.bgColorPicker)
    }
    if (props.textColor) {
      r.style.setProperty('--text-color', props.textColor)
    }
    if (props.size == 'small') {
      r.style.setProperty('--picker-padding', '1rem')
      r.style.setProperty('--year-display-margin-top', '0.5rem')
      r.style.setProperty('--year-display-margin-bottom', '0.5rem')
      r.style.setProperty('--month-select-padding', '0.5rem')
    }
  }, [])

  const changeYear = (year: any) => {
    setYear(year)
  }

  const getMonthNames = (locale = 'en', format = 'short') => {
    const formatter = new Intl.DateTimeFormat(locale, {
      month: format as any,
      timeZone: 'UTC',
    })
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
      const mm = month < 10 ? `0${month}` : month
      return new Date(`2023-${mm}-01T00:00:00+00:00`)
    })
    return months.map(date => formatter.format(date))
  }

  const changeMonth = (month: any) => {
    setMonth(month)
    props.setIsOpen(false)
    props.onChange({
      month: month + 1,
      year: year,
      monthName: new Date(year, month).toLocaleString(props.lang ? props.lang : 'en', {
        month: 'long',
      }),
      monthShortName: new Date(year, month).toLocaleString(props.lang ? props.lang : 'en', {
        month: 'short',
      }),
    })
  }

  return (
    <div className={styles.pickerContainer}>
      <div className={styles.yearContainer}>
        <button className={styles.button} aria-label="Previous Year" onClick={() => changeYear(year - 1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={props.textColor ? props.textColor : '#000'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-left">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span aria-description="Year selected" className={styles.bold1}>
          {year}
        </span>
        <button className={styles.button} aria-label="Next Year" onClick={() => changeYear(year + 1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={props.textColor ? props.textColor : '#000'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className={styles.monthsContainer}>
        {getMonthNames(props.lang).map((monthName, index) => {
          return (
            <button
              key={index}
              className={`${styles.month} ${styles.button} ${
                index == month && props.selected.year == year ? styles.active : null
              }`}
              onClick={() => changeMonth(index)}>
              {monthName}
            </button>
          )
        })}
      </div>
      <div
        className={styles.footer}
        onClick={() => {
          changeMonth(new Date().getUTCMonth())
        }}>{`Select current month`}</div>
    </div>
  )
}
