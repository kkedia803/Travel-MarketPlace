import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  console.log("Upload route called");

  // Validate Cloudinary configuration
  if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET) {
    console.error("Cloudinary credentials are missing");
    return NextResponse.json(
      {
        error: "Server configuration error",
        details: "Cloudinary credentials are not configured. Please check your environment variables."
      },
      { status: 500 }
    );
  }

  try {
    console.log("About to parse formData");
    const formData = await request.formData();
    console.log("formData parsed");
    const file = formData.get("file");
    console.log("Received file:", file);

    if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
      console.error("No valid file provided");
      return NextResponse.json(
        { error: "No valid file provided" },
        { status: 400 }
      );
    }

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];
    const allowedPdfTypes = ["application/pdf"];
    const allowedTypes = [...allowedImageTypes, ...allowedPdfTypes];

    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Only JPEG, PNG, WebP images and PDF documents are allowed.`,
        },
        { status: 400 }
      );
    }

    const isPdf = allowedPdfTypes.includes(file.type);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64String}`;
    console.log("Uploading to Cloudinary...", isPdf ? "(PDF)" : "(Image)");

    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          dataURI,
          {
            folder: isPdf ? "travel-packages/documents" : "travel-packages",
            resource_type: isPdf ? "raw" : "image",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log("Cloudinary upload result:", result);

      return NextResponse.json({
        url: (result as any).secure_url,
        success: true,
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError);
      return NextResponse.json(
        {
          error: "Failed to upload to Cloudinary",
          details: (cloudinaryError as Error).message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in upload route:", error);
    return NextResponse.json(
      {
        error: "Failed to process upload request",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
