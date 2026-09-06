# PaperVault Frontend

A complete React/Vite frontend redesign for PaperVault, based on the supplied visual references and preserving the existing academic archive flows.

## Included

- React + Vite
- React Router
- Tailwind CSS
- Responsive desktop/mobile navigation
- Editorial/brutalist visual system
- Department → Course → Semester → Subject → Papers navigation
- Search by subject name/code
- Year filters
- PDF preview modal
- PDF download wiring ready for real storage URLs
- Admin login UI
- Admin upload workflow
- Recent upload queue
- Delete upload
- LocalStorage prototype persistence
- Netlify SPA redirect configuration
- Accessible focus states
- Reduced-motion support

## Run

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Demo admin

Create `.env` from `.env.example` and set:

```env
VITE_DEMO_ADMIN_PASSWORD=demo
```

This is intentionally temporary. It is not secure because Vite `VITE_*` variables are public in the browser.

## Production roadmap

1. Replace demo authentication with Supabase Auth.
2. Move subjects/papers to PostgreSQL.
3. Move PDFs to Supabase Storage.
4. Add Row Level Security.
5. Connect upload/delete actions to authenticated APIs.
6. Add real paper URLs and PDF previews.
7. Add analytics and request-missing-paper flow.
