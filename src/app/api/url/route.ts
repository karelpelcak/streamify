import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const accestoken = searchParams.get("accestoken");

  const tokenFromDb = await prisma.tokenDB.findFirst({
    where: {
      token_string: accestoken?.toString(),
    },
    select: {
      uUID_string: true,
    },
  });

  return NextResponse.json({
    msg: tokenFromDb,
  });
};
