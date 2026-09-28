# Gauss Quest

A responsive practice website with Gaussian elimination challenges and AI-created quizzes for user-chosen topics. It uses a small Node.js server to call the OpenAI API without putting the private API key in the browser.

## Run it on your computer

You need Node.js 20 or newer and an OpenAI API key with API billing enabled. ChatGPT subscriptions and API usage are separate; each generated quiz uses API credits.

1. Open PowerShell in this folder.
2. Set the API key for this terminal window (replace the example with your own key):

   ```powershell
   $env:OPENAI_API_KEY = "your-private-key"
   ```

3. Start the website:

   ```powershell
   npm start
   ```

4. Visit `http://localhost:3000` in your browser. Keep the terminal open while you use the site.

The Gaussian elimination quiz works without an API key. The AI topic quiz needs the key and an internet connection. Do not paste your key into `app.js`, `index.html`, or any file you upload to a public repository.

## Put it online for friends

GitHub Pages by itself cannot run the private AI server. Use a hosting service that can run a Node.js web service, then:

1. Upload this project to a private or public GitHub repository.
2. Create a Node.js web service from that repository on your chosen host.
3. Set the start command to `npm start` (or `node server.mjs`).
4. Add `OPENAI_API_KEY` in the host’s private environment-variable settings. Do not add the real key to the repository.
5. Deploy, open the public website link, try creating an AI quiz, and share the link with friends.

Check the host’s current plan and usage limits before choosing it. AI requests use your OpenAI API account and may incur charges. The included per-process limit slows accidental repeat requests; a public launch with many visitors should use a persistent rate limiter and a hosting provider usage cap.

## How to use AI quizzes

Choose a question count, type a topic (for example, “fractions for beginners” or “the solar system”), and press **Create AI Quiz**. The quiz maker generates four-choice questions with answers and explanations. The answer is shown after a player checks it. The current quiz is temporary and is generated again when you replay; this version does not publish a shared topic catalog or save quizzes between visits.

## Files

- `index.html`, `style.css`, and `app.js` make the website.
- `server.mjs` serves the site and safely calls the AI API from the server.
- `package.json` defines the start command; there are no third-party packages to install.
- `.env.example` shows the server settings. Keep your real key private.
