export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  // Add other student properties as needed
}

export interface AIProfile {
  summary: string;
  recommended_tracks: string[];
  explanation_text: string;
}