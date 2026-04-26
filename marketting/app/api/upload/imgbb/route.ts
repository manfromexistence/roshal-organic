import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Upload to imgbb
    const imgbbApiKey = process.env.IMGBB;
    if (!imgbbApiKey) {
      return NextResponse.json(
        { error: "IMGBB API key not configured" },
        { status: 500 },
      );
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append("image", base64);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: imgbbFormData,
      },
    );

    const data = await response.json();

    if (!response.ok || data.status !== 200) {
      return NextResponse.json(
        { error: "Failed to upload to imgbb" },
        { status: 500 },
      );
    }

    // Extract unique ID from URL (format: https://i.ibb.co/XXXXX/filename.ext)
    const url = data.data.url;
    const match = url.match(/https:\/\/i\.ibb\.co\/([^/]+)/);
    const uniqueId = match ? match[1] : null;

    if (!uniqueId) {
      return NextResponse.json(
        { error: "Failed to extract unique ID from imgbb URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      id: uniqueId,
      url: url,
      deleteUrl: data.data.delete_url,
    });
  } catch (error) {
    console.error("ImgBB upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
