import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Html } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Camera, Eye, RotateCw, RefreshCw, Maximize2, Minimize2, 
  Sun, Moon, Flame, Rocket, Disc, AlertCircle, Info, UploadCloud, CheckCircle
} from 'lucide-react';
import { audioService } from '../utils/audioSynth';
import { useLanguage } from '../utils/LanguageContext';
import { resolveAsset } from '../utils/assetHelper';

// Procedural Thruster Particle Component
function ThrusterParticles({ active }) {
  const pointsRef = useRef();
  const particleCount = 140;

  const [positions, colors] = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const colorCyan = new THREE.Color('#00BFFF');
    const colorOrange = new THREE.Color('#FF4500');

    for (let i = 0; i < particleCount; i++) {
      // Rear nozzle area offsets (rear is along -Z)
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.7;
      pos[i * 3 + 1] = 0.28 + (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 2] = -2.1 - Math.random() * 1.8;

      const mixed = Math.random() > 0.4 ? colorCyan : colorOrange;
      col[i * 3 + 0] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !active) return;
    const posArray = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 2] -= delta * (4.0 + Math.random() * 5.0);
      posArray[i * 3 + 0] += (Math.random() - 0.5) * 0.08;
      posArray[i * 3 + 1] += (Math.random() - 0.5) * 0.08;

      if (posArray[i * 3 + 2] < -5.5) {
        posArray[i * 3 + 0] = (Math.random() - 0.5) * 0.7;
        posArray[i * 3 + 1] = 0.28 + (Math.random() - 0.5) * 0.15;
        posArray[i * 3 + 2] = -2.1;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3D Roadster Car Model Component
function RoadsterModel({ 
  modelUrl, 
  activeColor, 
  isWheelsSpinning, 
  thrusterElevating, 
  doorsOpen 
}) {
  const { scene } = useGLTF(modelUrl);
  const carGroupRef = useRef();
  const wheelsRef = useRef([]);

  // Apply materials and collect wheel nodes
  useEffect(() => {
    if (!scene) return;

    wheelsRef.current = [];
    const colorHex = activeColor?.hex || '#B30006';
    const roughness = activeColor?.roughness ?? 0.15;
    const metalness = activeColor?.metalness ?? 0.5;
    const isDiamondSparkle = activeColor?.sparkle || false;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const meshName = child.name.toLowerCase();
        if (meshName.includes('wheel') || meshName.includes('tire') || meshName.includes('rim') || meshName.includes('disc') || meshName.includes('object_6') || meshName.includes('object_7') || meshName.includes('object_8') || meshName.includes('object_9') || meshName.includes('object_10') || meshName.includes('object_11') || meshName.includes('object_12')) {
          wheelsRef.current.push(child);
        } else {
          if (child.material) {
            if (!child.userData.originalMaterial) {
              child.userData.originalMaterial = child.material.clone();
            }
            const mat = child.material;
            if (mat.color) {
              mat.color.set(colorHex);
            }
            mat.roughness = roughness;
            mat.metalness = metalness;
            if (mat.clearcoat !== undefined) {
              mat.clearcoat = 1.0;
              mat.clearcoatRoughness = isDiamondSparkle ? 0.2 : 0.05;
            }
            mat.needsUpdate = true;
          }
        }
      }
    });
  }, [scene, activeColor]);

  // Frame loop for kinematics: wheel spin, thruster hovering, door illustrative lift
  useFrame((state, delta) => {
    if (!carGroupRef.current) return;

    // 1. Wheel spin animation on model meshes
    if (isWheelsSpinning) {
      wheelsRef.current.forEach((wheel) => {
        wheel.rotation.x += delta * 14;
      });
    }

    // 2. Thruster vertical levitation & subtle pitch oscillation
    if (thrusterElevating) {
      const hoverY = 0.55 + Math.sin(state.clock.elapsedTime * 6) * 0.04;
      const hoverTilt = Math.sin(state.clock.elapsedTime * 4) * 0.02;
      carGroupRef.current.position.y = THREE.MathUtils.lerp(carGroupRef.current.position.y, hoverY, delta * 3);
      carGroupRef.current.rotation.x = THREE.MathUtils.lerp(carGroupRef.current.rotation.x, -hoverTilt, delta * 3);
    } else {
      carGroupRef.current.position.y = THREE.MathUtils.lerp(carGroupRef.current.position.y, 0, delta * 4);
      carGroupRef.current.rotation.x = THREE.MathUtils.lerp(carGroupRef.current.rotation.x, 0, delta * 4);
    }

    // 3. Illustrative canopy / door inspection mode
    if (doorsOpen && !thrusterElevating) {
      carGroupRef.current.position.y = THREE.MathUtils.lerp(carGroupRef.current.position.y, 0.15, delta * 4);
    }
  });

  return (
    <group ref={carGroupRef}>
      <Center top>
        <primitive 
          object={scene} 
          scale={0.065} 
          rotation={[0, -Math.PI / 2, 0]}
        />
      </Center>
      <ThrusterParticles active={thrusterElevating} />
    </group>
  );
}

