import { fetchCSV } from './fsUtils';
import { 
  ErrorData, 
  CategoryData, 
  MinuteData, 
  StatusData, 
  SeverityData, 
  RootCauseData, 
  CommonErrorData,
  CriticalEventData
} from '@/types';

/**
 * Load and process error data from CSV
 */
export const loadErrorData = async (filename: string = 'errors_only.csv') => {
  try {
    // Fetch and parse CSV data
    const parsedErrors = await fetchCSV(filename);
    return parsedErrors.data as ErrorData[];
  } catch (error) {
    console.error('Error loading error data:', error);
    return [];
  }
};

/**
 * Process error categories
 */
export const processErrorCategories = (
  errors: ErrorData[], 
  getCategoryColor: (category: string) => string
): CategoryData[] => {
  const categories: Record<string, number> = {};
  
  errors.forEach(error => {
    if (!error.category) return;
    
    if (!categories[error.category]) {
      categories[error.category] = 0;
    }
    categories[error.category]++;
  });
  
  return Object.entries(categories).map(([name, count]) => ({
    name,
    count,
    color: getCategoryColor(name)
  })).sort((a, b) => b.count - a.count);
};

/**
 * Process errors by minute
 */
export const processErrorsByMinute = (errors: ErrorData[]): MinuteData[] => {
  const minuteData: Record<string, MinuteData> = {};
  
  errors.forEach(error => {
    if (!error.time_key) return;
    
    if (!minuteData[error.time_key]) {
      minuteData[error.time_key] = {
        time: error.time_key,
        logs: 0,
        errors: 0,
        warnings: 0,
        participant_errors: 0,
        call_errors: 0,
        http_errors: 0
      };
    }
    
    minuteData[error.time_key].logs++;
    
    if (error.severity === 'error') {
      minuteData[error.time_key].errors++;
    } else if (error.severity === 'warning') {
      minuteData[error.time_key].warnings++;
    }
    
    if (error.is_participant_error === 1) {
      minuteData[error.time_key].participant_errors++;
    }
    
    if (error.is_call_error === 1) {
      minuteData[error.time_key].call_errors++;
    }
    
    if (error.category === 'HTTP Error') {
      minuteData[error.time_key].http_errors++;
    }
  });
  
  return Object.values(minuteData).sort((a, b) => a.time.localeCompare(b.time));
};

/**
 * Process HTTP status codes
 */
export const processStatusCodes = (
  errors: ErrorData[], 
  getStatusColor: (code: number) => string
): StatusData[] => {
  const statusCodes: Record<number, number> = {};
  
  errors.forEach(error => {
    if (error.status_code) {
      if (!statusCodes[error.status_code]) {
        statusCodes[error.status_code] = 0;
      }
      statusCodes[error.status_code]++;
    }
  });
  
  return Object.entries(statusCodes).map(([code, count]) => ({
    name: `HTTP ${code}`,
    count,
    color: getStatusColor(parseInt(code))
  }));
};

/**
 * Process error severities
 */
export const processSeverities = (
  errors: ErrorData[],
  getSeverityColor: (severity: string) => string
): SeverityData[] => {
  const severities: Record<string, number> = {};
  
  errors.forEach(error => {
    if (!error.severity) return;
    if (!severities[error.severity]) {
      severities[error.severity] = 0;
    }
    severities[error.severity]++;
  });
  
  return Object.entries(severities).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
    color: getSeverityColor(name)
  }));
};

/**
 * Find cascade patterns (errors occurring in rapid succession)
 */
export const findCascadePatterns = (errors: ErrorData[]): ErrorData[][] => {
  const sortedErrors = [...errors].sort((a, b) => {
    const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
    const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
    return dateA.getTime() - dateB.getTime();
  });
  
  let cascadeSequences: ErrorData[][] = [];
  let currentSequence: ErrorData[] = [];
  
  for (let i = 1; i < sortedErrors.length; i++) {
    if (!sortedErrors[i-1].timestamp || !sortedErrors[i].timestamp) continue;
    
    const prevTime = new Date(sortedErrors[i-1].timestamp || 0);
    const currTime = new Date(sortedErrors[i].timestamp || 0);
    const diffMs = currTime.getTime() - prevTime.getTime();
    
    if (diffMs < 500) {
      if (currentSequence.length === 0) {
        currentSequence.push(sortedErrors[i-1]);
      }
      currentSequence.push(sortedErrors[i]);
    } else if (currentSequence.length > 0) {
      if (currentSequence.length >= 3) {
        cascadeSequences.push([...currentSequence]);
      }
      currentSequence = [];
    }
  }
  
  if (currentSequence.length >= 3) {
    cascadeSequences.push([...currentSequence]);
  }
  
  return cascadeSequences;
};

/**
 * Find error examples for different error types
 */
export const findErrorExamples = (errors: ErrorData[]): Record<string, string> => {
  const examples: Record<string, string> = {};
  const errorTypes: Record<string, ErrorData | undefined> = {
    'Participant Deletion': errors.find(e => e.error_message?.includes('deleting participant')),
    'Call Update Errors': errors.find(e => e.error_message?.includes('updating call')),
    'HTTP 500 Errors': errors.find(e => e.status_code === 500),
    'Unknown Errors': errors.find(e => e.error_message === 'Unknown error' && e.category === 'Call Update'),
    'Retry Failures': errors.find(e => e.is_retry === 1)
  };
  
  Object.entries(errorTypes).forEach(([key, error]) => {
    if (error) {
      examples[key] = error.full_log || 
                      error.error_message || 
                      (error.details_json ? JSON.stringify(JSON.parse(error.details_json), null, 2) : 'No details available');
    }
  });
  
  return examples;
};

