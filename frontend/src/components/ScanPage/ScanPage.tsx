import React, { useState, useRef } from "react";
import {
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaLeaf,
} from "react-icons/fa";
import styles from "./ScanPage.module.css";
import type { ScanResult } from "../../types/scan";

interface ScanPageProps {
  token: string;
}

const ScanPage: React.FC<ScanPageProps> = ({ token }) => {
  const [singleImage, setSingleImage] = useState<File | null>(null);
  const [batchImages, setBatchImages] = useState<File[]>([]);
  const [singleResult, setSingleResult] = useState<ScanResult | null>(null);
  const [batchResults, setBatchResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState<"single" | "batch" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const singleInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);

  const handleSingleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSingleImage(e.target.files[0]);
      setSingleResult(null);
      setError(null);
    }
  };

  const handleBatchImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBatchImages(Array.from(e.target.files));
      setBatchResults([]);
      setError(null);
    }
  };

  const handleSingleScan = async () => {
    if (!singleImage) {
      setError("Please select an image to scan.");
      return;
    }
    if (!token) {
      setError("Authentication token missing. Please log in.");
      return;
    }

    setLoading("single");
    setError(null);
    const formData = new FormData();
    formData.append("file", singleImage);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/scan/upload-image",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error: ${response.status}`);
      }

      const result: ScanResult = await response.json();
      setSingleResult(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Scan failed. Please try again."
      );
    } finally {
      setLoading(null);
    }
  };

  const handleBatchScan = async () => {
    if (batchImages.length === 0) {
      setError("Please select images for batch scan.");
      return;
    }
    if (!token) {
      setError("Authentication token missing. Please log in.");
      return;
    }

    setLoading("batch");
    setError(null);
    const formData = new FormData();
    batchImages.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("http://localhost:8000/api/v1/scan/batch", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error: ${response.status}`);
      }

      const results: ScanResult[] = await response.json();
      setBatchResults(results);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Batch scan failed. Please try again."
      );
    } finally {
      setLoading(null);
    }
  };

  const triggerSingleInput = () => singleInputRef.current?.click();
  const triggerBatchInput = () => batchInputRef.current?.click();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <FaLeaf className={styles.heroIcon} />
        <h1 className={styles.heroTitle}>Harvest Guard Scan</h1>
        <p className={styles.heroSubtitle}>
          Quickly verify fertilizer authenticity with our advanced AI scanning
          technology.
        </p>
      </div>
      <div className={styles.scanWrapper}>
        <div className={styles.scanSection}>
          <h2 className={styles.sectionTitle}>Single Image Scan</h2>
          <p className={styles.sectionDesc}>
            Upload a single fertilizer image to check its authenticity
            instantly.
          </p>
          <div className={styles.inputArea}>
            <input
              type="file"
              accept="image/*"
              ref={singleInputRef}
              onChange={handleSingleImageChange}
              className={styles.hiddenInput}
            />
            <button
              onClick={triggerSingleInput}
              className={styles.uploadButton}
            >
              <FaUpload className={styles.icon} />
              Choose Image
            </button>
            {singleImage && (
              <p className={styles.fileName}>{singleImage.name}</p>
            )}
            <button
              onClick={handleSingleScan}
              disabled={loading === "single"}
              className={styles.actionButton}
            >
              {loading === "single" ? (
                <FaSpinner className={styles.spinning} />
              ) : (
                "Scan Image"
              )}
            </button>
          </div>
          {singleResult && (
            <div className={styles.feedback}>
              <h3 className={styles.feedbackTitle}>Scan Result</h3>
              <div
                className={`${styles.resultCard} ${
                  singleResult.decision === "Flag" ? styles.flagged : ""
                }`}
              >
                {singleResult.decision === "Accept" ? (
                  <FaCheckCircle className={styles.resultIcon} />
                ) : (
                  <FaTimesCircle className={styles.resultIcon} />
                )}
                <div className={styles.resultDetails}>
                  <p>
                    <strong>Image:</strong> {singleResult.image}
                  </p>
                  <p>
                    <strong>Decision:</strong> {singleResult.decision}
                  </p>
                  <p>
                    <strong>Confidence:</strong>{" "}
                    {(singleResult.confidence * 100).toFixed(2)}%
                  </p>
                  <p>
                    <strong>Error:</strong>{" "}
                    {singleResult.reconstruction_error.toFixed(5)}
                  </p>
                  <p>
                    <strong>Anomaly:</strong>{" "}
                    {singleResult.is_anomaly ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Timestamp:</strong>{" "}
                    {new Date(singleResult.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.scanSection}>
          <h2 className={styles.sectionTitle}>Batch Image Scan</h2>
          <p className={styles.sectionDesc}>
            Upload multiple images to scan in bulk for efficient processing.
          </p>
          <div className={styles.inputArea}>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={batchInputRef}
              onChange={handleBatchImagesChange}
              className={styles.hiddenInput}
            />
            <button onClick={triggerBatchInput} className={styles.uploadButton}>
              <FaUpload className={styles.icon} />
              Choose Images
            </button>
            {batchImages.length > 0 && (
              <p className={styles.fileName}>
                {batchImages.length} image(s) selected
              </p>
            )}
            <button
              onClick={handleBatchScan}
              disabled={loading === "batch"}
              className={styles.actionButton}
            >
              {loading === "batch" ? (
                <FaSpinner className={styles.spinning} />
              ) : (
                "Scan Batch"
              )}
            </button>
          </div>
          {batchResults.length > 0 && (
            <div className={styles.batchFeedback}>
              <h3 className={styles.feedbackTitle}>Batch Scan Results</h3>
              <table className={styles.resultTable}>
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
                  {batchResults.map((result, index) => (
                    <tr
                      key={index}
                      className={
                        result.decision === "Flag" ? styles.flagged : ""
                      }
                    >
                      <td>{result.image}</td>
                      <td>
                        {result.decision === "Accept" ? (
                          <FaCheckCircle className={styles.resultIcon} />
                        ) : (
                          <FaTimesCircle className={styles.resultIcon} />
                        )}
                        {result.decision}
                      </td>
                      <td>{(result.confidence * 100).toFixed(2)}%</td>
                      <td>{result.reconstruction_error.toFixed(5)}</td>
                      <td>{result.is_anomaly ? "Yes" : "No"}</td>
                      <td>{new Date(result.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className={styles.error}>
          <FaTimesCircle className={styles.errorIcon} />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
