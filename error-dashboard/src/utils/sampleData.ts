import { ErrorData, MinuteData, CategoryData, StatusData, SeverityData, CommonErrorData, CriticalEventData, RootCauseData } from '@/types';

/**
 * Generate sample error data for testing
 */
export const generateSampleErrorData = (): ErrorData[] => {
  const categories = ['Participant Deletion', 'Call Update', 'HTTP Error', 'Retry Operation', 'Unknown Error'];
  const severities = ['error', 'warning', 'info'];
  const statusCodes = [400, 401, 403, 404, 500, 502, 503];
  const errorMessages = [
    'Failed to delete participant',
    'HTTP 500 Internal Server Error',
    'Connection timeout',
    'Invalid participant state',
    'Operation retry failed',
    'Authentication failed',
    'Resource not found',
    'Invalid request format',
    'Service unavailable',
    'Database connection error'
  ];

  // Generate timestamps for the last hour with 1-minute intervals
  const now = new Date();
  const timestamps: string[] = [];
  const timeKeys: string[] = [];
  
  for (let i = 0; i < 60; i++) {
    const time = new Date(now.getTime() - (60 - i) * 60000);
    timestamps.push(time.toISOString());
    timeKeys.push(`${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`);
  }

  // Generate 379 sample error entries
  const errors: ErrorData[] = [];
  for (let i = 0; i < 379; i++) {
    const timeIndex = Math.min(Math.floor(i / 7), 59); // Distribute errors across the hour
    const category = categories[Math.floor(Math.random() * categories.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const statusCode = category === 'HTTP Error' ? statusCodes[Math.floor(Math.random() * statusCodes.length)] : undefined;
    const errorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    
    errors.push({
      id: i + 1,
      timestamp: timestamps[timeIndex],
      time_key: timeKeys[timeIndex],
      severity,
      category,
      error_message: errorMessage,
      full_log: `[${timestamps[timeIndex]}] ${severity.toUpperCase()}: ${errorMessage} ${Math.random().toString(36).substring(2, 15)}`,
      details_json: JSON.stringify({ error: errorMessage, timestamp: timestamps[timeIndex], code: statusCode }),
      status_code: statusCode,
      is_participant_error: category === 'Participant Deletion' ? 1 : 0,
      is_call_error: category === 'Call Update' ? 1 : 0,
      is_retry: category === 'Retry Operation' ? 1 : 0
    });
  }

  return errors;
};

/**
 * Process error categories
 */
export const processSampleCategories = (errors: ErrorData[]): CategoryData[] => {
  const categories: Record<string, number> = {};
  
  errors.forEach(error => {
    if (!error.category) return;
    
    if (!categories[error.category]) {
      categories[error.category] = 0;
    }
    categories[error.category]++;
  });
  
  const colors = {
    'Participant Deletion': '#ff6b6b',
    'Call Update': '#feca57',
    'HTTP Error': '#ff9f43',
    'Retry Operation': '#1dd1a1',
    'Unknown Error': '#5f27cd'
  };
  
  return Object.entries(categories).map(([name, count]) => ({
    name,
    count,
    color: colors[name as keyof typeof colors] || '#5f27cd'
  })).sort((a, b) => b.count - a.count);
};

/**
 * Process errors by minute
 */
export const processSampleMinuteData = (errors: ErrorData[]): MinuteData[] => {
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
export const processSampleStatusCodes = (errors: ErrorData[]): StatusData[] => {
  const statusCodes: Record<number, number> = {};
  
  errors.forEach(error => {
    if (error.status_code) {
      if (!statusCodes[error.status_code]) {
        statusCodes[error.status_code] = 0;
      }
      statusCodes[error.status_code]++;
    }
  });
  
  const getStatusColor = (code: number) => {
    if (code >= 500) return '#ff6b6b'; // Error
    if (code >= 400) return '#feca57'; // Warning
    if (code >= 300) return '#54a0ff'; // Info
    return '#1dd1a1'; // Success
  };
  
  return Object.entries(statusCodes).map(([code, count]) => ({
    name: `HTTP ${code}`,
    count,
    color: getStatusColor(parseInt(code))
  }));
};

/**
 * Process error severities
 */
export const processSampleSeverities = (errors: ErrorData[]): SeverityData[] => {
  const severities: Record<string, number> = {};
  
  errors.forEach(error => {
    if (!error.severity) return;
    if (!severities[error.severity]) {
      severities[error.severity] = 0;
    }
    severities[error.severity]++;
  });
  
  const getSeverityColor = (severity: string) => {
    switch(severity.toLowerCase()) {
      case 'error': return '#ff6b6b';
      case 'warning': return '#feca57';
      case 'info': return '#54a0ff';
      default: return '#a5b1c2';
    }
  };
  
  return Object.entries(severities).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
    color: getSeverityColor(name)
  }));
};

