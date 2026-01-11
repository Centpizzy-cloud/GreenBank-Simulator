# GreenBank Simulator

A frontend-only fintech banking system simulation built with pure HTML, CSS, and Vanilla JavaScript — designed to model real-world banking behavior, state logic, and UI architecture without backend dependencies.

Live Demo: https://melodious-sunshine-7cee2d.netlify.app/

---

## 🏦 What Is GreenBank?

GreenBank is not a static demo. It’s a core banking behavior simulator that mimics how real financial systems handle users, accounts, transactions, sessions, and audit logic — all inside the browser.

It simulates:

- User registration & authentication
- Persistent session state
- Multiple accounts (checking/savings)
- Credit, debit, and transfer workflows
- Transaction ledger & activity feed
- PIN-based sensitive operations
- Admin console with audit capabilities
- Premium UI design and responsive layout

All of this runs entirely on the frontend using LocalStorage as a mock database.

---

## 🧠 Why This Project Matters

Most frontend demos are superficial. GreenBank is different because it:

- Models real banking logic
- Uses ledger-first accounting
- Implements stateful systems thinking
- Simulates audit and compliance behavior
- Applies UI/UX hierarchy for finance apps
- Is designed to be backend-ready

This project demonstrates:
✔ System design  
✔ State management  
✔ Debugging complex flows  
✔ Architecture decisions  
✔ UI clarity & responsive UX  
✔ Product-level thinking

---

##  Features

### User Side

- Account creation & authentication  
- Persistent login sessions  
- Balance overview and transactions  
- Transfers between accounts  
- Activity feed with timestamps  
- PIN security for sensitive actions  

### Admin Side

- Credit and debit operations    
- Audit trail with admin metadata  
- Immutable log of system changes

---

## 🧩 Architecture Overview

GreenBank uses:

### LocalStorage tables



### Single source of truth

All UI and logic are derived from one authoritative state object.

### Ledger-based transactions

Balances are computed from event logs, not patched arbitrarily.

### Security patterns

Role separation, PIN steps, audit metadata, and session guards simulate backend logic.

---

## 📌 Design Philosophy

This project was built with real-world constraints in mind:

- Data-first UI
- Clear visual hierarchy
- Calm, trust-centered design
- Mobile responsiveness
- Predictable deterministic state

---

## 🛠 How to Run Locally

1. Clone the repo:

git clone https://github.com/Centpizzy-cloud/GreenBank-Simulator.git

2. Open `index.html` in your browser  

3. Explore the dashboard & admin console

---

##  Limitations & Next Phase

GreenBank currently uses LocalStorage as a mock database. The future roadmap includes:

- Backend API with PostgreSQL (Neon or Supabase)
- JWT-based authentication
- Persistent transactions
- Role-based security
- Real environment deployments

---

## 📈 What This Project Shows About My Skills

This project demonstrates:

- Architecture design from first principles
- Persistent state modeling without frameworks
- Simulation of backend system behavior
- Debugging real-world UI and logic problems
- UX principles for financial applications
- System-level thinking under constraints

---

## 📌 Live Demo

Try it now:  
https://melodious-sunshine-7cee2d.netlify.app/

---

## 💡 Feedback & Collaboration

I welcome questions, pull requests, and ideas.  
Let’s build more realistic engineering demos for learning and adoption.

