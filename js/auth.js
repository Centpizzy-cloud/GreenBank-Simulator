document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("emailInput").value.trim().toLowerCase();
    const password = document.getElementById("passwordInput").value;

    const users = JSON.parse(localStorage.getItem("greenbank_users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid login details.");
      return;
    }

    localStorage.setItem("greenbank_current_user", JSON.stringify(user));
    location.href = "dashboard.html";
  });
});
