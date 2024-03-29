import React, { ChangeEvent, FormEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Hearts } from "react-loader-spinner";
import { DangerousHtml } from "../../utils/dangerous-html.utils";
import { BlogInput } from "../../components/input/blog-input/blog-input.component";
import { HashtagInput } from "../../components/input/hashtag-input/hashtag-input.component";
import { RatingInput } from "../../components/input/rating-input/rating-input.component";
import { TextAreaInput } from "../../components/input/textarea-input/textarea-input.component";
import { TextInput } from "../../components/input/text-input/text-input.component";
import { Blog, buildTweet, OptionType, Rating, Tag, TagOption, Tweet } from "../../types";
import { useSession } from "../../contexts/session.context";
import { getTweet, getBlogs, getTags, savePost } from "../../services/ntf-backend.api";
import { cleanTweetText } from "../../utils/clean-text";

// TODO: parse the name to form an hashtag
// https://github.com/beaugunderson/emoji-aware this to remove emojis
// combining split and onlyEmoji

import "./post.styles.css";

type PostRouteParams = {
  tweetId: string;
};

const blogToOpt = (b: Blog): OptionType => ({ value: b.id, label: b.name });

const tagsToOpts = (tags: Tag[]): TagOption[] => {
  return tags
    .reduce((opts, tag) => {
      return [
        ...opts,
        ...tag.genres.map((genre) => {
          const fullGenreObject = tags.find((t) => t.name === genre);
          const genrePosts = fullGenreObject ? fullGenreObject.num_posts : 0;
          return { name: `${genre} • ${tag.name}`, num_posts: tag.num_posts + genrePosts };
        }),
      ] as TagOption[];
    }, [] as TagOption[])
    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
    .sort((a, b) => b.num_posts - a.num_posts);
};

export const Post = () => {
  const { tweetId } = useParams<PostRouteParams>();
  const [searchParams] = useSearchParams();
  const { clearBackendAccessToken, clearBackendRefreshToken } = useSession();
  const navigate = useNavigate();
  const [tweet, setTweet] = useState<Tweet>(buildTweet());
  const [blogOptions, setBlogOptions] = useState<Blog[]>([]);
  const [tagOptions, setTagOptions] = useState<Tag[]>([]);
  const [comment, setComment] = useState("");
  const [hashtags, setHashTags] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [rating, setRating] = useState<Rating>(Rating.M);
  const [blog, setBlog] = useState<Blog>();
  const [isPosting, setIsPosting] = useState(false);

  const post = async (queue: boolean = true) => {
    if (!blog) {
      alert("Select a blog");
      return;
    }

    setIsPosting(true);
    // this is so that we see the spinner for at least 1 second
    Promise.all([
      new Promise((r) => setTimeout(r, 500)),
      savePost(
        queue,
        tweet.id,
        comment,
        hashtags,
        source,
        rating,
        blog.id,
        tweet.images.map((img) => img.id)
      ),
    ])
      .then(([_, next]) => {
        if (next) {
          navigate("/gallery", { state: { next }, replace: true });
        } else {
          navigate(-1);
        }
      })
      .finally(() => setIsPosting(false));
  };

  const handleChangeComment = (e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value);
  const handleChangeSource = (e: ChangeEvent<HTMLInputElement>) => setSource(e.target.value);
  const handleChangeBlog = (o: OptionType) => setBlog(blogOptions.find((b) => b.id === o.value));
  const handleChangeRating = (r: Rating) => setRating(r);

  const handleApiErrors = useCallback(() => {
    clearBackendAccessToken();
    clearBackendRefreshToken();
    navigate("/");
  }, [clearBackendAccessToken, clearBackendRefreshToken, navigate]);

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    return navigate(-1);
    // return navigate("/gallery", { state: { id: 7, color: 'green' } });
  };

  const handleQueue = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("QUEUE");
    await post(true);
  };

  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("POST");
    await post(false);
  };

  useEffect(() => {
    getBlogs()
      .then((blogs) => {
        setBlogOptions(blogs);
        setBlog(blogs.at(0));
      })
      .catch(handleApiErrors);
  }, [handleApiErrors]);

  useEffect(() => {
    getTags().then(setTagOptions).catch(handleApiErrors);
  }, [handleApiErrors]);

  useEffect(() => {
    if (!tweetId) return;

    getTweet(tweetId)
      .then((tweet) => {
        setTweet({
          ...tweet,
          images: tweet.images.filter((img) => searchParams.get("images")?.split(",").includes(String(img.position))),
        });
        setSource(tweet.source);
      })
      .catch(handleApiErrors);
  }, [handleApiErrors, searchParams, tweetId]);

  return (
    <div className="post-container">
      {isPosting && (
        <div className="posting-spinner-container">
          <Hearts
            height="200"
            width="200"
            color="#dc5ee5"
            ariaLabel="hearts-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      <ul className="post-images-container">
        {tweet.images.map((image, i) => (
          <li className="post-image-frame" key={image.position}>
            <a target="_blank" rel="noopener noreferrer" href={image.large}>
              <img className="post-image-thumbnail" alt={`${tweet.id}/${i}`} src={image.thumb} />
            </a>
          </li>
        ))}
      </ul>
      {tweet.text && <DangerousHtml as="p" className="post-tweet-text" _html={cleanTweetText(tweet.text)} />}
      <form className="post-form-container" onSubmit={handlePost}>
        <TextAreaInput label="Comment" value={comment} onChange={handleChangeComment} />
        <HashtagInput
          defaultValue={tweet.author.length > 0 ? [tweet.author] : undefined}
          options={tagsToOpts(tagOptions)}
          onChange={setHashTags}
        />
        <TextInput label="Source" value={source} onChange={handleChangeSource} />
        <RatingInput label="Rating" value={rating} onChange={handleChangeRating} />
        <BlogInput
          options={blogOptions.map(blogToOpt)}
          value={blog ? blogToOpt(blog) : undefined}
          onChange={handleChangeBlog}
        />
        <div className="post-form-buttons-container">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleQueue}>Queue</button>
          <button type="submit">Post</button>
        </div>
      </form>
    </div>
  );
};

export default Post;
