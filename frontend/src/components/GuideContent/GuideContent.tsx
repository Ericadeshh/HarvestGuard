// src/pages/Guide.tsx
import React from "react";
import styles from "./GuideContent.module.css";
import { Carousel } from "react-bootstrap";

const Guide: React.FC = () => (
  <div className={styles.guide}>
    <h2>How to Use HarvestGuard</h2>
    <Carousel variant="dark">
      <Carousel.Item>
        <img className="d-block w-100" src="/guide1.png" alt="Step 1" />
        <Carousel.Caption>
          <h5>Step 1</h5>
          <p>Login or access the system.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src="/guide2.png" alt="Step 2" />
        <Carousel.Caption>
          <h5>Step 2</h5>
          <p>Upload images or select folder.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src="/guide3.png" alt="Step 3" />
        <Carousel.Caption>
          <h5>Step 3</h5>
          <p>View results and act accordingly.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </div>
);

export default Guide;
