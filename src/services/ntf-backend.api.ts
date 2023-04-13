export const login = async (username: string, password: string) => {
  const url = "http://127.0.0.1:8000/api/token/";
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
  // TODO: every api call must have a check if it worked, and if not, clear the session token and redirect to "/"
  const respBody = await response.json();
  console.log("respBody", respBody);
  const access: string = respBody.access;
  const refresh: string = respBody.refresh;
  console.log("access", access);
  console.log("refresh", refresh);
  return [access, refresh];
};
