---
name: Node 20 and Supabase server clients
description: Supabase SDK initialization may need WebSocket support in a Node 20 backend even for REST-only routes.
---

On Node 20, initializing `@supabase/supabase-js` may throw because its Realtime client has no native WebSocket transport. This can happen even when the backend only needs PostgREST insert and select calls.

**Why:** A Node 20 Preview server failed before Express could listen, although the required database operations use HTTP only.

**How to apply:** For a Node 20 backend that only needs database REST operations, use PostgREST HTTP or configure a Node WebSocket transport before SDK initialization. Do not change the project runtime solely to work around this.
