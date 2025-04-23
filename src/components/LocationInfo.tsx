import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Info, Image, MapPin } from "lucide-react";

interface Location {
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
}

interface LocationInfoProps {
  location: Location;
}

export const LocationInfo = ({ location }: LocationInfoProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? location.images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === location.images.length - 1 ? 0 : prev + 1
    );
  };
  
  // Определяем тип локации на русском
  const getLocationType = (type: string) => {
    switch(type) {
      case "city": return "Город";
      case "country": return "Страна";
      case "river": return "Река";
      case "landmark": return "Достопримечательность";
      default: return "Место";
    }
  };
  
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="info" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Информация
        </TabsTrigger>
        <TabsTrigger value="gallery" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Галерея ({location.images.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Тип
                  </h3>
                  <p className="text-base">{getLocationType(location.type)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Координаты
                  </h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">
                      {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Описание
                  </h3>
                  <p className="text-base">{location.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Интересные факты
              </h3>
              <ul className="space-y-2">
                {location.facts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                      {index + 1}
                    </span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="gallery">
        <div className="rounded-lg overflow-hidden bg-background border h-[300px] md:h-[400px] relative">
          <img 
            src={location.images[currentImageIndex]} 
            alt={`${location.name} - изображение ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-x-0 bottom-0 bg-black/50 p-4 text-white">
            <p className="text-sm">
              {location.name} - изображение {currentImageIndex + 1} из {location.images.length}
            </p>
          </div>
          
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/100"
            onClick={handlePrevImage}
            aria-label="Предыдущее изображение"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/100"
            onClick={handleNextImage}
            aria-label="Следующее изображение"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Миниатюры изображений */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {location.images.map((image, index) => (
            <div 
              key={index}
              className={`cursor-pointer rounded-md overflow-hidden border-2 h-16 md:h-20 ${
                index === currentImageIndex ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img 
                src={image}
                alt={`Миниатюра ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
