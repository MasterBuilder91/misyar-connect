// src/app/components/matching/MatchingAlgorithm.ts
import { RightsAdjustment, UserProfile, UserPreferences } from '@/app/types/user';

interface MatchingResult {
  userId: string;
  matchedUserId: string;
  compatibilityScore: number;
  rightsCompatibility: {
    [key: string]: boolean;
  };
}

/**
 * Calculate compatibility score between two users based on their rights adjustments and preferences
 */
export const calculateCompatibility = (
  user: UserProfile & { rightsAdjustment: RightsAdjustment, preferences: UserPreferences },
  potentialMatch: UserProfile & { rightsAdjustment: RightsAdjustment }
): MatchingResult => {
  // Initialize score components
  let rightsScore = 0;
  let preferencesScore = 0;
  let demographicsScore = 0;
  
  // Track which rights are compatible
  const rightsCompatibility: { [key: string]: boolean } = {};
  
  // Calculate rights compatibility
  const userRights = Object.entries(user.rightsAdjustment).filter(([key]) => key !== 'explanation');
  const matchRights = Object.entries(potentialMatch.rightsAdjustment).filter(([key]) => key !== 'explanation');
  
  // For each right, check if there's compatibility
  userRights.forEach(([rightKey, userWillingToAdjust]) => {
    const matchWillingToAdjust = potentialMatch.rightsAdjustment[rightKey as keyof RightsAdjustment];
    
    // If either user is willing to adjust this right, it's compatible
    if (userWillingToAdjust === true || matchWillingToAdjust === true) {
      rightsScore += 1;
      rightsCompatibility[rightKey] = true;
    } else {
      rightsCompatibility[rightKey] = false;
    }
  });
  
  // Normalize rights score (0-50 points)
  rightsScore = (rightsScore / userRights.length) * 50;
  
  // Calculate preferences match (0-30 points)
  // Age preference
  if (
    potentialMatch.age >= user.preferences.ageRange.min &&
    potentialMatch.age <= user.preferences.ageRange.max
  ) {
    preferencesScore += 10;
  }
  
  // Location preference
  if (user.preferences.location.includes(potentialMatch.location)) {
    preferencesScore += 10;
  }
  
  // Religious practice preference
  if (user.preferences.religiousPractice.includes(potentialMatch.religiousPractice)) {
    preferencesScore += 10;
  }
  
  // Calculate demographics compatibility (0-20 points)
  // Basic compatibility factors
  demographicsScore += 10; // Base score for being in the system
  
  // Education and occupation compatibility (simplified)
  demographicsScore += 10; // Placeholder for more sophisticated matching
  
  // Calculate total score (0-100)
  const totalScore = rightsScore + preferencesScore + demographicsScore;
  
  return {
    userId: user.uid,
    matchedUserId: potentialMatch.uid,
    compatibilityScore: Math.round(totalScore),
    rightsCompatibility
  };
};

/**
 * Find potential matches for a user from a pool of candidates
 */
export const findPotentialMatches = (
  user: UserProfile & { rightsAdjustment: RightsAdjustment, preferences: UserPreferences },
  candidates: Array<UserProfile & { rightsAdjustment: RightsAdjustment }>
): MatchingResult[] => {
  // Filter candidates by gender (opposite gender only)
  const filteredCandidates = candidates.filter(candidate => 
    candidate.gender !== user.gender && candidate.uid !== user.uid
  );
  
  // Calculate compatibility with each candidate
  const matches = filteredCandidates.map(candidate => 
    calculateCompatibility(user, candidate)
  );
  
  // Sort by compatibility score (highest first)
  return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};
