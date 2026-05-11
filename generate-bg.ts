import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

async function run() {
  console.log('Checking API key...');
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No GEMINI_API_KEY found');
    process.exit(1);
  }
  console.log('API key found. Initializing...');
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    console.log('Starting Veo generation...');
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: 'A beautiful, abstract 3D cosmic aurora, slow motion, smooth, comforting, dark background, seamless loop, high quality, 1080p, vibrant hot pink and electric purple colors, cinematic lighting',
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    console.log('Operation created:', operation.name);
    
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('Polling...');
      operation = await ai.operations.getVideosOperation({ operation });
    }

    console.log('Generation complete!');
    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) throw new Error('No URI');
    
    console.log('Downloading from:', uri);
    const res = await fetch(uri, { headers: { 'x-goog-api-key': apiKey } });
    const buffer = await res.arrayBuffer();
    
    fs.writeFileSync('public/veo-background.mp4', Buffer.from(buffer));
    console.log('Saved to public/veo-background.mp4');
  } catch (e) {
    console.error('Error:', e);
  }
}

run();
