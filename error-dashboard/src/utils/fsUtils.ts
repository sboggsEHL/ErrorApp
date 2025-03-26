/**
 * File system utilities for browser environments
 */
import * as Papa from 'papaparse';

/**
 * Fetch and parse CSV file
 */
export const fetchCSV = async (filename: string) => {
  try {
    console.log(`Fetching CSV from: http://localhost:3000/data/${filename}`);
    const response = await fetch(`http://localhost:3000/data/${filename}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load file: ${filename}`);
    }
    
    const text = await response.text();
    return Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
  } catch (error) {
    console.error('Error fetching CSV:', error);
    throw error;
  }
};
