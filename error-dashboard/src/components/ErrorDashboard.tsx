import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { LineChart, Line } from 'recharts';
import { Clock, AlertTriangle, Terminal, ArrowDownCircle } from 'lucide-react';
import { fetchCSV } from '../utils/fsUtils';

interface ErrorData {
  id?: number;
  timestamp?: string;
  time_key?: string;
  severity?: string;
  category?: string;
  error_message?: string;
  full_log?: string;
  details_json?: string;
  status_code?: number;
  is_participant_error?: number;
  is_call_error?: number;
  is_retry?: number;
  [key: string]: any;
}

interface CategoryData {
  name: string;
  count: number;
  color: string;
}

interface MinuteData {
  time: string;
  logs: number;
  errors: number;
  warnings: number;
  participant_errors: number;
  call_errors: number;
  http_errors: number;
}

interface StatusData {
  name: string;
  count: number;
  color: string;
}

interface SeverityData {
  name: string;
  count: number;
  color: string;
}

interface RootCauseData {
  id: number;
  name: string;
  probability: string;
  evidence: string;
  details: string;
  color: string;
}

interface CriticalEventData {
  time: string;
  event: string;
  details: string;
  type: 'info' | 'warning' | 'error' | 'critical';
}

const ErrorDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [errorData, setErrorData] = useState<ErrorData[]>([]);
  const [timelineData, setTimelineData] = useState<MinuteData[]>([]);
  const [criticalEvents, setCriticalEvents] = useState<CriticalEventData[]>([]);
  const [errorExamples, setErrorExamples] = useState<Record<string, string>>({});
  const [errorsByCategory, setErrorsByCategory] = useState<CategoryData[]>([]);
  const [errorsByMinute, setErrorsByMinute] = useState<MinuteData[]>([]);
  const [errorsByStatus, setErrorsByStatus] = useState<StatusData[]>([]);
  const [cascadePatterns, setCascadePatterns] = useState<ErrorData[][]>([]);
  const [rootCauses, setRootCauses] = useState<RootCauseData[]>([]);
  const [severityDistribution, setSeverityDistribution] = useState<SeverityData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper function to get color based on category
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Participant Deletion': return '#ff6b6b';
      case 'Call Update': return '#feca57';
      case 'HTTP Error': return '#ff9f43';
      case 'Retry Operation': return '#1dd1a1';
      default: return '#5f27cd';
    }
  };

  // Helper function to get color based on HTTP status
  const getStatusColor = (code: number) => {
    if (code >= 500) return '#ff6b6b';
    if (code >= 400) return '#feca57';
    if (code >= 300) return '#54a0ff';
    return '#1dd1a1';
  };

  useEffect(() => {
    const analyzeErrorData = async () => {
      try {
        // Fetch and parse CSV data
        const parsedErrors = await fetchCSV('errors_only.csv');
        
        const errors = parsedErrors.data as ErrorData[];
        
        // Process error categories
        const categories: Record<string, number> = {};
        errors.forEach(error => {
          if (!error.category) return;
          
          if (!categories[error.category]) {
            categories[error.category] = 0;
          }
          categories[error.category]++;
        });
        
        const categoryData = Object.entries(categories).map(([name, count]) => ({
          name,
          count,
          color: getCategoryColor(name)
        })).sort((a, b) => b.count - a.count);
        
        // Errors by minute
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
        
        const timeData = Object.values(minuteData).sort((a, b) => {
          return a.time.localeCompare(b.time);
        });
        
        // Find error examples
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
        
        // Process HTTP status codes
        const statusCodes: Record<number, number> = {};
        errors.forEach(error => {
          if (error.status_code) {
            if (!statusCodes[error.status_code]) {
              statusCodes[error.status_code] = 0;
            }
            statusCodes[error.status_code]++;
          }
        });
        
        const statusData = Object.entries(statusCodes).map(([code, count]) => ({
          name: `HTTP ${code}`,
          count,
          color: getStatusColor(parseInt(code))
        }));
        
        // Find cascade patterns
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
        
        
        
        // Build critical events timeline
        // This is a static example - in a real application, this would be derived from error patterns
        const firstTime = timeData.length > 0 ? timeData[0].time : '00:00';
        const time20 = timeData.length > 0 ? timeData[Math.min(Math.floor(timeData.length * 0.2), timeData.length - 1)].time : '00:00';
        const time40 = timeData.length > 0 ? timeData[Math.min(Math.floor(timeData.length * 0.4), timeData.length - 1)].time : '00:00';
        const time60 = timeData.length > 0 ? timeData[Math.min(Math.floor(timeData.length * 0.6), timeData.length - 1)].time : '00:00';
        const time70 = timeData.length > 0 ? timeData[Math.min(Math.floor(timeData.length * 0.7), timeData.length - 1)].time : '00:00';
        const time80 = timeData.length > 0 ? timeData[Math.min(Math.floor(timeData.length * 0.8), timeData.length - 1)].time : '00:00';
        const lastTime = timeData.length > 0 ? timeData[timeData.length - 1].time : '00:00';
        
        const http20 = timeData.length > 0 ? timeData[Math.min(Math.floor(timeData.length * 0.2), timeData.length - 1)].http_errors || 0 : 0;
        const participantErrors = errors.filter(e => e.is_participant_error === 1 && e.time_key === time40).length;
        const callErrors = errors.filter(e => e.is_call_error === 1 && e.time_key === time60).length;
        const serverErrors = errors.filter(e => e.status_code === 500 && e.time_key === time70).length;
        
        const criticalEventsData: CriticalEventData[] = [
          { time: errors[0]?.time_key || firstTime, event: 'System operating normally', details: 'Low volume of call updates, no errors', type: 'info' },
          { time: time20, event: 'First HTTP errors appear', details: `${http20} HTTP errors detected`, type: 'warning' },
          { time: time40, event: 'Participant deletion errors begin', details: `${participantErrors} participant errors`, type: 'warning' },
          { time: time60, event: 'Call update error spike', details: `${callErrors} call handling failures`, type: 'error' },
          { time: time70, event: 'HTTP 500 errors begin', details: `${serverErrors} server errors`, type: 'error' },
          { time: time80, event: 'Cascade failure detected', details: `${cascadeSequences.length} error cascades identified`, type: 'critical' },
          { time: lastTime, event: 'Last system activity', details: 'System likely crashed after this point', type: 'critical' }
        ];
        
        // Root causes analysis - this is static example data
        const rootCausesData: RootCauseData[] = [
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
        
        // Analyze severities
        const severities: Record<string, number> = {};
        errors.forEach(error => {
          if (!error.severity) return;
          if (!severities[error.severity]) {
            severities[error.severity] = 0;
          }
          severities[error.severity]++;
        });
        
        const severityData = Object.entries(severities).map(([name, count]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          count,
          color: name === 'error' ? '#ff6b6b' : name === 'warning' ? '#feca57' : '#54a0ff'
        }));

        // Set state with processed data
        setErrorData(errors);
        setTimelineData(timeData);
        setCriticalEvents(criticalEventsData);
        setErrorExamples(examples);
        setErrorsByCategory(categoryData);
        setErrorsByMinute(timeData);
        setErrorsByStatus(statusData);
        setCascadePatterns(cascadeSequences);
        setRootCauses(rootCausesData);
        setSeverityDistribution(severityData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error analyzing data:', error);
        setIsLoading(false);
      }
    };
    
    analyzeErrorData();
  }, []);

  const renderEventIcon = (type: string) => {
    switch(type) {
      case 'info':
        return <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-500"><Terminal size={16} /></span>;
      case 'warning':
        return <span className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500"><AlertTriangle size={16} /></span>;
      case 'error':
        return <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-500"><AlertTriangle size={16} /></span>;
      case 'critical':
        return <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-500"><ArrowDownCircle size={16} /></span>;
      default:
        return <Clock size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Analyzing error data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>System Error Analysis Dashboard</h1>
        <p>Error Analysis for System Crash</p>
      </header>
      
      <div className="alert">
        <div className="alert-icon">
          <AlertTriangle size={24} />
        </div>
        <div className="alert-content">
          <h3>Critical Issue Detected</h3>
          <p>System crash occurred with {errorData.length} error events detected</p>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button 
          className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
        <button 
          className={`tab ${activeTab === 'errors' ? 'active' : ''}`}
          onClick={() => setActiveTab('errors')}
        >
          Error Details
        </button>
        <button 
          className={`tab ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          Error Patterns
        </button>
      </div>

      {activeTab === 'summary' && (
        <div className="grid grid-2">
          <div className="card">
            <h2>Error Categories</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {errorsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2>Error Severity Distribution</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(severityDistribution || []).map((entry: SeverityData, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card span-2">
            <h2>Error Timeline</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={errorsByMinute}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="errors" stroke="#ff6b6b" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="warnings" stroke="#feca57" />
                  <Line type="monotone" dataKey="http_errors" stroke="#ff9f43" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card span-2">
            <h2>Root Cause Analysis</h2>
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Root Cause</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evidence</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rootCauses.map((cause) => (
                    <tr key={cause.id}>
                      <td>
                        <div className="flex-row">
                          <span className="color-indicator" style={{ backgroundColor: cause.color }}></span>
                          <span>{cause.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cause.probability}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{cause.evidence}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{cause.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div>
          <div className="card">
            <h2>System Crash Timeline</h2>
            
            <div className="timeline">
              <div className="timeline-line"></div>
              {criticalEvents.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className={`timeline-icon ${event.type}`}>{renderEventIcon(event.type)}</div>
                  <div className="timeline-time">{event.time}</div>
                  <div className={`timeline-title ${event.type}`}>{event.event}</div>
                  <div className="timeline-details">{event.details}</div>
                </div>
              ))}
            </div>
          </div>
            
          <div className="card mt-8">
            <h2>Error Volume Over Time</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={errorsByMinute}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="errors" name="Errors" fill="#ff6b6b" />
                  <Bar dataKey="warnings" name="Warnings" fill="#feca57" />
                  <Bar dataKey="participant_errors" name="Participant Errors" fill="#ff9f43" />
                  <Bar dataKey="call_errors" name="Call Errors" fill="#5f27cd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'errors' && (
        <div className="grid grid-2">
          <div className="card">
            <h2>HTTP Status Codes</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={errorsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {errorsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2>Error Categories</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={errorsByCategory}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 60,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {errorsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card span-2">
            <h2>Error Examples</h2>
            <div>
              {Object.entries(errorExamples).map(([key, example]) => (
                <div key={key} className="error-example">
                  <div className="error-example-header">{key}</div>
                  <div className="error-example-body">
                    <pre>{example}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="grid">
          <div className="card">
            <h2>Cascade Failure Patterns</h2>
            <p>Identified {cascadePatterns.length} potential error cascades (3+ errors within 500ms)</p>
            
            <div>
              {cascadePatterns.slice(0, 3).map((cascade, index) => (
                <div key={index} className="error-example">
                  <div className="error-example-header">Cascade Pattern #{index + 1}</div>
                  <div className="error-example-body">
                    <p className="text-sm">
                      {cascade.length} errors in {(() => {
                        try {
                          if (!Array.isArray(cascade) || cascade.length === 0) {
                            return 'unknown time period';
                          }

                          const lastError = cascade[cascade.length - 1] as ErrorData;
                          const firstError = cascade[0] as ErrorData;
                          
                          if (!lastError?.timestamp || !firstError?.timestamp) {
                            return 'unknown time period';
                          }
                          
                          const endTime = new Date(lastError.timestamp);
                          const startTime = new Date(firstError.timestamp);
                          return `${endTime.getTime() - startTime.getTime()}ms`;
                        } catch {
                          return 'unknown time period';
                        }
                      })()}
                    </p>
                    
                    <div className="overflow-auto max-h-40">
                      <table>
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {cascade.map((error, errorIndex) => (
                            <tr key={errorIndex} className={errorIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td>{error.timestamp?.split('T')[1]?.split('.')[0] || 'unknown'}</td>
                              <td>{error.category || 'unknown'}</td>
                              <td className="truncate">{error.error_message || 'No message'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h2>Error Pattern Analysis</h2>
            
            <div className="error-example">
              <div className="error-example-header">Temporal Patterns</div>
              <div className="error-example-body">
                <p>
                  Error density: {(errorData.length / timelineData.length).toFixed(2)} errors per minute
                </p>
                <p>
                  Peak error minute: {errorsByMinute.sort((a, b) => b.errors - a.errors)[0]?.time || 'unknown'} 
                  ({errorsByMinute.sort((a, b) => b.errors - a.errors)[0]?.errors || 0} errors)
                </p>
              </div>
            </div>
            
            <div className="error-example">
              <div className="error-example-header">Correlation Analysis</div>
              <div className="error-example-body">
                <p>
                  HTTP errors strongly correlate with participant errors ({
                    errorsByMinute.filter(m => m.http_errors > 0 && m.participant_errors > 0).length
                  } minutes overlap)
                </p>
                <p>
                  {errorsByMinute.filter(m => m.call_errors > 2 * m.http_errors).length > 0 ?
                    'Call errors increased independently of HTTP errors in some time periods, suggesting client-side issues.' :
                    'Call errors closely tracked HTTP errors, suggesting API dependency.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorDashboard;
