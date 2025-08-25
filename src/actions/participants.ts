"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/db";
import { participants } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getParticipantsAction = async () => {
  const results = await db.query.participants.findMany({
    with: {
      event: {
        with: {
          participants: true,
          winners: true,
        },
      },
      user: {
        with: {
          participants: true,
          winners: true,
        },
      },
    },
  });
  return results ?? [];
};

export const enrollForAnEventAction = async (eventId: number) => {
  try {
    const s = await auth.api.getSession({
      headers: await headers(),
    });
    const cur_user = s?.user;

    if (!cur_user) return { ok: false, error: "not-auth" };

    if ((cur_user.roll_number === "#NUll#" || cur_user.phone_number === "#NUll#")) return { ok: false, error: "roll-not-found" };

    const res = await db
      .insert(participants)
      .values({
        eventId: eventId,
        userId: cur_user.id,
      })
      .returning();

    revalidatePath(`/events`);
    revalidatePath(`/events/${eventId}`);

    return { ok: res ? true : false, error: res ? "" : "unknown" };
  } catch {
    return { ok: false, error: "server error" };
  }
};
