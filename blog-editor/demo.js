/* HF Blog Editor demo — shared interactions (no backend, nothing is published) */

// ── Saved-status ticker: simulates autosave recency
let savedSeconds = 4;
const savedEls = document.querySelectorAll("[data-saved-label]");
const fmtSaved = s =>
	s < 8 ? "Saved just now" : s < 60 ? `Saved ${s}s ago` : `Saved ${Math.floor(s / 60)} min ago`;
function renderSaved() { savedEls.forEach(el => (el.textContent = fmtSaved(savedSeconds))); }
if (savedEls.length) {
	renderSaved();
	setInterval(() => { savedSeconds += 4; renderSaved(); }, 4000);
	// Any click inside the editor "resets" the autosave clock, like typing would
	document.querySelectorAll("[data-editor]").forEach(ed =>
		ed.addEventListener("click", () => { savedSeconds = 0; renderSaved(); })
	);
}

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

// ── Edit / Preview toggle (chip on the editor) — pane ids depend on the active draft
let currentDraft = "huggy";
const activePaneIds = () => currentDraft === "test"
	? { src: "md-source-test", prev: "md-preview-test" }
	: { src: "md-source", prev: "md-preview" };
document.querySelectorAll("[data-preview-toggle]").forEach(btn =>
	btn.addEventListener("click", () => {
		const ids = activePaneIds();
		const src = document.getElementById(ids.src);
		const prev = document.getElementById(ids.prev);
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

// ── Option 1: collapse the metadata panel (iOS-style handle zone)
const metaPanel = document.getElementById("meta-panel");
const collapseBtn = document.getElementById("collapse-handle");
if (metaPanel && collapseBtn) {
	collapseBtn.addEventListener("click", () => {
		const closed = metaPanel.classList.toggle("hidden");
		collapseBtn.title = closed ? "Show article settings" : "Hide article settings";
	});
}

// ── Footer popovers (Option 2 settings · Option 1 draft selector)
const settingsPop = document.getElementById("settings-popover");
const draftPop = document.getElementById("draft-popover");
const syntaxPop = document.getElementById("syntax-popover");
function closeSettings() {
	if (settingsPop) settingsPop.classList.remove("open");
	if (draftPop) draftPop.classList.remove("open");
	if (syntaxPop) syntaxPop.classList.remove("open");
}
function wirePopover(btnId, pop) {
	const btn = document.getElementById(btnId);
	if (!btn || !pop) return;
	btn.addEventListener("click", e => {
		e.stopPropagation();
		const wasOpen = pop.classList.contains("open");
		closeSettings();
		if (!wasOpen) pop.classList.add("open");
	});
	pop.addEventListener("click", e => e.stopPropagation());
}
wirePopover("settings-btn", settingsPop);
wirePopover("draft-btn", draftPop);
wirePopover("syntax-btn", syntaxPop);
if (settingsPop || draftPop || syntaxPop) {
	document.addEventListener("click", () => closeSettings());
}

// ── Option 1: draft switching — unsaved new draft ⇄ saved "Test" draft
const ROW_CURRENT = "mb-px flex w-full items-center justify-between gap-1.5 truncate rounded-lg bg-black px-1.5 py-0.5 text-left text-gray-200";
const ROW_PLAIN = "mb-px flex w-full items-center justify-between gap-1.5 truncate rounded-lg px-1.5 py-0.5 text-left text-gray-500 hover:text-gray-900";
const CHIP_ON_DARK = "rounded bg-white/20 px-1.5 py-px text-[11px] font-medium text-gray-100";
const CHIP_ON_LIGHT = "rounded bg-gray-100 px-1.5 py-px text-[11px] font-medium text-gray-500";
function selectDraft(id) {
	const rowH = document.getElementById("row-huggy");
	const rowT = document.getElementById("row-test");
	if (!rowH || !rowT) return;
	currentDraft = id;
	// swap editor panes; always come back in edit mode
	document.getElementById("md-source").classList.toggle("hidden", id !== "huggy");
	document.getElementById("md-source-test").classList.toggle("hidden", id !== "test");
	document.getElementById("md-preview").classList.add("hidden");
	document.getElementById("md-preview-test").classList.add("hidden");
	document.querySelectorAll("[data-preview-toggle] .lbl").forEach(l => (l.textContent = "Preview"));
	// footer draft selector chip
	document.getElementById("draft-chip-label").textContent =
		id === "huggy" ? "Designing Huggy: Behind Hugging Face’s…" : "Test";
	document.getElementById("draft-chip-unsaved").style.display = id === "huggy" ? "" : "none";
	// popover rows
	rowH.className = id === "huggy" ? ROW_CURRENT : ROW_PLAIN;
	document.getElementById("row-huggy-unsaved").className = id === "huggy" ? CHIP_ON_DARK : CHIP_ON_LIGHT;
	rowT.className = id === "test" ? ROW_CURRENT : ROW_PLAIN;
	// save-state cluster: unsaved → no history/no delete, "Save as draft";
	// saved → green status + History, "Update draft" (like the real editor's draft state)
	document.getElementById("status-unsaved").style.display = id === "huggy" ? "flex" : "none";
	document.getElementById("status-saved").style.display = id === "test" ? "flex" : "none";
	document.getElementById("history-btn").style.display = id === "test" ? "inline-block" : "none";
	document.getElementById("btn-delete").style.display = id === "test" ? "inline-block" : "none";
	document.getElementById("btn-save").textContent = id === "test" ? "Update draft" : "Save as draft";
	if (id === "test") { savedSeconds = 120; renderSaved(); }
	closeSettings();
}
document.querySelectorAll("#draft-popover [data-draft]").forEach(row =>
	row.addEventListener("click", () => selectDraft(row.dataset.draft))
);
if (document.getElementById("row-test")) selectDraft("huggy");

// ── Authors label: "Coauthors" once more than one author is listed
(function authorsLabel() {
	const lbl = document.querySelector("[data-authors-label]");
	if (!lbl) return;
	const count = document.querySelectorAll(".author-row").length;
	lbl.textContent = count > 1 ? "Coauthors" : "Authors";
})();

// ── Thumbnail replace (always-on translucent button)
document.querySelectorAll("[data-thumb-replace]").forEach(btn =>
	btn.addEventListener("click", () => showToast("Demo only — a file picker would open here"))
);

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
