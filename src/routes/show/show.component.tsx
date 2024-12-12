import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { Tweet } from "../../types";
import { getGallery } from "../../services/ntf-backend.api";
import { useSession } from "../../contexts/session.context";
import { useNavigate } from "react-router-dom";

import "./show.styles.css";


export const Show = () => {
    const [gallery, setGallery] = useState<Tweet[]>([]);
    const { clearBackendAccessToken, clearBackendRefreshToken } = useSession();
    const navigate = useNavigate();


    useEffect(() => {
        getGallery()
            .then(setGallery)
            .catch(() => {
                clearBackendAccessToken();
                clearBackendRefreshToken();
                navigate("/");
            });
    }, [clearBackendAccessToken, clearBackendRefreshToken, navigate]);

    function shuffleArray<T>(array: T[]): T[] {
        let shuffledArray = [...array]; // Make a copy of the array to avoid mutating the original
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Get a random index
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
        }
        return shuffledArray;
    }

    const settings: Settings = {
        infinite: true, // Loop slides
        speed: 500, // Transition speed
        slidesToShow: 1, // One slide at a time
        slidesToScroll: 1,
        autoplay: true, // Enable auto-play
        autoplaySpeed: 7000, // Set slide interval to 7 seconds
        lazyLoad: "anticipated",
    };

    return (
        <Slider {...settings} className="slideshow-container">
            {shuffleArray([...gallery].reduce((acc, tweet) => {
                return [...acc, ...tweet.images.map(img => img.large)]
            }, [] as string[]))
                .map((image, index) =>
                    <img
                        key={index}
                        className="slideshow-item"
                        src={image}
                        alt={`Slide ${index + 1}`}
                        onLoad={() => window.dispatchEvent(new Event('resize'))}
                    />
                )}
        </Slider>
    );
};


export default Show