import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GalleryItem } from "../../components/gallery-item/gallery-item.component";
import { Tweet } from "../../types";
import { getGallery } from "../../services/ntf-backend.api";
import { useSession } from "../../contexts/session.context";

import "./gallery.styles.css";

export const Gallery = () => {
  const [gallery, setGallery] = useState<Tweet[]>([]);
  const { backendAccessToken, clearBackendAccessToken, clearBackendRefreshToken } = useSession();
  const [selectedTweetId, setSelectedTweetId] = useState<string>();
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleSelectImage = useCallback(
    (tweetId: string, imageIx: number) => {
      if (tweetId !== selectedTweetId) {
        // if tweetId different from selectedTweet
        //   set selectedTweet
        setSelectedTweetId(tweetId);
        //   set selectedImages all images
        const tweet = gallery.find((tweet) => tweet.id === tweetId);
        if (tweet) {
          setSelectedImages(tweet.images.map((img) => img.position));
        }
      } else {
        if (selectedImages.includes(imageIx)) {
          // if this image was selected, deselect
          if (selectedImages.length === 1) {
            setSelectedTweetId(undefined);
          }
          setSelectedImages((images) => images.filter((image) => image !== imageIx));
        } else {
          // if this image was not selected, select
          setSelectedImages((images) => [...images, imageIx]);
        }
      }
    },
    [selectedTweetId, selectedImages, gallery, setSelectedTweetId, setSelectedImages]
  );

  // const handleClickDeleteSelected = useCallback(() => {
  //   setGallery((g) => {
  //     const updatedGallery = g
  //       .map((tweet) => ({
  //         ...tweet,
  //         images: tweet.images.filter((_, i) => !(tweet.id === selectedTweetId && selectedImages.includes(i))),
  //       }))
  //       .filter((tweet) => tweet.images.length > 0);
  //     //   chrome.storage.local.set({ gallery: updatedGallery });
  //     setSelectedTweetId(undefined);
  //     setSelectedImages([]);
  //     return updatedGallery;
  //   });
  // }, [selectedTweetId, selectedImages, setSelectedTweetId, setSelectedImages]);

  useEffect(() => {
    getGallery()
      .then(setGallery)
      .catch(() => {
        clearBackendAccessToken();
        clearBackendRefreshToken();
        navigate("/");
      });
  }, [backendAccessToken, clearBackendAccessToken, clearBackendRefreshToken, navigate]);

  return (
    <Fragment>
      <ul className="gallery-items-container">
        {[...gallery]
          .reverse()
          .map((tweet) =>
            tweet.images.map((image) => (
              <GalleryItem
                key={`${tweet.id}-${image.position}`}
                tweetId={tweet.id}
                imageIndex={image.position}
                image={image.thumb}
                selected={selectedTweetId === tweet.id && selectedImages.includes(image.position)}
                onToggleSelect={handleSelectImage}
              />
            ))
          )}
      </ul>
      {!!selectedTweetId && selectedImages.length > 0 && (
        <div className="gallery-buttons-container">
          {/* <button className="gallery-button gallery-button-delete" onClick={handleClickDeleteSelected}>
            D
          </button> */}
          <Link to={`/post/${selectedTweetId}/?images=${selectedImages.join(",")}`}>
            <button className="gallery-button gallery-button-post">P</button>
          </Link>
        </div>
      )}
    </Fragment>
  );
};

export default Gallery;
