import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const _uuid = searchParams.get("_uuid");

  const tokenFromDb = await prisma.tokenDB.findFirst({
    where: {
      uUID_string: _uuid?.toString(),
    },
    select: {
      token_string: true,
    },
  });

  return NextResponse.json({
    msg: tokenFromDb,
  });
};
