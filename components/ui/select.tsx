"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// --- Context ---
interface SelectContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  value?: string
  onValueChange: (value: string) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

// --- Select ---
interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  children: React.ReactNode
}

const Select = ({
  value,
  onValueChange,
  defaultValue,
  children,
}: SelectProps) => {
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    defaultValue || value
  )

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value: selectedValue,
        onValueChange: handleSelect,
      }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

// --- SelectTrigger ---
interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext)!
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-orange-500 transition-all duration-200 shadow-sm",
          className
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <ChevronDownIcon className="h-4 w-4 text-slate-500" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

// --- SelectValue ---
interface SelectValueProps {
  placeholder?: string
}

const SelectValue = ({ placeholder }: SelectValueProps) => {
  const { value } = React.useContext(SelectContext)!
  // We need to find the label of the selected value from children, but for simplicity:
  // Let's just map our values to labels!
  const labelMap: Record<string, string> = {
    "fleet_manager": "Fleet Manager",
    "dispatcher": "Dispatcher",
    "safety_officer": "Safety Officer",
    "financial_analyst": "Financial Analyst"
  }
  const displayValue = value ? labelMap[value] || value : placeholder
  return <span className="text-slate-900">{displayValue}</span>
}
SelectValue.displayName = "SelectValue"

// --- SelectContent ---
interface SelectContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext)!
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node)
        ) {
          setOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [setOpen])

    if (!open) return null

    return (
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-900 shadow-xl",
          className
        )}
        {...props}
      >
        <div className="p-1">{children}</div>
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

// --- SelectItem ---
interface SelectItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(SelectContext)!
    return (
      <div
        ref={ref}
        role="option"
        aria-selected={selectedValue === value}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-md py-1.5 px-2 text-sm font-medium outline-none transition-colors",
          selectedValue === value ? "bg-slate-50 text-slate-900" : "text-slate-700 hover:bg-slate-50",
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      >
        <span className="flex-1">{children}</span>
        {selectedValue === value && <CheckIcon className="h-4 w-4 text-orange-500" />}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
