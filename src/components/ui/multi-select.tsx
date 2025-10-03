"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckIcon, XCircle, ChevronDown, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

const multiSelectVariants = cva(
    "m-1",
    {
        variants: {
            variant: {
                default:
                    "border-foreground",
                secondary:
                    "border-secondary ",
                destructive:
                    "border-destructive",
                inverted:
                    "inverted",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  onValueChange?: (value: string[]) => void
  defaultValue?: string[]
  placeholder?: string
  animation?: number
  maxCount?: number
  asChild?: boolean
  className?: string
  onChange: (value: string[]) => void;
  selected: string[];
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      placeholder,
      className,
      defaultValue,
      onChange,
      selected,
      disabled,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")

    const handleSelect = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];
        onChange(newSelected);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange([]);
    };
    
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={() => setOpen(!open)}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", selected.length > 0 ? "h-full" : "h-10", className)}
            disabled={disabled}
          >
            {selected.length > 0 ? (
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-wrap items-center">
                        {selected.map((value) => {
                            const option = options.find((o) => o.value === value);
                            return (
                                <Badge
                                    key={value}
                                    variant="secondary"
                                    className="m-1"
                                >
                                    {option?.label}
                                    <XCircle
                                        className="ml-2 h-4 w-4 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelect(value);
                                        }}
                                    />
                                </Badge>
                            );
                        })}
                    </div>
                    <div className="flex items-center">
                      <XIcon className="h-4 w-4 cursor-pointer" onClick={handleClear} />
                      <Separator orientation="vertical" className="h-4 mx-2" />
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between w-full">
                    <span>{placeholder ?? "Select options"}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
                placeholder="Buscar..." 
                value={inputValue}
                onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {selected.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleClear}
                      className="justify-center text-center"
                    >
                      Limpar seleção
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiSelect.displayName = "MultiSelect";
