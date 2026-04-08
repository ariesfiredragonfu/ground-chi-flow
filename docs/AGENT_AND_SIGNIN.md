# Health Coach Agent & Getting Signed In

Quick guide: use the in-app agent and get yourself signed in so you can use GroundChiFlow every day.

---

## How to open the app

1. **Open a terminal** and go to the GroundChiFlow folder:
   ```bash
   cd ~/GroundChiFlow
   ```
2. **Start the app:**
   ```bash
   npm start
   ```
3. **Then either:**
   - **Web (easiest):** In the terminal you’ll see something like “Metro waiting on exp://…” and a URL. Press **`w`** to open in your browser, or run `npm run web` in another terminal and open the URL it gives you (e.g. `http://localhost:8081`).
   - **Phone:** Install **Expo Go** from the App Store / Play Store, then scan the QR code that appears in the terminal with your phone’s camera (or Expo Go). The app will open on your phone.
   - **Simulator:** Press **`a`** for Android emulator or **`i`** for iOS simulator (macOS only), if you have them set up.

To stop the app, press **Ctrl+C** in the terminal.

---

## 1. Get signed in

### Option A: Create your own account (recommended)

1. Open the app: `cd ~/GroundChiFlow && npm start` (then scan QR with Expo Go or run `npm run web`).
2. On the login screen, tap **“Don’t have an account? Sign Up”**.
3. Enter your **email** and a **password** (at least 6 characters). Confirm password.
4. Tap **Create Account**. You’re in.

Use the same email and password next time to **Sign In**.

### Option B: Skip for now (guest)

If Firebase isn’t configured yet, the app may show **“Skip for now”** so you can use it as a guest. Data stays local only until you sign in and add Firebase (see README).

### Option C: Admin account (if you set it up)

See `docs/ADMIN_CREDENTIALS.md` for the admin email/password. Same flow: Sign In with that email and password.

### If sign-in says “not available”

- Make sure `.env` has all `EXPO_PUBLIC_FIREBASE_*` vars (copy from `.env.example`, get values from [Firebase Console](https://console.firebase.google.com) → Project Settings → Your apps).
- Restart the app after changing `.env` (`npm start` again).

### Website (GitHub Pages) — “Create Account” looks dead or only a spinner

1. **Deploy** a build that includes the auth UX fix (sign-up no longer replaces the whole page with the root loading spinner — you should stay on the form and see errors or the button spinner).
2. **Firebase Console** → Authentication → **Sign-in method** → **Email/Password** enabled.
3. Same place → **Settings** → **Authorized domains** → add **`howell-forge.com`**, **`www.howell-forge.com`**, and **`ariesfiredragonfu.github.io`** (GitHub Pages) if missing. Without the domain you’re loading from, Firebase returns `auth/unauthorized-domain` (shown in the red error box after the fix).
4. **CI secrets:** The static web export must receive all `EXPO_PUBLIC_FIREBASE_*` values at build time (see Hardware_Factory `docs/WHERE_TO_FIND_SECRETS.md`). If they’re missing, you’ll see “Sign-up is not available…”

---

## 2. In-app Health Coach agent

The **Coach** tab is your in-app expert for:

- **Natural health:** diet, nutrition, exercise, brain states, meditation, herbs, natural remedies.
- **App navigation:** “Where do I log blood work?”, “How do I track gut health?”, etc.

### How it works

- You type in the Coach tab; the app sends your message (and conversation history) to the **Grok bridge** (e.g. `https://bridge.howell-forge.com/ask`).
- The API key lives only on the server; the app never sees it.
- The agent uses a system prompt that makes it an expert in natural health and in guiding users around the app.

### Enable the agent

You only need to do this once:

1. **Open the GroundChiFlow folder** (e.g. `~/GroundChiFlow`).
2. **Find or create a file named exactly `.env`** (it may be hidden; “Show hidden files” in your file manager or use your editor’s “Open file” and type `.env`).
3. **Add this one line** (or add it if you already have other lines in `.env`):
   ```
   EXPO_PUBLIC_GROK_BRIDGE_URL=https://bridge.howell-forge.com
   ```
   Use your real Grok bridge URL if it’s different (e.g. your tunnel hostname).
4. **Save the file.** Restart the app (`npm start` again). Open the **Coach** tab and ask something (e.g. “How do I log my blood work?”).

You’re not pasting a file anywhere — you’re just putting that one line inside the `.env` file so the app knows where to send Coach messages. If you don’t have a `.env` yet, create a new file, name it `.env`, put that line in it, and save it in the GroundChiFlow folder.

### If the Coach says “not configured”

- Add `EXPO_PUBLIC_GROK_BRIDGE_URL` to `.env` as above.
- Ensure the Grok bridge is running and reachable (tunnel up, `XAI_API_KEY` set on the server).

---

## 3. Files added for the agent

| File | Purpose |
|------|--------|
| `constants/AgentPrompt.ts` | System prompt: natural health expert + app navigation. |
| `lib/grokBridge.ts` | Client: sends messages to Grok bridge, no key in the app. |
| `app/(tabs)/agent.tsx` | Coach tab: chat UI, send/receive, loading and errors. |
| `app/(tabs)/_layout.tsx` | New “Coach” tab with chat icon. |

You can edit `AgentPrompt.ts` to change the agent’s tone or add more expertise areas.

---

*Built so the app can be a real asset for staying healthy — and so you can use it yourself every day.*

---

## 4. Paste lab results (Blood Work)

On the **Blood Work** tab there’s a **“Paste lab results”** button. Paste or type text from a lab report or email (e.g. “Glucose 92, Vitamin D 45, B12 520”); the Coach extracts the values and fills the biomarker fields for you. Uses the same Grok bridge; requires `EXPO_PUBLIC_GROK_BRIDGE_URL` in `.env`.
