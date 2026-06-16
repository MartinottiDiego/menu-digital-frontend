import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build "standalone" (.next/standalone con server.js + deps mínimas trazadas)
  // para una imagen Docker chica y autocontenida.
  output: "standalone",
  // Permite levantar un segundo `next dev` (tests E2E) con su propio directorio
  // de build, sin chocar el lock de `.next` del dev server del usuario.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  env: {
    NEXT_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_CLOUDINARY_UPLOAD_PRESET,
  },
};

export default nextConfig;
