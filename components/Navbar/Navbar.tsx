import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Navbar = () => {
	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border-b border-gray-400">
			<div className="container mx-auto px-4">
				<div className="h-20 flex items-center justify-between">
					<Link href="/" className="flex items-center space-x-2">
						<Image
							src="/assets/icons/logo-full.svg"
							alt="PatientHub"
							width={60}
							height={60}
							className="w-auto h-20 rounded-md"
						/>
						<span className="text-4xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
							PatientHub
						</span>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
