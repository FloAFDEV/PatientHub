// app/dashboard/components/Logo.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export const Logo = () => {
	return (
		<Link
			href="#"
			className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
		>
			<div className="h-8 w-8 flex-shrink-0">
				<Image
					src="/assets/images/logo-full.svg"
					alt="Logo de PatientHub"
					width={32}
					height={32}
					className="object-contain rounded-md shadow-xl"
				/>
			</div>
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="font-semibold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-300 dark:to-purple-400 whitespace-pre"
			>
				PatientHub
			</motion.span>
		</Link>
	);
};

export const LogoIcon = () => {
	return (
		<Link href="#" className="flex items-center justify-center py-2">
			<div className="h-8 w-8">
				<Image
					src="/assets/images/logo-full.svg"
					alt="Logo de PatientHub"
					width={32}
					height={32}
					className="object-contain rounded-md shadow-md"
				/>
			</div>
		</Link>
	);
};
