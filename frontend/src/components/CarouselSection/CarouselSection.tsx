import { Carousel } from "react-bootstrap";
import styles from "./CarouselSection.module.css";

const CarouselSection: React.FC = () => {
  return (
    <section className={styles.carousel}>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400?text=Authentic+Products"
            alt="Authentic Products"
          />
          <Carousel.Caption>
            <h3>Verify Product Authenticity</h3>
            <p>Scan agricultural products to ensure they are genuine.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400?text=Quality+Assurance"
            alt="Quality Assurance"
          />
          <Carousel.Caption>
            <h3>Quality Assurance</h3>
            <p>Detect expired or tampered products with AI precision.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </section>
  );
};

export default CarouselSection;
