import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;
    const folder = formData.get("folder") as string;

    console.log("Upload request:", { fileName: file?.name, projectId, folder });

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Upload to catbox
    const catboxFormData = new FormData();
    catboxFormData.append("reqtype", "fileupload");
    catboxFormData.append("fileToUpload", file);

    const userhash = process.env.CATBOX_USERHASH;
    if (userhash) {
      catboxFormData.append("userhash", userhash);
    }

    console.log("Uploading to catbox...", {
      fileSize: file.size,
      fileType: file.type,
      hasUserhash: !!userhash,
    });

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxFormData,
    });

    const data = await response.text();
    console.log("Catbox response:", {
      status: response.status,
      data: data.substring(0, 100),
    });

    if (!response.ok || !data) {
      console.error("Catbox upload failed:", { status: response.status, data });
      return NextResponse.json(
        { error: "Failed to upload to catbox" },
        { status: 500 },
      );
    }

    // Catbox returns just the URL as plain text
    const url = data.trim();

    return NextResponse.json({
      fileName: file.name,
      fileType: file.type,
      fileUrl: url,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("EDMS upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
