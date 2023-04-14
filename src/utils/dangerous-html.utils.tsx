import React, { BaseHTMLAttributes, FC } from "react";
import { sanitize } from "dompurify";

type DangerousHtmlProps = {
  _html?: string;
  as?: "div" | "p" | "a" | "span" | "h1" | "h2";
} & BaseHTMLAttributes<HTMLDivElement>;

export const DangerousHtml: FC<DangerousHtmlProps> = ({ as = "div", _html, className }) => {
  if (!_html) return null;

  const As = as;
  return (
    <As
      dangerouslySetInnerHTML={{
        __html: sanitize(_html).replaceAll("><video ", "><video oncontextmenu='return false;'"),
      }}
      className={className}
    />
  );
};

export default DangerousHtml;
