import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    if (file.size > 32 * 1024 * 1024) {
      return NextResponse.json(
        { error: "ImgBB only supports uploads up to 32 MB" },
        { status: 400 },
      );
    }

    const imgbbApiKey = process.env.IMGBB_API_KEY || process.env.IMGBB;

    if (!imgbbApiKey) {
      return NextResponse.json(
        { error: "IMGBB API key is not configured" },
        { status: 500 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    const imgbbFormData = new FormData();
    imgbbFormData.append("image", base64);
    imgbbFormData.append("name", file.name);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: imgbbFormData,
      },
    );

    const data = await response.json();
    const uploadError =
      typeof data?.error?.message === "string"
        ? data.error.message
        : "Failed to upload image to ImgBB";

    if (!response.ok || data.status !== 200) {
      return NextResponse.json({ error: uploadError }, { status: 500 });
    }

    const imageUrl =
      data?.data?.display_url || data?.data?.url || data?.data?.image?.url;
    const imageId = data?.data?.id;
    const deleteUrl = data?.data?.delete_url || "";

    if (typeof imageUrl !== "string" || !imageUrl) {
      return NextResponse.json(
        { error: "ImgBB did not return an image URL" },
        { status: 500 },
      );
    }

    if (typeof imageId !== "string" || !imageId) {
      return NextResponse.json(
        { error: "ImgBB did not return an image id" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      id: imageId,
      url: imageUrl,
      deleteUrl,
    });
  } catch (error) {
    console.error("ImgBB upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
