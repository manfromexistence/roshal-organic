import { type NextRequest, NextResponse } from "next/server";

const INLINE_IMAGE_UPLOAD_MAX_BYTES = 2 * 1024 * 1024;

function toInlineImageUrl(file: File, bytes: ArrayBuffer) {
  if (file.size > INLINE_IMAGE_UPLOAD_MAX_BYTES) {
    throw new Error("Upload fallback only supports images up to 2 MB");
  }

  const mediaType = file.type || "image/png";

  return `data:${mediaType};base64,${Buffer.from(bytes).toString("base64")}`;
}

async function uploadImageToCatbox(file: File, bytes: ArrayBuffer) {
  const uploadFile = new File(
    [bytes],
    file.name || `roshal-image-${Date.now()}.png`,
    {
      type: file.type || "image/png",
    },
  );

  const catboxFormData = new FormData();
  catboxFormData.append("reqtype", "fileupload");
  catboxFormData.append("fileToUpload", uploadFile);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: catboxFormData,
    headers: {
      "User-Agent": "Roshal Organic Upload/1.0",
    },
  });
  const url = (await response.text()).trim();

  if (
    !response.ok ||
    !url ||
    (!url.startsWith("http://") && !url.startsWith("https://"))
  ) {
    throw new Error(url || `Catbox upload failed with ${response.status}`);
  }

  return url;
}

async function uploadImageFallback(file: File, bytes: ArrayBuffer) {
  try {
    const fallbackUrl = await uploadImageToCatbox(file, bytes);

    return {
      provider: "catbox",
      url: fallbackUrl,
    };
  } catch (fallbackError) {
    console.error("Catbox upload fallback failed:", fallbackError);

    const inlineUrl = toInlineImageUrl(file, bytes);

    return {
      provider: "inline",
      url: inlineUrl,
    };
  }
}

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imgbbApiKey = process.env.IMGBB_API_KEY || process.env.IMGBB;

    if (!imgbbApiKey) {
      const fallback = await uploadImageFallback(file, bytes);

      return NextResponse.json({
        success: true,
        id: fallback.url,
        url: fallback.url,
        deleteUrl: "",
        provider: fallback.provider,
      });
    }

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
      try {
        const fallback = await uploadImageFallback(file, bytes);

        return NextResponse.json({
          success: true,
          id: fallback.url,
          url: fallback.url,
          deleteUrl: "",
          provider: fallback.provider,
        });
      } catch (fallbackError) {
        console.error("Inline upload fallback failed:", fallbackError);
        return NextResponse.json({ error: uploadError }, { status: 500 });
      }
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
      provider: "imgbb",
    });
  } catch (error) {
    console.error("ImgBB upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
