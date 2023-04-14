export const cleanTweetText = (text: string): string => {
  let txt = text;
  txt = cleanEmojis(txt);
  txt = cleanHashtags(txt);
  txt = cleanHandles(txt);
  txt = cleanLinks(txt);

  return txt;
};

const cleanEmojis = (text: string): string => {
  const emojiRegex = /\s\[https.*emoji.*\.svg\]/gm;

  return text.replaceAll(emojiRegex, "");
};

const cleanHashtags = (text: string): string => {
  const hashtagRegex = /#(.*?)\s\[(.*?)\]/gm;

  let cleanText = text;
  let match: RegExpExecArray | null;
  while ((match = hashtagRegex.exec(cleanText)) !== null) {
    const hashtag = `~~~${match[1]}`;
    const hashtagUrl = `https://twitter.com${match[2]}`;
    cleanText = cleanText.replace(
      match[0],
      `<a target="_blank" rel="noopener noreferrer" href="${hashtagUrl}">${hashtag}</a>`
    );
  }
  cleanText = cleanText.replaceAll("~~~", "#");

  return cleanText;
};

const cleanHandles = (text: string): string => {
  const hashtagRegex = /@(.*?)\s\[(.*?)\]/gm;

  let cleanText = text;
  let match: RegExpExecArray | null;
  while ((match = hashtagRegex.exec(cleanText)) !== null) {
    const handle = `~~~${match[1]}`;
    const handleUrl = `https://twitter.com${match[2]}`;
    cleanText = cleanText.replace(
      match[0],
      `<a target="_blank" rel="noopener noreferrer" href="${handleUrl}">${handle}</a>`
    );
  }
  cleanText = cleanText.replaceAll("~~~", "@");

  return cleanText;
};

const cleanLinks = (text: string): string => {
  const hashtagRegex = /https(.*?)\s\[(.*?)\]/gm;

  let cleanText = text;
  let match: RegExpExecArray | null;
  while ((match = hashtagRegex.exec(cleanText)) !== null) {
    const shortUrl = match[2];
    cleanText = cleanText.replace(
      match[0],
      `<a target="_blank" rel="noopener noreferrer" href="${shortUrl}">${shortUrl}</a>`
    );
  }
  cleanText = cleanText.replaceAll("~~~", "@");

  return cleanText;
};
