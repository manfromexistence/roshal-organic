import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { letters, minutesOfMeeting } from "@/lib/schema";

export async function getLetters(projectId?: string) {
  try {
    if (!projectId) return [];

    const lettersData = await db
      .select()
      .from(letters)
      .where(eq(letters.projectId, projectId))
      .orderBy(desc(letters.date));

    return lettersData.map((letter) => ({
      id: letter.id,
      letterNumber: letter.letterNumber || "N/A",
      date: letter.date
        ? new Date(letter.date).toLocaleDateString()
        : "Not dated",
      direction: letter.direction || "unknown",
      from: letter.from || "Unknown",
      to: letter.to || "Unknown",
      toType: letter.toType || "Unknown",
      subject: letter.subject || "No subject",
      status: letter.status || "unknown",
      projectId: letter.projectId || "",
      createdAt: letter.createdAt
        ? new Date(letter.createdAt).toLocaleDateString()
        : "Unknown",
      updatedAt: letter.updatedAt
        ? new Date(letter.updatedAt).toLocaleDateString()
        : "Unknown",
    }));
  } catch (error) {
    console.error("Error fetching letters:", error);
    return [];
  }
}

export async function getMinutesOfMeeting(projectId?: string) {
  try {
    if (!projectId) return [];

    const momData = await db
      .select()
      .from(minutesOfMeeting)
      .where(eq(minutesOfMeeting.projectId, projectId))
      .orderBy(desc(minutesOfMeeting.meetingDate));

    return momData.map((mom) => ({
      chairperson: mom.chairperson || "Unknown",
      id: mom.id,
      momNumber: mom.momNumber || "N/A",
      meetingDate: mom.meetingDate
        ? new Date(mom.meetingDate).toLocaleDateString()
        : "Not dated",
      meetingType: mom.meetingType || "Unknown",
      title: mom.title || "No title",
      location: mom.location || "Unknown",
      status: mom.status || "unknown",
      projectId: mom.projectId || "",
    }));
  } catch (error) {
    console.error("Error fetching minutes of meeting:", error);
    return [];
  }
}
