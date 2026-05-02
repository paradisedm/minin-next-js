"use server";

import { signIn } from "@/auth/auth";

export async function signInWithCredentials(email: string, password: string) {
	try {
		await signIn("credentials", {
			email,
			password,
			redirect: false
		});

		return;
	} catch (err) {
		console.error("Ошибка авторизации:", err);
		throw err;
	}
}