// Camera Controller for smooth preset transitions
function CameraController({ targetPosition, targetLookAt, autoRotate }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (targetPosition) {
      camera.position.set(targetPosition[0], targetPosition[1], targetPosition[2]);
      if (controlsRef.current) {
        controlsRef.current.target.set(targetLookAt[0], targetLookAt[1], targetLookAt[2]);
        controlsRef.current.update();
      }
    }
  }, [targetPosition, targetLookAt, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 - 0.02}
      minDistance={1.8}
      maxDistance={9.0}
      autoRotate={autoRotate}
      autoRotateSpeed={1.8}
    />
  );
}

export default function ThreeViewer({ viewerData, selectedColor, onSelectColor }) {
  const { t, isRTL, lang } = useLanguage();
  const containerRef = useRef(null);

  const initialModel = resolveAsset(viewerData?.modelAsset?.path || "/assets/roadster-model.glb");
  const [modelUrl, setModelUrl] = useState(initialModel);
  const [activePreset, setActivePreset] = useState("default");
  const [lightingMode, setLightingMode] = useState("studio"); // 'studio', 'cyber', 'sunset'
  const [autoRotate, setAutoRotate] = useState(false);
  const [isWheelsSpinning, setIsWheelsSpinning] = useState(false);
  const [thrusterElevating, setThrusterElevating] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [doorDisclosureOpen, setDoorDisclosureOpen] = useState(false);
  const [customModelLoaded, setCustomModelLoaded] = useState(false);

  // Camera presets coordinates:
  // Front: +Z, Rear: -Z, Left: -X, Right: +X
  const cameraPresets = {
    default: { pos: [3.4, 1.3, 3.4], look: [0, 0.4, 0] },
    front: { pos: [0, 0.9, 4.4], look: [0, 0.4, 0] },
    rear: { pos: [0, 1.1, -4.4], look: [0, 0.4, 0] },
    side_left: { pos: [-4.4, 0.9, 0], look: [0, 0.4, 0] },
    side_right: { pos: [4.4, 0.9, 0], look: [0, 0.4, 0] },
    top: { pos: [0, 5.0, 0.05], look: [0, 0.3, 0] },
    cockpit: { pos: [0.35, 0.85, 0.15], look: [0.1, 0.7, 0.6] }
  };

  // Fullscreen event listener and Escape key handling
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (document.fullscreenElement || document.webkitFullscreenElement)) {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Thruster demo triggers synchronous sound, particle, light, and kinematics
  const handleActivateThruster = () => {
    if (thrusterElevating) {
      setThrusterElevating(false);
      audioService.stopAll();
      return;
    }
    setThrusterElevating(true);
    audioService.playThrusterSound(() => {
      setThrusterElevating(false);
    });
  };

  const handleCustomModelUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      const blobUrl = URL.createObjectURL(file);
      setModelUrl(blobUrl);
      setCustomModelLoaded(true);
    }
  };

  // Lighting configurations
  const lightingConfigs = {
    studio: {
      bg: '#0A0E17',
      ambient: 0.9,
      keyColor: '#FFFFFF',
      keyIntensity: 1.8,
      keyPos: [5, 6, 5],
      accentColor: '#00BFFF',
      accentIntensity: 1.2,
      accentPos: [-5, 3, -4],
      floorColor: '#0F172A'
    },
    cyber: {
      bg: '#04060E',
      ambient: 0.5,
      keyColor: '#00E5FF',
      keyIntensity: 2.2,
      keyPos: [4, 5, 4],
      accentColor: '#FF007F',
      accentIntensity: 2.0,
      accentPos: [-4, 4, -4],
      floorColor: '#080518'
    },
    sunset: {
      bg: '#1A0E1A',
      ambient: 0.8,
      keyColor: '#FFA726',
      keyIntensity: 2.0,
      keyPos: [5, 4, 3],
      accentColor: '#AB47BC',
      accentIntensity: 1.5,
      accentPos: [-4, 2, -5],
      floorColor: '#1F101A'
    }
  };

  const currentLighting = lightingConfigs[lightingMode];

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-lg flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[620px] sm:h-[700px]'
      }`}
      style={{ backgroundColor: currentLighting.bg }}
    >
      {/* 3D Canvas Viewport */}
      <div className="relative w-full flex-1">
        <Canvas
          shadows
          camera={{ position: [3.4, 1.3, 3.4], fov: 42 }}
          gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
          className="w-full h-full"
        >
          <color attach="background" args={[currentLighting.bg]} />

          {/* Dynamic Studio Lighting */}
          <ambientLight intensity={currentLighting.ambient} />
          <directionalLight
            position={currentLighting.keyPos}
            intensity={currentLighting.keyIntensity}
            color={currentLighting.keyColor}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={currentLighting.accentPos}
            intensity={currentLighting.accentIntensity}
            color={currentLighting.accentColor}
          />
          <pointLight position={[0, 4, 0]} intensity={0.6} color="#FFFFFF" />

          {/* Active Thruster Exhaust Glow Lights */}
          {thrusterElevating && (
            <>
              <pointLight position={[0, 0.35, -2.2]} intensity={5.0} distance={4} color="#00BFFF" />
              <pointLight position={[0, 0.35, -2.4]} intensity={4.0} distance={3} color="#FF4500" />
            </>
          )}

          {/* Ground Grid & Shadow Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial 
              color={currentLighting.floorColor} 
              roughness={0.85} 
              metalness={0.1}
            />
          </mesh>
          <gridHelper args={[30, 30, '#00BFFF', '#1E293B']} position={[0, 0, 0]} />

          {/* 3D Roadster Model with Kinematics */}
          <Suspense fallback={
            <Html center>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/90 text-white border border-blue-500/30">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-xs font-semibold">{t('common.loading')}</span>
              </div>
            </Html>
          }>
            <RoadsterModel
              modelUrl={modelUrl}
              activeColor={selectedColor}
              isWheelsSpinning={isWheelsSpinning}
              thrusterElevating={thrusterElevating}
              doorsOpen={doorsOpen}
            />
          </Suspense>

          {/* Orbit Controls & Camera Mover */}
          <CameraController
            targetPosition={cameraPresets[activePreset].pos}
            targetLookAt={cameraPresets[activePreset].look}
            autoRotate={autoRotate}
          />
        </Canvas>

        {/* Thruster Demo Floating Banner */}
        {thrusterElevating && (
          <div className="absolute top-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 bg-red-600/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-2xl flex items-center justify-center gap-2 border border-red-400 animate-pulse text-xs sm:text-sm font-bold z-20">
            <Rocket className="w-4 h-4" />
            <span>{t('home.thrusterDisclaimerTag')}</span>
          </div>
        )}

        {/* Top Control Bar: Lighting Presets & Fullscreen */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <div className="bg-black/60 backdrop-blur-md p-1 rounded-xl flex items-center border border-white/10 shadow-lg text-white text-xs">
            <button
              onClick={() => setLightingMode('studio')}
              className={`p-1.5 rounded-lg transition ${lightingMode === 'studio' ? 'bg-[#007BFF] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Studio Softbox"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLightingMode('cyber')}
              className={`p-1.5 rounded-lg transition ${lightingMode === 'cyber' ? 'bg-[#007BFF] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Cyber Neon"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLightingMode('sunset')}
              className={`p-1.5 rounded-lg transition ${lightingMode === 'sunset' ? 'bg-[#007BFF] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Sunset Glow"
            >
              <Flame className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl border border-white/10 shadow-lg transition"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Model Attribution & Upload Badge */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg text-white text-[11px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{customModelLoaded ? "Custom 3D Model Loaded" : "Tesla Roadster 2.0 (CC-BY 4.0)"}</span>
          </div>

          {/* Model upload control */}
          <label className="bg-black/40 hover:bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-slate-300 hover:text-white text-[10px] cursor-pointer flex items-center gap-1.5 transition">
            <UploadCloud className="w-3 h-3 text-[#00BFFF]" />
            <span>Upload .GLB</span>
            <input 
              type="file" 
              accept=".glb,.gltf" 
              onChange={handleCustomModelUpload}
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* Interactive Controls Dock (Camera Presets & Kinematic Actions) */}
      <div className="bg-black/85 backdrop-blur-xl border-t border-white/10 p-3 sm:p-4 text-white flex flex-col gap-3">
        {/* Camera Views Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-[#00BFFF]" />
            <span>{t('viewer.cameraViews')}:</span>
          </span>
          {Object.keys(cameraPresets).map((presetKey) => (
            <button
              key={presetKey}
              onClick={() => {
                setActivePreset(presetKey);
                setAutoRotate(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg font-medium shrink-0 transition ${
                activePreset === presetKey && !autoRotate
                  ? 'bg-[#007BFF] text-white shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              {lang === 'ar' ? (viewerData?.cameraPresets?.find(p => p.id === presetKey)?.name_ar || presetKey) : (viewerData?.cameraPresets?.find(p => p.id === presetKey)?.name || presetKey)}
            </button>
          ))}

          {/* 360 Auto-Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1.5 rounded-lg font-medium shrink-0 flex items-center gap-1.5 transition ${
              autoRotate ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>360°</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={() => {
              setActivePreset('default');
              setAutoRotate(false);
            }}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 transition"
            title="Reset Camera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Kinematic Action Buttons (Wheel Spin, Doors, Thruster Demo) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
          {/* Wheel Spin Toggle */}
          <button
            onClick={() => setIsWheelsSpinning(!isWheelsSpinning)}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
              isWheelsSpinning 
                ? 'bg-[#007BFF] text-white ring-2 ring-[#00BFFF]' 
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <Disc className={`w-4 h-4 ${isWheelsSpinning ? 'animate-spin text-white' : 'text-[#00BFFF]'}`} />
            <span>{isWheelsSpinning ? t('viewer.stopWheels') : t('viewer.startWheels')}</span>
          </button>

          {/* Doors Control with Monocoque Disclosure */}
          <button
            onClick={() => {
              setDoorsOpen(!doorsOpen);
              setDoorDisclosureOpen(true);
            }}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
              doorsOpen 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4 text-purple-300" />
            <span>{doorsOpen ? t('viewer.closeDoors') : t('viewer.openDoors')}</span>
          </button>

          {/* Thruster Demo Button */}
          <button
            onClick={handleActivateThruster}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
              thrusterElevating 
                ? 'bg-red-600 text-white animate-pulse shadow-lg' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>{thrusterElevating ? t('viewer.thrusterActive') : t('viewer.activateThruster')}</span>
          </button>
        </div>

        {/* Door Model Geometry Disclosure Notice */}
        {doorDisclosureOpen && (
          <div className="flex items-start justify-between gap-2 p-2 bg-slate-900/90 rounded-lg border border-purple-500/30 text-[11px] text-slate-300">
            <div className="flex items-start gap-1.5">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>{t('viewer.doorsNotice')}</span>
            </div>
            <button 
              onClick={() => setDoorDisclosureOpen(false)}
              className="text-slate-400 hover:text-white px-1.5 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
