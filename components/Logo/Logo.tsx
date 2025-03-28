// app/dashboard/components/Logo.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export const Logo = () => {
	return (
		<div className="font-normal flex flex-col items-center text-sm py-1 relative z-20">
			<div className="flex items-center space-x-2 mb-12">
				<Activity className="w-12 h-12 text-blue-500" />
				<motion.span
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="font-semibold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-500 dark:via-purple-500 dark:to-purple-500 whitespace-pre"
				>
					PatientHub
				</motion.span>
			</div>
		</div>
	);
};

export const LogoIcon = () => {
	return (
		<Link href="#" className="flex items-center justify-center py-2">
			<div className="h-10 w-10">
				<Image
					src="/assets/icons/logo-full.svg"
					alt="Logo de PatientHub"
					width={60}
					height={60}
					className="object-contain rounded-md shadow-md"
				/>
			</div>
		</Link>
	);
};
