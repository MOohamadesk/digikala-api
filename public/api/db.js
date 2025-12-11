import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const { query } = req;
  
  if (req.method === 'GET') {
    const { slug } = query;
    
    if (slug) {
      // Handle both old format (data-01) and new format (data/data-01.json)
      const cleanSlug = slug.replace('.json', '').replace('data/', '');
      const dbPath = join(process.cwd(), 'public', 'data', `${cleanSlug}.json`);
      
      try {
        const fileData = JSON.parse(readFileSync(dbPath, 'utf8'));
        return res.status(200).json(fileData);
      } catch (error) {
        console.error('API error:', error);
        return res.status(404).json({ error: 'Not found' });
      }
    }
    return res.status(400).json({ error: 'Missing slug' });
  }
  
  // For stories PATCH (only works locally)
  if (req.method === 'PATCH' && slug && slug.includes('stories')) {
    // ... existing PATCH logic for local development
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}