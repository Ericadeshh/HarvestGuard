// src/components/Upload.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Upload.module.css";
import { Carousel, Spinner } from "react-bootstrap";

interface ScanResult {
  image: string;
  decision: string;
  confidence: number;
  reconstruction_error: number;
  error?: string;
}

const Upload: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResults([]);
    setFiles(e.target.files);
  };

  const handleScan = async () => {
    if (!files) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    const data = new FormData();
    Array.from(files).forEach((file) => data.append("files", file));
    const res = await fetch("http://127.0.0.1:8000/api/v1/scan/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });
    if (res.status === 401) return navigate("/login");
    const json = await res.json();
    setResults(json.results);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Upload images for AI scan</h2>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={selectFiles}
        className={styles.fileInput}
      />
      <button
        onClick={handleScan}
        className={styles.scanButton}
        disabled={!files || loading}
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Start Scan"}
      </button>
      {results.length > 0 && (
        <div className={styles.carouselWrapper}>
          <Carousel>
            {results.map((r, idx) => (
              <Carousel.Item key={idx}>
                <div className={styles.item}>
                  <h5>{r.image}</h5>
                  {r.error ? (
                    <p className={styles.error}>{r.error}</p>
                  ) : (
                    <>
                      <p>
                        Decision:{" "}
                        <b
                          className={
                            r.decision === "FLAGGED"
                              ? styles.flag
                              : styles.accept
                          }
                        >
                          {r.decision}
                        </b>
                      </p>
                      <p>
                        Conf: {(r.confidence * 100).toFixed(2)}% | Err:{" "}
                        {r.reconstruction_error.toFixed(5)}
                      </p>
                    </>
                  )}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default Upload;
