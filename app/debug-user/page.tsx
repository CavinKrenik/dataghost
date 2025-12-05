import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/profile";

export default async function DebugUserPage() {
    const user = await getCurrentUser();
    const profile = user ? await getProfile(user.id) : null;

    return (
        <div className="p-10 space-y-4 text-white">
            <h1 className="text-2xl font-bold">Debug User</h1>
            <pre className="bg-gray-800 p-4 rounded overflow-auto">
                {JSON.stringify({ user, profile }, null, 2)}
            </pre>
        </div>
    );
}
