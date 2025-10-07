// utils/timeHelper.ts - Utility functions for time formatting

/**
 * Format seconds to MM:SS or HH:MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
};

/**
 * Parse time string to seconds
 * @param timeString - Time string in MM:SS or HH:MM:SS format
 * @returns Time in seconds
 */
export const parseTime = (timeString: string): number => {
  const parts = timeString.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
};

/**
 * Get time remaining
 * @param currentTime - Current time in seconds
 * @param duration - Total duration in seconds
 * @returns Remaining time in seconds
 */
export const getTimeRemaining = (currentTime: number, duration: number): number => {
  return Math.max(0, duration - currentTime);
};

/**
 * Get progress percentage
 * @param currentTime - Current time in seconds
 * @param duration - Total duration in seconds
 * @returns Progress as percentage (0-100)
 */
export const getProgressPercentage = (currentTime: number, duration: number): number => {
  if (duration <= 0) return 0;
  return Math.min(100, Math.max(0, (currentTime / duration) * 100));
};