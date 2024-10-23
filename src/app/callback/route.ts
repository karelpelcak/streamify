import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../lib/prisma";
import { randomUUID } from "crypto";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code provided" },
      { status: 400 }
    );
  }

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: "http://localhost:3000/callback/",
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: tokenResponse.status }
    );
  }

  const tokenData = await tokenResponse.json();
  const cookieStore = await cookies();
  const accessToken = tokenData.access_token;
  await prisma.tokenDB.create({
    data: {
      uUID_string: randomUUID(),
      token_string: accessToken,
    },
  });
  cookieStore.set("Token", accessToken);
  return NextResponse.redirect(new URL("/", request.url));
};
