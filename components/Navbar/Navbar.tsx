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
							width={40}
							height={40}
							className="w-auto h-10 rounded-md"
						/>
						<span className="text-4xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
							PatientHub
						</span>
					</Link>

					<div className="flex items-center space-x-4">
						<Link href="/login">
							<Button className="hidden sm:flex items-center space-x-2 bg-amber-500">
								Connexion
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
