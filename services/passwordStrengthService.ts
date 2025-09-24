// Copyright github.com/sapthesh
export interface PasswordStrength {
  score: number; // 0 to 4, or -1 for empty
  label: string;
  color: string;
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: -1, label: '', color: 'transparent' };
  }

  let points = 0;

  // Award points for length
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;

  // Award points for character variety
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  
  const categories = (hasLower ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSymbol ? 1 : 0);
  
  // Bonus for having multiple categories
  if (categories >= 2) points++;
  if (categories >= 3) points++;
  if (categories === 4) points++;

  // Total possible points: 2 for length + 3 for categories = 5

  // Map points (0-5) to score (0-4)
  let score = 0;
  if (points <= 1) score = 0;      // Very Weak (e.g., "password", "12345678")
  else if (points === 2) score = 1; // Weak (e.g., "Password", "abcdefghijkl")
  else if (points === 3) score = 2; // Fair (e.g., "Password123")
  else if (points === 4) score = 3; // Strong (e.g., "Password123!")
  else if (points >= 5) score = 4;  // Very Strong (e.g., "Password123!long")

  // Override: any password less than 8 chars is Very Weak, regardless of points
  if (password.length > 0 && password.length < 8) {
    score = 0;
  }

  const strengthMap = [
        { label: 'Very Weak', color: '#f44336' },
        { label: 'Weak', color: '#ff9800' },
        { label: 'Fair', color: '#ffc107' },
        { label: 'Strong', color: '#8bc34a' },
        { label: 'Very Strong', color: '#4caf50' },
  ];

  return { score, ...strengthMap[score] };
};