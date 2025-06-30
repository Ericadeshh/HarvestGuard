import type { ScanResult } from "../types/scan";

const API_BASE_URL = "http://localhost:8000/api/v1";

interface BatchScanResponse {
  status: string;
  results: ScanResult[];
}

interface SingleScanResponse {
  status: string;
  result: ScanResult;
}

interface StatusResponse {
  status: string;
}

export async function checkServerStatus(): Promise<StatusResponse> {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) throw new Error("Server status check failed");
  return await response.json();
}

export async function uploadImage(
  file: File,
  token: string | null
): Promise<SingleScanResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/scan/upload-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error("Upload failed");
  return await response.json();
}

export async function batchUpload(
  files: FileList,
  token: string | null
): Promise<BatchScanResponse> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }
  const response = await fetch(`${API_BASE_URL}/scan/batch`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error("Batch upload failed");
  return await response.json();
}
