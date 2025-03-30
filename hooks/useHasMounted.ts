// /hooks/useHasMounted.ts
import { useState, useEffect } from "react";

/**
 * Retourne `true` seulement après que le composant
 * soit monté (client). Ainsi, on évite un mismatch SSR.
 */
export function useHasMounted(): boolean {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	return hasMounted;
}
