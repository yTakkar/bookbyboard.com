import React, { useRef } from 'react'
import classnames from 'classnames'

export interface ICoreSelectInputOption {
  id: string | number
  value: string
  label: string
  selected: boolean
}

interface ICoreSelectInputProps {
  value: string
  onChange: (value: string) => void
  options: ICoreSelectInputOption[]
  disabled?: boolean
  className?: string
}

const CoreSelectInput: React.FC<ICoreSelectInputProps> = props => {
  const { value, onChange, options, disabled = false, className } = props

  const selectRef = useRef<HTMLSelectElement>(null)

  return (
    <div
      className={classnames(
        'select',
        {
          'select--disabled': disabled,
        },
        className
      )}>
      <select
        ref={selectRef}
        id={classnames(disabled ? 'standard-select-disabled' : 'standard-select')}
        value={value}
        onChange={e => {
          onChange(e.target.value)
          selectRef.current?.blur()
        }}
        disabled={disabled}>
        <option disabled value="">
          -- select an option --
        </option>
        {options.map(option => (
          <option key={option.id} value={option.value} selected={option.selected}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="focus"></span>
    </div>
  )
}

export default CoreSelectInput