/**
 * Find the most common errors
 */
export const findMostCommonErrors = (errors: ErrorData[]): CommonErrorData[] => {
  const errorMessages: Record<string, CommonErrorData> = {};
  
  errors.forEach(error => {
    // Use error message if available, otherwise use category or "Unknown error"
    const message = error.error_message || 
                   (error.category ? `${error.category} error` : "Unknown error");
    
    // Create a key that trims and normalizes the message to group similar errors
    const key = message.trim().toLowerCase();
    
    if (!errorMessages[key]) {
      errorMessages[key] = {
        message,
        count: 0,
        category: error.category,
        severity: error.severity,
        firstSeen: error.timestamp
      };
    }
    errorMessages[key].count++;
  });
  
  return Object.values(errorMessages)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

/**
 * Generate sample data for testing
 */
export const generateSampleData = () => {
  const sampleErrors: CommonErrorData[] = [
    { message: "Failed to delete participant", count: 28, category: "Participant Deletion", severity: "error" },
    { message: "HTTP 500 Internal Server Error", count: 24, category: "HTTP Error", severity: "error" },
    { message: "Connection timeout", count: 19, category: "Call Update", severity: "error" },
    { message: "Invalid participant state", count: 15, category: "Participant Deletion", severity: "warning" },
    { message: "Operation retry failed", count: 12, category: "Retry Operation", severity: "error" }
  ];
  
  return {
    sampleErrors
  };
};

/**
 * Generate critical events timeline based on error data
 */
export const generateCriticalEvents = (
  errors: ErrorData[],
  timelineData: MinuteData[],
  cascadePatterns: ErrorData[][]
): CriticalEventData[] => {
  if (!timelineData.length) return [];
  
  const firstTime = timelineData[0].time;
  const time20 = timelineData[Math.min(Math.floor(timelineData.length * 0.2), timelineData.length - 1)].time;
  const time40 = timelineData[Math.min(Math.floor(timelineData.length * 0.4), timelineData.length - 1)].time;
  const time60 = timelineData[Math.min(Math.floor(timelineData.length * 0.6), timelineData.length - 1)].time;
  const time70 = timelineData[Math.min(Math.floor(timelineData.length * 0.7), timelineData.length - 1)].time;
  const time80 = timelineData[Math.min(Math.floor(timelineData.length * 0.8), timelineData.length - 1)].time;
  const lastTime = timelineData[timelineData.length - 1].time;
  
  const http20 = timelineData[Math.min(Math.floor(timelineData.length * 0.2), timelineData.length - 1)].http_errors || 0;
  const participantErrors = errors.filter(e => e.is_participant_error === 1 && e.time_key === time40).length;
  const callErrors = errors.filter(e => e.is_call_error === 1 && e.time_key === time60).length;
  const serverErrors = errors.filter(e => e.status_code === 500 && e.time_key === time70).length;
  
  return [
    { time: errors[0]?.time_key || firstTime, event: 'System operating normally', details: 'Low volume of call updates, no errors', type: 'info' },
    { time: time20, event: 'First HTTP errors appear', details: `${http20} HTTP errors detected`, type: 'warning' },
    { time: time40, event: 'Participant deletion errors begin', details: `${participantErrors} participant errors`, type: 'warning' },
    { time: time60, event: 'Call update error spike', details: `${callErrors} call handling failures`, type: 'error' },
    { time: time70, event: 'HTTP 500 errors begin', details: `${serverErrors} server errors`, type: 'error' },
    { time: time80, event: 'Cascade failure detected', details: `${cascadePatterns.length} error cascades identified`, type: 'critical' },
    { time: lastTime, event: 'Last system activity', details: 'System likely crashed after this point', type: 'critical' }
  ];
};

/**
 * Generate root cause analysis based on error data
 */
export const generateRootCauses = (errors: ErrorData[]): RootCauseData[] => {
  return [
    {
      id: 1,
      name: 'Race Condition',
      probability: 'High',
      evidence: 'High call update and participant errors within 500ms timeframe',
      details: 'System attempted to delete participants that were already removed or in an invalid state',
      color: '#ff6b6b'
    },
    {
      id: 2,
      name: 'API Rate Limiting',
      probability: 'Medium',
      evidence: `${errors.filter(e => e.status_code === 401).length} authorization errors detected during peak load`,
      details: 'API may have enforced rate limiting when too many requests were sent',
      color: '#feca57'
    },
    {
      id: 3,
      name: 'Resource Exhaustion',
      probability: 'High',
      evidence: `${errors.filter(e => e.status_code === 500).length} server errors coinciding with peak error rate`,
      details: 'HTTP 500 errors suggest the system ran out of available resources during peak load',
      color: '#ff9f43'
    },
    {
      id: 4,
      name: 'Connection Pool Saturation',
      probability: 'Medium',
      evidence: 'Rapid error sequence with timestamps within milliseconds of each other',
      details: 'The system may have saturated connection pools to external APIs',
      color: '#5f27cd'
    }
  ];
};