import React, { ChangeEvent, FC } from "react";

import "./textarea-input.styles.css";

type Props = {
  label: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

export const TextAreaInput: FC<Props> = ({ label, value, onChange }) => (
  <label className="post-form-label">
    <span>{label}</span>
    <textarea className="post-form-input" value={value} onChange={onChange} />
  </label>
);

export default TextAreaInput;
