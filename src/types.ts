export type TweetImage = {
  name: string;
  thumb: string;
  large: string;
};

export type Tweet = {
  url: string;
  id: string;
  author: string;
  tweet_id: string;
  source: string;
  text?: string;
  tweeted: Date;
  images: TweetImage[];
};
