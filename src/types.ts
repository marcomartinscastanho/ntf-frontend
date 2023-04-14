export type TweetImage = {
  id: string;
  position: number;
  name: string;
  thumb: string;
  large: string;
};

export type Blog = {
  id: string;
  name: string;
};

export type Tag = {
  name: string;
  genres: string[];
  num_posts: number;
};

export type TagOption = {
  name: string;
  num_posts: number;
};

export type Tweet = {
  url: string;
  id: string;
  author: string;
  source: string;
  text?: string;
  tweeted: Date;
  images: TweetImage[];
};

export enum Rating {
  F = "F",
  O = "O",
  M = "M",
  X = "X",
}

export const ratingCode = (r: Rating) => {
  switch (r) {
    case Rating.F:
      return 1;
    case Rating.O:
      return 2;
    case Rating.M:
      return 3;
    case Rating.X:
    default:
      return 4;
  }
};

export type OptionType = { value: string; label: string };

// Skeleton object builders
const tweetSkeleton: Tweet = {
  id: "",
  author: "",
  images: [],
  source: "",
  tweeted: new Date(),
  url: "",
};
export const buildTweet = (): Tweet => tweetSkeleton;
