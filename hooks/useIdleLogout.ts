// hooks/useIdleLogout.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

export const useIdleLogout = () => {
    const router = useRouter();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleActivity = () => {
            clearTimeout(timeoutId); // Efface le timeout actuel
            timeoutId = setTimeout(() => {
                // Déconnexion automatique
                localStorage.removeItem('accessKey'); // Ou votre méthode de déconnexion
                localStorage.removeItem('accessKeyExpiration');
                router.push('/'); // Redirection vers la page d'accueil
            }, EXPIRATION_TIME);
        };

        // Écoute les événements d'activité
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        window.addEventListener('click', handleActivity);
        window.addEventListener('scroll', handleActivity);

        // Démarre le timeout initial
        handleActivity();

        // Nettoyage des événements lors de la désinscription du composant
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('scroll', handleActivity);
        };
    }, [router]);
};
