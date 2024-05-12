import React from "react";
import "../styles/Slide.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const images = [
  {
    label: "beach",
    src: "https://res.cloudinary.com/doqjl4k7t/image/upload/v1714765558/coastalhaven/beach_slide.webp",
  },
  {
    label: "luxury",
    src: "https://res.cloudinary.com/doqjl4k7t/image/upload/v1714765640/coastalhaven/luxury_slide.jpg",
  },
  {
    label: "island",
    src: "https://res.cloudinary.com/doqjl4k7t/image/upload/v1714765583/coastalhaven/island_slide.jpg",
  },
  {
    label: "cave",
    src: "https://res.cloudinary.com/doqjl4k7t/image/upload/v1714765576/coastalhaven/cave_slide.jpg",
  },
  {
    label: "island",
    src: "https://res.cloudinary.com/doqjl4k7t/image/upload/v1714765611/coastalhaven/island2_slide.jpg",
  },
];

const Slide = () => {
  return (
    <div className="slide">
      <Carousel
        autoPlay
        infiniteLoop
        interval={2000}
        showThumbs={false}
        className="carousel"
      >
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.src} alt={image.label} />
            <div className="overlay"></div>
          </div>
        ))}
      </Carousel>
      <div className="banner-text">
        <h1>
          Welcome to <span>Coastal Haven!</span>
        </h1>
        <p>Find Your Perfect Stay: Your Home, Anywhere You Go</p>
      </div>
    </div>
  );
};

export default Slide;
