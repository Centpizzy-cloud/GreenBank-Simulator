if (!document.querySelector(".dashboard")) {
    console.log("Shortcuts disabled on this page");
  } else {
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT") return;
  
      switch (e.key.toLowerCase()) {
        case "r":
          location.reload();
          break;
        case "l":
          localStorage.removeItem("greenbank_current_user");
          window.location.href = "login.html";
          break;
      }
    });
  }
  