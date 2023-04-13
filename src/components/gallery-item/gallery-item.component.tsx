import React, { FC } from "react";

import "./gallery-item.styles.css";

type Props = {
  tweetId: string;
  imageIndex: number;
  image: string;
  selected?: boolean;
  onToggleSelect: (tweetId: string, imageIndex: number) => void;
};

export const GalleryItem: FC<Props> = ({ tweetId, imageIndex, image, selected, onToggleSelect }) => {
  return (
    <div
      className={`gallery-item-thumbnail-frame ${selected ? "selected" : ""}`}
      onClick={() => onToggleSelect(tweetId, imageIndex)}
    >
      <img className="gallery-item-thumbnail" alt={`${tweetId}/${imageIndex}`} src={image} />
    </div>
  );
};

export default GalleryItem;
