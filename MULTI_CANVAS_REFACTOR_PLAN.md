## Single Canvas Pattern for Three.js Components

Globe and Lanyard both use React Three Fiber, so they can share one canvas:

```tsx
import { Canvas } from '@react-three/fiber'
import { View, OrbitControls } from '@react-three/drei'

// Shared canvas at root
<Canvas eventSource={containerRef} className="fixed inset-0 pointer-events-none">
  <View.Port />
</Canvas>

// Wherever you need Globe
<View className="w-full h-full">
  <Globe globeConfig={globeConfig} data={sampleArcs} />
  <OrbitControls makeDefault />
  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
</View>

// Wherever you need Lanyard
<View className="w-[250px] h-[350px]">
  <Lanyard position={[0, 0, 0]} gravity={[0, -40, 0]} />
  <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={25} />
</View>
```

## For OGL Components

FaultyTerminal and GradientBlinds use OGL (different library), so they **cannot** share the Three.js canvas. Each needs its own OGL canvas.

Options:
1. Keep separate OGL canvases (acceptable - only 2 contexts)
2. Migrate both to Three.js if possible (unified stack)

## For CrowdCanvas

This is a 2D canvas - unrelated to WebGL concerns. Can stay as-is.

## Recommended Architecture

```
Root Layout
├── OGL Canvas (FaultyTerminal) - full screen background
├── Single Three.js Canvas (Globe + Lanyard via Views)
├── 2D Canvas (CrowdCanvas) - isolated
└── OGL Canvas (GradientBlinds) - bottom overlay

Total: 3 WebGL contexts (acceptable)
```

Would you like me to refactor the Globe + Lanyard into a single canvas pattern?
