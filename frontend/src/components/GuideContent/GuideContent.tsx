import styles from "./GuideContent.module.css";

const GuideContent: React.FC = () => {
  return (
    <div className={styles.guide}>
      <h3>How to Use HarvestGuard</h3>
      <ol>
        <li>
          <strong>Login</strong>: Sign in with your credentials or register a
          new account.
        </li>
        <li>
          <strong>Upload Images</strong>: Navigate to the Upload page and select
          a single image or a batch (ZIP/folder).
        </li>
        <li>
          <strong>Scan</strong>: Click "Scan Image" or "Scan Batch" to process
          the images using our AI system.
        </li>
        <li>
          <strong>View Results</strong>: Check the Results page for detailed
          scan outcomes, including authenticity and confidence scores.
        </li>
        <li>
          <strong>Provide Feedback</strong>: Submit feedback on scan results to
          improve the system.
        </li>
      </ol>
      <p>
        <strong>Tip</strong>: Ensure images are clear and well-lit for best
        results.
      </p>
    </div>
  );
};

export default GuideContent;
