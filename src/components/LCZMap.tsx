import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Layers, Info, ChevronRight, ChevronDown,
  TreePine, Building2,
  Loader2, FlaskConical, BarChart3, Database, Cpu, X, Award
} from 'lucide-react';
import ChatBubble from './ChatBubble';

// Congreso CIMA 2025 photos
const congresoPhotos = [
  { id: 1, src: 'congreso-cima-2025/congreso-foto-1.png', alt: 'Exposición Congreso CIMA 2025' },
  { id: 2, src: 'congreso-cima-2025/congreso-foto-2.png', alt: 'Presentación LCZ CDMX' },
  { id: 3, src: 'congreso-cima-2025/congreso-foto-3.jpg', alt: 'Congreso CIMA 2025' },
  { id: 4, src: 'congreso-cima-2025/constancia-participacion.png', alt: 'Constancia de Participación' },
];

// Comprehensive LCZ data with all classification information
const lczTypes = [
  // Urban Built Types
  {
    id: 1,
    code: 'LCZ 1',
    name: 'Compacto Gran Altura',
    nameEn: 'Compact High-rise',
    color: '#8B0000',
    type: 'urban',
    image: 'lcz-fotos/LCZ1.jpg',
    area: 338.4,
    percentage: 13.50,
    f1Score: 0.90,
    precision: 84.00,
    recall: 96.90,
    pixels: 376031,
    height: '>25m',
    density: '40-60%',
    description: 'Mezcla densa de edificios altos (+25m). Distrito financiero y comercial de alta densidad.',
    climate: 'Alta absorción solar, retención térmica nocturna significativa, isla de calor intensa.',
    examples: 'Corredor Reforma-Polanco, Santa Fe'
  },
  {
    id: 2,
    code: 'LCZ 2',
    name: 'Compacto Altura Media',
    nameEn: 'Compact Midrise',
    color: '#CC0000',
    type: 'urban',
    image: 'lcz-fotos/LCZ2.jpg',
    area: 227.2,
    percentage: 9.10,
    f1Score: 0.71,
    precision: 78.60,
    recall: 64.70,
    pixels: 252456,
    height: '10-25m',
    density: '40-70%',
    description: 'Edificios de 3-9 pisos con configuración densa. Zonas residenciales consolidadas.',
    climate: 'Temperatura superficial alta, retención térmica moderada-alta.',
    examples: 'Centro Histórico, Roma Norte, Doctores'
  },
  {
    id: 3,
    code: 'LCZ 3',
    name: 'Compacto Baja Altura',
    nameEn: 'Compact Low-rise',
    color: '#FF0000',
    type: 'urban',
    image: 'lcz-fotos/LCZ3.png',
    area: 183.5,
    percentage: 7.30,
    f1Score: 0.83,
    precision: 84.20,
    recall: 82.10,
    pixels: 203863,
    height: '3-10m',
    density: '40-70%',
    description: 'Estructuras de 1-3 pisos densamente agrupadas. Barrios tradicionales.',
    climate: 'Calentamiento diurno significativo, enfriamiento nocturno más rápido.',
    examples: 'Tepito, La Merced, colonias populares'
  },
  {
    id: 4,
    code: 'LCZ 4',
    name: 'Abierto Gran Altura',
    nameEn: 'Open High-rise',
    color: '#FF6600',
    type: 'urban',
    image: 'lcz-fotos/LCZ4.png',
    area: 125.4,
    percentage: 5.00,
    f1Score: 0.84,
    precision: 78.40,
    recall: 90.90,
    pixels: 139349,
    height: '>25m',
    density: '20-40%',
    description: 'Torres aisladas con amplios espacios verdes entre edificios.',
    climate: 'Menor intensidad térmica, mejor ventilación, enfriamiento por vegetación.',
    examples: 'Tlatelolco, Torres de Mixcoac'
  },
  {
    id: 5,
    code: 'LCZ 5',
    name: 'Abierto Altura Media',
    nameEn: 'Open Midrise',
    color: '#FF9900',
    type: 'urban',
    image: 'lcz-fotos/LCZ5.jpg',
    area: 232.2,
    percentage: 9.30,
    f1Score: 0.92,
    precision: 93.10,
    recall: 90.00,
    pixels: 258004,
    height: '10-25m',
    density: '20-40%',
    description: 'Balance entre superficie construida y espacios abiertos. MEJOR DESEMPEÑO urbano.',
    climate: 'Temperatura moderada, enfriamiento evapotranspirativo significativo.',
    examples: 'Unidades habitacionales modernas, Coyoacán'
  },
  {
    id: 6,
    code: 'LCZ 6',
    name: 'Abierto Baja Altura',
    nameEn: 'Open Low-rise',
    color: '#FFCC00',
    type: 'urban',
    image: 'lcz-fotos/LCZ6.jpg',
    area: 41.8,
    percentage: 1.70,
    f1Score: 0.73,
    precision: 76.20,
    recall: 69.60,
    pixels: 46467,
    height: '3-10m',
    density: '20-40%',
    description: 'Viviendas unifamiliares con jardines. Suburbio residencial típico.',
    climate: 'Temperatura superficial baja, alto potencial de enfriamiento.',
    examples: 'Pedregal, Jardines del Pedregal'
  },
  {
    id: 7,
    code: 'LCZ 7',
    name: 'Ligero Baja Altura',
    nameEn: 'Lightweight Low-rise',
    color: '#FFFF00',
    type: 'urban',
    image: 'lcz-fotos/LCZ7.jpg',
    area: 105.1,
    percentage: 4.20,
    f1Score: 0.92,
    precision: 88.60,
    recall: 95.10,
    pixels: 116788,
    height: '2-4m',
    density: '60-90%',
    description: 'Estructuras ligeras: mercados, asentamientos informales. Materiales variables.',
    climate: 'Alta reflectancia metálica, calentamiento/enfriamiento rápido.',
    examples: 'Asentamientos informales, mercados sobre ruedas'
  },
  {
    id: 8,
    code: 'LCZ 8',
    name: 'Grande Baja Altura',
    nameEn: 'Large Low-rise',
    color: '#99CC00',
    type: 'urban',
    image: 'lcz-fotos/LCZ8.jpg',
    area: 122.0,
    percentage: 4.90,
    f1Score: 0.81,
    precision: 75.00,
    recall: 88.90,
    pixels: 135599,
    height: '3-10m',
    density: '30-50%',
    description: 'Naves industriales, centros comerciales, bodegas. MAYORES intensidades de isla de calor.',
    climate: 'Grandes superficies absorbentes, mínima vegetación. Prioridad mitigación.',
    examples: 'Central de Abastos, Zona Industrial Vallejo'
  },
  {
    id: 9,
    code: 'LCZ 9',
    name: 'Escasamente Construido',
    nameEn: 'Sparsely Built',
    color: '#669900',
    type: 'urban',
    image: 'lcz-fotos/LCZ9.jpg',
    area: 9.6,
    percentage: 0.40,
    f1Score: 0.13,
    precision: 33.30,
    recall: 7.70,
    pixels: 10713,
    height: '3-10m',
    density: '10-20%',
    description: 'Disposición dispersa en entorno natural. PEOR DESEMPEÑO de clasificación.',
    climate: 'Transición urbano-rural, microclimas muy variables.',
    examples: 'Periferias, Xochimilco disperso, Milpa Alta'
  },
  // Natural Types
  {
    id: 'A',
    code: 'LCZ A',
    name: 'Árboles Densos',
    nameEn: 'Dense Trees',
    color: '#006600',
    type: 'natural',
    image: 'lcz-fotos/LCZA.png',
    area: 541.2,
    percentage: 21.60,
    f1Score: 0.89,
    precision: 85.70,
    recall: 91.50,
    pixels: 601280,
    height: '>10m',
    coverage: '>90%',
    description: 'Bosque denso. CLASE MÁS EXTENSA del estudio (21.6% del territorio).',
    climate: 'ENFRIAMIENTO MÁXIMO, efecto evapotranspirativo, sombra continua.',
    examples: 'Desierto de los Leones, Ajusco, Bosque de Tlalpan'
  },
  {
    id: 'B',
    code: 'LCZ B',
    name: 'Árboles Dispersos',
    nameEn: 'Scattered Trees',
    color: '#009900',
    type: 'natural',
    image: 'lcz-fotos/B.png',
    area: 70.2,
    percentage: 2.80,
    f1Score: 0.71,
    precision: 61.50,
    recall: 84.20,
    pixels: 78036,
    height: '>10m',
    coverage: '30-60%',
    description: 'Bosque abierto con cobertura de dosel entre 30-60%.',
    climate: 'Enfriamiento significativo, variabilidad térmica moderada.',
    examples: 'Chapultepec, Parque Hundido'
  },
  {
    id: 'C',
    code: 'LCZ C',
    name: 'Arbustos',
    nameEn: 'Bush/Scrub',
    color: '#66CC00',
    type: 'natural',
    image: 'lcz-fotos/C.png',
    area: 100.8,
    percentage: 4.00,
    f1Score: 0.91,
    precision: 97.40,
    recall: 86.00,
    pixels: 112042,
    height: '<2m',
    coverage: '>90%',
    description: 'Vegetación arbustiva y matorrales. Zonas de transición ecológica.',
    climate: 'Enfriamiento moderado, sensible a cambios estacionales.',
    examples: 'Laderas del Ajusco, vegetación secundaria'
  },
  {
    id: 'D',
    code: 'LCZ D',
    name: 'Plantas Bajas',
    nameEn: 'Low Plants',
    color: '#99FF00',
    type: 'natural',
    image: 'lcz-fotos/D.png',
    area: 161.7,
    percentage: 6.50,
    f1Score: 0.86,
    precision: 87.80,
    recall: 83.70,
    pixels: 179645,
    height: '<1m',
    coverage: '>90%',
    description: 'Pastizal, agricultura urbana, parques de césped.',
    climate: 'Enfriamiento por evapotranspiración, alta variabilidad estacional.',
    examples: 'Campos deportivos, chinampas, zonas agrícolas'
  },
  {
    id: 'E',
    code: 'LCZ E',
    name: 'Roca/Pavimento',
    nameEn: 'Bare Rock/Paved',
    color: '#999999',
    type: 'natural',
    image: 'lcz-fotos/E.png',
    area: 21.5,
    percentage: 0.90,
    f1Score: 0.87,
    precision: 100.00,
    recall: 76.70,
    pixels: 23933,
    coverage: '<10%',
    description: 'Roca expuesta o pavimento. Sin vegetación.',
    climate: 'Calentamiento diurno extremo, enfriamiento nocturno rápido.',
    examples: 'AICM, grandes estacionamientos, autopistas'
  },
  {
    id: 'F',
    code: 'LCZ F',
    name: 'Suelo Desnudo',
    nameEn: 'Bare Soil/Sand',
    color: '#CC9966',
    type: 'natural',
    image: 'lcz-fotos/F.jpg',
    area: 179.1,
    percentage: 7.20,
    f1Score: 0.76,
    precision: 81.30,
    recall: 72.20,
    pixels: 198981,
    coverage: '<10%',
    description: 'Suelo o arena expuesta. Terrenos baldíos, áreas en construcción.',
    climate: 'Calentamiento diurno significativo, sin efecto evaporativo.',
    examples: 'Terrenos baldíos, zonas degradadas'
  },
  {
    id: 'G',
    code: 'LCZ G',
    name: 'Agua',
    nameEn: 'Water',
    color: '#0066FF',
    type: 'natural',
    image: 'lcz-fotos/G.jpg',
    area: 43.9,
    percentage: 1.80,
    f1Score: 0.89,
    precision: 100.00,
    recall: 79.40,
    pixels: 48800,
    description: 'Cuerpos de agua superficiales. MÁXIMO EFECTO REGULADOR térmico.',
    climate: 'Alta inercia térmica, temperatura estable, enfriamiento por evaporación.',
    examples: 'Lago de Xochimilco, canales, presas'
  }
];

