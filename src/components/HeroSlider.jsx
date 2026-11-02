import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

/**
 * HeroSlider Component
 * Displays high-resolution swimming pool environments with smooth fade transitions,
 * keyboard accessibility, autoplay pause/play controls, and clear readable overlay.
 */
export default function HeroSlider() {
  const slides = [
    {
      id: 1,
      image: '/images/hero-pool-1.jpg',
      badge: 'Premier Pool Engineering',
      title: 'Swimming Pool Solutions Designed Around You',
      subtitle: 'From custom swimming pool construction to filtration and maintenance, discover professional solutions tailored to your space.',
      alt: 'Luxury architectural outdoor swimming pool with clean crystal water and sun loungers'
    },
    {
      id: 2,
      image: '/images/hero-pool-2.jpg',
      badge: 'Indoor & Architectural Facilities',
      title: 'Engineered For Durability, Designed For Serenity',
      subtitle: 'State-of-the-art indoor climate pools with high-efficiency water circulation, acoustic ceilings, and precision waterproofing.',
      alt: 'Contemporary indoor swimming pool facility with underwater illumination and modern deck'
    },
    {
      id: 3,
      image: '/images/hero-pool-3.jpg',
      badge: 'Bespoke Infinity & Luxury Pools',
      title: 'Precision Craftsmanship in Every Drop',
      subtitle: 'Turnkey pool installations engineered with high-strength reinforced concrete shells and commercial-grade sand filtration.',
      alt: 'Panoramic vanishing edge infinity swimming pool overlooking scenic horizon at twilight'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const slideIntervalRef = useRef(null);
  const sliderContainerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Autoplay management
  useEffect(() => {
    if (isPlaying) {
      slideIntervalRef.current = setInterval(() => {
        nextSlide();
      }, 6500); // Relaxed, dignified transition timing
    } else {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    }
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [isPlaying, nextSlide]);

  // Keyboard navigation for accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  return (
    <section
      ref={sliderContainerRef}
      className="hero-slider-container"
      aria-label="Featured Swimming Pool Projects Slider"
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`hero-slide ${isActive ? 'active' : ''}`}
            aria-hidden={!isActive}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.alt}
              className="hero-slide-bg"
              // Do not lazy-load the hero image to ensure immediate paint
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            {/* Subtle Gradient Overlay for High Readability */}
            <div className="hero-slide-overlay" />

            {/* Content Text Box */}
            <div className="container hero-content-wrap">
              <div className="hero-text-box">
                <div className="hero-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{slide.badge}</span>
                </div>

                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>

                <div className="d-flex flex-wrap gap-3">
                  <Link to="/services" className="btn-primary-custom">
                    <span>Explore Our Services</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <Link to="/contact" className="btn-outline-light-custom">
                    <span>Contact Us</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next Slider Navigation Buttons */}
      <button
        type="button"
        className="slider-nav-btn slider-nav-prev"
        onClick={prevSlide}
        aria-label="Previous swimming pool slide"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        className="slider-nav-btn slider-nav-next"
        onClick={nextSlide}
        aria-label="Next swimming pool slide"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Slider Bottom Controls: Indicators & Accessible Pause/Play */}
      <div className="slider-bottom-controls" role="group" aria-label="Slider controls">
        {slides.map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            className={`slider-indicator-dot ${dotIndex === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(dotIndex)}
            aria-label={`Go to slide ${dotIndex + 1}`}
            aria-current={dotIndex === currentIndex ? 'true' : 'false'}
          />
        ))}

        <button
          type="button"
          className="slider-pause-btn"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause automatic slider' : 'Play automatic slider'}
          title={isPlaying ? 'Pause slider' : 'Play slider'}
        >
          {isPlaying ? (
            <span className="d-flex align-items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Pause
            </span>
          ) : (
            <span className="d-flex align-items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Play
            </span>
          )}
        </button>
      </div>
    </section>
  );
}
