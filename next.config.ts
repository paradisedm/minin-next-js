import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
		remotePatterns: [
			{ protocol: "https", hostname: "img-global.cpcdn.com"},
			{ protocol: "https", hostname: "cookpad.com"}
		]
	}
};

export default nextConfig;
