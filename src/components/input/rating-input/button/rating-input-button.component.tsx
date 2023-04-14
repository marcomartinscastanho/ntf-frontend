import React, { FC } from "react";
import { Rating } from "../../../../types";

import "./rating-input-button.styles.css";

type Props = {
  rating: Rating;
  selected: boolean;
  onClick: (rating: Rating) => void;
};

export const RatingInputButton: FC<Props> = ({ rating, selected, onClick }) => (
  <button className="rating-input-button" disabled={selected} onClick={() => onClick(rating)}>
    {rating}
  </button>
);

export default RatingInputButton;
