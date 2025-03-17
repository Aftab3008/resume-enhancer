"use server";

import { User } from "@prisma/client";
import { prisma } from "../db/prisma";
import { UserCreate } from "../../types";

export async function createUser({
  email,
  name,
  username,
  clerkId,
  imageUrl,
}: UserCreate): Promise<User | { error: string }> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return { error: "User already exists" };
  }

  return prisma.user.create({
    data: {
      email,
      name,
      username,
      clerkId,
      imageUrl,
    },
  });
}
