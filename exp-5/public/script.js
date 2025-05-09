function register(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const user = { username, email, password, isLoggedIn: false };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Registered successfully!");
    window.location.href = "/login";
  }
  
  function login(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
  
    const storedUser = JSON.parse(localStorage.getItem("user"));
  
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      storedUser.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(storedUser));
      window.location.href = "/profile";
    } else {
      document.getElementById("loginError").innerText = "Invalid login credentials.";
    }
  }
  