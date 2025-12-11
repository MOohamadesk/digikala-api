import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const { slug } = req.query;
  const dbPath = join(process.cwd(), 'db.json');
  
  try {
    const dbData = JSON.parse(readFileSync(dbPath, 'utf8'));
    
    if (req.method === 'GET') {
      const resource = slug[0];
      
      if (dbData[resource]) {
        // Handle nested routes like data-02/stories/1
        if (slug.length > 1) {
          const subresource = slug[1];
          if (dbData[resource][subresource]) {
            if (slug.length > 2) {
              const id = slug[2];
              const item = dbData[resource][subresource].find(item => item.id == id);
              if (item) {
                return res.status(200).json(item);
              }
              return res.status(404).json({ error: 'Not found' });
            }
            return res.status(200).json(dbData[resource][subresource]);
          }
        }
        return res.status(200).json(dbData[resource]);
      }
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    if (req.method === 'PATCH') {
      const resource = slug[0];
      
      if (resource === 'data-02' && slug[1] === 'stories' && slug[2]) {
        const storyId = parseInt(slug[2]);
        const storyIndex = dbData[resource].stories.findIndex(story => story.id === storyId);
        
        if (storyIndex !== -1) {
          // Update the story
          dbData[resource].stories[storyIndex] = {
            ...dbData[resource].stories[storyIndex],
            ...req.body,
          };
          
          // Note: In a real app, you would write back to the file
          // For Vercel serverless, you can't write to the file system
          // This is just for demonstration
          
          return res.status(200).json(dbData[resource].stories[storyIndex]);
        }
        return res.status(404).json({ error: 'Story not found' });
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}