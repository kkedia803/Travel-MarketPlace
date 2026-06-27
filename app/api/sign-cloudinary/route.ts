import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { getUserRole, jsonError, requireUser } from "@/app/api/_utils/auth";

const allowedFolders = new Set([
    "travel-packages",
    "travel-packages/documents",
    "company-logos",
]);

const allowedKeys = new Set(["timestamp", "folder", "type", "access_mode"]);

export async function POST(request: Request) {
    try {
        const { supabase, user, response } = await requireUser();
        if (response || !user) return response;

        if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
            return jsonError("Cloudinary is not configured", 500);
        }

        const body = await request.json();
        const { paramsToSign } = body;

        if (!paramsToSign || typeof paramsToSign !== "object" || Array.isArray(paramsToSign)) {
            return jsonError("paramsToSign is required", 400);
        }

        const keys = Object.keys(paramsToSign);
        if (keys.some((key) => !allowedKeys.has(key))) {
            return jsonError("Unsupported upload parameter", 400);
        }

        const { timestamp, folder, type, access_mode } = paramsToSign;

        if (!Number.isInteger(timestamp)) {
            return jsonError("timestamp is invalid", 400);
        }

        const now = Math.round(Date.now() / 1000);
        if (Math.abs(now - timestamp) > 5 * 60) {
            return jsonError("Upload timestamp has expired", 400);
        }

        if (!allowedFolders.has(folder)) {
            return jsonError("Upload folder is not allowed", 400);
        }

        if (type && type !== "upload") {
            return jsonError("Upload type is not allowed", 400);
        }

        if (access_mode && access_mode !== "public") {
            return jsonError("Upload access mode is not allowed", 400);
        }

        const role = await getUserRole(supabase, user.id);
        if ((folder === "company-logos" || folder === "travel-packages/documents") && role !== "seller" && role !== "admin") {
            return jsonError("Forbidden", 403);
        }

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET as string
        );

        return NextResponse.json({
            signature,
            timestamp: paramsToSign.timestamp,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
        });
    } catch (error) {
        console.error("Error signing Cloudinary request:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
