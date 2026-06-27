import { NextResponse } from "next/server";
import { createSupabaseRouteClient, getUserRole, jsonError, requireUser } from "@/app/api/_utils/auth";

export async function POST(request: Request) {
  try {
    const { supabase, user, response } = await requireUser();
    if (response || !user) return response;

    const { rating, review_text, package_id } = await request.json();
    const numericRating = Number(rating);

    if (!numericRating || !review_text || !package_id) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (typeof review_text !== "string" || review_text.trim().length < 3 || review_text.length > 2000) {
      return jsonError("Review text must be between 3 and 2000 characters", 400);
    }

    if (typeof package_id !== "string") {
      return jsonError("package_id is invalid", 400);
    }

    const role = await getUserRole(supabase, user.id);
    if (role === "seller") {
      return jsonError("Sellers cannot review packages", 403);
    }

    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .select("id, is_approved, status")
      .eq("id", package_id)
      .single();

    if (packageError || !packageData || !packageData.is_approved || packageData.status !== "active") {
      return jsonError("Package is not available for reviews", 400);
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([{ package_id, rating: numericRating, review_text: review_text.trim(), profile_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error inserting review:", error);
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Review submitted successfully", review: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const supabase = await createSupabaseRouteClient();
  const { searchParams } = new URL(request.url);
  const package_id = searchParams.get("package_id");

  if (!package_id) {
    return NextResponse.json(
      { error: "package_id is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("rating, review_text, created_at, profile_id")
    .eq("package_id", package_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }

  return NextResponse.json({ reviews: data }, { status: 200 });
}
