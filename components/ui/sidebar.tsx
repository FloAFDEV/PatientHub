"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

export interface Links {
	label: string | React.ReactNode; // <-- Modifier ici
	href: string;
	icon: React.JSX.Element | React.ReactNode;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
	disabled?: boolean;
	subItems?: Omit<Links, "icon" | "subItems">[];
}

interface SidebarContextProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
	undefined
);

export const useSidebar = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
};

export const SidebarProvider = ({
	children,
	open: openProp,
	setOpen: setOpenProp,
	animate = true,
}: {
	children: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	animate?: boolean;
}) => {
	const [openState, setOpenState] = useState(false);
	const open = openProp !== undefined ? openProp : openState;
	const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

	return (
		<SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
			{children}
		</SidebarContext.Provider>
	);
};

export const Sidebar = ({
	children,
	open,
	setOpen,
	animate,
}: {
	children?: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	animate?: boolean;
}) => {
	return (
		<SidebarProvider open={open} setOpen={setOpen} animate={animate}>
			{children}
		</SidebarProvider>
	);
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
	return (
		<>
			<DesktopSidebar {...props} />
			<MobileSidebar {...(props as React.ComponentProps<"div">)} />
		</>
	);
};

export const DesktopSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof motion.div>) => {
	const { open, setOpen, animate } = useSidebar();
	return (
		<>
			<motion.div
				className={cn(
					"h-full px-4 py-4 hidden  md:flex md:flex-col bg-gray-200 dark:bg-slate-800 w-[300px] flex-shrink-0 ",
					className
				)}
				animate={{
					width: animate ? (open ? "300px" : "60px") : "300px",
				}}
				onMouseEnter={() => setOpen(true)}
				onMouseLeave={() => setOpen(false)}
				{...props}
			>
				{children}
			</motion.div>
		</>
	);
};

export const MobileSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<"div">) => {
	const { open, setOpen } = useSidebar();
	return (
		<>
			<div
				className={cn(
					"h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-neutral-100 dark:bg-slate-800 w-full"
				)}
				{...props}
			>
				<div className="flex justify-end z-20 w-full">
					<IconMenu2
						className="text-neutral-800 dark:text-neutral-200"
						onClick={() => setOpen(!open)}
						aria-label={
							open ? "Fermer la sidebar" : "Ouvrir la sidebar"
						}
						role="button"
						aria-expanded={open}
					/>
				</div>
				<AnimatePresence>
					{open && (
						<motion.div
							initial={{ x: "-100%", opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: "-100%", opacity: 0 }}
							transition={{
								duration: 0.3,
								ease: "easeInOut",
							}}
							className={cn(
								"fixed h-full w-full inset-0 bg-white dark:bg-gray-800 p-10 z-[100] flex flex-col justify-between",
								className
							)}
						>
							<div
								className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
								onClick={() => setOpen(!open)}
							>
								<IconX />
							</div>
							{children}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
};

export const SidebarLink = ({
	link,
	className,
	...props
}: {
	link: Links;
	className?: string;
	props?: Omit<
		React.AnchorHTMLAttributes<HTMLAnchorElement>,
		keyof LinkProps
	>;
}) => {
	const { open, animate } = useSidebar();

	const handleClick = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		if (link.disabled) {
			e.preventDefault();
			return;
		}
		if (link.onClick) {
			link.onClick(e);
		}
	};

	return (
		<>
			<Link
				href={link.href}
				className={cn(
					"flex items-center justify-start gap-2 group/sidebar py-2",
					{ "pointer-events-none opacity-50": link.disabled },
					className
				)}
				onClick={handleClick}
				{...props}
			>
				{link.icon}
				<motion.span
					animate={{
						display: animate
							? open
								? "inline-block"
								: "none"
							: "inline-block",
						opacity: animate ? (open ? 1 : 0) : 1,
					}}
					className="text-gray-700 dark:text-neutral-200 group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block text-md font-light !p-0 !m-0"
				>
					{link.label}
				</motion.span>
			</Link>
			{link.subItems && open && (
				<div className="ml-6">
					{link.subItems.map((subItem, index) => (
						<Link
							key={index}
							href={subItem.href}
							className="flex items-center py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
							onClick={subItem.onClick}
						>
							{subItem.label}
						</Link>
					))}
				</div>
			)}
		</>
	);
};
