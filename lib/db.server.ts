'use server';

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createRemovalJob(data: {
    status: string;
    user_email: string;
    worker_data: any;
}) {
    const { data: job, error } = await supabase
        .from("jobs")
        .insert(data)
        .select()
        .single();

    if (error) {
        console.error("Error creating removal job:", error);
        throw new Error("Failed to create removal job");
    }

    return job;
}

export async function updateJob(id: string, updates: any) {
    const { error } = await supabase.from("jobs").update(updates).eq("id", id);
    if (error) throw error;
}

export async function getPendingJobs() {
    const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .in("status", ["queued", "processing"]);
    if (error) throw error;
    return data || [];
}

export async function getUserJobs(emailHash: string) {
    const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_email_hash", emailHash)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function getDataBrokerUser(emailHash: string) {
    const { data, error } = await supabase
        .from("data_broker_users")
        .select("*")
        .eq("id", emailHash)
        .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

export async function upsertDataBrokerUser(data: {
    id: string,
    verification_code?: string,
    verified?: boolean,
    last_sent_at?: string,
    code_generated_at?: string
}) {
    const { error } = await supabase
        .from("data_broker_users")
        .upsert(data);
    if (error) throw error;
}
