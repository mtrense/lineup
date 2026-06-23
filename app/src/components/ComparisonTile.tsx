/**
 * ComparisonTile — a card-style link to a single comparison type.
 *
 * Wraps the existing Link → Card pattern from the old HomePage but now accepts
 * a tile URL and layers TileBackground behind the card's text content.
 *
 * The parent grid must be `relative` or any non-static container for the
 * absolute-positioned TileBackground fill to work correctly — the Card itself
 * sets `relative` via the className prop.
 */
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TileBackground } from "@/components/TileBackground";
import type { ComparisonType } from "@/types";

interface ComparisonTileProps {
  comparison: ComparisonType;
  tileUrl?: string | null;
}

export function ComparisonTile({ comparison, tileUrl }: ComparisonTileProps) {
  return (
    <Link to={`/${comparison.id}`} aria-label={comparison.name}>
      <Card className="relative cursor-pointer transition-colors hover:bg-accent h-full overflow-hidden">
        <TileBackground url={tileUrl} />
        <CardHeader className="relative">
          <CardTitle>{comparison.name}</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-sm text-muted-foreground">
            {comparison.description ?? "No description"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}