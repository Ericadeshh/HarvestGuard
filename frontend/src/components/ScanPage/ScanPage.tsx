import React, { useState, useEffect } from "react";
import type { ScanResult } from "../../types/scan";
import styles from "./ScanPage.module.css";

interface ScanPageProps {
  token: string;
}

const ScanPage: React.FC<ScanPageProps> = ({ token }) => {
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [singleLoading, setSingleLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [serverStatus, setServerStatus] = useState("Checking...");
  const API_BASE_URL = "http://localhost:8000/api/v1";

  useEffect(() => {
    const checkStatus = () => {
      fetch("http://localhost:8000/")
        .then((res) => {
          if (res.ok) {
            setServerStatus("Online");
          } else {
            setServerStatus("Offline");
          }
        })
        .catch((err) => {
          console.error("Server status check failed:", err);
          setServerStatus("Offline");
        });
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSingleFile(e.target.files[0]);
      setError("");
    }
  };

  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBatchFiles(Array.from(e.target.files));
      setError("");
    }
  };

  const handleSingleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleFile) {
      setError("Please select an image file");
      return;
    }
    if (serverStatus === "Offline") {
      setError(
        "Cannot scan: Backend server is offline. Please try again later."
      );
      return;
    }

    setSingleLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", singleFile);

    try {
      const response = await fetch(`${API_BASE_URL}/scan/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Scan failed");
      }

      const data = await response.json();
      setResults([data]);
      setSuccess("Single image scanned successfully!");
    } catch (err) {
      console.error("Single scan error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to server"
      );
    } finally {
      setSingleLoading(false);
    }
  };

  const handleBatchScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (batchFiles.length === 0) {
      setError("Please select at least one image file");
      return;
    }
    if (serverStatus === "Offline") {
      setError(
        "Cannot scan: Backend server is offline. Please try again later."
      );
      return;
    }

    setBatchLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    batchFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(`${API_BASE_URL}/scan/batch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Batch scan failed");
      }

      const data = await response.json();
      const successfulResults = data.filter(
        (result: ScanResult) => result.decision !== "ERROR"
      );
      setResults(data);
      if (successfulResults.length === data.length) {
        setSuccess("Batch images scanned successfully!");
      } else {
        setError(`Some images failed to scan. Check results for details.`);
      }
    } catch (err) {
      console.error("Batch scan error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to server"
      );
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <div className={styles.scanContainer}>
      <h1 className={styles.title}>HarvestGuard Scan</h1>
      <div className={styles.serverStatus}>
        Server Status:{" "}
        <span
          className={
            serverStatus === "Online"
              ? styles.statusOnline
              : styles.statusOffline
          }
        >
          {serverStatus}
        </span>
      </div>
      <div className={styles.scanOptions}>
        <div className={styles.scanCard}>
          <h2>Single Image Scan</h2>
          <form onSubmit={handleSingleScan}>
            <div className={styles.formGroup}>
              <label htmlFor="singleFile">Select Image</label>
              <input
                id="singleFile"
                type="file"
                accept="image/*"
                onChange={handleSingleFileChange}
              />
            </div>
            <button
              type="submit"
              className={styles.scanButton}
              disabled={singleLoading || serverStatus === "Offline"}
            >
              {singleLoading
                ? "Scanning..."
                : serverStatus === "Offline"
                ? "Server Offline"
                : "Scan Image"}
            </button>
          </form>
        </div>
        <div className={styles.scanCard}>
          <h2>Batch Image Scan</h2>
          <form onSubmit={handleBatchScan}>
            <div className={styles.formGroup}>
              <label htmlFor="batchFiles">Select Images or ZIP</label>
              <input
                id="batchFiles"
                type="file"
                accept="image/*,.zip"
                multiple
                onChange={handleBatchFileChange}
              />
            </div>
            <button
              type="submit"
              className={styles.scanButton}
              disabled={batchLoading || serverStatus === "Offline"}
            >
              {batchLoading
                ? "Scanning..."
                : serverStatus === "Offline"
                ? "Server Offline"
                : "Scan Batch"}
            </button>
          </form>
        </div>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      {results.length > 0 && (
        <div className={styles.resultsContainer}>
          <h2>Scan Results</h2>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Decision</th>
                <th>Confidence</th>
                <th>Error</th>
                <th>Anomaly</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.image}</td>
                  <td
                    className={
                      result.decision === "Flag"
                        ? styles.flagged
                        : result.decision === "ERROR"
                        ? styles.error
                        : styles.accepted
                    }
                  >
                    {result.decision}
                  </td>
                  <td>{result.confidence.toFixed(4)}</td>
                  <td>{result.reconstruction_error.toFixed(5)}</td>
                  <td>{result.is_anomaly ? "Yes" : "No"}</td>
                  <td>
                    {result.timestamp
                      ? new Date(result.timestamp).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
