/* HF Blog Editor demo — shared interactions (no backend, nothing is published) */

// ── Saved-status ticker: simulates autosave recency
(function savedTicker() {
	const els = document.querySelectorAll("[data-saved-label]");
	if (!els.length) return;
	let seconds = 4;
	const fmt = s =>
		s < 8 ? "Saved just now" : s < 60 ? `Saved ${s}s ago` : `Saved ${Math.floor(s / 60)} min ago`;
	const tick = () => els.forEach(el => (el.textContent = fmt(seconds)));
	tick();
	setInterval(() => { seconds += 4; tick(); }, 4000);
	// Any click inside the editor "resets" the autosave clock, like typing would
	document.querySelectorAll("[data-editor]").forEach(ed =>
		ed.addEventListener("click", () => { seconds = 0; tick(); })
	);
})();

// ── Publish modal
const publishModal = document.getElementById("publish-modal");
function openPublish() {
	if (publishModal) publishModal.classList.add("open");
}
function closePublish() {
	if (publishModal) publishModal.classList.remove("open");
}
document.querySelectorAll("[data-publish-open]").forEach(b => b.addEventListener("click", openPublish));
document.querySelectorAll("[data-publish-close]").forEach(b => b.addEventListener("click", closePublish));
if (publishModal) {
	publishModal.addEventListener("click", e => { if (e.target === publishModal) closePublish(); });
}
document.addEventListener("keydown", e => {
	if (e.key === "Escape") { closePublish(); closeSettings(); }
});
document.querySelectorAll("[data-publish-confirm]").forEach(b =>
	b.addEventListener("click", () => {
		closePublish();
		showToast("Demo only — nothing was published 🤗");
	})
);

// ── Toast
let toastTimer;
function showToast(msg) {
	const t = document.getElementById("toast");
	if (!t) return;
	t.querySelector("span").textContent = msg;
	t.classList.add("open");
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => t.classList.remove("open"), 3200);
}

// ── Edit / Preview toggle (chip on the editor)
document.querySelectorAll("[data-preview-toggle]").forEach(btn =>
	btn.addEventListener("click", () => {
		const src = document.getElementById("md-source");
		const prev = document.getElementById("md-preview");
		const showingPreview = !prev.classList.contains("hidden");
		if (showingPreview) {
			prev.classList.add("hidden");
			src.classList.remove("hidden");
			btn.dataset.state = "edit";
		} else {
			src.classList.add("hidden");
			prev.classList.remove("hidden");
			btn.dataset.state = "preview";
		}
		document.querySelectorAll("[data-preview-toggle] .lbl").forEach(l =>
			l.textContent = showingPreview ? "Preview" : "Edit"
		);
	})
);

// ── Option 1: collapse the metadata panel
const metaPanel = document.getElementById("meta-panel");
const collapseBtn = document.getElementById("collapse-handle");
if (metaPanel && collapseBtn) {
	collapseBtn.addEventListener("click", () => {
		const closed = metaPanel.classList.toggle("hidden");
		collapseBtn.querySelector("svg").style.transform = closed ? "rotate(180deg)" : "";
		collapseBtn.title = closed ? "Show article settings" : "Hide article settings";
	});
}

// ── Option 2: settings popover in the footer
const settingsPop = document.getElementById("settings-popover");
function closeSettings() { if (settingsPop) settingsPop.classList.remove("open"); }
const settingsBtn = document.getElementById("settings-btn");
if (settingsBtn && settingsPop) {
	settingsBtn.addEventListener("click", e => {
		e.stopPropagation();
		settingsPop.classList.toggle("open");
	});
	settingsPop.addEventListener("click", e => e.stopPropagation());
	document.addEventListener("click", () => closeSettings());
}

// ── Thumbnail remove / restore (both options)
document.querySelectorAll("[data-thumb-remove]").forEach(btn =>
	btn.addEventListener("click", () => {
		document.querySelectorAll("[data-thumb-filled]").forEach(el => el.classList.add("hidden"));
		document.querySelectorAll("[data-thumb-empty]").forEach(el => el.classList.remove("hidden"));
	})
);
document.querySelectorAll("[data-thumb-add]").forEach(btn =>
	btn.addEventListener("click", () => {
		document.querySelectorAll("[data-thumb-filled]").forEach(el => el.classList.remove("hidden"));
		document.querySelectorAll("[data-thumb-empty]").forEach(el => el.classList.add("hidden"));
	})
);
