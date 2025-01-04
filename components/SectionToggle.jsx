import React from "react";
import PropTypes from "prop-types";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const SectionToggle = ({ title, isOpen, onToggle, children }) => (
	<div className="mb-4 border rounded-lg overflow-hidden">
		<button
			className="flex justify-between items-center w-full bg-gray-200 dark:bg-gray-700 p-2 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
			onClick={onToggle}
		>
			<span className="font-semibold">{title}</span>
			{isOpen ? (
				<ChevronUpIcon className="h-5 w-5" />
			) : (
				<ChevronDownIcon className="h-5 w-5" />
			)}
		</button>
		<div
			className={`transition-all duration-300 ease-in-out overflow-hidden ${
				isOpen ? "max-h-max opacity-100" : "max-h-0 opacity-0"
			}`}
		>
			<div className="p-4 bg-white dark:bg-gray-800">{children}</div>
		</div>
	</div>
);

// Validation des props pour garantir que les types sont corrects
SectionToggle.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
};

export default SectionToggle;
