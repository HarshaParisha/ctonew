import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import { MOOD_COLORS } from '../constants';

function GlobeCore() {
  const globeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const { globalStats } = useStore();
  const [pulseActive, setPulseActive] = useState(false);
  const lastTapCount = useRef(0);

  const dominantColor = useMemo(() => {
    if (!globalStats || !globalStats.countryData.length) {
      return '#4169E1';
    }
    const totalMoods = globalStats.countryData.reduce((acc, country) => {
      Object.entries(country.moods).forEach(([mood, count]) => {
        acc[mood] = (acc[mood] || 0) + count;
      });
      return acc;
    }, {} as { [key: string]: number });

    const dominant = Object.entries(totalMoods).sort(([, a], [, b]) => b - a)[0];
    return dominant ? MOOD_COLORS[dominant[0]] : '#4169E1';
  }, [globalStats]);

  useEffect(() => {
    if (globalStats && globalStats.totalTaps > lastTapCount.current) {
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 1000);
      lastTapCount.current = globalStats.totalTaps;
    }
  }, [globalStats]);

  const activityIntensity = useMemo(() => {
    if (!globalStats) return 0.5;
    return Math.min(1, (globalStats.totalTaps / 1000) + 0.3);
  }, [globalStats]);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
    if (glowRef.current) {
      const baseScale = 1.2;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      const activityBoost = pulseActive ? 0.15 : 0;
      const scale = baseScale + pulse + activityBoost;
      glowRef.current.scale.set(scale, scale, scale);
    }
    if (pulseRef.current) {
      if (pulseActive) {
        const progress = (state.clock.elapsedTime % 1);
        pulseRef.current.scale.set(1 + progress * 0.5, 1 + progress * 0.5, 1 + progress * 0.5);
        const material = pulseRef.current.material as THREE.MeshBasicMaterial;
        material.opacity = 1 - progress;
      } else {
        pulseRef.current.scale.set(0, 0, 0);
      }
    }
  });

  const glowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(dominantColor) },
          intensity: { value: 1.5 * activityIntensity },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float intensity;
          varying vec3 vNormal;
          void main() {
            float alpha = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(color, alpha * intensity);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      }),
    [dominantColor, activityIntensity]
  );

  const pulseMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: dominantColor,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide,
      }),
    [dominantColor]
  );

  return (
    <group>
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshPhongMaterial
          color={dominantColor}
          emissive={dominantColor}
          emissiveIntensity={0.3 + activityIntensity * 0.2}
          shininess={100}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Sphere ref={glowRef} args={[2.1, 64, 64]} material={glowMaterial} />
      <Sphere ref={pulseRef} args={[2.3, 64, 64]} material={pulseMaterial} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5 + activityIntensity * 0.3} color={dominantColor} />
    </group>
  );
}

function CameraSetup() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 6);
  }, [camera]);

  return null;
}

export default function Globe() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas>
        <CameraSetup />
        <GlobeCore />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
