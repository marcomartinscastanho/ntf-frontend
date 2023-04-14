import React, { FC } from "react";
import { Rating } from "../../../types";
import { RatingInputButton } from "./button/rating-input-button.component";

import "./rating-input.styles.css";

type Props = {
  label: string;
  value?: Rating;
  onChange: (value: Rating) => void;
};

export const RatingInput: FC<Props> = ({ label, value, onChange }) => {
  return (
    <>
      <label className="post-form-label" htmlFor="rating-input">
        <span>{label}</span>
      </label>
      <div id="rating-input" className="rating-input-buttons">
        <RatingInputButton rating={Rating.F} selected={value === Rating.F} onClick={onChange} />
        <RatingInputButton rating={Rating.O} selected={value === Rating.O} onClick={onChange} />
        <RatingInputButton rating={Rating.M} selected={value === Rating.M} onClick={onChange} />
        <RatingInputButton rating={Rating.X} selected={value === Rating.X} onClick={onChange} />
      </div>
    </>
  );
};

export default RatingInput;
