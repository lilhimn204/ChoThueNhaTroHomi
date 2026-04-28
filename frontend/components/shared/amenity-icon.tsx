import type { LucideIcon } from "lucide-react";
import {
  Bath,
  Blinds,
  Building2,
  CarFront,
  ChefHat,
  Fan,
  Layers3,
  ShieldCheck,
  WashingMachine,
  Wifi,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  wifi: Wifi,
  "car-front": CarFront,
  fan: Fan,
  bath: Bath,
  shield: ShieldCheck,
  "chef-hat": ChefHat,
  "layers-3": Layers3,
  washer: WashingMachine,
  blinds: Blinds,
  "building-2": Building2,
};

export function AmenityIcon({
  iconKey,
  className,
}: {
  iconKey: string;
  className?: string;
}) {
  const Icon = iconMap[iconKey] ?? Building2;
  return <Icon className={className} />;
}
