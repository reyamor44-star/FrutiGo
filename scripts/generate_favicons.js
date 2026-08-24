import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Generar todos los favicons e íconos en alta resolución
async function generateFavicons() {
  const svgPath = path.resolve('public/logo.svg');
  const publicDir = path.resolve('public');

  console.log('Reading SVG from:', svgPath);
  const svgBuffer = fs.readFileSync(svgPath);

  const targets = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 }, // Recomendado específicamente por Google Search Console
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-touch-icon-180x180.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'icon-192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
    { name: 'icon-512.png', size: 512 },
    { name: 'logo.png', size: 512 }
  ];

  for (const target of targets) {
    const outputPath = path.join(publicDir, target.name);
    await sharp(svgBuffer, { density: 300 })
      .resize(target.size, target.size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(outputPath);
    console.log(`✓ Generado: ${target.name} (${target.size}x${target.size}px)`);
  }

  // Generar favicon.ico con múltiples tamaños embebidos (16x16, 32x32, 48x48) en formato ICO válido
  const p16 = await sharp(svgBuffer, { density: 300 }).resize(16, 16).png().toBuffer();
  const p32 = await sharp(svgBuffer, { density: 300 }).resize(32, 32).png().toBuffer();
  const p48 = await sharp(svgBuffer, { density: 300 }).resize(48, 48).png().toBuffer();

  const pngBuffers = [
    { size: 16, buffer: p16 },
    { size: 32, buffer: p32 },
    { size: 48, buffer: p48 }
  ];

  // Construir cabecera ICO de 3 imágenes
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + numImages * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved (must be 0)
  header.writeUInt16LE(1, 2); // Image type: 1 = ICO
  header.writeUInt16LE(numImages, 4); // Number of images

  const dirEntries = [];
  for (const img of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // Width
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // Height
    entry.writeUInt8(0, 2); // Color count
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Size of image data in bytes
    entry.writeUInt32LE(offset, 12); // Offset of image data
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...pngBuffers.map(b => b.buffer)]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Generado: favicon.ico (Multi-resolución 16x16, 32x32, 48x48)');

  // Eliminar archivo de prueba si existe
  if (fs.existsSync(path.join(publicDir, 'test-sharp.png'))) {
    fs.unlinkSync(path.join(publicDir, 'test-sharp.png'));
  }

  console.log('\n¡Todos los favicons se generaron exitosamente en /public!');
}

generateFavicons().catch(err => {
  console.error('Error al generar favicons:', err);
  process.exit(1);
});
