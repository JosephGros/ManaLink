"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  { src: "/assets/AppImages/screen1.png", alt: "Item 1" },
  { src: "/assets/AppImages/screen2.png", alt: "Item 2" },
  { src: "/assets/AppImages/screen3.png", alt: "Item 3" },
  { src: "/assets/AppImages/screen4.png", alt: "Item 4" },
  { src: "/assets/AppImages/screen5.png", alt: "Item 5" },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
    }
  };

  useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  const getClass = (index: number) => {
    if (index === currentIndex) return "scale-100 z-10 translate-x-0";
    if (index === (currentIndex + 1) % images.length)
      return "scale-75 opacity-60 translate-x-full";
    if (index === (currentIndex - 1 + images.length) % images.length)
      return "scale-75 opacity-60 -translate-x-full";
    return "hidden";
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden flex justify-center items-center">
      <div className="relative flex justify-center items-center w-full h-[400px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute transition-transform duration-700 ease-in-out transform ${getClass(
              index
            )}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={255}
              height={400}
              className="h-96 w-auto rounded-md shadow-md border-8 border-bg2"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-btn rounded-full p-2 shadow hover:bg-light-btn"
      >
        ❮
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-btn rounded-full p-2 shadow hover:bg-light-btn"
      >
        ❯
      </button>
    </div>
  );
};

export default Carousel;