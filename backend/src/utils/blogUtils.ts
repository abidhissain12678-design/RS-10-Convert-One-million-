/**
 * Calculate word count from HTML content
 * Removes HTML tags and counts words
 */
export const calculateWordCount = (htmlContent: string): number => {
  // Remove HTML tags
  const plainText = htmlContent.replace(/<[^>]*>/g, '');
  // Count words
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
};

/**
 * Calculate reading time in minutes
 * Based on average reading speed of 200 words per minute
 */
export const calculateReadingTime = (wordCount: number): number => {
  const wordsPerMinute = 200;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
};

/**
 * Generate excerpt from HTML content
 * Removes HTML tags and truncates to specified length
 */
export const generateExcerpt = (htmlContent: string, maxLength: number = 300): string => {
  // Remove HTML tags
  const plainText = htmlContent.replace(/<[^>]*>/g, ' ');
  // Remove extra whitespace
  const excerpt = plainText.replace(/\s+/g, ' ').trim();
  // If excerpt is already within limit, return it
  if (excerpt.length <= maxLength) {
    return excerpt;
  }
  // Truncate to maxLength - 3 to leave room for '...'
  const truncated = excerpt.substring(0, maxLength - 3).trim();
  return truncated + '...';
};
