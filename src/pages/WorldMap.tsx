import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, X, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { LocationInfo } from "@/components/LocationInfo";

// Типы для мест на карте
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
  flag?: string; // для стран
}

// Фиктивные данные о локациях
const sampleLocations: Location[] = [
  {
    id: "moscow",
    name: "Москва",
    type: "city",
    coordinates: { lat: 55.7558, lng: 37.6173 },
    description: "Столица России, крупнейший по численности населения город страны.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: ["Основана в 1147 году", "Население: более 12 миллионов человек", "Крупнейший транспортный узел России"],
    flag: "/placeholder.svg"
  },
  {
    id: "paris",
    name: "Париж",
    type: "city",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    description: "Столица Франции, один из крупнейших городов Европы.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: ["Известен как 'Город света'", "Эйфелева башня - символ города", "Один из мировых центров моды и искусства"],
    flag: "/placeholder.svg"
  },
  {
    id: "amazon",
    name: "Амазонка",
    type: "river",
    coordinates: { lat: -3.4653, lng: -58.3800 },
    description: "Крупнейшая река в мире по полноводности.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: ["Длина реки: около 6400 км", "Площадь бассейна: более 7 млн км²", "Содержит около 20% всей пресной воды Земли"],
  },
  {
    id: "tokyo",
    name: "Токио",
    type: "city",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    description: "Столица Японии, крупнейший мегаполис мира.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: ["Население агломерации: более 37 миллионов человек", "Один из важнейших финансовых центров мира", "Старое название - Эдо"],
    flag: "/placeholder.svg"
  },
  {
    id: "nile",
    name: "Нил",
    type: "river",
    coordinates: { lat: 30.0500, lng: 31.2333 },
    description: "Одна из величайших рек Африки и мира.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: ["Длина: около 6650 км", "Является самой длинной рекой в мире", "На его берегах зародилась древнеегипетская цивилизация"],
  }
];

const WorldMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    // Имитируем загрузку карты в отсутствие реальной 3D библиотеки
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setCurrentImageIndex(0); // Сбрасываем индекс изображения при выборе новой локации
  };
  
  const handleCloseInfo = () => {
    setSelectedLocation(null);
  };
  
  const nextImage = () => {
    if (selectedLocation) {
      setCurrentImageIndex((prev) => 
        prev < selectedLocation.images.length - 1 ? prev + 1 : 0
      );
    }
  };
  
  const prevImage = () => {
    if (selectedLocation) {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedLocation.images.length - 1
      );
    }
  };
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-blue-900 to-blue-600">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Загрузка карты мира...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Заглушка для карты мира */}
          <div ref={containerRef} className="globe-container w-full h-full flex items-center justify-center">
            <div className="relative w-[600px] h-[600px] rounded-full bg-blue-400 shadow-xl animate-[spin_120s_linear_infinite]">
              {/* Стилизованные континенты (просто для визуализации) */}
              <div className="absolute top-[20%] left-[30%] w-[30%] h-[40%] bg-green-700 rounded-full opacity-80" />
              <div className="absolute top-[50%] right-[20%] w-[25%] h-[30%] bg-green-700 rounded-full opacity-80" />
              <div className="absolute bottom-[20%] left-[40%] w-[20%] h-[20%] bg-green-700 rounded-full opacity-80" />
              
              {/* Маркеры локаций */}
              {sampleLocations.map((location) => (
                <button
                  key={location.id}
                  className="absolute w-4 h-4 bg-red-500 rounded-full hover:w-6 hover:h-6 hover:bg-red-600 transition-all duration-300 z-10"
                  style={{
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                  }}
                  onClick={() => handleLocationClick(location)}
                  aria-label={`Посмотреть ${location.name}`}
                />
              ))}
              
              <div className="absolute bottom-10 left-0 right-0 text-center text-white text-xl">
                Нажмите на маркер для просмотра информации
              </div>
            </div>
          </div>
          
          {/* Список доступных локаций */}
          <div className="absolute top-6 right-6 bg-background/90 p-4 rounded-lg border border-border max-w-xs">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Доступные локации
            </h3>
            <ul className="space-y-2 max-h-[50vh] overflow-y-auto">
              {sampleLocations.map((location) => (
                <li key={location.id}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left" 
                    onClick={() => handleLocationClick(location)}
                  >
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{location.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {location.type === 'city' ? '🏙️' : 
                       location.type === 'country' ? '🏳️' : 
                       location.type === 'river' ? '🌊' : '🏞️'}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      
      {/* Информация о выбранной локации */}
      {selectedLocation && (
        <div className="location-info absolute bottom-0 left-0 right-0 bg-background border-t border-border p-6 max-h-[80vh] overflow-y-auto animate-fade-in">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">{selectedLocation.name}</h2>
              {selectedLocation.flag && (
                <img 
                  src={selectedLocation.flag} 
                  alt={`Флаг ${selectedLocation.name}`} 
                  className="h-6 ml-2"
                />
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCloseInfo}
              aria-label="Закрыть"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Галерея изображений */}
          <div className="relative mb-6 rounded-lg overflow-hidden aspect-video bg-muted">
            <img 
              src={selectedLocation.images[currentImageIndex]} 
              alt={`${selectedLocation.name} изображение ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover"
            />
            
            {/* Кнопки навигации по галерее */}
            <div className="absolute inset-0 flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={prevImage} 
                className="h-12 w-12 rounded-full bg-background/50 hover:bg-background/70 ml-2"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={nextImage} 
                className="h-12 w-12 rounded-full bg-background/50 hover:bg-background/70 mr-2"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
            
            {/* Индикаторы изображений */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {selectedLocation.images.map((_, index) => (
                <button 
                  key={index} 
                  className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-primary' : 'bg-background/50'}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Показать изображение ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <LocationInfo location={selectedLocation} />
        </div>
      )}
    </div>
  );
};

export default WorldMap;
