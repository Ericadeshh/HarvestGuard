import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import styles from "./Results.module.css";

interface ScanResult {
  image: string;
  decision: string;
  confidence: number;
  reconstruction_error: number;
}

export default function Results() {
  const [results, setResults] = useState<ScanResult[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("scanResults");
    if (stored) setResults(JSON.parse(stored));
  }, []);

  if (results.length === 0)
    return <p className={styles.empty}>No results yet. Go to Scan.</p>;

  return (
    <div className={`container ${styles.results}`}>
      <h2>Scan Results</h2>
      <p>
        Total images scanned: <strong>{results.length}</strong>
      </p>
      <Carousel>
        {results.map((r) => (
          <Carousel.Item key={r.image}>
            <img
              className="d-block w-100"
              src={`/uploads/${r.image}`}
              alt={r.image}
            />
            <Carousel.Caption className={styles.caption}>
              <h5>{r.image}</h5>
              <p>Decision: {r.decision}</p>
              <p>Confidence: {r.confidence}</p>
              <p>Error: {r.reconstruction_error}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