// Algorithm comparison data
const algorithms = [
  { name: 'Gradient Tree Boost', accuracy: 83.65, kappa: 0.824, rank: 1, stars: 5, status: 'Óptimo', color: 'text-green-600' },
  { name: 'Random Forest', accuracy: 80.21, kappa: 0.787, rank: 2, stars: 4, status: 'Excelente', color: 'text-blue-600' },
  { name: 'CART', accuracy: 70.22, kappa: 0.679, rank: 3, stars: 3, status: 'Aceptable', color: 'text-yellow-600' },
  { name: 'Minimum Distance', accuracy: 46.30, kappa: 0.425, rank: 4, stars: 2, status: 'Limitado', color: 'text-orange-600' },
  { name: 'Naive Bayes', accuracy: 45.27, kappa: 0.414, rank: 5, stars: 2, status: 'Limitado', color: 'text-orange-600' },
  { name: 'SVM (RBF)', accuracy: 17.56, kappa: 0.075, rank: 6, stars: 1, status: 'Inadecuado', color: 'text-red-600' },
];

// Methodology data
const methodology = {
  platform: 'Google Earth Engine (GEE)',
  algorithm: 'Gradient Tree Boost',
  satellite: 'Landsat 9 OLI-2 TIRS-2',
  resolution: '30 metros',
  period: 'Dic 2023 - Abr 2025',
  area: '2,226 km²',
  images: '47 imágenes bienales',
  samples: '1,949 polígonos (~58,470 píxeles)',
  validation: '70% entrenamiento / 30% validación',
  bands: ['SR_B1 (Aerosol)', 'SR_B2 (Azul)', 'SR_B3 (Verde)', 'SR_B4 (Rojo)', 'SR_B5 (NIR)', 'SR_B6 (SWIR1)', 'SR_B7 (SWIR2)', 'ST_B10 (Térmico)'],
  indices: ['NDVI (Vegetación)', 'NDBI (Construcción)', 'NDWI (Agua)', 'BSI (Suelo)', 'UI (Urbano)'],
  topography: ['Elevación SRTM', 'Pendiente', 'Aspecto'],
  totalVariables: 16
};

