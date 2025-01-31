import React from "react";

interface StatCardProps {
	title: string;
	value: string | number;
	description: string;
	color: string;
}

const StatCard: React.FC<StatCardProps> = React.memo(
	({ title, value, description, color }) => (
		<div className="bg-white dark:bg-neutral-800 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
			<h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4">
				{title}
			</h2>
			<p
				className={`text-3xl font-bold ${color} dark:text-${
					color.split("-")[0]
				}-400`}
			>
				{value}
			</p>
			<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
				{description}
			</p>
		</div>
	)
);

StatCard.displayName = "StatCard";

export default StatCard;
