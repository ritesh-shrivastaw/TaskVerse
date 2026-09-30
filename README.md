# Study Tools Workshop

A collection of ten guided classroom projects for building practical study tools, including a resume builder, notes generator, presentation generator, quiz maker, flashcards, and study planner.

Created by **Ritesh Kumar Srivastav**.

## Run the Ten-Task Website

Prerequisites: Node.js 20.6 or newer.

1. Create a `.env` file in the project root:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   # Optional settings
   GEMINI_MODEL=gemini-3.8-flash
   PORT=3000
   ```

2. Start the site:

   ```powershell
   npm run server
   ```

3. Open <http://localhost:3000>.

The ten-task frontend lives in `public/`. The Node server serves those files and proxies generation requests to Google Gemini. Keep the API key in `.env`; never put it in browser JavaScript or commit it to source control. Rotate a key if it has been exposed.

## Project Structure

- `public/`: the ten-task website, styles, favicon, and privacy policy.
- `public/js/tasks.js`: task descriptions, steps, and Gemini prompts.
- `public/js/app.js`: task navigation, project views, and demo rendering.
- `server.js`: static file server and server-side Gemini API proxy.
- `src/`: a separate React notes application.

The `npm run dev` and `npm run build` scripts currently run the separate React notes application. Use `npm run server` to run the ten-task website.

## Privacy and Deployment

The privacy policy is available at `/privacy.html`. Demo prompts are forwarded to Google Gemini. The page also describes Google Fonts requests and the server's temporary rate-limit counter. Review the policy against your final hosting setup and add a monitored privacy contact before publishing publicly.

A custom domain is not configured in this repository. To connect one, register or provide the domain, choose a hosting provider, set that provider's required DNS records, and enable HTTPS. The specific DNS records depend on the provider.
