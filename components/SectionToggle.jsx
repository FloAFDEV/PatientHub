import React, { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";

const SectionToggle = ({ title, isOpen, onToggle, children }) => {
	const contentRef = useRef(null);
	const [maxHeight, setMaxHeight] = useState("0px");
	const [isClient, setIsClient] = useState(false);

	// Vérifie qu'on est bien côté client (évite les bugs SSR)
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Gère l'ouverture/fermeture animée de la section
	useEffect(() => {
		if (!isClient || !contentRef.current) return;

		if (isOpen) {
			const content = contentRef.current;
			// On mesure la hauteur réelle du contenu
			const scrollHeight = content.scrollHeight;
			setMaxHeight(`${scrollHeight}px`);
		} else {
			setMaxHeight("0px");
		}
	}, [isOpen, isClient, children]);

	return (
		<div className="mb-4 border rounded-lg shadow-sm overflow-hidden">
			<button
				id={`toggle-${title}`}
				onClick={onToggle}
				aria-expanded={isOpen}
				aria-controls={`section-${title}`}
				className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<span>{title}</span>
				<ChevronDown
					className={`h-5 w-5 transform transition-transform duration-300 ${
						isOpen ? "rotate-180" : "rotate-0"
					}`}
					aria-hidden="true"
				/>
			</button>

			<div
				id={`section-${title}`}
				ref={contentRef}
				role="region"
				aria-labelledby={`toggle-${title}`}
				style={{
					maxHeight,
					overflow: "hidden",
					transition: "max-height 0.3s ease-in-out",
				}}
				tabIndex={isOpen ? 0 : -1}
			>
				<div className="p-4">{children}</div>
			</div>
		</div>
	);
};

SectionToggle.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
};

export default SectionToggle;
