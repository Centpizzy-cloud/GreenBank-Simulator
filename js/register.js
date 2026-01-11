document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim().toLowerCase();
    const password = document.getElementById("passwordInput").value;

    if (!name || !email || !password) {
      alert("All fields required.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("greenbank_users")) || [];

    if (users.some(u => u.email === email)) {
      alert("Account already exists.");
      return;
    }

    const user = {
      id: Date.now().toString(),
      name,
      email,
      password,
      accounts: {
        checking: 0,
        savings: 0
      },
      transactions: []
    };

    users.push(user);
    localStorage.setItem("greenbank_users", JSON.stringify(users));

    alert("Account created.");
    location.href = "login.html";
  });
});
