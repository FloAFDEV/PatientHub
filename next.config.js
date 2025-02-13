/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "assets.aceternity.com",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=3600, stale-while-revalidate=86400",
					},
					{
						key: "ETag",
						value: "W/etag-value", // Vous pouvez générer dynamiquement cette valeur
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
