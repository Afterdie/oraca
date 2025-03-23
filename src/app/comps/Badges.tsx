import { Badge } from "@/components/ui/badge";

export default function Badges({ variant }: { variant: string }) {
  let badgeStyle;

  switch (variant) {
    case "PK":
      badgeStyle = "bg-green-500";
      break;
    case "NOT NULL":
      badgeStyle = "bg-sky-800";
      break;
    default:
      badgeStyle = "bg-slate-200";
  }

  return <Badge className={badgeStyle}>{variant}</Badge>;
}
