const STORAGE_KEY = "dhakaSafetyMapState.v1";

const regions = [
  { id: "dhanmondi", name: "Dhanmondi", center: [23.7461, 90.3742] },
  { id: "gulshan", name: "Gulshan", center: [23.7925, 90.4078] },
  { id: "motijheel", name: "Motijheel", center: [23.7330, 90.4172] },
  { id: "mirpur", name: "Mirpur", center: [23.8223, 90.3654] },
  { id: "uttara", name: "Uttara", center: [23.8759, 90.3795] }
];

const submissionStatuses = [
  "submitted",
  "automated_screening",
  "pending_review",
  "needs_reporter_response",
  "needs_more_evidence",
  "under_verification",
  "verified",
  "rejected",
  "duplicate",
  "malicious",
  "withdrawn",
  "archived"
];

const reporterSafeStatus = {
  submitted: "Received",
  automated_screening: "Received",
  pending_review: "Under review",
  needs_reporter_response: "More information requested",
  needs_more_evidence: "More information requested",
  under_verification: "Under review",
  verified: "Verified",
  rejected: "Unable to verify",
  duplicate: "Closed",
  malicious: "Closed",
  withdrawn: "Closed",
  archived: "Closed"
};

const seedState = {
  submissions: [
    {
      id: "sub-seed-1",
      reference: "DSM-2026-0001",
      token: "track-demo-0001",
      status: "pending_review",
      priority: "high",
      duplicateRisk: "low",
      submittedAt: "2026-06-14T10:30:00.000Z",
      lastActivityAt: "2026-06-14T10:35:00.000Z",
      assignedReviewer: "Unassigned",
      incident: {
        category: "Theft or robbery",
        title: "Bag snatching reported near Dhanmondi market",
        description: "Reporter describes a bag snatching near a busy market entrance. No injuries were reported. The report requires corroboration before publication.",
        date: "2026-06-13",
        time: "18:20",
        datePrecision: "exact",
        timePrecision: "approximate",
        witnessRelationship: "affected_person",
        reportedToPolice: "unknown",
        policeReference: "",
        sourceLinks: ["https://example.com/local-news"],
        evidenceDescription: "One still image and a link to a public post.",
        emergencyFlags: { isHappeningNow: false, immediateDanger: false, urgentAssistance: false }
      },
      location: {
        region: "Dhanmondi",
        description: "Near the entrance of a market",
        latitude: 23.746,
        longitude: 90.374,
        precision: "landmark",
        sensitive: false
      },
      evidence: [
        { name: "market-photo.jpg", type: "image/jpeg", size: 1536000, scanStatus: "clean", reviewStatus: "pending", publicVisibility: "private" }
      ],
      reporter: {
        mode: "anonymous_publicly",
        publicAnonymity: true,
        allowFollowUp: true,
        preferredContact: "email",
        name: "Encrypted: R**** A****",
        email: "Encrypted: r****@example.com",
        phone: "Encrypted: +8801*********"
      },
      messages: [],
      reviews: [
        { at: "2026-06-14T10:35:00.000Z", actor: "system", action: "automated_screening", note: "File signature and size checks passed." }
      ]
    },
    {
      id: "sub-seed-2",
      reference: "DSM-2026-0002",
      token: "track-demo-0002",
      status: "needs_reporter_response",
      priority: "normal",
      duplicateRisk: "medium",
      submittedAt: "2026-06-13T15:00:00.000Z",
      lastActivityAt: "2026-06-14T06:10:00.000Z",
      assignedReviewer: "Nadia",
      incident: {
        category: "Harassment",
        title: "Harassment concern near transit stop",
        description: "Reporter submitted a harassment concern near a transit stop. The public summary must avoid identifying private individuals unless official confirmation exists.",
        date: "2026-06-12",
        time: "20:00",
        datePrecision: "exact",
        timePrecision: "approximate",
        witnessRelationship: "personally_witnessed",
        reportedToPolice: "no",
        policeReference: "",
        sourceLinks: [],
        evidenceDescription: "No file evidence.",
        emergencyFlags: { isHappeningNow: false, immediateDanger: false, urgentAssistance: false }
      },
      location: {
        region: "Mirpur",
        description: "Near a transit stop",
        latitude: "",
        longitude: "",
        precision: "area",
        sensitive: true
      },
      evidence: [],
      reporter: {
        mode: "fully_anonymous",
        publicAnonymity: true,
        allowFollowUp: false,
        preferredContact: "none",
        name: "",
        email: "",
        phone: ""
      },
      messages: [
        { at: "2026-06-14T06:10:00.000Z", sender: "reviewer", body: "Please provide a source link or additional context if available.", internal: false }
      ],
      reviews: [
        { at: "2026-06-14T06:10:00.000Z", actor: "Nadia", action: "request_information", note: "Need clearer corroboration before verification." }
      ]
    }
  ],
  publicIncidents: [
    {
      id: "inc-seed-1",
      sourceSubmissionId: "imported-official-1",
      title: "Phone theft confirmed near Gulshan Avenue",
      category: "Theft or robbery",
      region: "Gulshan",
      date: "2026-06-11",
      time: "19:15",
      summary: "A phone theft was confirmed through an approved news source and public police notice. The location has been generalized to the area level.",
      verificationLevel: "corroborated",
      scoreEligible: true,
      publishedAt: "2026-06-12T09:00:00.000Z"
    },
    {
      id: "inc-seed-2",
      sourceSubmissionId: "imported-official-2",
      title: "Road safety incident confirmed in Motijheel",
      category: "Road safety",
      region: "Motijheel",
      date: "2026-06-10",
      time: "08:30",
      summary: "An incident was confirmed by multiple public sources. Personal details and exact marker data are not published.",
      verificationLevel: "officially_confirmed",
      scoreEligible: true,
      publishedAt: "2026-06-11T08:00:00.000Z"
    }
  ],
  audit: []
};

