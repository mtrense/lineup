import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DateRangePickerProps {
  /** Date range value as Date objects */
  value?: DateRange;
  /** Callback when date range changes (Date objects) */
  onChange?: (range: DateRange | undefined) => void;
  /** Date range value as timestamps (milliseconds) */
  valueAsTimestamps?: { from?: number; to?: number };
  /** Callback when date range changes (timestamps in milliseconds) */
  onChangeTimestamps?: (range: { from?: number; to?: number }) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Additional class name for the trigger button */
  className?: string;
  /** Placeholder text when no dates are selected */
  placeholder?: string;
}

/**
 * A date range picker component that provides a calendar-based interface
 * for selecting a date range. Built on top of react-day-picker and shadcn Calendar.
 *
 * Supports both Date object and timestamp (milliseconds) interfaces for
 * integration with different data formats.
 */
export function DateRangePicker({
  value,
  onChange,
  valueAsTimestamps,
  onChangeTimestamps,
  minDate,
  maxDate,
  disabled = false,
  className,
  placeholder = "Pick a date",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Convert timestamp values to Date objects if provided
  const dateValue = React.useMemo<DateRange | undefined>(() => {
    if (value) {
      return value;
    }
    if (valueAsTimestamps) {
      return {
        from: valueAsTimestamps.from ? new Date(valueAsTimestamps.from) : undefined,
        to: valueAsTimestamps.to ? new Date(valueAsTimestamps.to) : undefined,
      };
    }
    return undefined;
  }, [value, valueAsTimestamps]);

  // Handle date selection
  const handleSelect = React.useCallback(
    (range: DateRange | undefined) => {
      if (onChange) {
        onChange(range);
      }
      if (onChangeTimestamps) {
        onChangeTimestamps({
          from: range?.from?.getTime(),
          to: range?.to?.getTime(),
        });
      }
    },
    [onChange, onChangeTimestamps]
  );

  // Format the selected date range for display
  const formattedRange = React.useMemo(() => {
    if (!dateValue?.from) {
      return placeholder;
    }
    if (dateValue.to) {
      return `${format(dateValue.from, "MMM d, yyyy")} - ${format(dateValue.to, "MMM d, yyyy")}`;
    }
    return format(dateValue.from, "MMM d, yyyy");
  }, [dateValue, placeholder]);

  // Determine the default month to show
  const defaultMonth = dateValue?.from || new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateValue?.from && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          aria-haspopup="dialog"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{formattedRange}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={defaultMonth}
          selected={dateValue}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={
            minDate || maxDate
              ? [
                  ...(minDate ? [{ before: minDate }] : []),
                  ...(maxDate ? [{ after: maxDate }] : []),
                ]
              : undefined
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
