export const API_BASE = "http://localhost:5000";

export const API = {
  signup: `${API_BASE}/signup`,
  login: `${API_BASE}/login`,
  getUser: (email) => `${API_BASE}/user/${email}`,
  updateScore: (email) => `${API_BASE}/user/${email}/score`,
};
