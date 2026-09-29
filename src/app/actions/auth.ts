"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword, setSession, clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Missing fields" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "User already exists with this email" };
  }

  const hashedPassword = await hashPassword(password);

  // If this is the very first user, make them an ADMIN
  const userCount = await prisma.user.count();
  const role = userCount === 0 ? "ADMIN" : "USER";

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role, 
    },
  });

  await setSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect("/");
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Missing fields" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    return { error: "Invalid email or password" };
  }

  await setSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  if (user.role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/");
  }
}

export async function logoutUser() {
  await clearSession();
  redirect("/login");
}

export async function getSessionAction() {
  const { getSession } = await import("@/lib/auth");
  return await getSession();
}
