/**
 * Type definitions for the Error Dashboard application
 */

/**
 * Represents an error entry with all its properties
 */
export interface ErrorData {
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

/**
 * Represents error data grouped by category
 */
export interface CategoryData {
  name: string;
  count: number;
  color: string;
}

/**
 * Represents error data aggregated by minute
 */
export interface MinuteData {
  time: string;
  logs: number;
  errors: number;
  warnings: number;
  participant_errors: number;
  call_errors: number;
  http_errors: number;
}

/**
 * Represents error data grouped by HTTP status code
 */
export interface StatusData {
  name: string;
  count: number;
  color: string;
}

/**
 * Represents error data grouped by severity
 */
export interface SeverityData {
  name: string;
  count: number;
  color: string;
}

/**
 * Represents a potential root cause of errors
 */
export interface RootCauseData {
  id: number;
  name: string;
  probability: string;
  evidence: string;
  details: string;
  color: string;
}

/**
 * Represents a common error pattern
 */
export interface CommonErrorData {
  message: string;
  count: number;
  category?: string;
  severity?: string;
  firstSeen?: string;
}

/**
 * Represents a critical event in the timeline
 */
export interface CriticalEventData {
  time: string;
  event: string;
  details: string;
  type: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Available theme colors
 */
export type ThemeColor = 'default' | 'green' | 'red' | 'purple' | 'blue';

/**
 * Tab types
 */
export type TabType = 'summary' | 'timeline' | 'errors' | 'patterns';