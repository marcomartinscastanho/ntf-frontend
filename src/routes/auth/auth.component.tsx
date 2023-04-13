import React, { useEffect } from "react";
import { ActionFunction, Form, Navigate, useActionData } from "react-router-dom";
import { useSession } from "../../contexts/session.context";
import { login } from "../../services/ntf-backend.api";

import "./auth.styles.css";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  if (typeof username === "string" && typeof password === "string") {
    const [backendAccessToken, backendRefreshToken] = await login(username, password);
    // TODO: await login to NT
    return { backendAccessToken, backendRefreshToken /** ntToken */ };
  }
};

export const Auth = () => {
  const {
    // ntToken,
    backendAccessToken,
    backendRefreshToken,
    setNtToken,
    setBackendAccessToken,
    setBackendRefreshToken,
  } = useSession();
  const actionData = useActionData() as { [key: string]: string };

  useEffect(() => {
    if (actionData?.ntToken) {
      setNtToken(actionData.ntToken);
    }
  }, [actionData?.ntToken, setNtToken]);
  useEffect(() => {
    if (actionData?.backendAccessToken) {
      setBackendAccessToken(actionData.backendAccessToken);
    }
  }, [actionData?.backendAccessToken, setBackendAccessToken]);
  useEffect(() => {
    if (actionData?.backendRefreshToken) {
      setBackendRefreshToken(actionData.backendRefreshToken);
    }
  }, [actionData?.backendRefreshToken, setBackendRefreshToken]);

  // if the tokens are stored in the local storage
  if (/*!!ntToken && */ !!backendAccessToken && !!backendRefreshToken) {
    return <Navigate to="/gallery" />;
  }

  return (
    <div className="auth-container">
      <Form method="post" id="auth-form" className="auth-form">
        <label className="auth-form-label">
          <span>Username</span>
          <input name="username" placeholder="usename" />
        </label>
        <label className="auth-form-label">
          <span>Password</span>
          <input type="password" name="password" placeholder="password" />
        </label>
        <button type="submit">Save</button>
      </Form>
    </div>
  );
};

export default Auth;

// reference: https://stackoverflow.com/questions/72514608/google-chrome-extension-manifest-version-3-to-handle-google-sign-ins/73345256#73345256
// reference: https://codesandbox.io/s/cs3k1
// reference: https://stackoverflow.com/questions/65625854/how-to-integrate-gapi-in-chrome-extensions-manifest-v3
