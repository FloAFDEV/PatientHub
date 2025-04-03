import React, { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";

const SectionToggle = ({ title, isOpen, onToggle, children }) => {
	const contentRef = useRef(null);
	const [maxHeight, setMaxHeight] = useState("0px");
	const [shouldRender, setShouldRender] = useState(isOpen);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			requestAnimationFrame(() => {
				if (contentRef.current) {
					setMaxHeight(`${contentRef.current.scrollHeight}px`);
				}
			});
		} else {
			if (contentRef.current) {
				setMaxHeight("0px");
				const timeout = setTimeout(() => {
					setShouldRender(false);
				}, 300);
				return () => clearTimeout(timeout);
			}
		}
	}, [isOpen, children]);

	return (
		<div className="mb-4 border rounded-lg shadow-sm">
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

			{isClient && shouldRender && (
				<div
					id={`section-${title}`}
					role="region"
					aria-labelledby={`toggle-${title}`}
					ref={contentRef}
					style={{
						maxHeight,
						overflow: "hidden",
						transition: "max-height 0.3s ease-in-out",
					}}
					tabIndex={isOpen ? 0 : -1}
				>
					<div className="p-4">{children}</div>
				</div>
			)}
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
