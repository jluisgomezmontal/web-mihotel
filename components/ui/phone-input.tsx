"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string
  onChange?: (value: string) => void
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = "", onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("")

    const formatPhoneNumber = (input: string): string => {
      const digits = input.replace(/\D/g, '')
      
      if (digits.length === 0) return ''
      
      if (digits.length <= 2) {
        return `${digits}`
      }
      
      if (digits.length <= 4) {
        return `${digits.slice(0, 2)} ${digits.slice(2)}`
      }
      
      if (digits.length <= 8) {
        return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`
      }
      
      return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`
    }

    const getRawValue = (formatted: string): string => {
      return formatted.replace(/\D/g, '')
    }

    React.useEffect(() => {
      if (value) {
        const digits = value.replace(/\D/g, '')
        setDisplayValue(formatPhoneNumber(digits))
      } else {
        setDisplayValue('')
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      const digits = input.replace(/\D/g, '')
      
      if (digits.length <= 12) {
        const formatted = formatPhoneNumber(digits)
        setDisplayValue(formatted)
        
        if (onChange) {
          onChange(digits ? `+${digits}` : '')
        }
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && displayValue.endsWith(' ')) {
        e.preventDefault()
        const newValue = displayValue.slice(0, -1)
        const digits = getRawValue(newValue)
        const formatted = formatPhoneNumber(digits)
        setDisplayValue(formatted)
        
        if (onChange) {
          onChange(digits ? `+${digits}` : '')
        }
      }
    }

    return (
      <Input
        type="text"
        className={cn(className)}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="+52 55 1234 5678"
        {...props}
      />
    )
  }
)

PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
