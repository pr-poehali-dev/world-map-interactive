import React from "react";
import { Separator } from "@/components/ui/separator";
import { Flag, Landmark, Droplets, MapPin, Users, MapPinned } from "lucide-react";

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
    region?: string;
    population?: number;
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

      {/* Информация о регионе */}
      {location.region && (
        <div className="flex items-center gap-2">
          <MapPinned className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Регион: {location.region}</span>
        </div>
      )}

      {/* Информация о населении для городов и стран */}
      {location.population && (location.type === "city" || location.type === "country") && (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            Население: {location.population.toLocaleString()} чел.
          </span>
        </div>
      )}

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

      {/* Дополнительная информация по типу локации */}
      {location.type === "river" && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Особенности реки</h3>
          <p className="text-muted-foreground">
            Реки играют важную роль в экосистеме планеты, обеспечивая водой миллионы людей и животных. 
            Они также служат транспортными артериями и источниками энергии.
          </p>
        </div>
      )}

      {location.type === "city" && (
        <div>
          <h3 className="text-lg font-semibold mb-3">О городе</h3>
          <p className="text-muted-foreground">
            Города являются центрами культуры, искусства и экономики. 
            Каждый город имеет свою уникальную историю, архитектуру и атмосферу.
          </p>
        </div>
      )}

      {location.type === "country" && (
        <div>
          <h3 className="text-lg font-semibold mb-3">О стране</h3>
          <p className="text-muted-foreground">
            Страны отличаются своей культурой, историей, традициями и политическими системами. 
            Каждая страна вносит свой вклад в мировое наследие.
          </p>
        </div>
      )}

      {location.type === "landmark" && (
        <div>
          <h3 className="text-lg font-semibold mb-3">О достопримечательности</h3>
          <p className="text-muted-foreground">
            Достопримечательности — это особые места, имеющие историческую, культурную или природную ценность. 
            Они привлекают туристов со всего мира и часто становятся символами стран и городов.
          </p>
        </div>
      )}

      {/* Идентификатор локации */}
      <div className="text-sm text-right mt-4 text-muted-foreground">
        ID локации: {location.id}
      </div>
    </div>
  );
};
