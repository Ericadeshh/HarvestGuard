import { useState } from "react";
import FileUpload from "../../components/FileUpload/FileUpload";
import BatchUpload from "../../components/BatchUpload/BatchUpload";
import styles from "../../components/FileUpload/FileUpload.module.css";

const Upload: React.FC = () => {
  const [uploadType, setUploadType] = useState<"single" | "batch">("single");

  return (
    <div className={styles.container}>
      <h2>Upload Images for Scanning</h2>
      <div className={styles.toggle}>
        <button
          className={uploadType === "single" ? styles.active : ""}
          onClick={() => setUploadType("single")}
        >
          Single Image
        </button>
        <button
          className={uploadType === "batch" ? styles.active : ""}
          onClick={() => setUploadType("batch")}
        >
          Batch Upload
        </button>
      </div>
      {uploadType === "single" ? <FileUpload /> : <BatchUpload />}
    </div>
  );
};

export default Upload;
