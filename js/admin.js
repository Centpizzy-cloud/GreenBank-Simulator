// =============================
// GREENBANK ADMIN CORE
// =============================

const PIN_KEY = "greenbank_admin_pin";
const SESSION_KEY = "greenbank_admin_session";
const AUDIT_KEY = "greenbank_admin_audit";

// UI
const lockScreen = document.getElementById("lockScreen");
const adminApp = document.getElementById("adminApp");
const pinInput = document.getElementById("pinInput");
const unlockBtn = document.getElementById("unlockBtn");
const pinStatus = document.getElementById("pinStatus");

const userSelect = document.getElementById("userSelect");
const actionSelect = document.getElementById("actionSelect");
const accountSelect = document.getElementById("accountSelect");
const amountInput = document.getElementById("amountInput");
const sourceInput = document.getElementById("sourceInput");
const timeInput = document.getElementById("timeInput");
const applyBtn = document.getElementById("applyBtn");
const actionStatus = document.getElementById("actionStatus");
const auditLog = document.getElementById("auditLog");

const lockBtn = document.getElementById("lockBtn");

// -----------------------------
// UTIL
// -----------------------------

function getUsers() {
  return JSON.parse(localStorage.getItem("greenbank_users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("greenbank_users", JSON.stringify(users));
}

function getAudit() {
  return JSON.parse(localStorage.getItem(AUDIT_KEY)) || [];
}

function saveAudit(log) {
  localStorage.setItem(AUDIT_KEY, JSON.stringify(log));
}

function hashPIN(pin) {
  return btoa(pin);
}

function generateSessionId() {
  return "ADM-" + Date.now() + "-" + Math.random().toString(36).slice(2);
}

// -----------------------------
// LOCK SYSTEM
// -----------------------------

function showLock() {
  lockScreen.classList.remove("hidden");
  adminApp.classList.add("hidden");
}

function showAdmin() {
  lockScreen.classList.add("hidden");
  adminApp.classList.remove("hidden");
}

function checkSession() {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (session) {
    showAdmin();
    loadUsers();
    loadAudit();
  } else {
    showLock();
  }
}

unlockBtn.onclick = () => {
  const pin = pinInput.value.trim();

  if (pin.length !== 6) {
    pinStatus.textContent = "PIN must be 6 digits";
    return;
  }

  const stored = localStorage.getItem(PIN_KEY);

  if (!stored) {
    localStorage.setItem(PIN_KEY, hashPIN(pin));
    sessionStorage.setItem(SESSION_KEY, generateSessionId());
    showAdmin();
    loadUsers();
    loadAudit();
    return;
  }

  if (hashPIN(pin) !== stored) {
    pinStatus.textContent = "Invalid PIN";
    return;
  }

  sessionStorage.setItem(SESSION_KEY, generateSessionId());
  showAdmin();
  loadUsers();
  loadAudit();
};

lockBtn.onclick = () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
};

// -----------------------------
// USERS
// -----------------------------

function loadUsers() {
  const users = getUsers();
  userSelect.innerHTML = "";

  users.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = `${u.name} (${u.email})`;
    userSelect.appendChild(opt);
  });
}

// -----------------------------
// AUDIT
// -----------------------------

function addAudit(entry) {
  const log = getAudit();
  log.unshift(entry);
  saveAudit(log);
}

function loadAudit() {
  const log = getAudit().slice(0, 20);
  auditLog.innerHTML = "";

  log.forEach(e => {
    const div = document.createElement("div");
    div.className = "audit-entry";
    div.textContent =
      `[${e.executedAt}] ${e.action} → ${e.targetUserEmail} | $${e.amount} | ${e.account} | ${e.fundingSource} | effective: ${e.effectiveTime}`;
    auditLog.appendChild(div);
  });
}

// -----------------------------
// APPLY CREDIT / DEBIT
// -----------------------------

applyBtn.onclick = () => {
  const users = getUsers();
  const userId = userSelect.value;
  const action = actionSelect.value;
  const account = accountSelect.value;
  const amount = Number(amountInput.value);
  const source = sourceInput.value.trim() || "Admin adjustment";
  const effectiveTime = timeInput.value
    ? new Date(timeInput.value).toISOString()
    : new Date().toISOString();

  if (!userId || !amount || amount <= 0) {
    actionStatus.textContent = "Invalid input.";
    return;
  }

  const user = users.find(u => u.id === userId);
  if (!user) return;

  if (!user.accounts) user.accounts = { checking: 0, savings: 0 };
  if (!user.transactions) user.transactions = [];

  if (action === "debit" && user.accounts[account] < amount) {
    actionStatus.textContent = "Insufficient funds.";
    return;
  }

  // Apply
  if (action === "credit") user.accounts[account] += amount;
  if (action === "debit") user.accounts[account] -= amount;

  user.transactions.unshift({
    id: "txn_admin_" + Date.now(),
    type: action,
    amount,
    account,
    description: `Admin ${action} — ${source}`,
    effectiveTime
  });

  // Save users
  saveUsers(users);

  // Sync logged-in user if needed
  const current = localStorage.getItem("greenbank_current_user");
  if (current) {
    const cu = JSON.parse(current);
    if (cu.id === user.id) {
      localStorage.setItem("greenbank_current_user", JSON.stringify(user));
    }
  }

  // Audit
  addAudit({
    action: action === "credit" ? "ADMIN_CREDIT" : "ADMIN_DEBIT",
    targetUserId: user.id,
    targetUserEmail: user.email,
    account,
    amount,
    fundingSource: source,
    effectiveTime,
    executedAt: new Date().toISOString(),
    sessionId: sessionStorage.getItem(SESSION_KEY)
  });

  loadAudit();

  actionStatus.textContent = "Transaction applied.";

  amountInput.value = "";
  sourceInput.value = "";
};

// -----------------------------
checkSession();