export function LCZMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const lczLayerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [tifLoaded, setTifLoaded] = useState(false);
  const [selectedLCZ, setSelectedLCZ] = useState<typeof lczTypes[0] | null>(null);
  const [activeTab, setActiveTab] = useState('legend');
  const [expandedSection, setExpandedSection] = useState<string | null>('urban');
  const [baseMap, setBaseMap] = useState<'street' | 'satellite'>('satellite');
  const [lczOpacity, setLczOpacity] = useState(30);
  const [congresoOpen, setCongresoOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<typeof congresoPhotos[0] | null>(null);
  const congresoRef = useRef<HTMLDivElement>(null);

  // Scroll detection for Congreso section
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

          if (!congresoRef.current) {
            ticking = false;
            return;
          }

          const rect = congresoRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          const inExpandZone = rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3;

          if (inExpandZone && !congresoOpen && scrollDirection === 'down') {
            setCongresoOpen(true);
          }
          else if (scrollDirection === 'up' && congresoOpen && rect.top > viewportHeight * 0.5) {
            setCongresoOpen(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [congresoOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      setLoading(true);

      Promise.all([
        import('leaflet'),
        import('leaflet/dist/leaflet.css'),
        import('georaster'),
        import('georaster-layer-for-leaflet'),
      ]).then(async ([L, _, parseGeoraster, GeoRasterLayer]) => {

        const map = L.map(mapRef.current!, {
          center: [19.4326, -99.1332],
          zoom: 10,
          zoomControl: true,
        });

        mapInstanceRef.current = map;

        const streetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '© CartoDB © OpenStreetMap',
          maxZoom: 19,
          subdomains: 'abcd',
        });

        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri',
          maxZoom: 18,
        });

        satelliteLayer.addTo(map);

        (map as any)._baseLayers = { street: streetLayer, satellite: satelliteLayer };
        (map as any)._currentBase = 'satellite';

        try {
          const tifUrl = `${import.meta.env.BASE_URL}lcz-cdmx.tif`;
          const response = await fetch(tifUrl);
          const arrayBuffer = await response.arrayBuffer();
          const georaster = await parseGeoraster.default(arrayBuffer);

          const colorMap = (values: number[]) => {
            const value = values[0];
            if (value === 0 || value === null || value === undefined) {
              return 'rgba(0,0,0,0)';
            }
            // Valores 1-9: LCZ urbanos (1-9)
            // Valores 11-17: LCZ naturales (A-G)
            const lcz = lczTypes.find(t => t.id === Math.round(value) || t.id === String.fromCharCode(64 + Math.round(value) - 10));
            if (lcz) return lcz.color;
            return '#999999';
          };

          const lczLayer = new GeoRasterLayer.default({
            georaster: georaster,
            opacity: 0.30,
            pixelValuesToColorFn: colorMap,
            resolution: 256,
          });

          lczLayer.addTo(map);
          lczLayerRef.current = lczLayer;
          setTifLoaded(true);
          setLoading(false);

        } catch (error) {
          console.error('Error loading GeoTIFF:', error);
          setLoading(false);
        }

        L.control.scale({ metric: true, imperial: false }).addTo(map);

      }).catch(error => {
        console.error('Error initializing map:', error);
        setLoading(false);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle base map change
  useEffect(() => {
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      const layers = (map as any)._baseLayers;
      const currentBase = (map as any)._currentBase;

      if (layers && currentBase !== baseMap) {
        map.removeLayer(layers[currentBase]);
        layers[baseMap].addTo(map);
        layers[baseMap].bringToBack();
        (map as any)._currentBase = baseMap;
      }
    }
  }, [baseMap]);

  // Handle LCZ opacity change
  useEffect(() => {
    if (lczLayerRef.current) {
      lczLayerRef.current.setOpacity(lczOpacity / 100);
    }
  }, [lczOpacity]);

  const urbanTypes = lczTypes.filter(l => l.type === 'urban');
  const naturalTypes = lczTypes.filter(l => l.type === 'natural');

  return (
    <div className="py-8 px-4 min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8 relative">
            <a
              href="https://daniel9romero.github.io/Portafolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-0 right-0 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-all border border-gray-700"
            >
              Contacto
            </a>
            <Badge variant="outline" className="mb-4">Proyecto de Investigación</Badge>
            <h1 className="text-4xl font-bold mb-2">
              Clasificación LCZ de la Ciudad de México
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              José Daniel López Romero
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              Local Climate Zones - Zonas Climáticas Locales
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge className="bg-green-600">83.65% Precisión</Badge>
              <Badge variant="outline">Kappa: 0.824</Badge>
              <Badge variant="outline">16 Clases</Badge>
              {tifLoaded && <Badge className="bg-blue-600">GeoTIFF Cargado</Badge>}
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Database className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">47</p>
                <p className="text-xs text-gray-500">Imágenes Landsat 9</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FlaskConical className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">16</p>
                <p className="text-xs text-gray-500">Variables Espectrales</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Cpu className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">GTB</p>
                <p className="text-xs text-gray-500">Gradient Tree Boost</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold">~2.8M</p>
                <p className="text-xs text-gray-500">Píxeles Clasificados</p>
              </CardContent>
            </Card>
          </div>

          {/* Map + Legend Row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Map Container */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Mapa Interactivo LCZ
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <div ref={mapRef} className="h-[500px] w-full relative" style={{ zIndex: 0 }} />

                    {loading && (
                      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Cargando mapa y GeoTIFF...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t flex items-center justify-between gap-4 flex-wrap">
                    {/* Base Map Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Vista:</span>
                      <div className="flex rounded-lg overflow-hidden border">
                        <button
                          onClick={() => setBaseMap('street')}
                          className={`px-3 py-1.5 text-xs font-medium transition-colors ${baseMap === 'street' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                          Mapa
                        </button>
                        <button
                          onClick={() => setBaseMap('satellite')}
                          className={`px-3 py-1.5 text-xs font-medium transition-colors ${baseMap === 'satellite' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                          Satélite
                        </button>
                      </div>
                    </div>

                    {/* LCZ Opacity */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">LCZ:</span>
                      <Slider
                        value={[lczOpacity]}
                        onValueChange={(v: number[]) => setLczOpacity(v[0])}
                        max={100}
                        min={0}
                        step={5}
                        className="w-24"
                      />
                      <span className="text-xs text-gray-500 w-8">{lczOpacity}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <TabsList className="w-full">
                    <TabsTrigger value="legend" className="flex-1">Leyenda</TabsTrigger>
                    <TabsTrigger value="methodology" className="flex-1">Metodología</TabsTrigger>
                  </TabsList>

                  <TabsContent value="legend" className="mt-2 flex-1">
                    <Card className="h-[570px] flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Clases LCZ (16 tipos)</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto">
                        {/* Urban Section */}
                        <button
                          onClick={() => setExpandedSection(expandedSection === 'urban' ? null : 'urban')}
                          className="w-full flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                        >
                          <span className="flex items-center gap-2 font-semibold text-sm">
                            <Building2 className="h-4 w-4" />
                            Urbano Construido (9)
                          </span>
                          {expandedSection === 'urban' ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                        <AnimatePresence>
                          {expandedSection === 'urban' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              {urbanTypes.map(lcz => (
                                <div
                                  key={lcz.id}
                                  onClick={() => setSelectedLCZ(lcz)}
                                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer ml-4 group"
                                >
                                  <div className="w-10 h-10 rounded flex-shrink-0 border overflow-hidden relative">
                                    <img
                                      src={`${import.meta.env.BASE_URL}${lcz.image}`}
                                      alt={lcz.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                    <div className="hidden absolute inset-0 rounded" style={{ backgroundColor: lcz.color }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{lcz.code}: {lcz.name}</p>
                                    <p className="text-xs text-gray-500">{lcz.percentage}% | F1: {lcz.f1Score}</p>
                                  </div>
                                  <Info className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Natural Section */}
                        <button
                          onClick={() => setExpandedSection(expandedSection === 'natural' ? null : 'natural')}
                          className="w-full flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded mt-2"
                        >
                          <span className="flex items-center gap-2 font-semibold text-sm">
                            <TreePine className="h-4 w-4" />
                            Cobertura Natural (7)
                          </span>
                          {expandedSection === 'natural' ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                        <AnimatePresence>
                          {expandedSection === 'natural' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              {naturalTypes.map(lcz => (
                                <div
                                  key={lcz.id}
                                  onClick={() => setSelectedLCZ(lcz)}
                                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer ml-4 group"
                                >
                                  <div className="w-10 h-10 rounded flex-shrink-0 border overflow-hidden relative">
                                    <img
                                      src={`${import.meta.env.BASE_URL}${lcz.image}`}
                                      alt={lcz.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                    <div className="hidden absolute inset-0 rounded" style={{ backgroundColor: lcz.color }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{lcz.code}: {lcz.name}</p>
                                    <p className="text-xs text-gray-500">{lcz.percentage}% | F1: {lcz.f1Score}</p>
                                  </div>
                                  <Info className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="methodology" className="mt-2 flex-1">
                    <Card className="h-[570px] flex flex-col">
                      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Satellite Data */}
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Database className="h-4 w-4 text-blue-600" />
                            Datos Satelitales
                          </h4>
                          <div className="text-xs space-y-1 ml-6">
                            <p><strong>Sensor:</strong> {methodology.satellite}</p>
                            <p><strong>Resolución:</strong> {methodology.resolution}</p>
                            <p><strong>Período:</strong> {methodology.period}</p>
                            <p><strong>Imágenes:</strong> {methodology.images}</p>
                            <p><strong>Área:</strong> {methodology.area}</p>
                          </div>
                        </div>

                        {/* Variables */}
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <FlaskConical className="h-4 w-4 text-green-600" />
                            Variables ({methodology.totalVariables})
                          </h4>
                          <div className="text-xs ml-6">
                            <p className="font-medium mb-1">8 Bandas Espectrales:</p>
                            <p className="text-gray-500 mb-2">{methodology.bands.join(', ')}</p>
                            <p className="font-medium mb-1">5 Índices:</p>
                            <p className="text-gray-500 mb-2">{methodology.indices.join(', ')}</p>
                            <p className="font-medium mb-1">3 Topográficas:</p>
                            <p className="text-gray-500">{methodology.topography.join(', ')}</p>
                          </div>
                        </div>

                        {/* Training */}
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-purple-600" />
                            Entrenamiento
                          </h4>
                          <div className="text-xs space-y-1 ml-6">
                            <p><strong>Muestras:</strong> {methodology.samples}</p>
                            <p><strong>División:</strong> {methodology.validation}</p>
                            <p><strong>Validación:</strong> Validación cruzada estratificada</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
            </div>
          </div>

          {/* Algorithm Comparison */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Comparación de Algoritmos
              </CardTitle>
              <CardDescription>Rendimiento de 6 algoritmos de clasificación supervisada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {algorithms.map((algo, idx) => (
                  <div key={algo.name} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-green-600 text-white' : idx === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      {algo.rank}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{algo.name}</span>
                        <span className={`text-sm font-bold ${algo.color}`}>{algo.accuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${idx === 0 ? 'bg-green-600' : idx === 1 ? 'bg-blue-600' : 'bg-gray-400'}`}
                          style={{ width: `${algo.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Congreso CIMA 2025 Section */}
          <motion.div
            ref={congresoRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer"
              onClick={() => setCongresoOpen(!congresoOpen)}
            >
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-lg">Congreso CIMA 2025</div>
                  <div className="text-sm opacity-90 font-normal">Exposición: Clasificación LCZ en CDMX</div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: congresoOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </div>

            <AnimatePresence>
              {congresoOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      Presentación del proyecto de clasificación de Zonas Climáticas Locales (LCZ) para la Ciudad de México
                      utilizando imágenes Landsat 9 y técnicas de Machine Learning.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {congresoPhotos.map((photo) => (
                        <motion.div
                          key={photo.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="cursor-pointer relative group overflow-hidden rounded-lg shadow-md"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <img
                            src={`${import.meta.env.BASE_URL}${photo.src}`}
                            alt={photo.alt}
                            className="w-full h-24 md:h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium px-2 text-center">
                              {photo.alt}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Photo Modal for Congreso */}
          <AnimatePresence>
            {selectedPhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedPhoto(null)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative max-w-4xl max-h-[90vh] w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <img
                    src={`${import.meta.env.BASE_URL}${selectedPhoto.src}`}
                    alt={selectedPhoto.alt}
                    className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                  />
                  <p className="text-white text-center mt-3 text-sm">{selectedPhoto.alt}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LCZ Detail Modal */}
          <AnimatePresence>
            {selectedLCZ && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedLCZ(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-12 rounded-lg"
                          style={{ backgroundColor: selectedLCZ.color }}
                        />
                        <div>
                          <h3 className="font-bold text-lg">{selectedLCZ.code}</h3>
                          <p className="text-sm text-gray-500">{selectedLCZ.name}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLCZ(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* LCZ Image */}
                    <div className="mb-4 rounded-lg overflow-hidden border">
                      <img
                        src={`${import.meta.env.BASE_URL}${selectedLCZ.image}`}
                        alt={selectedLCZ.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.parentElement!.style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
                        <p className="text-xl font-bold text-blue-600">{selectedLCZ.area} km²</p>
                        <p className="text-xs text-gray-500">Área</p>
                      </div>
                      <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
                        <p className="text-xl font-bold text-green-600">{selectedLCZ.percentage}%</p>
                        <p className="text-xs text-gray-500">Cobertura</p>
                      </div>
                      <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
                        <p className="text-xl font-bold text-purple-600">{selectedLCZ.f1Score}</p>
                        <p className="text-xs text-gray-500">F1-Score</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-1">Descripción</h4>
                        <p className="text-gray-600 dark:text-gray-400">{selectedLCZ.description}</p>
                      </div>

                      {selectedLCZ.height && (
                        <div>
                          <h4 className="font-semibold mb-1">Características Físicas</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            Altura: {selectedLCZ.height}
                            {selectedLCZ.density && ` | Densidad: ${selectedLCZ.density}`}
                            {selectedLCZ.coverage && ` | Cobertura: ${selectedLCZ.coverage}`}
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-1">Comportamiento Climático</h4>
                        <p className="text-gray-600 dark:text-gray-400">{selectedLCZ.climate}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">Ejemplos en CDMX</h4>
                        <p className="text-gray-600 dark:text-gray-400">{selectedLCZ.examples}</p>
                      </div>

                      <div className="pt-2 border-t">
                        <h4 className="font-semibold mb-2">Métricas de Clasificación</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <p><strong>Precisión Usuario:</strong> {selectedLCZ.precision}%</p>
                          <p><strong>Exhaustividad:</strong> {selectedLCZ.recall}%</p>
                          <p><strong>Píxeles:</strong> {selectedLCZ.pixels?.toLocaleString()}</p>
                          <p><strong>F1-Score:</strong> {selectedLCZ.f1Score}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <footer className="mt-12 text-center text-sm text-gray-500 border-t pt-6">
            <p>Proyecto de Investigación - Clasificación de Zonas Climáticas Locales</p>
            <p className="mt-1">Ciudad de México | Landsat 9 | Google Earth Engine</p>
          </footer>
        </motion.div>
      </div>

      {/* Chat Bubble */}
      <ChatBubble />

    </div>
  );
}

export default LCZMap;
