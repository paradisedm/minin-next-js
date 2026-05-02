"use server";

import { signOut } from "@/auth/auth";

export async function signOutFunc() {
	try {
		const result = await signOut({redirect: false});
		console.log("result", result)

		return result;
	} catch (err) {
		console.error("Ошибка авторизации:", err);
		throw err;
	}
}