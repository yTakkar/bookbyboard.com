import dayjs from 'dayjs'
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export const getRelativeTime = (time: string | number) => {
  // @ts-ignore
  return dayjs(time).fromNow()
}

// write a method that returns true if 0-50% of the current month's days have passed
export const isEarlyMonth = () => {
  const currentMonth = new Date().getUTCMonth()
  const currentYear = new Date().getUTCFullYear()
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const currentDay = new Date().getUTCDate()
  return currentDay <= totalDaysInMonth * 0.5
}

// write a method that returns true if 50-90% of the current month's days have passed
export const isMidMonth = () => {
  const currentMonth = new Date().getUTCMonth()
  const currentYear = new Date().getUTCFullYear()
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const currentDay = new Date().getUTCDate()
  return currentDay > totalDaysInMonth * 0.5 && currentDay <= totalDaysInMonth * 0.9
}

// write a method that returns true if 90-100% of the current month's days have passed
export const isLateMonth = () => {
  const currentMonth = new Date().getUTCMonth()
  const currentYear = new Date().getUTCFullYear()
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const currentDay = new Date().getUTCDate()
  return currentDay > totalDaysInMonth * 0.9
}
