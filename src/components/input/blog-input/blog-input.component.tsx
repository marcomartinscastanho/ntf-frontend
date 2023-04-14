import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { OptionType } from "../../../types";

import "./blog-input.styles.css";

type Props = {
  options: OptionType[];
  value?: OptionType;
  onChange: (value: OptionType) => void;
};

export const BlogInput: FC<Props> = ({ options, value, onChange }) => {
  const [selected, setSelected] = useState<OptionType | undefined>(value);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setSelected(options.find((option) => option.value === e.target.value));

  useEffect(() => {
    if (selected) {
      onChange(selected);
    }
  }, [selected, onChange]);

  return (
    <label className="blog-input-container">
      <span className="blog-input-label">Blog</span>
      <select className="blog-input-select" value={value?.value} onChange={handleChange}>
        <option value={undefined} disabled selected hidden>
          Choose a blog
        </option>
        {options.map((option) => (
          <option className="blog-input-select-option" value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
