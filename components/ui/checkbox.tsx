"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked'> {
  checked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean | 'indeterminate') => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement>(null)
    const combinedRef = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        ref.current = node;
      }
    };

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = checked === 'indeterminate'
      }
    }, [checked])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
    }

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={combinedRef}
          checked={checked === true}
          onChange={handleChange}
          className="peer h-4 w-4 shrink-0 appearance-none cursor-pointer opacity-0 z-10"
          {...props}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex h-4 w-4 items-center justify-center rounded-md border transition-all duration-150",
            checked === true || checked === 'indeterminate'
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 border-orange-500"
              : "border-slate-300 bg-white",
            className
          )}
        >
          {checked === true && <CheckIcon className="h-3 w-3 text-white" />}
          {checked === 'indeterminate' && <div className="h-1.5 w-1.5 bg-white rounded-sm" />}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
