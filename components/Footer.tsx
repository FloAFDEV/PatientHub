const Footer = () => {
	return (
		<footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
			<div className="container mx-auto px-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-lg font-semibold text-white mb-4">
							PatientHub
						</h3>
						<p className="text-sm">
							La solution complète pour la gestion de votre
							cabinet d&apos;ostéopathie.
						</p>
					</div>
					<div>
						<h4 className="text-lg font-semibold text-white mb-4">
							Produit
						</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="#features"
									className="hover:text-white transition-colors"
								>
									Fonctionnalités
								</a>
							</li>
							<li>
								<a
									href="#pricing"
									className="hover:text-white transition-colors"
								>
									Tarifs
								</a>
							</li>
							<li>
								<a
									href="#testimonials"
									className="hover:text-white transition-colors"
								>
									Témoignages
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="text-lg font-semibold text-white mb-4">
							Support
						</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="/help"
									className="hover:text-white transition-colors"
								>
									Centre d&apos;aide
								</a>
							</li>
							<li>
								<a
									href="/contact"
									className="hover:text-white transition-colors"
								>
									Contact
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="text-lg font-semibold text-white mb-4">
							Légal
						</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="/privacy"
									className="hover:text-white transition-colors"
								>
									Confidentialité
								</a>
							</li>
							<li>
								<a
									href="/terms"
									className="hover:text-white transition-colors"
								>
									Conditions d&apos;utilisation
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-12 pt-8 border-t border-gray-800 text-center">
					<p>&copy; 2024 PatientHub. Tous droits réservés.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
