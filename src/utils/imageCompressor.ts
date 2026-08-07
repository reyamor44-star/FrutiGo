/**
 * Utilidad de compresión de imágenes en el cliente (navegador).
 * Convierte archivos pesados (p. ej. fotos de 10MB) en JPEG optimizados de ~100KB - 200KB
 * para asegurar subidas instantáneas y cero errores en Firestore.
 */
export function compressImageFile(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error("No se pudo leer el archivo."));
        return;
      }

      // Si no es imagen o es un SVG pequeño, devolver como está
      if (file.type === "image/svg+xml" || file.size < 100 * 1024) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(src);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        } catch (err) {
          console.warn("Respaldo de compresión:", err);
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
