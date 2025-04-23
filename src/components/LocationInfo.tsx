import React from "react";
import { Separator } from "@/components/ui/separator";
import { Flag, Landmark, Droplets, MapPin } from "lucide-react";

// Интерфейс для локации
interface LocationProps {
  location: {
    id: string;
    name: string;
    type: "city" | "country" | "river" | "landmark";
    coordinates: {
      lat: number;
      lng: number;
    };
    description: string;
    images: string[];
    facts: string[];
    flag?: string;
  };
}

export const LocationInfo: React.FC<LocationProps> = ({ location }) => {
  // Функция для выбора иконки в зависимости от типа локации
  const getTypeIcon = () => {
    switch (location.type) {
      case "city":
        return <Landmark className="h-5 w-5 text-primary" />;
      case "country":
        return <Flag className="h-5 w-5 text-primary" />;
      case "river":
        return <Droplets className="h-5 w-5 text-primary" />;
      case "landmark":
        return <MapPin className="h-5 w-5 text-primary" />;
      default:
        return <MapPin className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          {getTypeIcon()}
          <h3 className="text-lg font-semibold">
            {location.type === "city"
              ? "Город"
              : location.type === "country"
              ? "Страна"
              : location.type === "river"
              ? "Река"
              : "Достопримечательность"}
          </h3>
          <div className="text-sm text-muted-foreground ml-2">
            {location.coordinates.lat.toFixed(2)}°, {location.coordinates.lng.toFixed(2)}°
          </div>
        </div>
        <p className="text-base text-muted-foreground">{location.description}</p>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-3">Интересные факты</h3>
        <ul className="space-y-2">
          {location.facts.map((fact, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Можно добавить дополнительные секции для расширенной информации */}
      <div className="text-sm text-right mt-4 text-muted-foreground">
        ID локации: {location.id}
      </div>
    </div>
  );
};
