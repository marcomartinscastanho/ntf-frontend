import React, { Fragment, RefObject, createRef, useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GalleryItem } from "../../components/gallery-item/gallery-item.component";
import { Tweet, TweetImage, isAfterPostStateValid } from "../../types";
import { deleteImage, getGallery } from "../../services/ntf-backend.api";
import { useSession } from "../../contexts/session.context";

import "./gallery.styles.css";

export const Gallery = () => {
  const [gallery, setGallery] = useState<Tweet[]>([]);
  const { clearBackendAccessToken, clearBackendRefreshToken } = useSession();
  const [selectedTweetId, setSelectedTweetId] = useState<string>();
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const refs = gallery
    .reduce((acc, tweet) => {
      return [...acc, ...tweet.images];
    }, [] as TweetImage[])
    .reduce((acc, image) => {
      acc[image.id] = createRef<HTMLDivElement>();
      return acc;
    }, {} as { [key: string]: RefObject<HTMLDivElement> });

  const selectAllTweet = useCallback(
    (tweetId: string) => {
      setSelectedTweetId(tweetId);
      const tweet = gallery.find((tweet) => tweet.id === tweetId);
      if (tweet) {
        setSelectedImages(tweet.images.map((img) => img.position));
      }
    },
    [gallery]
  );

  const handleSelectImage = useCallback(
    (tweetId: string, imageIx: number) => {
      if (tweetId !== selectedTweetId) {
        selectAllTweet(tweetId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedImages, selectedTweetId]
  );

  const handleClickDeleteSelected = useCallback(() => {
    const images =
      gallery
        .find((tweet) => tweet.id === selectedTweetId)
        ?.images.filter((img) => selectedImages.includes(img.position)) ?? [];

    Promise.all(images.map((img) => img.id).map(deleteImage)).then(() => {
      setSelectedTweetId(undefined);
      setSelectedImages([]);
      setGallery((tweets) =>
        tweets
          .map((tweet) => ({
            ...tweet,
            images: tweet.images.filter(
              (image) => !(tweet.id === selectedTweetId && selectedImages.includes(image.position))
            ),
          }))
          .filter((tweet) => tweet.images.length > 0)
      );
    });
  }, [gallery, selectedImages, selectedTweetId]);

  useEffect(() => {
    getGallery()
      .then(setGallery)
      .catch(() => {
        clearBackendAccessToken();
        clearBackendRefreshToken();
        navigate("/");
      });
  }, [clearBackendAccessToken, clearBackendRefreshToken, navigate]);

  useEffect(() => {
    if (isAfterPostStateValid(locationState)) {
      const { next: nextTweetId } = locationState;
      const nextTweet = gallery.find((tweet) => tweet.id === nextTweetId);
      const nextTweetLastImage = nextTweet?.images.at(-1);
      if (nextTweetLastImage) {
        const ref = refs[nextTweetLastImage.id];
        ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      selectAllTweet(nextTweetId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery, locationState]);

  return (
    <Fragment>
      <ul className="gallery-items-container">
        {[...gallery].map((tweet) =>
          tweet.images.map((image) => (
            <GalleryItem
              key={`${tweet.id}-${image.position}`}
              ref={refs[image.id]}
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
          <button className="gallery-button gallery-button-delete" onClick={handleClickDeleteSelected}>
            D
          </button>
          <Link to={`/post/${selectedTweetId}/?images=${selectedImages.join(",")}`}>
            <button className="gallery-button gallery-button-post">P</button>
          </Link>
        </div>
      )}
    </Fragment>
  );
};

export default Gallery;
