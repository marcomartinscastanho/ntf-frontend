export type TweetImage = {
  name: string;
  thumb: string;
  large: string;
};

export type Tweet = {
  id: string;
  date: Date;
  source: string;
  text?: string;
  images: TweetImage[];
};
