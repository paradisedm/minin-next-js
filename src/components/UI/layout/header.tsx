"use client";

import { layoutConfig } from "@/config/layout.config";
import { siteConfig } from "@/config/site.config";
import { Button } from "@heroui/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RegistrationModal from "../modals/registration.modal";
import LoginModal from "../modals/login.modal";
import { signOutFunc } from "@/actions/sign-out";
import { useAuthStore } from "@/store/auth.store";

export const Logo = () => {
	return (
		<Image
			src="/logo.png"
			alt={siteConfig.title}
			width={26}
			height={26}
			priority
		/>
	);
}

export default function Header() {
	const pathname = usePathname();

	const { isAuth, session, status, setAuthState } = useAuthStore();

	const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
	const [isLoginOpen, setIsLoginOpen] = useState(false);

	const handleSignOut = async () => {
		
		try {
			await signOutFunc();
		} catch (err) {
			console.log("error", err);
		}

		setAuthState("unauthenticated", null);
	}

	const getNavItems = () => {
		return siteConfig.navItems
		.filter((item) => {
			if (item.href === "/ingredients") {
				return isAuth;
			}
			return true;
		})
		.map((item) => {
			const isActive = pathname === item.href

			return (
				<li key={item.href}>
					<Link 
						color="foreground"
						href={item.href}
						className={`px-3 py-1
							${isActive ? "text-blue-500" : "text-foreground"}
							hover:text-blue-300 hover:border hover:border-blue-300 hover:rounded-md
							transition-all duration-200
							duration-200`}
					>
						{item.label}
					</Link>
				</li>
			)
		})
	}

	return (
		<nav 
			className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg"
			style={{height: layoutConfig.headerHeight}}
		>
			<header className={`flex h-16 items-center justify-between px-6`}>
				<div className="flex items-center gap-3">
					<Link href="/" className="flex gap-1">
						<Logo/>
						<p className="font-bold">{siteConfig.title}</p>
					</Link>
				</div>

				<ul className="flex items-center gap-4">
					{getNavItems()}
				</ul>
				
				<ul className="flex items-center gap-4">
					{isAuth && <p>Привет, {session?.user?.email}!</p>}
					{status === "loading" 
					? <p>Загрузка...</p> 
					: !isAuth 
						?
						<>
							<li>
								<Button
									as={Link}
									color="secondary"
									onPress={() => setIsLoginOpen(true)}
								>
									Логин
								</Button>
							</li>
							<li>
								<Button
									as={Link}
									color="primary"
									onPress={() => setIsRegistrationOpen(true)}
								>
									Регистрация
								</Button>
							</li>
						</>
						:
						<li>
							<Button
								as={Link}
								color="secondary"
								onPress={handleSignOut}
							>
								Выйти
							</Button>
						</li>
						}		
				</ul>
			</header>
			<RegistrationModal
				isOpen={isRegistrationOpen}
				onClose={() => setIsRegistrationOpen(false)}
			/>
			<LoginModal
				isOpen={isLoginOpen}
				onClose={() => setIsLoginOpen(false)}
			/>
		</nav>
	)
}
