import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";


export async function POST(request: Request) {
    try {
        const { rating, comment, package_id } = await request.json();
        const supabaseServerClient = createServerSupabaseClient({ headers: request.headers });
        const { data: { user } } = await supabaseServerClient.auth.getUser();

        // Get authenticated user
        // const {
        //     data: { user },
        // } = await supabase.auth.getUser();
        console.log(user)
        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Validate input
        if (!rating || !comment || !package_id) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        // Insert into Supabase reviews table
        const { data, error } = await supabase.from("reviews").insert([
            {
                package_id,
                user_id: user.id,
                rating,
                comment,
            },
        ]);

        if (error) {
            console.error("Error inserting review:", error);
            return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
        }

        return NextResponse.json({ message: "Review submitted successfully", review: data }, { status: 201 });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const package_id = searchParams.get("package_id");

    if (!package_id) {
        return NextResponse.json({ error: "package_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("reviews")
        .select("rating, comment, created_at, profiles(name)")
        .eq("package_id", package_id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }

    return NextResponse.json({ reviews: data }, { status: 200 });
}
