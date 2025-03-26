import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Only serve the CSV data API
app.get('/data/:filename', (req, res) => {
// Look for the file in the current directory first
  const filePath = path.join(__dirname, req.params.filename);
  const parentDirFilePath = path.join(dirname(__dirname), req.params.filename);
  
  try {
    if (fs.existsSync(filePath)) {
      // Set appropriate headers
      res.setHeader('Content-Type', 'text/csv');
      res.sendFile(filePath);
    } else if (fs.existsSync(parentDirFilePath)) {
      // Try the parent directory
      res.setHeader('Content-Type', 'text/csv');
      res.sendFile(parentDirFilePath);
    } else {
      console.log(`File not found: ${filePath} or ${parentDirFilePath}`);
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
