import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface RangeSliderProps {
  /** Minimum bound of the range */
  min: number;
  /** Maximum bound of the range */
  max: number;
  /** Current range value as [min, max] tuple */
  value: [number, number];
  /** Callback when range value changes */
  onChange: (value: [number, number]) => void;
  /** Optional formatter for displaying values */
  formatLabel?: (value: number) => string;
  /** Step size for the slider */
  step?: number;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * A dual-handle range slider component for selecting a min/max range.
 * Built on top of the shadcn Slider component.
 */
export function RangeSlider({
  min,
  max,
  value,
  onChange,
  formatLabel = (v) => String(v),
  step = 1,
  disabled = false,
  className,
}: RangeSliderProps) {
  const handleValueChange = React.useCallback(
    (newValue: number[]) => {
      if (newValue.length >= 2) {
        onChange([newValue[0], newValue[1]]);
      }
    },
    [onChange]
  );

  // Ensure value is within bounds
  const clampedValue: [number, number] = [
    Math.max(min, Math.min(max, value[0])),
    Math.max(min, Math.min(max, value[1])),
  ];

  return (
    <div className={cn("space-y-2", className)}>
      {/* Value labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatLabel(clampedValue[0])}</span>
        <span>{formatLabel(clampedValue[1])}</span>
      </div>

      {/* Slider */}
      <Slider
        min={min}
        max={max}
        step={step}
        value={clampedValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        aria-label="Range slider"
      />

      {/* Min/max bounds labels */}
      <div className="flex justify-between text-[10px] text-muted-foreground/60">
        <span>{formatLabel(min)}</span>
        <span>{formatLabel(max)}</span>
      </div>
    </div>
  );
}
