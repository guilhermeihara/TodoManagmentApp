import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Convert UTC date string to local timezone
 */
const convertUtcToLocal = (dateString: string): Date => {
    const utcDateString = dateString.endsWith('Z')
        ? dateString
        : dateString + 'Z';
    const utcDate = parseISO(utcDateString);
    return utcDate;
};

/**
 * Calculate relative time (e.g., "2 hours ago") with better formatting
 */
export const getRelativeTime = (dateString: string): string => {
    const localDate = convertUtcToLocal(dateString);
    return formatDistanceToNow(localDate, {
        addSuffix: true,
        includeSeconds: true,
    });
};

/**
 * Format date and time in a readable format (local timezone)
 */
export const formatDateTime = (dateString: string): string => {
    const localDate = convertUtcToLocal(dateString);
    return format(localDate, 'MMM dd, yyyy  hh:mm a');
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};
