const ErrorDisplay = ({ error, onClose }) => (
	<div className="p-4 w-full mx-auto">
		<button className="mb-4 text-red-500" onClick={onClose}>
			&times; Fermer
		</button>
		<div className="text-red-500">
			<strong>Erreur:</strong> {error}
		</div>
	</div>
);

export default ErrorDisplay;
