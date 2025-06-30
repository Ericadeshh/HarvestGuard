import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./FileUpload.module.css";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (
      selectedFile &&
      ["image/jpeg", "image/png"].includes(selectedFile.type)
    ) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid image (JPG/PNG).");
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("No file selected.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const result = await uploadImage(file, token);
      navigate("/results", { state: { results: [result.result] } });
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.upload}>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading || !file}>
          {loading ? <LoadingSpinner /> : "Scan Image"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
