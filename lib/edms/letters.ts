import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { letters } from "@/lib/schema";

export interface LetterData {
  id: string;
  letterNumber: string;
  date: string;
  direction: string;
  from: string;
  to: string;
  toType: string;
  subject: string;
  status: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export async function getLettersData(): Promise<LetterData[]> {
  try {
    const allLetters = await db
      .select({
        id: letters.id,
        letterNumber: letters.letterNumber,
        date: letters.date,
        direction: letters.direction,
        from: letters.from,
        to: letters.to,
        toType: letters.toType,
        subject: letters.subject,
        status: letters.status,
        projectId: letters.projectId,
        createdAt: letters.createdAt,
        updatedAt: letters.updatedAt,
      })
      .from(letters)
      .orderBy(desc(letters.date));

    return allLetters.map((letter) => ({
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

export async function getLetterManagementData(
  _sessionUser: any,
  projectId?: string,
) {
  try {
    const lettersData = await getLettersData();

    // Filter by project if projectId is provided
    const filteredLetters = projectId
      ? lettersData.filter((l) => l.projectId === projectId)
      : lettersData;

    const outgoingLetters = filteredLetters.filter(
      (l) => l.direction === "outgoing",
    );
    const incomingLetters = filteredLetters.filter(
      (l) => l.direction === "incoming",
    );
    const pendingLetters = filteredLetters.filter(
      (l) => l.status === "pending",
    );

    return {
      letters: filteredLetters,
      metrics: [
        {
          label: "Total Letters",
          value: filteredLetters.length.toString(),
          description: `${filteredLetters.length} total letters`,
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Outgoing",
          value: outgoingLetters.length.toString(),
          description: `${outgoingLetters.length} outgoing letters`,
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "Incoming",
          value: incomingLetters.length.toString(),
          description: `${incomingLetters.length} incoming letters`,
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Pending",
          value: pendingLetters.length.toString(),
          description: `${pendingLetters.length} letters pending`,
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: false,
      statusMessage: "Letter data loaded successfully",
    };
  } catch (error) {
    console.error("Error fetching letter management data:", error);
    return {
      letters: [] as LetterData[],
      metrics: [
        {
          label: "Total Letters",
          value: "0",
          description: "Error loading data",
          tone: "blue" as const,
          icon: "documents" as const,
        },
        {
          label: "Outgoing",
          value: "0",
          description: "Error loading data",
          tone: "emerald" as const,
          icon: "reviews" as const,
        },
        {
          label: "Incoming",
          value: "0",
          description: "Error loading data",
          tone: "amber" as const,
          icon: "transmittals" as const,
        },
        {
          label: "Pending",
          value: "0",
          description: "Error loading data",
          tone: "rose" as const,
          icon: "notifications" as const,
        },
      ],
      isUsingFallbackData: true,
      statusMessage: "Error loading letter data",
    };
  }
}

export async function getLetters() {
  return getLettersData();
}
