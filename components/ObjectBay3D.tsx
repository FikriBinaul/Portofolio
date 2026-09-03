"use client";

import { Suspense, useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, useAnimations, useGLTF } from "@react-three/drei";

export type ObjId = "gears" | "chip" | "duck";

const OBJ_META: Record<ObjId, { name: string; hint: string }> = {
  gears: { name: "01 · GEARSET.GLB", hint: "drag to inspect" },
  chip: { name: "02 · MCU_DIE · procedural", hint: "drag to inspect" },
  duck: { name: "03 · CAL_DUCK.GLB", hint: "drag to inspect" },
};

// Preload downloaded GLB assets (three.js example models, MIT licensed).
useGLTF.preload("/models/gears.glb");
useGLTF.preload("/models/duck.glb");

/** Scales + centers any child group to fit a target size. */
function Fit({ children, target = 1.6 }: { children: ReactNode; target?: number }) {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    const box = new THREE.Box3().setFromObject(g);
    const size = box.getSize(new THREE.Vector3());
    const max = Math.max(size.x, size.y, size.z, 1e-4);
    const s = target / max;
    const center = box.getCenter(new THREE.Vector3());
    g.scale.setScalar(s);
    g.position.set(-center.x * s, -center.y * s, -center.z * s);
  }, [target]);
  return <group ref={ref}>{children}</group>;
}

/** Downloaded low-poly gearset — plays its embedded rotation animation. */
function GearsModel() {
  const { scene, animations } = useGLTF("/models/gears.glb");
  const { actions } = useAnimations(animations, scene);
  useLayoutEffect(() => {
    Object.values(actions).forEach((a) => a?.play());
  }, [actions]);
  return (
    <Fit target={1.55}>
      <primitive object={scene} />
    </Fit>
  );
}

/** Downloaded low-poly calibration duck — the classic glTF sample. */
function DuckModel() {
  const { scene, animations } = useGLTF("/models/duck.glb");
  const { actions } = useAnimations(animations, scene);
  useLayoutEffect(() => {
    Object.values(actions).forEach((a) => a?.play());
  }, [actions]);
  return (
    <Fit target={1.35}>
      <primitive object={scene} />
    </Fit>
  );
}

/** Procedural minimal microcontroller: substrate, die, legs, status LEDs. */
function ChipModel() {
  const legs = [-0.62, -0.21, 0.21, 0.62];
  const legMat = <meshStandardMaterial color="#c9b78f" metalness={0.85} roughness={0.25} />;
  const pins = legs.flatMap((x) => [
    <mesh key={`t${x}`} position={[x, -0.12, 0.79]}>
      <boxGeometry args={[0.09, 0.12, 0.11]} />
      {legMat}
    </mesh>,
    <mesh key={`b${x}`} position={[x, -0.12, -0.79]}>
      <boxGeometry args={[0.09, 0.12, 0.11]} />
      {legMat}
    </mesh>,
    <mesh key={`l${x}`} position={[-0.79, -0.12, x]}>
      <boxGeometry args={[0.11, 0.12, 0.09]} />
      {legMat}
    </mesh>,
    <mesh key={`r${x}`} position={[0.79, -0.12, x]}>
      <boxGeometry args={[0.11, 0.12, 0.09]} />
      {legMat}
    </mesh>,
  ]);
  return (
    <Fit target={1.6}>
      <group>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.16, 1.5]} />
          <meshStandardMaterial color="#20262f" metalness={0.65} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.95, 0.06, 0.95]} />
          <meshStandardMaterial color="#4c3a1e" metalness={0.5} roughness={0.4} />
        </mesh>
        {pins}
        <mesh position={[0.33, 0.15, 0.33]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#32D74B" emissive="#32D74B" emissiveIntensity={2.4} />
        </mesh>
        <mesh position={[-0.33, 0.15, -0.33]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#FF6B4A" emissive="#FF6B4A" emissiveIntensity={1.6} />
        </mesh>
      </group>
    </Fit>
  );
}

function Scene({ id }: { id: ObjId }) {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.4;
  });
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2.5]} intensity={1.3} />
      <pointLight position={[-3, 1.6, -2]} intensity={0.55} color="#7C6CFF" />
      <group ref={spin}>
        <Suspense fallback={null}>
          <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.45}>
            {id === "gears" && <GearsModel />}
            {id === "chip" && <ChipModel />}
            {id === "duck" && <DuckModel />}
          </Float>
        </Suspense>
      </group>
      <ContactShadows position={[0, -1.0, 0]} opacity={0.5} scale={6} blur={2.5} far={2.6} />
    </>
  );
}

interface ObjectBay3DProps {
  id: ObjId;
  onPrev: () => void;
  onNext: () => void;
}

/** Object Bay — a living 3D widget on the desktop. */
export default function ObjectBay3D({ id, onPrev, onNext }: ObjectBay3DProps) {
  const meta = OBJ_META[id];
  return (
    <div className="desk-widget obj-bay">
      <div className="dw-head">
        <span className="dw-label">object bay</span>
        <div className="obj-nav">
          <button onClick={onPrev} aria-label="Previous object">
            ←
          </button>
          <button onClick={onNext} aria-label="Next object">
            →
          </button>
        </div>
      </div>
      <div className="obj-canvas">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.55, 3.6], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene id={id} />
        </Canvas>
      </div>
      <div className="obj-name">
        <span>{meta.name}</span>
        <span className="obj-hint">{meta.hint}</span>
      </div>
    </div>
  );
}