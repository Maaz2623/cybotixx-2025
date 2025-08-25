"use server";

import { db } from "@/lib/db/db";
import { event, participants, user } from "@/lib/db/schema";

export const getCybotixxStats = async () => {
  const totalUsers = (await db.$count(user)) ?? 0;
  const totalEvents = (await db.$count(event)) ?? 0;
  const totalParticipants = (await db.$count(participants)) ?? 0;

  console.log({ totalUsers, totalEvents, totalParticipants });

  return { totalUsers, totalEvents, totalParticipants };
};