/**
 * Find cascade patterns (errors occurring in rapid succession)
 */
export const findSampleCascadePatterns = (errors: ErrorData[]): ErrorData[][] => {
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
export const findSampleErrorExamples = (errors: ErrorData[]): Record<string, string> => {
  const examples: Record<string, string> = {};
  const errorTypes: Record<string, ErrorData | undefined> = {
    'Participant Deletion': errors.find(e => e.category === 'Participant Deletion'),
    'Call Update Errors': errors.find(e => e.category === 'Call Update'),
    'HTTP 500 Errors': errors.find(e => e.status_code === 500),
    'Unknown Errors': errors.find(e => e.category === 'Unknown Error'),
    'Retry Failures': errors.find(e => e.category === 'Retry Operation')
  };
  
  Object.entries(errorTypes).forEach(([key, error]) => {
    if (error) {
      examples[key] = error.full_log || 
                     error.error_message || 
                     (error.details_json ? error.details_json : 'No details available');
    }
  });
  
  return examples;
};

/**
 * Find the most common errors
 */
export const findSampleMostCommonErrors = (errors: ErrorData[]): CommonErrorData[] => {
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
 * Generate critical events timeline based on error data
 */
export const generateSampleCriticalEvents = (
  errors: ErrorData[],
  timelineData: MinuteData[]
): CriticalEventData[] => {
  if (!timelineData.length) return [];
  
  const firstTime = timelineData[0].time;
  const time20 = timelineData[Math.min(Math.floor(timelineData.length * 0.2), timelineData.length - 1)].time;
  const time40 = timelineData[Math.min(Math.floor(timelineData.length * 0.4), timelineData.length - 1)].time;
  const time60 = timelineData[Math.min(Math.floor(timelineData.length * 0.6), timelineData.length - 1)].time;
  const time70 = timelineData[Math.min(Math.floor(timelineData.length * 0.7), timelineData.length - 1)].time;
  const time80 = timelineData[Math.min(Math.floor(timelineData.length * 0.8), timelineData.length - 1)].time;
  const lastTime = timelineData[timelineData.length - 1].time;
  
  return [
    { time: firstTime, event: 'System operating normally', details: 'Low volume of call updates, no errors', type: 'info' },
    { time: time20, event: 'First HTTP errors appear', details: '12 HTTP errors detected', type: 'warning' },
    { time: time40, event: 'Participant deletion errors begin', details: '28 participant errors', type: 'warning' },
    { time: time60, event: 'Call update error spike', details: '45 call handling failures', type: 'error' },
    { time: time70, event: 'HTTP 500 errors begin', details: '32 server errors', type: 'error' },
    { time: time80, event: 'Cascade failure detected', details: '5 error cascades identified', type: 'critical' },
    { time: lastTime, event: 'Last system activity', details: 'System likely crashed after this point', type: 'critical' }
  ];
};

/**
 * Generate root cause analysis based on error data
 */
export const generateSampleRootCauses = (): RootCauseData[] => {
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
      evidence: '24 authorization errors detected during peak load',
      details: 'API may have enforced rate limiting when too many requests were sent',
      color: '#feca57'
    },
    {
      id: 3,
      name: 'Resource Exhaustion',
      probability: 'High',
      evidence: '32 server errors coinciding with peak error rate',
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

/**
 * Generate all sample data needed for the dashboard
 */
export const generateAllSampleData = () => {
  const errors = generateSampleErrorData();
  const timelineData = processSampleMinuteData(errors);
  const cascadePatterns = findSampleCascadePatterns(errors);
  
  return {
    errors,
    timelineData,
    errorsByCategory: processSampleCategories(errors),
    errorsByStatus: processSampleStatusCodes(errors),
    severityDistribution: processSampleSeverities(errors),
    cascadePatterns,
    errorExamples: findSampleErrorExamples(errors),
    mostCommonErrors: findSampleMostCommonErrors(errors),
    criticalEvents: generateSampleCriticalEvents(errors, timelineData),
    rootCauses: generateSampleRootCauses()
  };
};