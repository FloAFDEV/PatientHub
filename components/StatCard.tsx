import React, { useState } from "react";

interface StatCardProps {
	icon: React.ReactNode;
	title: string;
	value: string | number;
	change?: string;
	subtitle?: string;
	explanation?: string;
}

const StatCard: React.FC<StatCardProps> = ({
	icon,
	title,
	value,
	change,
	subtitle,
	explanation,
}) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="relative bg-gradient-to-br from-gray-50/90 to-gray-200/90 dark:from-gray-700/90 dark:to-gray-800/90 p-4 sm:p-6 rounded-xl shadow-lg transition-all duration-500 ease-in-out hover:scale-[1.02] hover:shadow-xl border border-gray-100/50 dark:border-gray-600/50 backdrop-blur-sm"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center">
					<div className="text-primary/80 transition-colors duration-300">
						{icon}
					</div>
					<h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent ml-2">
						{title}
					</h3>
				</div>
			</div>
			<p className="text-3xl lg:text-3xl sm:text-2xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
				{value}
			</p>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
				{change && (
					<p className="text-sm sm:text-base text-green-600/90 dark:text-green-400/90 mb-1 sm:mb-0">
						{change}
					</p>
				)}
				{subtitle && (
					<p className="text-xs sm:text-sm text-gray-600/90 dark:text-gray-400/90">
						{subtitle}
					</p>
				)}
			</div>

			{/* Tooltip avec animation */}
			<div
				className={`absolute z-50 -top-2 left-1/2 w-72 p-4
    bg-gradient-to-br
    from-gray-50/95 to-gray-200/90 
    dark:from-gray-700/90 dark:to-gray-800/90
    text-sm rounded-lg shadow-xl
    transform -translate-x-1/2 translate-y-[-12px]
    border border-gray-200/50 dark:border-gray-700/50 
    backdrop-blur-sm transition-all duration-300 ease-in-out
    ${
		isHovered
			? "opacity-100 translate-y-0"
			: "opacity-0 translate-y-2 pointer-events-none"
	}`}
			>
				<div className="relative">
					<p className="text-gray-700 dark:text-gray-200">
						{explanation}
					</p>

					{/* Flèche de tooltip légèrement décalée */}
					<div
						className="absolute border border-1 border-zinc-500-bottom-6 right-8 transform -translate-x-1/2 w-6 h-6 rotate-45
    bg-gradient-to-br from-gray-95/50 to-gray-80/300
    dark:from-gray-700/90 dark:to-gray-800/80
    border-r-2 border-b-2 border-gray-200/50 dark:border-gray-700/50
    shadow-xl transition-all duration-300 ease-in-out"
					></div>
				</div>
			</div>
		</div>
	);
};

export default StatCard;
