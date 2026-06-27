import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getUserRole, jsonError, requireUser } from "@/app/api/_utils/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      {
        error: "Server configuration error",
      },
      { status: 500 }
    );
  }

  try {
    const { supabase, user, response } = await requireUser();
    if (response || !user) return response;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
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
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Only JPEG, PNG, WebP images and PDF documents are allowed.`,
        },
        { status: 400 }
      );
    }

    const isPdf = allowedPdfTypes.includes(file.type);
    const maxSize = isPdf ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if ("size" in file && typeof file.size === "number" && file.size > maxSize) {
      return jsonError(`File size must be less than ${isPdf ? "10MB" : "5MB"}`, 400);
    }

    const role = await getUserRole(supabase, user.id);
    if (isPdf && role !== "seller" && role !== "admin") {
      return jsonError("Forbidden", 403);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64String}`;

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
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });

      return NextResponse.json({
        url: (result as any).secure_url,
        success: true,
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError);
      return NextResponse.json(
        {
          error: "Failed to upload to Cloudinary",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in upload route:", error);
    return NextResponse.json(
      {
        error: "Failed to process upload request",
      },
      { status: 500 }
    );
  }
}
