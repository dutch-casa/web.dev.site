// @ts-nocheck
/* eslint-disable react/no-unknown-property */
'use client';

import { Canvas, extend, useFrame, ThreeElement } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

// Using dynamic imports to avoid type issues with GLTF/PNG
const cardGLBUrl = '/card.glb';
const lanyardUrl = '/lanyard.png';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  color?: string;
}

export function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  color = '#000000'
}: LanyardProps) {
  const isMobile = useRef(typeof window !== 'undefined' && window.innerWidth < 768).current;

  return (
    <div className="relative z-0 w-full h-screen flex justify-center items-center">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(color), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile: boolean;
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile }: BandProps) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials } = useGLTF(cardGLBUrl) as any;
  const texture = useTexture(lanyardUrl) as THREE.Texture;
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged !== false) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        const curr = ref.current;
        if (curr) {
          if (!curr.lerped) curr.lerped = new THREE.Vector3().copy(curr.translation());
          const clampedDistance = Math.max(0.1, Math.min(1, curr.lerped.distanceTo(curr.translation())));
          curr.lerped.lerp(curr.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
        }
      });
      curve.points[0].copy(j3.current?.translation() ?? new THREE.Vector3());
      curve.points[1].copy(j1.current?.lerped ?? new THREE.Vector3());
      curve.points[2].copy(j2.current?.lerped ?? new THREE.Vector3());
      curve.points[3].copy(fixed.current.translation());
      if (band.current?.geometry) {
        const linePoints = curve.getPoints(isMobile ? 16 : 32);
        (band.current.geometry as unknown as { setPoints(points: THREE.Vector3[]): void }).setPoints(linePoints);
      }
      ang.copy(card.current?.angvel() ?? new THREE.Vector3());
      rot.copy(card.current?.rotation() ?? new THREE.Vector3());
      card.current?.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} type="fixed" canSleep colliders={false} angularDamping={4} linearDamping={4} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} type="dynamic" canSleep colliders={false} angularDamping={4} linearDamping={4}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} type="dynamic" canSleep colliders={false} angularDamping={4} linearDamping={4}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} type="dynamic" canSleep colliders={false} angularDamping={4} linearDamping={4}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
          canSleep
          colliders={false}
          angularDamping={4}
          linearDamping={4}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as HTMLElement).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current?.translation() ?? new THREE.Vector3())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="black"
          depthTest={false}
          resolution={[isMobile ? 1000 : 1000, isMobile ? 2000 : 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
