import Cookies from "js-cookie";

export const createSession = (sessionData) => {
  // Store session data in a cookie for 30 minutes
  Cookies.set("userSession", JSON.stringify(sessionData), { expires: 1 / 48 });
};

export const getSession = () => {
  const session = Cookies.get("userSession");
  return session ? JSON.parse(session) : null;
};

export const clearSession = () => {
  Cookies.remove("userSession");
};
