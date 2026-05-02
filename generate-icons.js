const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function crc32(data) {
  let t = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    t ^= data[i];
    for (let j = 0; j < 8; j++) {
      t = (t >>> 1) ^ (t & 1 ? 0xEDB88320 : 0);
    }
  }
  return (t ^ 0xFFFFFFFF) >>> 0;
}

function mkChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const crcData = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createIcon(size, outPath) {
  const hdr = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const raw = Buffer.alloc((size + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size + 1)] = 0;
    const cx = size / 2, cy = size / 2, mx = size * 0.42;
    for (let x = 0; x < size; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const t = dist > mx ? 1 : dist / mx;
      const pi = Math.sin((dist / mx) * Math.PI * 4) * 0.15;
      raw[y * (size + 1) + 1 + x * 3]     = Math.max(0, Math.min(255, Math.floor(220 * (1 - t) + 250 * pi * t)));
      raw[y * (size + 1) + 1 + x * 3 + 1] = Math.max(0, Math.min(255, Math.floor(40 * (1 - t) - 10 * pi * t)));
      raw[y * (size + 1) + 1 + x * 3 + 2] = Math.max(0, Math.min(255, Math.floor(40 * (1 - t) - 10 * pi * t)));
    }
  }

  const idat = mkChunk('IDAT', zlib.deflateSync(raw));
  const iend = mkChunk('IEND', Buffer.alloc(0));

  fs.writeFileSync(outPath, Buffer.concat([hdr, mkChunk('IHDR', ihdr), idat, iend]));
  console.log('Created ' + outPath);
}

const iconDir = 'streetfighter/assets/icons';
fs.mkdirSync(iconDir, { recursive: true });
createIcon(192, path.join(iconDir, 'icon-192.png'));
createIcon(512, path.join(iconDir, 'icon-512.png'));
