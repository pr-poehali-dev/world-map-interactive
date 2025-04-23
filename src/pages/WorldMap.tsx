import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { LocationInfo } from "@/components/LocationInfo";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, X } from "lucide-react";

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
  }
];

const WorldMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const globeRef = useRef<THREE.Object3D | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Настройка сцены Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Добавляем свет
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Создаем глобус
    const globeRadius = 5;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    
    // Загружаем текстуру земли
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/land_ocean_ice_cloud_2048.jpg',
      (texture) => {
        const globeMaterial = new THREE.MeshPhongMaterial({ 
          map: texture,
          specular: new THREE.Color(0x333333),
          shininess: 5,
        });
        
        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);
        globeRef.current = globe;
        
        // Создаем маркеры для известных локаций
        sampleLocations.forEach(location => {
          const { lat, lng } = location.coordinates;
          const marker = createLocationMarker(lat, lng, globeRadius);
          globe.add(marker);
        });
        
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error("Ошибка загрузки текстуры:", error);
        setIsLoading(false);
      }
    );
    
    // Настраиваем позицию камеры
    camera.position.z = 15;
    
    // Добавляем контроль орбиты
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 6;
    controls.maxDistance = 20;
    
    // Обработка кликов для выбора локации
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    window.addEventListener('click', (event) => {
      // Нормализованные координаты мыши
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      // Проверяем пересечение с глобусом
      if (globeRef.current) {
        const intersects = raycaster.intersectObject(globeRef.current, true);
        
        if (intersects.length > 0) {
          // Тут должна быть логика определения ближайшей локации к точке клика
          // Для простоты берем случайную локацию
          const randomIndex = Math.floor(Math.random() * sampleLocations.length);
          setSelectedLocation(sampleLocations[randomIndex]);
        }
      }
    });
    
    // Адаптивный размер
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Анимация
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Очистка
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  // Функция для создания маркера локации на глобусе
  const createLocationMarker = (lat: number, lng: number, radius: number) => {
    // Конвертируем географические координаты в 3D координаты
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    // Создаем маркер
    const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    
    marker.position.set(x, y, z);
    
    // Создаем "смотрящий наружу" вектор для правильной ориентации маркера
    const lookAtVector = new THREE.Vector3(x, y, z).normalize().multiplyScalar(radius + 5);
    marker.lookAt(lookAtVector);
    
    return marker;
  };
  
  const handleCloseInfo = () => {
    setSelectedLocation(null);
  };
  
  return (
    <div className="relative w-full h-screen">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Загрузка карты мира...</p>
          </div>
        </div>
      )}
      
      <div ref={containerRef} className="globe-container w-full h-full" />
      
      {/* Информация о выбранной локации */}
      {selectedLocation && (
        <div className="location-info absolute bottom-0 left-0 right-0 bg-background border-t border-border p-6 max-h-[80vh] overflow-y-auto">
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
          
          <LocationInfo location={selectedLocation} />
        </div>
      )}
    </div>
  );
};

export default WorldMap;
