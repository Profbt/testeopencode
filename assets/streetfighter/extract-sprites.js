const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const baseDir = path.join(__dirname);
const sprites = [
  'Ryu.sprite3',
  'Ken.sprite3',
  'Hadouken.sprite3',
  'KenHadouken.sprite3',
  'Announcer.sprite3',
  'Charging.sprite3',
  'Hikou.sprite3',
  'Shield.sprite3',
  'Shinku Hadouken.sprite3',
  'Shinku Hit.sprite3',
  'Versus.sprite3'
];

sprites.forEach(spriteFile => {
  const spritePath = path.join(baseDir, spriteFile);
  if (!fs.existsSync(spritePath)) {
    console.log(`SKIP (not found): ${spriteFile}`);
    return;
  }

  // Clean folder name
  const dirName = spriteFile.replace('.sprite3', '').replace(/ /g, '_').toLowerCase();
  const outDir = path.join(baseDir, dirName);

  // Create output directory
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Extract ZIP
  const zip = new AdmZip(spritePath);
  zip.extractAllTo(outDir, true);

  // Parse sprite.json to get costume name -> filename mapping
  const jsonPath = path.join(outDir, 'sprite.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const map = {};
    if (data.costumes) {
      data.costumes.forEach(c => {
        map[c.name] = c.assetId + (c.dataFormat === 'png' ? '.png' : '.svg');
      });
    }
    const soundMap = {};
    if (data.sounds) {
      data.sounds.forEach(s => {
        soundMap[s.name] = s.assetId + '.' + (s.format === 'wav' ? 'wav' : 'mp3');
      });
    }
    console.log(`EXTRACTED: ${spriteFile} -> ${dirName}/`);
    console.log(`  Costumes: ${Object.keys(map).length}, Sounds: ${Object.keys(soundMap).length}`);
    // Write mapping for reference
    fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify({ costumes: map, sounds: soundMap }, null, 2));
    console.log(`  Mapping: ${dirName}/mapping.json`);
  } else {
    console.log(`EXTRACTED: ${spriteFile} -> ${dirName}/ (no sprite.json)`);
  }
});
