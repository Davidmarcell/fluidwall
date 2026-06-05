export type Mode = {
  id: string;
  name: string;
  summary: string;
  nativeControl: string;
  mobilePattern: string;
  palette: string[];
};

export type Interaction = {
  title: string;
  native: string;
  mobile: string;
  state: string;
};

export type AppState = {
  name: string;
  trigger: string;
  response: string;
};

export type Phase = {
  title: string;
  detail: string;
  deliverables: string[];
};

export const modes: Mode[] = [
  {
    id: "flow",
    name: "Flow",
    summary: "Single-color density with touch-driven optical flow.",
    nativeControl: "Key 1, optical flow on",
    mobilePattern: "Default canvas mode with one-finger drag.",
    palette: ["#69f0ff", "#36d1dc", "#07131f"],
  },
  {
    id: "vectors",
    name: "Vectors",
    summary: "Velocity field visualization for debugging and teaching.",
    nativeControl: "Key 2, velocity vectors",
    mobilePattern: "Inspector mode in a bottom sheet.",
    palette: ["#b8ff6a", "#46ffb3", "#0d1b10"],
  },
  {
    id: "users",
    name: "Users",
    summary: "Multi-color emissions that represent tracked participants.",
    nativeControl: "Key 3, Kinect users",
    mobilePattern: "Camera-assisted mode with touch-only fallback.",
    palette: ["#ff6b6b", "#ffd166", "#4ecdc4"],
  },
  {
    id: "gallery",
    name: "Gallery",
    summary: "High-contrast white-background version for screenshots.",
    nativeControl: "Key 4, white background",
    mobilePattern: "Share-ready mode with export controls.",
    palette: ["#101418", "#7c3aed", "#ffffff"],
  },
];

export const interactions: Interaction[] = [
  {
    title: "Primary gesture",
    native: "Left mouse drag adds velocity.",
    mobile: "One-finger drag adds force and density at the touch point.",
    state: "Active touch indicator follows the finger and fades after release.",
  },
  {
    title: "Tool switching",
    native: "Middle/right mouse buttons add bounds or density.",
    mobile: "Thumb-reachable tool rail toggles velocity, density, and bounds.",
    state: "Selected tool is mirrored in the canvas badge and haptic-ready copy.",
  },
  {
    title: "Mode switching",
    native: "Number keys 1-4 change render modes.",
    mobile: "Segmented bottom control switches modes without covering the canvas.",
    state: "Mode change briefly shows a confirmation overlay and clears transient input.",
  },
  {
    title: "Display toggles",
    native: "Keyboard toggles optical flow, velocity, bounds, and users.",
    mobile: "Settings sheet exposes compact switches and performance presets.",
    state: "Low-power mode lowers grid resolution and frame cap.",
  },
  {
    title: "Camera substitute",
    native: "Kinect depth silhouettes define bounds and user emitters.",
    mobile: "Optional camera permission enables silhouette-inspired motion input.",
    state: "Denied camera permission keeps the touch demo fully usable.",
  },
];

export const states: AppState[] = [
  {
    name: "First load",
    trigger: "User opens the Vercel URL.",
    response: "Show orientation-safe intro, start touch demo, and defer camera prompts.",
  },
  {
    name: "Camera request",
    trigger: "User enables camera mode.",
    response: "Explain why camera input is used before invoking browser permission.",
  },
  {
    name: "Permission denied",
    trigger: "Browser rejects camera access.",
    response: "Return to touch-only mode with a persistent non-blocking notice.",
  },
  {
    name: "Low power",
    trigger: "Reduced-motion preference, battery saver, or manual toggle.",
    response: "Use smaller grid, fewer particles, and lower animation intensity.",
  },
  {
    name: "Landscape",
    trigger: "Phone rotates or tablet opens wider layout.",
    response: "Keep canvas centered and move controls into a side rail.",
  },
  {
    name: "Share/export",
    trigger: "User enters Gallery mode.",
    response: "Use high contrast colors and reserve room for a future capture action.",
  },
];

export const phases: Phase[] = [
  {
    title: "1. Web shell",
    detail: "Ship the Vercel-ready Next.js surface that frames the mobile interaction plan.",
    deliverables: ["Mobile-first landing page", "Touch prototype", "Deployment metadata"],
  },
  {
    title: "2. Solver port",
    detail: "Move the Stable Fluids solver from C++ into a browser-safe TypeScript or WASM module.",
    deliverables: ["Grid model", "Canvas renderer", "Worker-friendly update loop"],
  },
  {
    title: "3. Camera input",
    detail: "Replace Kinect depth with optional getUserMedia frame differencing or segmentation.",
    deliverables: ["Permission states", "Touch fallback", "Performance presets"],
  },
  {
    title: "4. Installation polish",
    detail: "Prepare PWA affordances once the simulation is stable on mobile hardware.",
    deliverables: ["Offline shell", "Home-screen metadata", "Capture/share actions"],
  },
];
