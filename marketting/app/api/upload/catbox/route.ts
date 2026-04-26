import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to catbox
    const catboxFormData = new FormData();
    catboxFormData.append("reqtype", "fileupload");
    catboxFormData.append("fileToUpload", file);

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxFormData,
    });

    const data = await response.text();

    if (!response.ok || !data) {
      return NextResponse.json(
        { error: "Failed to upload to catbox" },
        { status: 500 },
      );
    }

    // Catbox returns just the URL as plain text
    const url = data.trim();

    // Extract unique ID from URL (format: https://files.catbox.moe/XXXXX.ext)
    const match = url.match(/https:\/\/files\.catbox\.moe\/([^/]+)/);
    const uniqueId = match ? match[1] : null;

    if (!uniqueId) {
      return NextResponse.json(
        { error: "Failed to extract unique ID from catbox URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      id: uniqueId,
      url: url,
    });
  } catch (error) {
    console.error("Catbox upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
