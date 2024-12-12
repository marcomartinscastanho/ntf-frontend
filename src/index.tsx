import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SessionProvider } from "./contexts/session.context";
import { Gallery } from "./routes/gallery/gallery.component";
import { Post } from "./routes/post/post.component";
import { Show } from "./routes/show/show.component";
import { Auth, action as authAction } from "./routes/auth/auth.component";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Auth />,
        action: authAction,
      },
      {
        path: "gallery",
        element: <Gallery />,
      },
      {
        path: "show",
        element: <Show />,
      },
      {
        path: "post/:tweetId/",
        element: <Post />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  </React.StrictMode>
);
