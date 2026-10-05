const SUPABASE_URL = "https://lkykanmvvqzmonqwvmxm.supabase.co";
const SUPABASE_KEY = "sb_publishable_9uSGrXFEWxU3tNUmwQcQ_g_VQp8xv-v";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

function openApplication() {
    document.getElementById("apply").scrollIntoView({
        behavior: "smooth"
    });
}

const form = document.getElementById("applicationForm");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const application = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        college: document.getElementById("college").value,
        course: document.getElementById("course").value
    };

    let response;
    try {
        response = await fetch("/api/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(application)
        });
    } catch (error) {
        console.error(error);
        alert("Application save nahi hui. Console me error dekho.");
        return;
    }

    if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        console.error(result.error || "Application submission failed.");
        alert("Application save nahi hui. Console me error dekho.");
        return;
    }

    alert("Application successfully saved in database! 🎉");

    form.reset();
});
const trackForm = document.getElementById("trackForm");
const statusResult = document.getElementById("statusResult");

trackForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("trackEmail").value.trim();

    let response;
    try {
        response = await fetch(
            `/api/applications/status?email=${encodeURIComponent(email)}`
        );
    } catch (error) {
        console.error(error);
        statusResult.textContent = "Application nahi mili.";
        return;
    }

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.application) {
        if (!response.ok) {
            console.error(result.error || "Application tracking failed.");
        }
        statusResult.textContent = "Application nahi mili.";
        return;
    }

    statusResult.textContent =
        "Hello " + result.application.name +
        "! Your application status is: " + result.application.status;
});
const loginForm = document.getElementById("loginForm");
const loginResult = document.getElementById("loginResult");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error(error);
        loginResult.innerHTML = "Login failed: " + error.message;
        return;
    }

    loginResult.innerHTML = "Login successful! 🎉";
});
const signupForm = document.getElementById("signupForm");
const signupResult = document.getElementById("signupResult");

signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        console.error(error);
        signupResult.innerHTML = "Signup failed: " + error.message;
        return;
    }

    signupResult.innerHTML =
        "Account created successfully! 🎉 Check your email if verification is required.";
    
    signupForm.reset();
});
const dashboard = document.getElementById("dashboard");
const logoutButton = document.getElementById("logoutButton");

// Check whether user is already logged in
async function checkUser() {
    const { data } = await supabaseClient.auth.getUser();

    if (data.user) {
        dashboard.style.display = "block";
    } else {
        dashboard.style.display = "none";
    }
}

checkUser();

// Logout
logoutButton.addEventListener("click", async function () {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error(error);
        return;
    }

    dashboard.style.display = "none";
    alert("Logged out successfully!");
});


// When login/signup state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session) {
        dashboard.style.display = "block";
    } else {
        dashboard.style.display = "none";
    }
});