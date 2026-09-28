# Gauss Quest

A free, static math practice website. It includes Gaussian elimination plus built-in multiple-choice exercise packs for data-science mathematics. New packs based on the supplied notes cover **Matrix Algebra & Linear Systems (MM151)** and **Functions, Domains & Graphs**. Answers and explanations appear after each submission.

There is no AI quiz generator, API key, account, or paid AI request. The practice questions are included in `practice-topics.js`. Longer runs reshuffle the selected pack and can repeat questions.

## Run on your computer

In PowerShell opened inside this folder, run:

```powershell
npm.cmd start
```

Then open `http://localhost:3000`. Keep the PowerShell window open while practicing. You can also open `index.html` directly in a browser.

## Publish with GitHub Pages

1. Upload these files to the top level of your GitHub repository: `index.html`, `style.css`, `alice-theme.css`, `app.js`, and `practice-topics.js`. Upload the latest `practice-topics.js` whenever you add or change exercises. The quiz includes simple topic-matched diagrams, including the generated Gaussian system's augmented matrix, vector sketches, function/domain drawings, and concept illustrations for the other subjects.
2. Commit the changes.
3. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select the branch containing the files (usually `main`) and select `/(root)`.
4. Save and wait for GitHub Pages to publish. Share the website link shown on the Pages settings screen.

The files `README.md`, `package.json`, and `server.mjs` may also be kept in the repository. GitHub Pages serves the static site files directly; the Node server is only for running the site locally.

## Add more exercises

Edit `practice-topics.js` to add or change built-in exercise questions. Each item contains a question, four answer choices, the correct answer, and a short explanation. Since quizzes are stored as code, adding questions means editing that file and uploading the updated version to GitHub.
