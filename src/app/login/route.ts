import { NextResponse } from "next/server";

export const GET = () => {
  const state = generateRandomString(16);

  const url = new URL("https://accounts.spotify.com");
  url.pathname = "/authorize";
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.CLIENT_ID as string);
  url.searchParams.set("scope", "user-read-currently-playing");
  url.searchParams.set("redirect_uri", "http://localhost:3000/callback/");
  url.searchParams.set("state", state);

  return NextResponse.redirect(url);
};

function generateRandomString(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
