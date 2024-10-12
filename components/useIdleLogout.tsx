// components/IdleLogout.tsx
"use client";

import { useIdleLogout } from "@/hooks/useIdleLogout";

const IdleLogout = () => {
	useIdleLogout();

	return null;
};

export default IdleLogout;
