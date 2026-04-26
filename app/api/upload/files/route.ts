import { type NextRequest, NextResponse } from "next/server";

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

    const catboxFormData = new FormData();
    catboxFormData.append("reqtype", "fileupload");
    catboxFormData.append("fileToUpload", file);

    const userhash = process.env.CATBOX_USERHASH;
    if (userhash) {
      catboxFormData.append("userhash", userhash);
    }

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxFormData,
    });

    const data = await response.text();

    if (!response.ok || !data) {
      console.error("Catbox upload failed:", { status: response.status, data });
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 },
      );
    }

    const url = data.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      console.error("Catbox returned an invalid upload URL", { data: url });
      return NextResponse.json(
        { error: "Upload provider returned an invalid file URL" },
        { status: 500 },
      );
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
