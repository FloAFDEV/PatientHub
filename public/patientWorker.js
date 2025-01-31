self.addEventListener("message", async (e) => {
	if (e.data === "fetchPatients") {
		try {
			const response = await fetch("/api/patients");
			if (!response.ok)
				throw new Error("Erreur dans le chargement des données.");
			const data = await response.json();
			data.sort((a, b) => a.name.localeCompare(b.name));
			self.postMessage({ type: "success", data });
		} catch (error) {
			self.postMessage({ type: "error", error: error.message });
		}
	}
});
