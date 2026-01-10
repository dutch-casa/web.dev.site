/**
 * Fuzzy matching utilities for quiz answers
 */

/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Normalize text for comparison (lowercase, trim, collapse whitespace)
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ")
}

/**
 * Check if two strings match within a Levenshtein distance threshold
 */
export function fuzzyMatch(
  input: string,
  expected: string,
  threshold: number = 2
): boolean {
  const normalizedInput = normalizeText(input)
  const normalizedExpected = normalizeText(expected)

  // Exact match after normalization
  if (normalizedInput === normalizedExpected) {
    return true
  }

  // Within Levenshtein threshold
  return levenshteinDistance(normalizedInput, normalizedExpected) <= threshold
}

/**
 * Calculate similarity ratio (0-1) between two strings
 * Uses longest common subsequence approach
 */
export function similarityRatio(a: string, b: string): number {
  const normalizedA = normalizeText(a)
  const normalizedB = normalizeText(b)

  if (normalizedA === normalizedB) return 1
  if (normalizedA.length === 0 || normalizedB.length === 0) return 0

  const maxLen = Math.max(normalizedA.length, normalizedB.length)
  const distance = levenshteinDistance(normalizedA, normalizedB)

  return 1 - distance / maxLen
}

/**
 * Check if similarity meets a threshold
 */
export function fuzzyMatchSimilarity(
  input: string,
  expected: string,
  threshold: number = 0.7
): boolean {
  return similarityRatio(input, expected) >= threshold
}
