import type { IconPack } from "@/types";
import { Icon } from "@/lib/icons";

type IconValueProps =
  | { type: "fontawesome"; name: string; pack?: IconPack }
  | { type: "emoji"; emoji: string };

export function IconValue(props: IconValueProps) {
  if (props.type === "emoji") {
    return <span className="text-xl">{props.emoji}</span>;
  }

  return (
    <span className="inline-flex items-center justify-center">
      <Icon name={props.name} pack={props.pack ?? "fa-solid"} />
    </span>
  );
}
