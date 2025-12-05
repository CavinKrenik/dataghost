import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
});

export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }
    return user;
}
