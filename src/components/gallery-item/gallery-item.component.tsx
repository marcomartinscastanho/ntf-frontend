import React, { ForwardedRef } from "react";

import "./gallery-item.styles.css";

type Props = {
  tweetId: string;
  imageIndex: number;
  image: string;
  selected?: boolean;
  onToggleSelect: (tweetId: string, imageIndex: number) => void;
};

export function GalleryItemInner(
  { tweetId, imageIndex, image, selected, onToggleSelect }: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      className={`gallery-item-thumbnail-frame ${selected ? "selected" : ""}`}
      ref={ref}
      onClick={() => onToggleSelect(tweetId, imageIndex)}
    >
      <img className="gallery-item-thumbnail" alt={`${tweetId}/${imageIndex}`} src={image} />
    </div>
  );
}

export const GalleryItem = React.forwardRef<HTMLDivElement, Props>((props, ref) => GalleryItemInner(props, ref));
GalleryItem.displayName = "Avatar";

export default GalleryItem;
