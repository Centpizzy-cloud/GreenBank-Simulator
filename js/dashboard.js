// =============================
// SESSION GUARD
// =============================
const storedUser = localStorage.getItem("greenbank_current_user");
if (!storedUser) location.href = "login.html";

let user = JSON.parse(storedUser);

// =============================
// ELEMENTS
// =============================
const totalBalanceEl = document.getElementById("totalBalance");
const checkingEl = document.getElementById("checkingBalance");
const savingsEl = document.getElementById("savingsBalance");
const activityList = document.getElementById("activityList");

const transferForm = document.getElementById("transferForm");
const beneficiarySelect = document.getElementById("beneficiarySelect");
const transferAmount = document.getElementById("transferAmount");
const transferNote = document.getElementById("transferNote");

// MODALS
const benModal = document.getElementById("beneficiaryModal");
const pinModal = document.getElementById("pinModal");
const adminModal = document.getElementById("adminModal");
const lockScreen = document.getElementById("lockScreen");

// PIN
const pinInput = document.getElementById("pinInput");
const pinConfirmBtn = document.getElementById("pinConfirmBtn");
const unlockPinInput = document.getElementById("unlockPinInput");
const unlockBtn = document.getElementById("unlockBtn");

let pinCallback = null;

// =============================
// UTIL
// =============================
function saveUser() {
  const users = JSON.parse(localStorage.getItem("greenbank_users")) || [];
  const idx = users.findIndex(u => u.id === user.id);
  users[idx] = user;
  localStorage.setItem("greenbank_users", JSON.stringify(users));
  localStorage.setItem("greenbank_current_user", JSON.stringify(user));
}

function format(n) {
  return `$${n.toFixed(2)}`;
}

// =============================
// RENDER
// =============================
function render() {
  const total = user.accounts.checking + user.accounts.savings;
  totalBalanceEl.textContent = format(total);
  checkingEl.textContent = format(user.accounts.checking);
  savingsEl.textContent = format(user.accounts.savings);

  activityList.innerHTML = "";
  (user.transactions || []).slice(0, 6).forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.type.toUpperCase()} ${format(t.amount)} — ${t.note || ""}`;
    activityList.appendChild(li);
  });

  renderBeneficiaries();
}

// =============================
// BENEFICIARIES
// =============================
user.beneficiaries ||= [];

function renderBeneficiaries() {
  beneficiarySelect.innerHTML = `<option value="">Select beneficiary</option>`;
  user.beneficiaries.forEach((b, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${b.name} — ${b.bank}`;
    beneficiarySelect.appendChild(opt);
  });
}

document.getElementById("addBeneficiaryBtn").onclick = () =>
  benModal.classList.remove("hidden");

document.getElementById("cancelBen").onclick = () =>
  benModal.classList.add("hidden");

document.getElementById("saveBen").onclick = () => {
  const name = document.getElementById("benName").value;
  const bank = document.getElementById("benBank").value;
  const acc = document.getElementById("benAccount").value;

  if (!name || !bank || !acc) return alert("All fields required");

  user.beneficiaries.push({ name, bank, acc });
  saveUser();
  benModal.classList.add("hidden");
  renderBeneficiaries();
};

// =============================
// PIN SYSTEM
// =============================
function requirePIN(action) {
  pinCallback = action;
  pinModal.classList.remove("hidden");
}

pinConfirmBtn.onclick = () => {
  const pin = pinInput.value;
  if (pin.length !== 6) return alert("PIN must be 6 digits");

  if (!user.pin) {
    user.pin = btoa(pin);
    saveUser();
  } else if (btoa(pin) !== user.pin) {
    return alert("Invalid PIN");
  }

  pinModal.classList.add("hidden");
  pinInput.value = "";
  pinCallback();
};

// LOCK ON LOAD
if (user.pin) lockScreen.classList.remove("hidden");

unlockBtn.onclick = () => {
  if (btoa(unlockPinInput.value) === user.pin) {
    lockScreen.classList.add("hidden");
    unlockPinInput.value = "";
  } else {
    alert("Wrong PIN");
  }
};

// =============================
// TRANSFER
// =============================
transferForm.onsubmit = e => {
  e.preventDefault();

  const benIndex = beneficiarySelect.value;
  const amount = Number(transferAmount.value);

  if (benIndex === "" || amount <= 0) return;

  requirePIN(() => {
    user.accounts.checking -= amount;
    user.transactions ||= [];
    user.transactions.unshift({
      type: "debit",
      amount,
      note: `External transfer`
    });

    saveUser();
    render();
    transferAmount.value = "";
    transferNote.value = "";
  });
};

// =============================
// CONTACT ADMIN
// =============================
document.getElementById("contactAdminBtn").onclick = () =>
  adminModal.classList.remove("hidden");

document.getElementById("cancelAdmin").onclick = () =>
  adminModal.classList.add("hidden");

document.getElementById("sendAdmin").onclick = () => {
  const msg = document.getElementById("adminMessage").value;
  if (!msg) return;

  user.adminMessages ||= [];
  user.adminMessages.push({
    message: msg,
    date: new Date().toISOString()
  });

  saveUser();
  adminModal.classList.add("hidden");
  document.getElementById("adminMessage").value = "";
};

// =============================
function logout() {
  localStorage.removeItem("greenbank_current_user");
  location.href = "login.html";
}

window.logout = logout;
render();
