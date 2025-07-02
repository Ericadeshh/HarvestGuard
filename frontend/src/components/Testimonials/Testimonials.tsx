import { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import styles from "./Testimonials.module.css";
import { GrLinkPrevious } from "react-icons/gr";
import { FaStar } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GrLinkNext } from "react-icons/gr";

import Eric from "../../assets/Eric.jpg";
import Daisy from "../../assets/Daisy.jpg";
import DrCrab from "../../assets/Dr. Crab.jpg";
import MrMachai from "../../assets/Mr. Machai.jpg";

// Define the type for team member details
interface TeamMember {
  name: string;
  quote: string;
  rating: number;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Eric, Developer",
    quote:
      "As the lead developer of HarvestGuard, I’ve built an AI platform that uses unsupervised machine learning and autoencoders to detect counterfeit and expired agricultural products with over 95% accuracy, ensuring farmers use only trusted inputs.",
    rating: 5,
    image: Eric,
  },
  {
    name: "Daisy Chebet",
    quote:
      "Co-developing HarvestGuard’s AI System and integrating our deep learning models has made it simple for farmers to verify the authenticity of agricultural products like seeds and pesticides in real time.",
    rating: 4.5,
    image: Daisy,
  },
  {
    name: "Doctor Crab",
    quote:
      "As an agricultural scientist, I’m impressed by HarvestGuard’s neural network technology. Its autoencoders accurately identify counterfeit and expired agricultural products, protecting farmers and boosting sustainable yields.",
    rating: 4.5,
    image: DrCrab,
  },
  {
    name: "Mr. Machai",
    quote:
      "HarvestGuard has revolutionized my farming. Its AI-powered scans ensure the seeds, pesticides, and fertilizers I use are genuine and effective, leading to healthier crops and higher yields.",
    rating: 5,
    image: MrMachai,
  },
];

const Testimonials: React.FC = () => {
  const [index, setIndex] = useState<number>(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else {
        stars.push(<FaStar key={i} className="text-muted" />);
      }
    }
    return stars;
  };

  return (
    <section className={styles.testimonials}>
      <h2 className={`${styles.testimonialTitle} `}>
        <FaPeopleGroup /> What Our Community Says{" "}
        <span className={styles.highlight}>About HarvestGuard</span>
      </h2>

      <p className={styles.p1}>
        Hear from developers, scientists, and farmers about how HarvestGuard’s
        AI-driven detection of counterfeit and expired agricultural products is
        transforming agriculture with unsupervised machine learning.
      </p>
      <div>
        <div className={styles.carouselContainer}>
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            controls={false}
            indicators={false}
            interval={5000}
            wrap={true}
            className={styles.carousel}
          >
            {teamMembers.map((member, idx) => (
              <Carousel.Item key={idx}>
                <div className={styles.card}>
                  <div>
                    <img
                      src={member.image}
                      alt={`${member.name}-img`}
                      className={`rounded-circle mr-1 ${styles.img}`}
                    />
                  </div>
                  <div className={styles.details}>
                    <h5 className={styles.names}>{member.name}</h5>
                    <p className={styles.testimonialText}>
                      <span className={styles.role}>{member.quote}</span>
                    </p>
                    <div className={styles.ratings}>
                      {renderStars(member.rating)}
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
          <button
            className={`${styles.carouselButton} ${styles.prevButton}`}
            onClick={() =>
              setIndex(
                (prevIndex) =>
                  (prevIndex - 1 + teamMembers.length) % teamMembers.length
              )
            }
          >
            <GrLinkPrevious />
          </button>
          <button
            className={`${styles.carouselButton} ${styles.nextButton}`}
            onClick={() =>
              setIndex((prevIndex) => (prevIndex + 1) % teamMembers.length)
            }
          >
            <GrLinkNext />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
