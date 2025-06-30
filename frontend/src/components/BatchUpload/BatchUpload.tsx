import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { batchUpload } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "../FileUpload/FileUpload.module.css";

const BatchUpload: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setError("");
    } else {
      setError("Please select at least one file.");
      setFiles(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files) {
      setError("No files selected.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const result = await batchUpload(files, token);
      navigate("/results", { state: { results: result.results } });
    } catch {
      setError("Batch upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.upload}>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/jpeg,image/png,.zip"
          multiple
          onChange={handleFileChange}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading || !files}>
          {loading ? <LoadingSpinner /> : "Scan Batch"}
        </button>
      </form>
    </div>
  );
};

export default BatchUpload;
