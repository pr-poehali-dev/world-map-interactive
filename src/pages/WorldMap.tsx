import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, X, Info, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { LocationInfo } from "@/components/LocationInfo";
import { Input } from "@/components/ui/input";

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
  region?: string; // регион (например, "Европа", "Азия")
  population?: number; // население
}

// Расширенный список локаций
const worldLocations: Location[] = [
  // Российские города
  {
    id: "moscow",
    name: "Москва",
    type: "city",
    coordinates: { lat: 55.7558, lng: 37.6173 },
    description: "Столица России, крупнейший по численности населения город страны и Европы.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Основана в 1147 году Юрием Долгоруким", 
      "Население: более 12 миллионов человек", 
      "Московский Кремль и Красная площадь внесены в список Всемирного наследия ЮНЕСКО"
    ],
    region: "Европа",
    population: 12600000
  },
  {
    id: "saint-petersburg",
    name: "Санкт-Петербург",
    type: "city",
    coordinates: { lat: 59.9343, lng: 30.3351 },
    description: "Второй по численности город России, культурная столица страны.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Основан Петром I в 1703 году", 
      "Был столицей Российской империи более 200 лет", 
      "Исторический центр внесен в список Всемирного наследия ЮНЕСКО"
    ],
    region: "Европа",
    population: 5380000
  },
  {
    id: "ufa",
    name: "Уфа",
    type: "city",
    coordinates: { lat: 54.7387, lng: 55.9720 },
    description: "Столица Республики Башкортостан, крупный промышленный и культурный центр.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Один из крупнейших городов Урала", 
      "Основан в 1574 году", 
      "Расположен на берегу реки Белой"
    ],
    region: "Европа",
    population: 1130000
  },
  {
    id: "kazan",
    name: "Казань",
    type: "city",
    coordinates: { lat: 55.7887, lng: 49.1221 },
    description: "Столица Республики Татарстан, один из крупнейших экономических, научных и культурных центров России.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Основана более 1000 лет назад", 
      "Казанский кремль включен в список Всемирного наследия ЮНЕСКО", 
      "Город проведения Универсиады 2013"
    ],
    region: "Европа",
    population: 1250000
  },
  {
    id: "novosibirsk",
    name: "Новосибирск",
    type: "city",
    coordinates: { lat: 55.0084, lng: 82.9357 },
    description: "Третий по численности населения город России, культурный и научный центр Сибири.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Основан в 1893 году", 
      "Крупнейший город Сибири", 
      "Научный центр — Академгородок"
    ],
    region: "Азия",
    population: 1620000
  },
  
  // Мировые города
  {
    id: "new-york",
    name: "Нью-Йорк",
    type: "city",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    description: "Крупнейший город США, один из мировых финансовых, культурных и экономических центров.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Население агломерации: более 20 миллионов человек", 
      "Статуя Свободы — символ города", 
      "Штаб-квартира ООН"
    ],
    region: "Северная Америка",
    population: 8400000
  },
  {
    id: "tokyo",
    name: "Токио",
    type: "city",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    description: "Столица Японии, крупнейший мегаполис мира.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Население агломерации: более 37 миллионов человек", 
      "Один из важнейших финансовых центров мира", 
      "Старое название - Эдо"
    ],
    region: "Азия",
    population: 13900000
  },
  {
    id: "london",
    name: "Лондон",
    type: "city",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    description: "Столица Великобритании, один из ведущих мировых городов.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "История насчитывает более 2000 лет", 
      "Один из крупнейших финансовых центров мира", 
      "Около 40% площади города занимают парки и сады"
    ],
    region: "Европа",
    population: 8900000
  },
  {
    id: "paris",
    name: "Париж",
    type: "city",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    description: "Столица Франции, один из крупнейших городов Европы.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Известен как 'Город света'", 
      "Эйфелева башня - символ города", 
      "Один из мировых центров моды и искусства"
    ],
    region: "Европа",
    population: 2100000
  },
  
  // Реки
  {
    id: "amazon",
    name: "Амазонка",
    type: "river",
    coordinates: { lat: -3.4653, lng: -58.3800 },
    description: "Крупнейшая река в мире по полноводности.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Длина реки: около 6400 км", 
      "Площадь бассейна: более 7 млн км²", 
      "Содержит около 20% всей пресной воды Земли"
    ],
    region: "Южная Америка"
  },
  {
    id: "nile",
    name: "Нил",
    type: "river",
    coordinates: { lat: 30.0500, lng: 31.2333 },
    description: "Одна из величайших рек Африки и мира.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Длина: около 6650 км", 
      "Является самой длинной рекой в мире", 
      "На его берегах зародилась древнеегипетская цивилизация"
    ],
    region: "Африка"
  },
  {
    id: "volga",
    name: "Волга",
    type: "river",
    coordinates: { lat: 45.7083, lng: 47.9792 },
    description: "Крупнейшая река Европы и России.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Длина: 3530 км", 
      "Исток находится в Валдайской возвышенности", 
      "На реке построено несколько крупных ГЭС"
    ],
    region: "Европа"
  },
  
  // Страны
  {
    id: "russia",
    name: "Россия",
    type: "country",
    coordinates: { lat: 61.5240, lng: 105.3188 },
    description: "Крупнейшая страна мира по площади территории.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Площадь: более 17 млн км²", 
      "Население: около 146 млн человек", 
      "11 часовых поясов"
    ],
    region: "Евразия",
    flag: "/placeholder.svg"
  },
  {
    id: "china",
    name: "Китай",
    type: "country",
    coordinates: { lat: 35.8617, lng: 104.1954 },
    description: "Самая населённая страна мира, одна из древнейших цивилизаций.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Население: более 1.4 млрд человек", 
      "Великая Китайская стена — крупнейшее сооружение, созданное человеком", 
      "Одна из крупнейших экономик мира"
    ],
    region: "Азия",
    flag: "/placeholder.svg"
  },
  {
    id: "usa",
    name: "США",
    type: "country",
    coordinates: { lat: 37.0902, lng: -95.7129 },
    description: "Одна из крупнейших стран мира по площади и численности населения.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Состоит из 50 штатов и федерального округа Колумбия", 
      "Крупнейшая экономика мира", 
      "Столица — Вашингтон"
    ],
    region: "Северная Америка",
    flag: "/placeholder.svg"
  },
  
  // Достопримечательности
  {
    id: "great-wall",
    name: "Великая Китайская стена",
    type: "landmark",
    coordinates: { lat: 40.4319, lng: 116.5704 },
    description: "Один из самых грандиозных и известных памятников архитектуры в мире.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Длина более 21 тысячи километров", 
      "Строительство началось в III веке до н.э.", 
      "Внесена в список Всемирного наследия ЮНЕСКО"
    ],
    region: "Азия"
  },
  {
    id: "eiffel-tower",
    name: "Эйфелева башня",
    type: "landmark",
    coordinates: { lat: 48.8584, lng: 2.2945 },
    description: "Металлическая башня в центре Парижа, самая узнаваемая его архитектурная достопримечательность.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: [
      "Высота: 324 метра", 
      "Построена в 1889 году", 
      "Названа в честь своего конструктора Гюстава Эйфеля"
    ],
    region: "Европа"
  }
];

