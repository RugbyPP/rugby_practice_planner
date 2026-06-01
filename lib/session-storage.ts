// Simple client-side session storage using localStorage

export interface StoredSession {
  id: string;
  ageGrade: string;
  gender: string;
  playerCount: number;
  abilityLevel: string;
  topic: string;
  principle: string;
  struggles?: string;
  desiredOutcome?: string;
  contactLevel: string;
  equipment?: string;
  space?: string;
  sessionLength: number;
  plan: string;
  createdAt: string;
  adaptations: Record<string, string>;
}

const STORAGE_KEY = 'rugby_sessions';

export function getSessions(): StoredSession[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading sessions:', error);
    return [];
  }
}

export function saveSession(session: StoredSession): void {
  if (typeof window === 'undefined') return;
  
  try {
    const sessions = getSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export function deleteSession(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const sessions = getSessions();
    const filtered = sessions.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting session:', error);
  }
}

export function getSession(id: string): StoredSession | null {
  const sessions = getSessions();
  return sessions.find(s => s.id === id) || null;
}
