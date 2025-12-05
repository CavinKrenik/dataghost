import { createSupabaseServerClient } from "@/lib/supabase/server";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getProfile = cache(async (userId: string) => {
    const supabase = createSupabaseServerClient();

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    return profile;
});

export async function requireActiveSubscriber() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const profile = await getProfile(user.id);

    if (
        !profile ||
        profile.status !== "active" ||
        profile.plan === "none"
    ) {
        redirect("/pricing");
    }

    return { user, profile };
}
