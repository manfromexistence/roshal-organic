import { type NextRequest, NextResponse } from "next/server";

const INLINE_UPLOAD_MAX_BYTES = 2 * 1024 * 1024;

function toInlineFileUrl(file: File, bytes: ArrayBuffer) {
  if (file.size > INLINE_UPLOAD_MAX_BYTES) {
    throw new Error("Upload fallback only supports files up to 2 MB");
  }

  const mediaType = file.type || "application/octet-stream";

  return `data:${mediaType};base64,${Buffer.from(bytes).toString("base64")}`;
}

async function uploadToCatbox(file: File, bytes: ArrayBuffer) {
  const uploadFile = new File(
    [bytes],
    file.name || `roshal-upload-${Date.now()}`,
    {
      type: file.type || "application/octet-stream",
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
  const data = (await response.text()).trim();

  if (!response.ok || !data) {
    throw new Error(data || `Catbox upload failed with ${response.status}`);
  }

  if (!data.startsWith("http://") && !data.startsWith("https://")) {
    throw new Error(data || "Upload provider returned an invalid file URL");
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "Empty files cannot be uploaded" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    let url: string;

    try {
      url = await uploadToCatbox(file, bytes);
    } catch (error) {
      console.error("Catbox file upload failed, using inline fallback:", error);
      url = toInlineFileUrl(file, bytes);
    }

    return NextResponse.json({
      fileName: file.name,
      fileType: file.type,
      fileUrl: url,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Unexpected file upload error" },
      { status: 500 },
    );
  }
}