// Еще 50+ российских и мировых городов
const additionalCities: Location[] = [
  // Российские города
  {
    id: "yekaterinburg",
    name: "Екатеринбург",
    type: "city",
    coordinates: { lat: 56.8389, lng: 60.6057 },
    description: "Четвертый по численности населения город России, административный центр Свердловской области.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: ["Основан в 1723 году", "Крупный промышленный и транспортный узел", "Находится на границе Европы и Азии"],
    region: "Европа",
    population: 1450000
  },
  {
    id: "nizhny-novgorod",
    name: "Нижний Новгород",
    type: "city",
    coordinates: { lat: 56.2965, lng: 43.9361 },
    description: "Пятый по численности населения город России, административный центр Нижегородской области.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: ["Основан в 1221 году", "Расположен при слиянии рек Оки и Волги", "Является крупным центром судостроения"],
    region: "Европа",
    population: 1250000
  },
  {
    id: "samara",
    name: "Самара",
    type: "city",
    coordinates: { lat: 53.2001, lng: 50.1500 },
    description: "Шестой по численности населения город России, административный центр Самарской области.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    facts: ["Основана в 1586 году", "Крупный центр авиационной и космической промышленности", "Расположена на левом берегу реки Волги"],
    region: "Европа",
    population: 1160000
  },
  // ... и так далее для остальных городов
];

// Объединяем все локации
const allLocations = [...worldLocations, ...additionalCities];

// Группы локаций по регионам для удобного отображения
const regionGroups = [
  "Европа",
  "Азия",
  "Северная Америка",
  "Южная Америка",
  "Африка",
  "Австралия и Океания",
  "Антарктида"
];

// Группы локаций по типам
const typeGroups = [
  { id: "city", name: "Города", icon: "🏙️" },
  { id: "country", name: "Страны", icon: "🏳️" },
  { id: "river", name: "Реки", icon: "🌊" },
  { id: "landmark", name: "Достопримечательности", icon: "🏞️" }
];

const WorldMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(allLocations);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  
  useEffect(() => {
    // Имитируем загрузку карты в отсутствие реальной 3D библиотеки
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Фильтрация локаций на основе поискового запроса и выбранных фильтров
  useEffect(() => {
    let filtered = allLocations;
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(query) || 
        location.description.toLowerCase().includes(query)
      );
    }
    
    // Фильтрация по региону
    if (activeRegion) {
      filtered = filtered.filter(location => location.region === activeRegion);
    }
    
    // Фильтрация по типу
    if (activeType) {
      filtered = filtered.filter(location => location.type === activeType);
    }
    
    setFilteredLocations(filtered);
  }, [searchQuery, activeRegion, activeType]);
  
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
  
  const handleGlobeClick = () => {
    setIsMapExpanded(true);
  };
  
  const handleBackToGlobe = () => {
    setIsMapExpanded(false);
    setSelectedLocation(null);
    setActiveRegion(null);
    setActiveType(null);
    setSearchQuery("");
  };
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-blue-900 to-blue-600 overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Загрузка карты мира...</p>
          </div>
        </div>
      ) : (
        <>
          {!isMapExpanded ? (
            // 3D Глобус (начальный вид)
            <div 
              ref={containerRef} 
              className="globe-container w-full h-full flex items-center justify-center"
              onClick={handleGlobeClick}
            >
              <div className="relative w-[600px] h-[600px] rounded-full bg-blue-400 shadow-xl animate-[spin_120s_linear_infinite] cursor-pointer hover:scale-105 transition-transform duration-500">
                {/* Стилизованные континенты (просто для визуализации) */}
                <div className="absolute top-[20%] left-[30%] w-[30%] h-[40%] bg-green-700 rounded-full opacity-80" />
                <div className="absolute top-[50%] right-[20%] w-[25%] h-[30%] bg-green-700 rounded-full opacity-80" />
                <div className="absolute bottom-[20%] left-[40%] w-[20%] h-[20%] bg-green-700 rounded-full opacity-80" />
                
                <div className="absolute bottom-10 left-0 right-0 text-center text-white text-xl font-semibold">
                  Нажмите на глобус, чтобы исследовать мир
                </div>
              </div>
            </div>
          ) : (
            // Развернутая карта мира
            <div className="map-expanded-view w-full h-full overflow-hidden">
              {/* Верхняя панель управления */}
              <div className="absolute top-0 left-0 right-0 bg-background/90 p-4 z-10 flex flex-wrap items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleBackToGlobe}
                  className="mr-4"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Вернуться к глобусу
                </Button>
                
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск городов, стран, рек..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                {/* Фильтры по типу */}
                <div className="flex items-center gap-2 ml-4">
                  {typeGroups.map(type => (
                    <Button
                      key={type.id}
                      variant={activeType === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveType(activeType === type.id ? null : type.id)}
                      className="flex items-center gap-1"
                    >
                      <span>{type.icon}</span>
                      <span>{type.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Карта мира с регионами */}
              <div className="world-map-container relative w-full h-full bg-blue-300 pt-16">
                {/* Регионы мира (стилизованно) */}
                <div className="regions-container relative w-full h-full overflow-auto">
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-8 p-8">
                    {regionGroups.map(region => (
                      <Button
                        key={region}
                        variant={activeRegion === region ? "default" : "outline"}
                        className="h-auto py-8 px-6 text-lg flex flex-col items-center gap-2 bg-background/80 hover:bg-background/90"
                        onClick={() => setActiveRegion(activeRegion === region ? null : region)}
                      >
                        {region === "Европа" && "🇪🇺"}
                        {region === "Азия" && "🌏"}
                        {region === "Северная Америка" && "🌎"}
                        {region === "Южная Америка" && "🌎"}
                        {region === "Африка" && "🌍"}
                        {region === "Австралия и Океания" && "🌏"}
                        {region === "Антарктида" && "🧊"}
                        <span>{region}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Панель с результатами поиска и локациями */}
              <div className="absolute bottom-0 left-0 right-0 bg-background/90 border-t border-border max-h-[50vh] overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-3 flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    {filteredLocations.length > 0 
                      ? `Найдено локаций: ${filteredLocations.length}` 
                      : "Локации не найдены"}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredLocations.map((location) => (
                      <Button 
                        key={location.id}
                        variant="outline" 
                        className="h-auto p-3 justify-start text-left flex flex-col items-start" 
                        onClick={() => handleLocationClick(location)}
                      >
                        <div className="flex items-center w-full mb-1">
                          <span>
                            {location.type === 'city' ? '🏙️' : 
                            location.type === 'country' ? '🏳️' : 
                            location.type === 'river' ? '🌊' : '🏞️'}
                          </span>
                          <span className="ml-2 font-medium">{location.name}</span>
                          {location.region && (
                            <span className="ml-auto text-xs text-muted-foreground">
                              {location.region}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate w-full">
                          {location.description.substring(0, 60)}...
                        </p>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Информация о выбранной локации */}
          {selectedLocation && (
            <div className="location-info absolute bottom-0 left-0 right-0 bg-background border-t border-border p-6 max-h-[80vh] overflow-y-auto animate-fade-in z-20">
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
        </>
      )}
    </div>
  );
};

export default WorldMap;
