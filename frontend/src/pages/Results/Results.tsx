import { useLocation } from "react-router-dom";
import ResultsTable from "../../components/ResultsTable/ResultsTable";

interface ScanResult {
  image: string;
  decision: string;
  confidence: number;
  reconstruction_error: number;
  is_anomaly: boolean;
  timestamp: string;
}

const Results: React.FC = () => {
  const location = useLocation();
  const results: ScanResult[] = location.state?.results || [];

  return (
    <div>
      <h2>Scan Results</h2>
      {results.length > 0 ? (
        <ResultsTable results={results} />
      ) : (
        <p>No results available. Please upload images to scan.</p>
      )}
    </div>
  );
};

export default Results;
