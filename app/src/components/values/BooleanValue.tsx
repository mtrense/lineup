import { Check, X } from "lucide-react";

interface BooleanValueProps {
  value: boolean;
}

export function BooleanValue({ value }: BooleanValueProps) {
  if (value) {
    return (
      <span className="inline-flex items-center justify-center">
        <Check className="h-5 w-5 text-green-500" />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center">
      <X className="h-5 w-5 text-red-500" />
    </span>
  );
}
