import { Blog, Rating, Tag, Tweet } from "../types";
import { LocalStorage } from "./local-storage";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : `${window.location.protocol}//${window.location.hostname}:8000`;

const accessTtoken = () => {
  return LocalStorage.get("backendAccessToken");
};

export const login = async (username: string, password: string) => {
  const url = API_BASE_URL + "/api/token/";
  const headers = {
    "Content-Type": "application/json",
  };
  const body = {
    username,
    password,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });
  const respBody = await response.json();
  const access: string = respBody.access;
  const refresh: string = respBody.refresh;
  return [access, refresh];
};

export const getGallery = async (): Promise<Tweet[]> => {
  const token = accessTtoken();
  if (!token) {
    Promise.reject("no access token in storage");
  }
  const url = API_BASE_URL + "/tweets/";
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, { headers });
  const responseBody = await response.json();

  if (response.status === 200) {
    return responseBody;
  }
  return Promise.reject(responseBody);
};

export const getTweet = async (id: string): Promise<Tweet> => {
  const token = accessTtoken();
  if (!token) {
    Promise.reject("no access token in storage");
  }

  const url = API_BASE_URL + `/tweets/${id}/`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, { headers });
  const responseBody = await response.json();

  if (response.status === 200) {
    return responseBody;
  }
  return Promise.reject(responseBody);
};

export const getBlogs = async (): Promise<Blog[]> => {
  const token = accessTtoken();
  if (!token) {
    Promise.reject("no access token in storage");
  }
  const url = API_BASE_URL + "/options/blogs/";
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, { headers });
  const responseBody = await response.json();

  if (response.status === 200) {
    return responseBody;
  }
  return Promise.reject(responseBody);
};

export const getTags = async (): Promise<Tag[]> => {
  const token = accessTtoken();
  if (!token) {
    Promise.reject("no access token in storage");
  }
  const url = API_BASE_URL + "/options/tags/";
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, { headers });
  const responseBody = await response.json();

  if (response.status === 200) {
    return responseBody;
  }
  return Promise.reject(responseBody);
};

export const savePost = async (
  queue: boolean = true,
  tweetId: string,
  comment: string,
  hashtags: string[],
  source: string,
  rating: Rating,
  blog: string,
  images: string[]
) => {
  const token = accessTtoken();
  if (!token) {
    Promise.reject("no access token in storage");
  }
  const url = API_BASE_URL + "/posts/";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const body = {
    tweet: tweetId,
    comment,
    tags: hashtags,
    source,
    rating,
    blog,
    queue,
    images,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  const respBody = await response.json();
  if ("next" in respBody) {
    const next: string = respBody.next;
    return next;
  }
  return undefined;
};

export const deleteImage = async (id: string): Promise<void> => {
  const token = accessTtoken();
  if (!token) {
    Promise.reject("no access token in storage");
  }

  const url = API_BASE_URL + `/tweets/images/${id}/`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, { method: "DELETE", headers });

  if (response.status === 204) {
    return Promise.resolve();
  }
  return Promise.reject(response.status);
};
