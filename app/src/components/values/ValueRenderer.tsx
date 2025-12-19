import type { ValueType } from "@/types";
import { TextValue } from "./TextValue";
import { BooleanValue } from "./BooleanValue";
import { LinkValue } from "./LinkValue";
import { IntegerValue } from "./IntegerValue";
import { DecimalValue } from "./DecimalValue";
import { TagsValue } from "./TagsValue";
import { RatingValue } from "./RatingValue";
import { FilesizeValue } from "./FilesizeValue";
import { DurationValue } from "./DurationValue";
import { IconValue } from "./IconValue";

type AttributeValueType =
  | number
  | string
  | string[]
  | boolean
  | null
  | undefined;

interface ValueRendererProps {
  value: AttributeValueType;
  valueType: ValueType;
}

export function ValueRenderer({ value, valueType }: ValueRendererProps) {
  // Handle null/undefined values
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  // Dispatch to appropriate renderer based on valueType
  if (valueType === "text") {
    return <TextValue value={String(value)} />;
  }

  if (valueType === "boolean") {
    return <BooleanValue value={Boolean(value)} />;
  }

  if (valueType === "link") {
    return <LinkValue value={String(value)} />;
  }

  if (typeof valueType === "object") {
    switch (valueType.type) {
      case "integer":
        return (
          <IntegerValue
            value={Number(value)}
            direction={valueType.direction}
          />
        );

      case "decimal":
        return (
          <DecimalValue
            value={Number(value)}
            direction={valueType.direction}
          />
        );

      case "filesize":
        return (
          <FilesizeValue
            value={Number(value)}
            direction={valueType.direction}
          />
        );

      case "duration":
        return (
          <DurationValue
            value={Number(value)}
            direction={valueType.direction}
          />
        );

      case "rating":
        return (
          <RatingValue
            value={Number(value)}
            lower={valueType.lower}
            upper={valueType.upper}
            direction={valueType.direction}
            symbols={valueType.symbols}
          />
        );

      case "tags":
        return (
          <TagsValue
            value={Array.isArray(value) ? value : [String(value)]}
            tags={valueType.tags}
            defaultColor={valueType.defaultColor}
          />
        );

      case "icon-fontawesome":
        return <IconValue type="fontawesome" name={valueType.name} pack={valueType.pack} />;

      case "icon-emoji":
        return <IconValue type="emoji" emoji={valueType.emoji} />;
    }
  }

  // Fallback: render as string
  return <TextValue value={String(value)} />;
}
