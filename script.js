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

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const college = document.getElementById("college").value;
    const course = document.getElementById("course").value;

    const { error } = await supabaseClient
        .from("applications")
        .insert([
            {
                name: name,
                email: email,
                college: college,
                course: course
            }
        ]);

    if (error) {
        console.error(error);
        alert("Application save nahi hui. Console me error dekho.");
        return;
    }

    alert("Application successfully saved in database! 🎉");

    form.reset();
})
const trackForm = document.getElementById("trackForm");
const statusResult = document.getElementById("statusResult");

trackForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("trackEmail").value.trim();

    const { data, error } = await supabaseClient
        .from("applications")
        .select("name, status")
        .eq("email", email)
        .order("id", { ascending: false })
        .limit(1);

    if (error) {
        console.error(error);
        statusResult.innerHTML = "Application nahi mili.";
        return;
    }

    if (!data || data.length === 0) {
        statusResult.innerHTML = "Application nahi mili.";
        return;
    }

    statusResult.innerHTML =
        "Hello " + data[0].name +
        "! Your application status is: " + data[0].status;
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