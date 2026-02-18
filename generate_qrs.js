import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';
import { members } from './src/data/members.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, 'public', 'members');
const baseUrl = 'https://iniciativasonora.org/profile/';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Generating QR codes...');

for (const member of members) {
    // Use member.id for the URL
    const url = `${baseUrl}${member.id}`;
    // Use the ID for the filename to match members.js structure roughly, though members.js has full paths.
    // If members.js has "qr: '/members/001_qr.png'", we should match that filename convention.
    // Assuming member.id is "001", filename is "001_qr.png"
    const filename = `${member.id}_qr.png`;
    const filepath = path.join(outputDir, filename);

    try {
        await QRCode.toFile(filepath, url, {
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            width: 500,
            margin: 2
        });
        console.log(`Generated QR for ${member.name} (${member.id}) -> ${filepath}`);
    } catch (err) {
        console.error(`Error generating QR for ${member.id}:`, err);
    }
}

console.log('Done!');
