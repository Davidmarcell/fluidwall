# Fluid Wall mobile plan

This repository originally contained a native C++/OpenGL/Kinect installation called
Fluid Wall. This branch keeps the native source intact and adds a Vercel-ready
Next.js web surface for planning the mobile version of the app.

## What is included

- Mobile-first plan page for translating the desktop installation to phones.
- Interactive touch canvas prototype for the main fluid gesture model.
- Mode, tool, camera-permission, low-power, landscape, and fallback states.
- Vercel project configuration at the repository root.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the mobile planning prototype.

## Production build

```bash
npm run build
npm run start
```

## Vercel deployment

Connect this repository and branch to the user's Vercel account. Vercel should
detect the Next.js framework automatically. The committed `vercel.json` uses:

- Install command: `npm install`
- Build command: `npm run build`
- Framework: Next.js

The `.vercelignore` file excludes Visual Studio and native build artifacts from
the web deployment bundle.

## Native reference app

The original desktop app remains in `fluidWall/` with the Visual Studio solution
and OpenGL/OpenCV/Kinect source. The web app uses that implementation as a
behavioral reference for future solver and camera-input ports.
