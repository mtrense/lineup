type IconValueProps =
  | { type: "fontawesome"; name: string; pack?: string }
  | { type: "emoji"; emoji: string };

export function IconValue(props: IconValueProps) {
  if (props.type === "emoji") {
    return <span className="text-xl">{props.emoji}</span>;
  }

  // FontAwesome icon - render as a placeholder for now
  // Full FontAwesome integration would require loading the library
  const pack = props.pack || "fas";
  const iconClass = `${pack} fa-${props.name}`;

  return (
    <span className="inline-flex items-center justify-center">
      <i className={iconClass} aria-hidden="true" />
    </span>
  );
}
