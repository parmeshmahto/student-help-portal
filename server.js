const path = require("node:path");
const express = require("express");

const PORT = Number(process.env.PORT) || 5000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
        "Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY before starting the server."
    );
}

const applicationsUrl =
    `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/applications`;
const supabaseHeaders = {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
};

const app = express();
app.use(express.json({ limit: "1mb" }));

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.get("/favicon.ico", (_request, response) => {
    response.status(204).end();
});

app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
});

app.post("/api/applications", async (request, response) => {
    const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";
    const email = typeof request.body?.email === "string" ? request.body.email.trim() : "";
    const college =
        typeof request.body?.college === "string" ? request.body.college.trim() : "";
    const course =
        typeof request.body?.course === "string" ? request.body.course.trim() : "";

    if (!name || !email || !college || !course || !isValidEmail(email)) {
        return response.status(400).json({
            error: "Please provide a name, valid email, college, and course."
        });
    }

    try {
        const result = await fetch(applicationsUrl, {
            method: "POST",
            headers: {
                ...supabaseHeaders,
                "Content-Type": "application/json",
                Prefer: "return=minimal"
            },
            body: JSON.stringify({ name, email, college, course })
        });

        if (!result.ok) {
            console.error(
                "Supabase application insert failed:",
                result.status,
                await result.text()
            );
            return response.status(502).json({
                error: "The application could not be saved. Check the Supabase table and access policies."
            });
        }

        return response.status(201).json({ success: true });
    } catch (error) {
        console.error("Application API failed:", error);
        return response.status(500).json({ error: "The application could not be saved." });
    }
});

app.get("/api/applications/status", async (request, response) => {
    const email =
        typeof request.query.email === "string" ? request.query.email.trim() : "";

    if (!isValidEmail(email)) {
        return response.status(400).json({ error: "Please provide a valid email address." });
    }

    try {
        const query = new URL(applicationsUrl);
        query.searchParams.set("select", "name,status");
        query.searchParams.set("email", `eq.${email}`);
        query.searchParams.set("order", "id.desc");
        query.searchParams.set("limit", "1");

        const result = await fetch(query, { headers: supabaseHeaders });
        if (!result.ok) {
            console.error(
                "Supabase application lookup failed:",
                result.status,
                await result.text()
            );
            return response.status(502).json({
                error: "Application status could not be loaded. Check the Supabase table and access policies."
            });
        }

        const applications = await result.json();
        return response.json({ application: applications[0] || null });
    } catch (error) {
        console.error("Application tracking API failed:", error);
        return response.status(500).json({ error: "Application status could not be loaded." });
    }
});

app.get("/", (_request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.get(["/index.html", "/style.css", "/script.js"], (request, response) => {
    response.sendFile(path.join(__dirname, request.path.slice(1)));
});

app.use((_request, response) => {
    response.status(404).json({ error: "Not found." });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Student Help Portal listening on port ${PORT}`);
});
