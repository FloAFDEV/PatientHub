'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-4xl font-bold text-red-600">Oups !</h1>
      <p className="text-lg mt-2">Désolé, quelque chose a coincé.</p>
      {message && (
        <p className="text-md text-red-600 font-semibold mt-2">
          Erreur : {decodeURIComponent(message)}
        </p>
      )}
      <p className="mt-4">
        <a href="/" className="text-blue-500 hover:underline">
          Retour accueil
        </a>
      </p>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
