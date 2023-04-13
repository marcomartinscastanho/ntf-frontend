import React, { ChangeEvent, FormEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Hearts } from "react-loader-spinner";
import { BlogInput } from "../../components/input/blog-input/blog-input.component";
import { RatingInput } from "../../components/input/rating-input/rating-input.component";
import { TextAreaInput } from "../../components/input/textarea-input/textarea-input.component";
import { TextInput } from "../../components/input/text-input/text-input.component";
import { HashtagInput } from "../../components/input/hashtag-input/hashtag-input.component";
import { Blog, buildTweet, GroupType, OptionType, Rating, ratingCode, Tag, Tweet } from "../../types";
import { useSession } from "../../contexts/session.context";
// import {
//   getPostCompose,
//   setPostComplete,
//   setPostCompose,
//   setPostOptions,
//   setPostPartInsert,
//   setPostPartUpdate,
//   setPostPartUpdateComment,
//   setPostPublish,
//   setPostQueue,
//   upload,
// } from "../../services/api";
import { getTweet, getBlogs, getTags } from "../../services/ntf-backend.api";

import "./post.styles.css";

type PostRouteParams = {
  tweetId: string;
};

const srcToOpts = (src?: string): OptionType[] => {
  if (!src) {
    return [];
  }
  const poster = src.split("/").pop();
  return poster ? [{ value: poster, label: poster }] : [];
};

export const Post = () => {
  const { tweetId } = useParams<PostRouteParams>();
  console.log("id", tweetId);

  const [searchParams] = useSearchParams();
  const { clearBackendAccessToken, clearBackendRefreshToken } = useSession();
  const navigate = useNavigate();

  // images here
  //   console.log("searchParams", searchParams.get("images")?.split(","));
  const [tweet, setTweet] = useState<Tweet>(buildTweet());
  const [blogOptions, setBlogOptions] = useState<Blog[]>([]);
  const [tagOptions, setTagOptions] = useState<Tag[]>([]);
  const [comment, setComment] = useState("");
  const [hashtags, setHashTags] = useState("");
  const [source, setSource] = useState("");
  const [rating, setRating] = useState<Rating>(Rating.M);
  const [blog, setBlog] = useState<Blog>();
  const [isPosting, setIsPosting] = useState(false);

  const post = async (queue?: boolean) => {
    if (!rating) {
      alert("Select a rating");
      return;
    }

    if (!blog) {
      alert("Select a blog");
      return;
    }
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
  };

  const handleQueue = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("QUEUE");
    await post(true);
  };

  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("POST");
    await post();
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
          {/* <span className={`posting-stage ${postingStage === "SUCCESS" ? "posting-success" : ""}`}>{postingStage}</span> */}
        </div>
      )}
      <ul className="post-images-container">
        {tweet.images.map((image, i) => (
          <li className="post-image-frame">
            <img className="post-image-thumbnail" alt={`${tweet.id}/${i}`} src={image.thumb} />
          </li>
        ))}
      </ul>
      {tweet.text && <p className="post-tweet-text">{tweet.text}</p>}
      <form className="post-form-container" onSubmit={handlePost}>
        <TextAreaInput label="Comment" value={comment} onChange={handleChangeComment} />
        {/* <HashtagInput
          placeholder="Select..."
          defaultValue={srcToOpts(tweet.source)}
          groupedOptions={Object.entries(genres).map<GroupType>(([genre, subgenres]) => ({
            value: genre,
            label: genre,
            options: subgenres.map((subgenre) => ({ value: subgenre, label: subgenre })),
          }))}
          onChange={(values) => setHashTags(values.map((v) => `#${v.label}`).join(""))}
        /> */}
        <TextInput label="Source" value={source} onChange={handleChangeSource} />
        <RatingInput label="Rating" value={rating} onChange={handleChangeRating} />
        <BlogInput
          options={blogOptions.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
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