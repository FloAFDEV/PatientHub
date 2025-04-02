/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true, // ✅ Active la minification avancée via SWC

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "assets.aceternity.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
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
						value: "W/etag-value",
					},
				],
			},
		];
	},
};

export default nextConfig;
