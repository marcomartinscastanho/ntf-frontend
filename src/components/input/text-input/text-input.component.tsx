import React, { ChangeEvent, FC } from "react";

import "./text-input.styles.css";

type Props = {
  label: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const TextInput: FC<Props> = ({ label, value, onChange }) => (
  <label className="post-form-label">
    <span>{label}</span>
    <input className="post-form-input" type="text" value={value} onChange={onChange} />
  </label>
);

export default TextInput;