const state = loadState();
let selectedRegion = "Dhanmondi";
let activeStep = 0;
let selectedSubmissionId = state.submissions[0]?.id || null;
let evidenceDraft = [];
let latestSubmissionRef = "";

const els = {
  navLinks: document.querySelectorAll(".nav-link"),
  views: document.querySelectorAll(".view"),
  dashboardReportButton: document.getElementById("dashboardReportButton"),
  regionReportButton: document.getElementById("regionReportButton"),
  emergencyDialog: document.getElementById("emergencyDialog"),
  continueToReportButton: document.getElementById("continueToReportButton"),
  reportForm: document.getElementById("reportForm"),
  formErrors: document.getElementById("formErrors"),
  stepLinks: document.querySelectorAll(".step-link"),
  stepPanels: document.querySelectorAll(".form-step"),
  prevStepButton: document.getElementById("prevStepButton"),
  nextStepButton: document.getElementById("nextStepButton"),
  submitReportButton: document.getElementById("submitReportButton"),
  resetFormButton: document.getElementById("resetFormButton"),
  emergencyFormNotice: document.getElementById("emergencyFormNotice"),
  evidenceInput: document.getElementById("evidenceInput"),
  evidenceList: document.getElementById("evidenceList"),
  reviewPreview: document.getElementById("reviewPreview"),
  contactFields: document.getElementById("contactFields"),
  confirmationDetails: document.getElementById("confirmationDetails"),
  publicIncidentList: document.getElementById("publicIncidentList"),
  publicRegionFilter: document.getElementById("publicRegionFilter"),
  selectedRegionSummary: document.getElementById("selectedRegionSummary"),
  trackForm: document.getElementById("trackForm"),
  trackingInput: document.getElementById("trackingInput"),
  trackingResult: document.getElementById("trackingResult"),
  identityPermissionToggle: document.getElementById("identityPermissionToggle"),
  adminStatusFilter: document.getElementById("adminStatusFilter"),
  adminRegionFilter: document.getElementById("adminRegionFilter"),
  adminPriorityFilter: document.getElementById("adminPriorityFilter"),
  submissionList: document.getElementById("submissionList"),
  submissionDetail: document.getElementById("submissionDetail")
};

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return structuredClone(seedState);
    const parsed = JSON.parse(stored);
    return {
      submissions: parsed.submissions || [],
      publicIncidents: parsed.publicIncidents || [],
      audit: parsed.audit || []
    };
  } catch {
    return structuredClone(seedState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getRegionId(name) {
  return regions.find((region) => region.name === name)?.id || "";
}

function generateReference() {
  const next = state.submissions.length + 1;
  return `DSM-2026-${String(next).padStart(4, "0")}`;
}

function generateToken() {
  const bytes = new Uint32Array(3);
  crypto.getRandomValues(bytes);
  return [...bytes].map((value) => value.toString(36)).join("-");
}

function getFormValue(name) {
  const field = els.reportForm.elements[name];
  if (!field) return "";
  if (field instanceof RadioNodeList) return field.value;
  if (field.type === "checkbox") return field.checked;
  return field.value?.trim() || "";
}

function setView(viewName) {
  els.views.forEach((view) => view.classList.remove("active-view"));
  document.getElementById(`${viewName}View`)?.classList.add("active-view");
  els.navLinks.forEach((button) => button.classList.toggle("active", button.dataset.view === viewName));
  if (viewName === "admin") renderAdmin();
  if (viewName === "dashboard") renderDashboard();
  if (viewName === "report") renderStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function populateSelects() {
  const regionOptions = regions.map((region) => `<option value="${region.name}">${region.name}</option>`).join("");
  els.reportForm.elements.region.innerHTML = `<option value="">Select a region</option>${regionOptions}`;
  els.publicRegionFilter.innerHTML = `<option value="all">All regions</option>${regionOptions}`;
  els.adminRegionFilter.innerHTML = `<option value="all">All regions</option>${regionOptions}`;
  els.adminStatusFilter.innerHTML = `<option value="all">All statuses</option>${submissionStatuses.map((status) => `<option value="${status}">${status.replaceAll("_", " ")}</option>`).join("")}`;
}

function renderDashboard() {
  const inReview = state.submissions.filter((submission) => !["verified", "rejected", "duplicate", "malicious", "withdrawn", "archived"].includes(submission.status));
  document.getElementById("metricPublicIncidents").textContent = state.publicIncidents.length;
  document.getElementById("metricPrivateSubmissions").textContent = inReview.length;
  document.getElementById("metricAwaitingResponse").textContent = state.submissions.filter((submission) => ["needs_reporter_response", "needs_more_evidence"].includes(submission.status)).length;
  document.getElementById("metricScoreEligible").textContent = state.publicIncidents.filter((incident) => incident.scoreEligible).length;

  document.querySelectorAll(".region-node").forEach((button) => {
    button.classList.toggle("active", button.dataset.region === selectedRegion);
  });

  const regionIncidents = state.publicIncidents.filter((incident) => incident.region === selectedRegion);
  const privateCount = state.submissions.filter((submission) => submission.location.region === selectedRegion && submission.status !== "verified").length;
  els.selectedRegionSummary.innerHTML = `
    <strong>${selectedRegion}</strong>
    <span>${regionIncidents.length} verified public incident${regionIncidents.length === 1 ? "" : "s"} and ${privateCount} private submission${privateCount === 1 ? "" : "s"} under review. Regional scores use verified public incidents only.</span>
  `;

  const filter = els.publicRegionFilter.value;
  const incidents = state.publicIncidents
    .filter((incident) => filter === "all" || incident.region === filter)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  els.publicIncidentList.innerHTML = incidents.length ? incidents.map((incident) => `
    <article class="list-card">
      <div class="list-topline">
        <strong>${escapeHtml(incident.title)}</strong>
        <span>${escapeHtml(incident.verificationLevel.replaceAll("_", " "))}</span>
      </div>
      <p>${escapeHtml(incident.summary)}</p>
      <div class="tag-row">
        <span>${escapeHtml(incident.category)}</span>
        <span>${escapeHtml(incident.region)}</span>
        <span>${escapeHtml(incident.date)}</span>
        <span>${incident.scoreEligible ? "Score eligible" : "Not score eligible"}</span>
      </div>
    </article>
  `).join("") : `<div class="empty-state">No verified public incidents match this filter.</div>`;
}

function showReportEmergencyGate() {
  if (typeof els.emergencyDialog.showModal === "function") {
    els.emergencyDialog.showModal();
  } else {
    setView("report");
  }
}

function updateEmergencyNotice() {
  const anyEmergency = ["isHappeningNow", "immediateDanger", "urgentAssistance"].some((name) => getFormValue(name) === "yes");
  els.emergencyFormNotice.hidden = !anyEmergency;
}

function setStep(nextStep) {
  activeStep = Math.max(0, Math.min(5, nextStep));
  renderStep();
}

function renderStep() {
  els.stepLinks.forEach((button) => {
    const step = Number(button.dataset.step);
    button.classList.toggle("active", step === activeStep);
    button.classList.toggle("complete", step < activeStep);
  });
  els.stepPanels.forEach((panel) => {
    panel.classList.toggle("active-step", Number(panel.dataset.stepPanel) === activeStep);
  });
  els.prevStepButton.disabled = activeStep === 0;
  els.nextStepButton.hidden = activeStep === 5;
  els.submitReportButton.hidden = activeStep !== 5;
  els.formErrors.hidden = true;
  if (activeStep === 5) renderReviewPreview();
  updateContactFields();
  updateEmergencyNotice();
}

function showErrors(errors) {
  els.formErrors.hidden = false;
  els.formErrors.innerHTML = `<strong>Please fix the following:</strong><ul>${errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>`;
  els.formErrors.focus?.();
}

function validateStep(step) {
  const errors = [];
  if (step === 1) {
    if (!getFormValue("crimeCategory")) errors.push("Choose a crime category.");
    if (!getFormValue("title")) errors.push("Add an incident title.");
    if (!getFormValue("incidentDate")) errors.push("Add an incident date.");
    if ((getFormValue("description") || "").length < 30) errors.push("Add a description of at least 30 characters.");
  }
  if (step === 2) {
    if (!getFormValue("region")) errors.push("Select a thana or region.");
    if (!getFormValue("locationDescription")) errors.push("Add a nearby landmark or location description.");
  }
  if (step === 3) {
    errors.push(...validateSourceLinks(getFormValue("sourceLinks")));
    errors.push(...validateEvidenceDraft());
  }
  if (step === 4) {
    const mode = getFormValue("submissionMode");
    if (mode !== "fully_anonymous" && getFormValue("allowFollowUp")) {
      const hasEmail = Boolean(getFormValue("reporterEmail"));
      const hasPhone = Boolean(getFormValue("reporterPhone"));
      if (!hasEmail && !hasPhone) errors.push("Provide email or phone, or turn off follow-up permission.");
    }
    if (getFormValue("reporterEmail") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(getFormValue("reporterEmail"))) {
      errors.push("Enter a valid email address.");
    }
  }
  if (step === 5) {
    ["accuracyDeclaration", "reviewAcknowledgement", "emergencyAcknowledgement", "evidencePermission", "privacyAcknowledgement"].forEach((name) => {
      if (!getFormValue(name)) errors.push("Complete all required consent declarations.");
    });
  }
  if (errors.length) showErrors([...new Set(errors)]);
  return errors.length === 0;
}

function validateSourceLinks(rawLinks) {
  if (!rawLinks) return [];
  const errors = [];
  rawLinks.split(/\n+/).map((line) => line.trim()).filter(Boolean).forEach((link) => {
    try {
      const url = new URL(link);
      if (!["https:", "http:"].includes(url.protocol)) errors.push(`Unsupported link protocol: ${link}`);
      if (url.hostname === "localhost" || url.hostname.startsWith("127.")) errors.push(`Local source links are not allowed: ${link}`);
    } catch {
      errors.push(`Invalid source link: ${link}`);
    }
  });
  return errors;
}

function validateEvidenceDraft() {
  const errors = [];
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  const totalSize = evidenceDraft.reduce((sum, file) => sum + file.size, 0);
  if (evidenceDraft.length > 5) errors.push("Upload no more than 5 files.");
  if (totalSize > 40 * 1024 * 1024) errors.push("Total evidence size must stay under 40 MB.");
  evidenceDraft.forEach((file) => {
    if (!allowed.includes(file.type)) errors.push(`${file.name} is not a supported file type.`);
    if (file.type.startsWith("image/") && file.size > 10 * 1024 * 1024) errors.push(`${file.name} exceeds the 10 MB image limit.`);
    if (file.type === "application/pdf" && file.size > 15 * 1024 * 1024) errors.push(`${file.name} exceeds the 15 MB PDF limit.`);
    if (/\.svg$/i.test(file.name) || /\.(exe|bat|cmd|js|html|scr|msi)$/i.test(file.name)) errors.push(`${file.name} is not allowed.`);
  });
  return errors;
}

function renderEvidenceList() {
  const errors = validateEvidenceDraft();
  els.evidenceList.innerHTML = evidenceDraft.length ? evidenceDraft.map((file, index) => `
    <div class="evidence-item">
      <div>
        <strong>${escapeHtml(file.name)}</strong>
        <span>${escapeHtml(file.type || "unknown")} · ${Math.round(file.size / 1024)} KB · scan pending</span>
      </div>
      <button type="button" data-remove-evidence="${index}">Remove</button>
    </div>
  `).join("") : `<div class="empty-state">No evidence files selected.</div>`;
  if (errors.length) {
    els.evidenceList.insertAdjacentHTML("beforeend", `<div class="error-note">${errors.map(escapeHtml).join("<br>")}</div>`);
  }
}

function updateContactFields() {
  const fullyAnonymous = getFormValue("submissionMode") === "fully_anonymous";
  els.contactFields.classList.toggle("disabled-fields", fullyAnonymous);
  els.contactFields.querySelectorAll("input, select").forEach((field) => {
    if (field.name !== "submissionMode") field.disabled = fullyAnonymous;
  });
}

function renderReviewPreview() {
  const sourceLinks = getFormValue("sourceLinks").split(/\n+/).map((link) => link.trim()).filter(Boolean);
  els.reviewPreview.innerHTML = `
    <div><strong>Incident</strong><span>${escapeHtml(getFormValue("crimeCategory"))} · ${escapeHtml(getFormValue("title"))}</span></div>
    <div><strong>Date and location</strong><span>${escapeHtml(getFormValue("incidentDate"))} ${escapeHtml(getFormValue("incidentTime"))} · ${escapeHtml(getFormValue("region"))}</span></div>
    <div><strong>Reporter mode</strong><span>${escapeHtml(getFormValue("submissionMode").replaceAll("_", " "))}</span></div>
    <div><strong>Evidence</strong><span>${evidenceDraft.length} file${evidenceDraft.length === 1 ? "" : "s"} · ${sourceLinks.length} source link${sourceLinks.length === 1 ? "" : "s"}</span></div>
    <div><strong>Publication rule</strong><span>This private submission will not appear on the public map or affect scoring unless verified and converted into a separate public incident.</span></div>
  `;
}

function collectSubmission() {
  const reference = generateReference();
  const now = new Date().toISOString();
  const sourceLinks = getFormValue("sourceLinks").split(/\n+/).map((link) => link.trim()).filter(Boolean);
  const mode = getFormValue("submissionMode");
  const emergencyFlags = {
    isHappeningNow: getFormValue("isHappeningNow") === "yes",
    immediateDanger: getFormValue("immediateDanger") === "yes",
    urgentAssistance: getFormValue("urgentAssistance") === "yes"
  };
  const priority = Object.values(emergencyFlags).some(Boolean) ? "high" : "normal";
  return {
    id: `sub-${Date.now()}`,
    reference,
    token: generateToken(),
    status: "pending_review",
    priority,
    duplicateRisk: detectDuplicateRisk(getFormValue("title"), getFormValue("region")),
    submittedAt: now,
    lastActivityAt: now,
    assignedReviewer: "Unassigned",
    incident: {
      category: getFormValue("crimeCategory"),
      title: getFormValue("title"),
      description: getFormValue("description"),
      date: getFormValue("incidentDate"),
      time: getFormValue("incidentTime"),
      datePrecision: getFormValue("datePrecision"),
      timePrecision: getFormValue("timePrecision"),
      witnessRelationship: getFormValue("witnessRelationship"),
      reportedToPolice: getFormValue("reportedToPolice"),
      policeReference: getFormValue("policeReference") || getFormValue("evidencePoliceReference"),
      sourceLinks,
      evidenceDescription: getFormValue("evidenceDescription"),
      emergencyFlags
    },
    location: {
      region: getFormValue("region"),
      description: getFormValue("locationDescription"),
      latitude: getFormValue("latitude"),
      longitude: getFormValue("longitude"),
      precision: getFormValue("locationPrecision"),
      sensitive: getFormValue("sensitiveLocation")
    },
    evidence: evidenceDraft.map((file) => ({
      name: file.name.replace(/[<>:"/\\|?*]/g, "_"),
      type: file.type,
      size: file.size,
      scanStatus: "pending",
      reviewStatus: "pending",
      publicVisibility: "private"
    })),
    reporter: {
      mode,
      publicAnonymity: mode !== "identified" || getFormValue("publicAnonymity"),
      allowFollowUp: mode !== "fully_anonymous" && getFormValue("allowFollowUp"),
      preferredContact: mode === "fully_anonymous" ? "none" : getFormValue("preferredContact"),
      name: mode === "fully_anonymous" ? "" : maskValue(getFormValue("reporterName"), "name"),
      email: mode === "fully_anonymous" ? "" : maskValue(getFormValue("reporterEmail"), "email"),
      phone: mode === "fully_anonymous" ? "" : maskValue(getFormValue("reporterPhone"), "phone")
    },
    messages: [],
    reviews: [
      { at: now, actor: "system", action: "submitted", note: "Private submission created. It is not public and not score eligible." },
      { at: now, actor: "system", action: "automated_screening", note: "Client-side file type and size checks completed for prototype." }
    ]
  };
}

function detectDuplicateRisk(title, region) {
  const normalized = title.toLowerCase().split(/\W+/).filter((word) => word.length > 3);
  const hasNearby = state.submissions.some((submission) => {
    const haystack = `${submission.incident.title} ${submission.location.region}`.toLowerCase();
    return submission.location.region === region && normalized.some((word) => haystack.includes(word));
  });
  return hasNearby ? "medium" : "low";
}

function maskValue(value, type) {
  if (!value) return "";
  if (type === "email") {
    const [name, domain] = value.split("@");
    return `Encrypted: ${name.slice(0, 1)}****@${domain || "hidden"}`;
  }
  if (type === "phone") return "Encrypted: +***********";
  return `Encrypted: ${value.slice(0, 1)}****`;
}

function submitReport(event) {
  event.preventDefault();
  if (!validateStep(5)) return;
  const submission = collectSubmission();
  state.submissions.unshift(submission);
  latestSubmissionRef = submission.reference;
  selectedSubmissionId = submission.id;
  saveState();
  renderConfirmation(submission);
  els.reportForm.reset();
  evidenceDraft = [];
  renderEvidenceList();
  activeStep = 0;
  setView("confirmation");
}

function renderConfirmation(submission) {
  els.confirmationDetails.innerHTML = `
    <div><span>Reference number</span><strong>${escapeHtml(submission.reference)}</strong></div>
    <div><span>Tracking token</span><strong>${escapeHtml(submission.token)}</strong></div>
    <div><span>Submitted</span><strong>${formatDateTime(submission.submittedAt)}</strong></div>
    <div><span>Current status</span><strong>${reporterSafeStatus[submission.status]}</strong></div>
    <div><span>Next step</span><strong>Administrative review queue</strong></div>
  `;
  els.trackingInput.value = submission.reference;
}

function resetForm() {
  els.reportForm.reset();
  evidenceDraft = [];
  activeStep = 0;
  renderEvidenceList();
  renderStep();
}

function renderTrackingResult(submission) {
  if (!submission) {
    els.trackingResult.innerHTML = `<div class="empty-state">No submission was found for that reference or token.</div>`;
    return;
  }
  const publicMessages = submission.messages.filter((message) => !message.internal);
  els.trackingResult.innerHTML = `
    <div class="section-head">
      <div>
        <h3>${escapeHtml(submission.reference)}</h3>
        <p>${escapeHtml(submission.incident.title)}</p>
      </div>
      <span class="status-chip">${reporterSafeStatus[submission.status]}</span>
    </div>
    <div class="timeline">
      <div><strong>Received</strong><span>${formatDateTime(submission.submittedAt)}</span></div>
      <div><strong>Last activity</strong><span>${formatDateTime(submission.lastActivityAt)}</span></div>
      <div><strong>Review process</strong><span>Reports are checked before they may be published or used for scoring.</span></div>
    </div>
    <form class="message-form" data-message-form="${submission.id}">
      <label class="field">
        <span>Send a reporter response</span>
        <textarea name="messageBody" rows="4" ${submission.reporter.mode === "fully_anonymous" ? "disabled" : ""} placeholder="${submission.reporter.mode === "fully_anonymous" ? "Fully anonymous submissions cannot receive follow-up threads." : "Add clarification or extra context"}"></textarea>
      </label>
      <button class="secondary-btn" ${submission.reporter.mode === "fully_anonymous" ? "disabled" : ""}>Send response</button>
    </form>
    <div class="stack-list">
      ${publicMessages.length ? publicMessages.map((message) => `<div class="list-card"><strong>${escapeHtml(message.sender)}</strong><p>${escapeHtml(message.body)}</p><span>${formatDateTime(message.at)}</span></div>`).join("") : `<div class="empty-state">No reporter-visible messages yet.</div>`}
    </div>
  `;
}

function renderAdmin() {
  const active = state.submissions.filter((submission) => !["verified", "rejected", "duplicate", "malicious", "withdrawn", "archived"].includes(submission.status));
  document.getElementById("adminMetricNew").textContent = state.submissions.filter((submission) => submission.status === "submitted" || submission.status === "pending_review").length;
  document.getElementById("adminMetricReview").textContent = active.length;
  document.getElementById("adminMetricDuplicates").textContent = state.submissions.filter((submission) => submission.duplicateRisk !== "low").length;
  document.getElementById("adminMetricPriority").textContent = state.submissions.filter((submission) => submission.priority === "high").length;

  const status = els.adminStatusFilter.value;
  const region = els.adminRegionFilter.value;
  const priority = els.adminPriorityFilter.value;
  const submissions = state.submissions.filter((submission) => {
    return (status === "all" || submission.status === status)
      && (region === "all" || submission.location.region === region)
      && (priority === "all" || submission.priority === priority);
  });

  els.submissionList.innerHTML = submissions.length ? submissions.map((submission) => `
    <button class="submission-row ${submission.id === selectedSubmissionId ? "active" : ""}" data-submission-id="${submission.id}">
      <span>
        <strong>${escapeHtml(submission.reference)}</strong>
        <small>${escapeHtml(submission.incident.category)} · ${escapeHtml(submission.location.region)}</small>
      </span>
      <span>
        <em>${escapeHtml(submission.status.replaceAll("_", " "))}</em>
        <small>${escapeHtml(submission.priority)} · duplicate ${escapeHtml(submission.duplicateRisk)}</small>
      </span>
    </button>
  `).join("") : `<div class="empty-state">No submissions match the selected filters.</div>`;

  const selected = state.submissions.find((submission) => submission.id === selectedSubmissionId) || submissions[0];
  if (selected) {
    selectedSubmissionId = selected.id;
    renderSubmissionDetail(selected);
  } else {
    els.submissionDetail.innerHTML = `<div class="empty-state">Select a submission from the queue.</div>`;
  }
}

function renderSubmissionDetail(submission) {
  const canReadIdentity = els.identityPermissionToggle.checked;
  const identityBlock = canReadIdentity ? `
    <div class="identity-box">
      <p><strong>Name</strong><span>${escapeHtml(submission.reporter.name || "Not provided")}</span></p>
      <p><strong>Email</strong><span>${escapeHtml(submission.reporter.email || "Not provided")}</span></p>
      <p><strong>Phone</strong><span>${escapeHtml(submission.reporter.phone || "Not provided")}</span></p>
    </div>
  ` : `<div class="restricted-box">Reporter identity: Restricted. Enable the dedicated permission to reveal contact details.</div>`;

  els.submissionDetail.innerHTML = `
    <div class="detail-header">
      <div>
        <p class="eyebrow">${escapeHtml(submission.reference)}</p>
        <h3>${escapeHtml(submission.incident.title)}</h3>
        <p>${escapeHtml(submission.incident.description)}</p>
      </div>
      <span class="status-chip">${escapeHtml(submission.status.replaceAll("_", " "))}</span>
    </div>

    <div class="detail-grid">
      <section>
        <h4>Report summary</h4>
        <p><strong>Category</strong><span>${escapeHtml(submission.incident.category)}</span></p>
        <p><strong>Date and time</strong><span>${escapeHtml(submission.incident.date)} ${escapeHtml(submission.incident.time || "")}</span></p>
        <p><strong>Police status</strong><span>${escapeHtml(submission.incident.reportedToPolice)} ${escapeHtml(submission.incident.policeReference || "")}</span></p>
        <p><strong>Emergency indicator</strong><span>${Object.values(submission.incident.emergencyFlags).some(Boolean) ? "Yes" : "No"}</span></p>
      </section>
      <section>
        <h4>Location</h4>
        <p><strong>Region</strong><span>${escapeHtml(submission.location.region)}</span></p>
        <p><strong>Description</strong><span>${escapeHtml(submission.location.description)}</span></p>
        <p><strong>Precision</strong><span>${escapeHtml(submission.location.precision)}</span></p>
        <p><strong>Sensitive</strong><span>${submission.location.sensitive ? "Yes, generalize if published" : "No"}</span></p>
      </section>
      <section>
        <h4>Evidence</h4>
        ${submission.evidence.length ? submission.evidence.map((item, index) => `
          <p><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.type)} · ${Math.round(item.size / 1024)} KB · ${escapeHtml(item.scanStatus)} · private <button class="text-btn" data-view-evidence="${index}">Log view</button></span></p>
        `).join("") : `<p><span>No files uploaded.</span></p>`}
      </section>
      <section>
        <h4>Source links</h4>
        ${submission.incident.sourceLinks.length ? submission.incident.sourceLinks.map((link) => `<p><strong>${classifyLink(link)}</strong><span>${escapeHtml(link)}</span></p>`).join("") : `<p><span>No source links provided.</span></p>`}
      </section>
      <section>
        <h4>Reporter</h4>
        <p><strong>Mode</strong><span>${escapeHtml(submission.reporter.mode.replaceAll("_", " "))}</span></p>
        <p><strong>Follow-up</strong><span>${submission.reporter.allowFollowUp ? "Allowed" : "Not available"}</span></p>
        ${identityBlock}
      </section>
      <section>
        <h4>Verification</h4>
        <label class="field">
          <span>Verification level</span>
          <select id="verificationLevel">
            <option value="unverified">Unverified</option>
            <option value="partially_corroborated">Partially corroborated</option>
            <option value="corroborated">Corroborated</option>
            <option value="officially_confirmed">Officially confirmed</option>
            <option value="unable_to_verify">Unable to verify</option>
            <option value="disputed">Disputed</option>
          </select>
        </label>
        <label class="field">
          <span>Reviewer note</span>
          <textarea id="reviewerNote" rows="4" placeholder="Document evidence, source assessment, duplicate checks, and publication risk."></textarea>
        </label>
      </section>
    </div>

    <div class="admin-actions">
      <button class="secondary-btn" data-admin-action="assign">Assign reviewer</button>
      <button class="secondary-btn" data-admin-action="request">Request information</button>
      <button class="secondary-btn" data-admin-action="duplicate">Mark duplicate</button>
      <button class="secondary-btn danger" data-admin-action="reject">Reject</button>
      <button class="primary-btn" data-admin-action="verify">Verify</button>
      <button class="primary-btn" data-admin-action="create">Create public incident</button>
    </div>

    <section class="timeline-panel">
      <h4>Audit timeline</h4>
      <div class="timeline">
        ${submission.reviews.map((review) => `<div><strong>${escapeHtml(review.action.replaceAll("_", " "))}</strong><span>${formatDateTime(review.at)} · ${escapeHtml(review.actor)} · ${escapeHtml(review.note)}</span></div>`).join("")}
      </div>
    </section>
  `;

}

function classifyLink(link) {
  try {
    const host = new URL(link).hostname;
    if (host.includes("police") || host.includes("gov")) return "official";
    if (host.includes("youtube") || host.includes("youtu.be")) return "video platform";
    if (host.includes("facebook") || host.includes("x.com") || host.includes("twitter")) return "social media";
    if (host.includes("news")) return "other news";
    return "unknown";
  } catch {
    return "invalid";
  }
}

function addReview(submission, actor, action, note, shouldSave = true) {
  const last = submission.reviews[0];
  if (last?.action === action && Date.now() - new Date(last.at).getTime() < 1000) return;
  submission.reviews.unshift({
    at: new Date().toISOString(),
    actor,
    action,
    note
  });
  submission.lastActivityAt = new Date().toISOString();
  if (shouldSave) saveState();
}

function handleAdminAction(action, submission) {
  const note = document.getElementById("reviewerNote")?.value.trim() || "No reviewer note supplied.";
  const verificationLevel = document.getElementById("verificationLevel")?.value || "unverified";
  if (action === "assign") {
    submission.assignedReviewer = "Nadia";
    addReview(submission, "admin", "reviewer_assigned", "Assigned to Nadia.");
  }
  if (action === "request") {
    submission.status = "needs_reporter_response";
    submission.messages.unshift({ at: new Date().toISOString(), sender: "reviewer", body: note, internal: false });
    addReview(submission, "admin", "request_information", note);
  }
  if (action === "duplicate") {
    submission.status = "duplicate";
    addReview(submission, "admin", "marked_duplicate", note);
  }
  if (action === "reject") {
    submission.status = "rejected";
    addReview(submission, "admin", "rejected", note);
  }
  if (action === "verify") {
    if (!["corroborated", "officially_confirmed"].includes(verificationLevel)) {
      alert("Use corroborated or officially confirmed before verifying.");
      return;
    }
    submission.status = "verified";
    submission.verificationLevel = verificationLevel;
    addReview(submission, "admin", "verified", note);
  }
  if (action === "create") {
    createPublicIncident(submission, verificationLevel, note);
  }
  saveState();
  renderAdmin();
  renderDashboard();
}

function createPublicIncident(submission, verificationLevel, note) {
  if (state.publicIncidents.some((incident) => incident.sourceSubmissionId === submission.id)) {
    alert("A public incident has already been created from this submission.");
    return;
  }
  const level = submission.verificationLevel || verificationLevel;
  if (submission.status !== "verified" || !["corroborated", "officially_confirmed"].includes(level)) {
    alert("Only verified, corroborated submissions can create public incidents.");
    return;
  }
  const incident = {
    id: `inc-${Date.now()}`,
    sourceSubmissionId: submission.id,
    title: neutralizeTitle(submission.incident.title),
    category: submission.incident.category,
    region: submission.location.region,
    date: submission.incident.date,
    time: submission.incident.time,
    summary: buildPublicSummary(submission),
    verificationLevel: level,
    scoreEligible: true,
    publishedAt: new Date().toISOString()
  };
  state.publicIncidents.unshift(incident);
  submission.verifiedIncidentId = incident.id;
  addReview(submission, "admin", "public_incident_created", note || "Created sanitized public incident.");
}

function neutralizeTitle(title) {
  return title
    .replace(/\b(accused|guilty|criminal|thief)\b/gi, "reported person")
    .replace(/\s+/g, " ")
    .trim();
}

function buildPublicSummary(submission) {
  const location = submission.location.sensitive ? `${submission.location.region} area` : submission.location.region;
  return `A ${submission.incident.category.toLowerCase()} report in the ${location} area was verified by reviewers. Reporter identity, private evidence, and exact submitted marker details are not public.`;
}

function attachEvents() {
  els.navLinks.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  document.querySelectorAll("[data-view-target]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.viewTarget)));
  els.dashboardReportButton.addEventListener("click", showReportEmergencyGate);
  els.regionReportButton.addEventListener("click", () => {
    els.reportForm.elements.region.value = selectedRegion;
    showReportEmergencyGate();
  });
  els.continueToReportButton.addEventListener("click", () => setView("report"));

  document.querySelectorAll(".region-node").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRegion = button.dataset.region;
      renderDashboard();
    });
  });
  els.publicRegionFilter.addEventListener("change", renderDashboard);

  els.stepLinks.forEach((button) => button.addEventListener("click", () => {
    const targetStep = Number(button.dataset.step);
    if (targetStep <= activeStep || validateStep(activeStep)) setStep(targetStep);
  }));
  els.prevStepButton.addEventListener("click", () => setStep(activeStep - 1));
  els.nextStepButton.addEventListener("click", () => {
    if (validateStep(activeStep)) setStep(activeStep + 1);
  });
  els.resetFormButton.addEventListener("click", resetForm);
  els.reportForm.addEventListener("submit", submitReport);
  els.reportForm.addEventListener("change", (event) => {
    if (event.target.name === "submissionMode") updateContactFields();
    updateEmergencyNotice();
  });

  els.evidenceInput.addEventListener("change", () => {
    evidenceDraft = [...els.evidenceInput.files].map((file) => ({ name: file.name, type: file.type, size: file.size }));
    renderEvidenceList();
  });
  els.evidenceList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-evidence]");
    if (!button) return;
    evidenceDraft.splice(Number(button.dataset.removeEvidence), 1);
    els.evidenceInput.value = "";
    renderEvidenceList();
  });

  document.querySelectorAll("[data-region-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      const region = regions.find((item) => item.name === button.dataset.regionPick);
      els.reportForm.elements.region.value = region.name;
      els.reportForm.elements.latitude.value = region.center[0];
      els.reportForm.elements.longitude.value = region.center[1];
    });
  });

  els.trackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = els.trackingInput.value.trim().toLowerCase();
    const submission = state.submissions.find((item) => item.reference.toLowerCase() === query || item.token.toLowerCase() === query);
    renderTrackingResult(submission);
  });
  els.trackingResult.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-message-form]");
    if (!form) return;
    event.preventDefault();
    const submission = state.submissions.find((item) => item.id === form.dataset.messageForm);
    const body = form.elements.messageBody.value.trim();
    if (!submission || !body) return;
    submission.messages.unshift({ at: new Date().toISOString(), sender: "reporter", body, internal: false });
    addReview(submission, "reporter", "reporter_response", "Reporter sent a tracking-thread response.");
    saveState();
    renderTrackingResult(submission);
    renderAdmin();
  });

  [els.adminStatusFilter, els.adminRegionFilter, els.adminPriorityFilter].forEach((control) => {
    control.addEventListener("change", renderAdmin);
  });
  els.identityPermissionToggle.addEventListener("change", () => {
    const selected = state.submissions.find((submission) => submission.id === selectedSubmissionId);
    if (selected && els.identityPermissionToggle.checked) {
      addReview(selected, "admin", "reporter_identity_viewed", "Reporter identity was revealed through the dedicated permission gate.");
    }
    renderAdmin();
  });
  els.submissionList.addEventListener("click", (event) => {
    const row = event.target.closest("[data-submission-id]");
    if (!row) return;
    selectedSubmissionId = row.dataset.submissionId;
    renderAdmin();
  });
  els.submissionDetail.addEventListener("click", (event) => {
    const selected = state.submissions.find((submission) => submission.id === selectedSubmissionId);
    if (!selected) return;
    const evidenceButton = event.target.closest("[data-view-evidence]");
    if (evidenceButton) {
      addReview(selected, "admin", "evidence_viewed", `Evidence item ${Number(evidenceButton.dataset.viewEvidence) + 1} was accessed through a short-lived preview simulation.`);
      renderAdmin();
      return;
    }
    const actionButton = event.target.closest("[data-admin-action]");
    if (actionButton) handleAdminAction(actionButton.dataset.adminAction, selected);
  });
}

function init() {
  populateSelects();
  attachEvents();
  renderEvidenceList();
  renderStep();
  renderDashboard();
  renderAdmin();
  if (latestSubmissionRef) els.trackingInput.value = latestSubmissionRef;
}

init();
