export interface ScanResult {
  image: string;
  decision: string;
  confidence: number;
  reconstruction_error: number;
  is_anomaly: boolean;
  timestamp: string;
  filename?: string; // Optional to handle backend variations
  action?: string; // Optional to handle backend variations
  scanned_at?: string; // Optional to handle backend variations
}
