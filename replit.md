# Running the Student Help Portal

- Start the Preview with `PORT=5000 npm start`.
- The Express server serves the existing static frontend and its `/api` routes on port 5000.
- Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` as Replit environment variables. The publishable key is the same public key used by the existing browser-side Supabase Auth client; do not use a service-role key.
- `/api/applications` accepts application submissions. `/api/applications/status?email=...` returns the latest application status for an email address. `/api/health` checks that the server is running.
- Supabase must have an `applications` table with the existing `name`, `email`, `college`, `course`, `status`, and `id` fields, plus policies permitting the app's publishable-key role to insert and read application rows. The server uses that key and does not bypass Supabase Row Level Security.

The existing frontend and Supabase Auth login/signup flow are kept in place.
