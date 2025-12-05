// SERVER-ONLY: Do not import this file in any "use client" components.
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createRemovalJob(data: any) {
  const { data: job, error } = await supabase
    .from("jobs")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
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
