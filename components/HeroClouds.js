"use client";

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// --- Shared Material ---
const solidMaterial = new THREE.MeshPhysicalMaterial({
    color: "#ff8a65",
    emissive: "#bf360c",
    emissiveIntensity: 0.2,
    roughness: 0.3,
    metalness: 0.1,
    reflectivity: 0.5,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
});

// --- GLB Model Component ---
function GLBModel({ url, position, rotation, scale = 1 }) {
    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => {
        const s = scene.clone();

        // Auto-center the model
        const box = new THREE.Box3().setFromObject(s);
        const center = box.getCenter(new THREE.Vector3());

        s.position.x = -center.x;
        s.position.y = -center.y;
        s.position.z = -center.z;

        return s;
    }, [scene]);

    useEffect(() => {
        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.material = solidMaterial;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [clonedScene]);

    return (
        <group position={position} rotation={rotation} scale={scale}>
            <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6}>
                <primitive object={clonedScene} />
            </Float>
        </group>
    );
}

function Scene({ scrollY }) {
    const groupRef = useRef();

    return (
        <group ref={groupRef}>
            {/* 
                Camera GLB - Left 
                Scale reduced ~20% (0.08 -> 0.065)
             */}
            <GLBModel
                url="/camera.glb"
                position={[-8.5, 1, -2]}
                rotation={[0.4, 0.6, 0.2]}
                scale={0.065}
            />

            {/* 
                Drill GLB - Right 
                Scale reduced ~20% (0.05 -> 0.04)
             */}
            <GLBModel
                url="/drill.glb"
                position={[8.5, 0, -2]}
                rotation={[0.5, -0.6, -0.3]}
                scale={0.04}
            />

            <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={25} blur={2.5} far={4} color="#D81B60" />
        </group>
    );
}

// Preload models
useGLTF.preload('/camera.glb');
useGLTF.preload('/drill.glb');

export default function HeroClouds() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => { setScrollY(window.scrollY); };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }} shadows dpr={[1, 2]}>
                <ambientLight intensity={0.5} color="#E64A19" />
                <spotLight
                    position={[-10, 10, 10]}
                    angle={0.6}
                    penumbra={0.5}
                    intensity={2.5}
                    color="#FFCCBC"
                    castShadow
                />
                <pointLight position={[10, -10, 5]} intensity={1.5} color="#D50000" />
                <Environment preset="city" />
                <Scene scrollY={scrollY} />
            </Canvas>
        </div>
    );
}
