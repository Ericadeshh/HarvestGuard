import type { ScanResult } from "../../types/scan";
import styles from "./ResultsTable.module.css";

interface ResultsTableProps {
  results: ScanResult[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Image</th>
          <th>Status</th>
          <th>Confidence</th>
          <th>Error Score</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <tr key={index}>
            <td>{result.image || result.filename || "Unknown"}</td>
            <td className={result.is_anomaly ? styles.flag : styles.accept}>
              {result.decision || result.action || "N/A"}
            </td>
            <td>{(result.confidence * 100).toFixed(2)}%</td>
            <td>{result.reconstruction_error.toFixed(5)}</td>
            <td>
              {result.timestamp || result.scanned_at
                ? new Date(
                    result.timestamp || result.scanned_at!
                  ).toLocaleString()
                : "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
