import React, { ChangeEvent, FC, KeyboardEvent, MouseEvent, useCallback, useEffect, useState } from "react";

import "./hashtag-input.styles.css";
import { CloseCrossIcon } from "./components/close-cross.component";
import { TagOption } from "../../../types";

type Props = {
  defaultValue?: string[];
  placeholder?: string;
  options: TagOption[];
  onChange: (selected: string[]) => void;
};

export const HashtagInput: FC<Props> = ({ defaultValue, options, placeholder, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultValue ?? []);
  const [customHashtag, setCustomHashtag] = useState("");

  const handleChangeCustomHashtag = (e: ChangeEvent<HTMLInputElement>) => setCustomHashtag(e.target.value);
  const addCustomHashtag = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (customHashtag.length === 0) return;

      if (e.key === "Enter") {
        setSelectedOptions((selected) =>
          [...selected, customHashtag].filter((o, i, self) => i === self.findIndex((t) => t === o))
        );
        setCustomHashtag("");
      }
    },
    [customHashtag]
  );
  const handleTagOptionClick = (option: string) => {
    setSelectedOptions((selected) =>
      [...selected, ...option.split(" • ")].filter((o, i, self) => i === self.findIndex((t) => t === o))
    );
    setCustomHashtag("");
  };
  const handleRemoveTagClick = (e: MouseEvent<HTMLSpanElement>, option: string) => {
    e.preventDefault();
    setSelectedOptions((selected) => selected.filter((o) => o !== option));
  };

  const getDisplay = useCallback(() => {
    if (!selectedOptions || selectedOptions.length === 0) {
      return placeholder ?? "Select a few tags below...";
    }
    return (
      <>
        {selectedOptions.map((option) => (
          <div key={option} className="hashtags-tag-item">
            <span>{`#${option}`}</span>
            <span onClick={(e) => handleRemoveTagClick(e, option)} className="hashtags-tag-close">
              <CloseCrossIcon />
            </span>
          </div>
        ))}
      </>
    );
  }, [placeholder, selectedOptions]);

  useEffect(() => {
    if (defaultValue && !defaultValue.every((val) => selectedOptions.includes(val))) {
      setSelectedOptions((selected) => [...defaultValue, ...selected.filter((opt) => !defaultValue.includes(opt))]);
    }
  }, [defaultValue, selectedOptions]);

  useEffect(() => onChange(selectedOptions), [selectedOptions, onChange]);

  return (
    <label className="post-form-label">
      <span>{"Hashtags"}</span>
      <div className="hashtag-container">
        {/** hashtgs-input */}
        <div className="hashtags-tags-container">{getDisplay()}</div>
        {/** options-menu */}
        <div className="hashtag-options-container">
          {options
            .filter(
              (optionCouple) => !optionCouple.name.split(" • ").every((option) => selectedOptions.includes(option))
            )
            .filter((option) =>
              !!customHashtag && customHashtag.length > 0 ? option.name.includes(customHashtag) : true
            )
            .map((option) => (
              <div className="hashtag-option-item" key={option.name} onClick={() => handleTagOptionClick(option.name)}>
                <span className="hashtag-option-item-name">{option.name}</span> •{" "}
                <span className="hashtag-option-item-number">{option.num_posts}</span>
              </div>
            ))}
        </div>
        {/** custom-hashtag-input */}
        <input
          className="custom-hashtag-input"
          placeholder="Search or create a new hashtag..."
          value={customHashtag}
          onChange={handleChangeCustomHashtag}
          onKeyDown={addCustomHashtag}
        />
      </div>
    </label>
  );
};

export default HashtagInput;
