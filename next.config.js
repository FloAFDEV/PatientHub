/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "assets.aceternity.com",
			},
		],
	},
	// Autres options de configuration
};

module.exports = nextConfig;
