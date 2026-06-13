// Value type definitions for attributes

export interface IntegerType {
  type: "integer";
  direction: "ascending" | "descending" | "neutral";
}

export interface DecimalType {
  type: "decimal";
  direction: "ascending" | "descending" | "neutral";
}

export interface FilesizeType {
  type: "filesize";
  direction: "ascending" | "descending";
}

export interface DurationType {
  type: "duration";
  direction: "ascending" | "descending";
}

export interface PercentageType {
  type: "percentage";
  direction: "ascending" | "descending";
}

export interface DateType {
  type: "date";
  direction: "ascending" | "descending";
  format?: "year" | "month-year" | "full";
}

export interface DateTimeType {
  type: "datetime";
  direction: "ascending" | "descending";
}

export interface RatingType {
  type: "rating";
  lower: number;
  upper: number;
  direction: "ascending" | "descending";
  symbols: {
    empty: string;
    half?: string;
    full: string;
  };
}

export interface Tag {
  id: string;
  value: string;
  color?: string;
  icon?: string;
}

export interface TagsType {
  type: "tags";
  defaultColor: string;
  tags: Tag[];
}

export type IconPack = "fa-solid" | "fa-brands" | "fa-regular" | "devicon";

export interface IconRef {
  name: string;
  pack?: IconPack;
}

export interface FontAwesomeIcon {
  type: "icon-fontawesome";
  name: string;
  pack?: IconPack;
}

export type IconType =
  | { type: "icon-fontawesome"; name: string; pack?: IconPack }
  | { type: "icon-emoji"; emoji: string };

export type ValueType =
  | IntegerType
  | DecimalType
  | FilesizeType
  | DurationType
  | PercentageType
  | DateType
  | DateTimeType
  | "text"
  | "boolean"
  | RatingType
  | TagsType
  | IconType
  | "link";

// Attribute definitions

export interface Attribute {
  id: string;
  name: string;
  valueType: ValueType;
  description?: string;
  icon?: string;
}

export interface AttributeGroup {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  expandedByDefault: boolean;
  attributes: Attribute[];
}

export interface AttributesFile {
  name: string;
  description?: string;
  groups: AttributeGroup[];
}
