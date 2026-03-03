

# Fix Contact Email Delivery and Instant Translation

## Issue 1: Contact Form Email Not Sending

**Root cause**: The `contact-notify` edge function is missing from `supabase/config.toml`. Without `verify_jwt = false`, the function rejects unauthenticated requests (contact form submissions from visitors) with a 401 error.

**Secondary cause (Resend)**: On Resend's free tier (sandbox mode), you can only send emails to the **same email address you used to sign up for Resend**. If `atroun.bd@gmail.com` is not that email, delivery will silently fail. To send to any recipient, you must verify a custom domain in Resend.

### Changes:
- **`supabase/config.toml`**: Add `contact-notify` and `manage-users` function configs with `verify_jwt = false`
- **`supabase/functions/contact-notify/index.ts`**: Add error logging for the Resend response body so failures are visible in logs
- Redeploy `contact-notify` and `manage-users` edge functions

---

## Issue 2: Make Translation Instant

**Root cause**: The current implementation polls for the Google Translate widget's hidden `<select>` element with 300ms retries (up to 10 attempts). This causes a noticeable delay. Also, on page navigations in a SPA, the widget may not re-translate new content automatically.

### Changes to `src/components/ui/language-translator.tsx`:
- Pre-load the Google Translate script in `index.html` so it's ready before React mounts (eliminates the biggest delay)
- Replace polling retry with a `MutationObserver` that fires immediately when the widget select appears
- After changing language, force Google Translate to re-process the page by triggering a DOM event
- For switching back to English, use Google's built-in restore function instead of page reload

### Changes to `index.html`:
- Add the Google Translate script tag directly so it loads in parallel with the app bundle

---

## Technical Details

### config.toml additions:
```toml
[functions.contact-notify]
verify_jwt = false

[functions.manage-users]
verify_jwt = false
```

### Translation approach:
The key improvement is moving from a "poll and retry" pattern to an "observe and act" pattern using MutationObserver, combined with pre-loading the translate script. This makes language switching feel instant because:
1. The Google Translate library is already loaded when the user clicks
2. The hidden select element is found immediately via observer (no 300ms delays)
3. The `change` event fires synchronously on the select element

