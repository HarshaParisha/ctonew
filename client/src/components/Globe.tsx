import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import { MOOD_COLORS } from '../constants';

function GlobeCore() {
  const globeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { globalStats } = useStore();

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

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
    if (glowRef.current) {
      const scale = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  const glowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(dominantColor) },
          intensity: { value: 1.5 },
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
    [dominantColor]
  );

  return (
    <group>
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshPhongMaterial
          color={dominantColor}
          emissive={dominantColor}
          emissiveIntensity={0.3}
          shininess={100}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Sphere ref={glowRef} args={[2.1, 64, 64]} material={glowMaterial} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={dominantColor} />
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
