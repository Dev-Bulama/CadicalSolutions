"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import SignOutLoadingButton from "./signout-loading-button";
import { LogOut } from "lucide-react";

export default function SignoutButton() {
	const router = useRouter();
	const [pending, setPending] = useState(false);

	const handleSignOut = async () => {
		try {
			setPending(true);
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push("/auth/login");
						router.refresh();
					},
				},
			});
		} catch (error) {
			console.error("Error signing out:", error);
		} finally {
			setPending(false);
		}
	};

	return (
		<SignOutLoadingButton pending={pending} onClick={handleSignOut}>
			<LogOut /> Sign Out
		</SignOutLoadingButton>
	);
}
