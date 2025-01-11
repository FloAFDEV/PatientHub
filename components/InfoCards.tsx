import React, { useState } from "react";
import Image from "next/image";

interface InfoCardProps {
	icon: React.ReactNode;
	title: string;
	content: string | undefined;
	link?: string;
	image: string;
	explanation?: string;
}

const InfoCard: React.FC<InfoCardProps> = React.memo(
	({ icon, title, content, link, image, explanation }) => {
		const [isHovered, setIsHovered] = useState(false);

		return (
			<div
				className="relative bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div className="aspect-video relative">
					<Image
						src={image}
						alt={title}
						fill
						className="object-cover rounded-t-lg"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
					/>
				</div>

				<div className="p-4">
					<div className="flex items-center gap-2 mb-3">
						{icon}
						<h2 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
							{title}
						</h2>
					</div>
					<p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 break-words">
						{link ? (
							<a
								href={link}
								target="_blank"
								rel="noopener noreferrer"
								className="text-base dark:text-gray-300 hover:underline inline-flex items-center gap-1"
							>
								{content}
							</a>
						) : (
							content
						)}
					</p>
				</div>

				{/* Tooltip uniquement si "explanation" est défini */}
				{explanation && (
					<div
						className={`absolute z-50 left-1/2 w-72 p-4 border border-1 border-zinc-500-bottom-6
              bg-gradient-to-br from-gray-50/98 to-gray-200/95
              dark:from-slate-700/95 dark:to-gray-800/95
              text-sm rounded-lg shadow-xl transform -translate-x-1/2 
              ${
					isHovered
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-2 pointer-events-none"
				}
              transition-all duration-300 ease-in-out`}
						style={{ top: "-10px" }} // Ajustement ici pour que ce soit au-dessus de la carte
					>
						<div className="relative">
							{/* Contenu de l'explication */}
							<p className="text-gray-700 dark:text-gray-200">
								{explanation}
							</p>

							{/* Flèche de tooltip légèrement décalée */}
							<div
								className="absolute border border-1 border-zinc-500-bottom-6 right-8 transform -translate-x-1/2 w-6 h-6 rotate-45
                bg-gradient-to-br from-gray-95/50 to-gray-80/300
                dark:from-gray-700/90 dark:to-cyan-800/80
                border-r-2 border-b-2 border-gray-200/50 dark:border-gray-700/50
                shadow-xl"
							></div>
						</div>
					</div>
				)}
			</div>
		);
	}
);

InfoCard.displayName = "InfoCard";

export default InfoCard;
