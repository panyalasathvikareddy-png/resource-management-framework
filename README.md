# RMF: Resource Management Framework

RMF is a web application for tracking team members (resources) and allocating them to projects. Users submit resource profiles, managers review requests, and accepted resources are marked as allocated.

## Features

- **Resource Form:** Add a resource with name, skillset, primary skill, years of experience, designation, and an optional resume link.
- **Resource Table:** View all resources, select them, and send them to the request pool. Selected resources can also be offboarded.
- **Request Pool (managers only):** Review requested resources and accept or reject them. Accepted resources are marked as allocated.
- **Authentication:** Email/password or Google sign-in through Firebase Authentication.
- **Role-based access:** Each user has a role stored in Firestore (`user` or `manager`) that controls which pages they can open.

## Tech Stack

- [Angular](https://angular.dev/) 19 (standalone components, lazy-loaded routes, route guards)
- [Firebase](https://firebase.google.com/): Authentication, Cloud Firestore, and Hosting
- [Bootstrap](https://getbootstrap.com/) 5.3 (loaded from CDN)
- Angular SSR (`@angular/ssr`) with an Express server
- TypeScript, RxJS
- Karma and Jasmine for unit tests
- GitHub Actions for deployment

## Project Structure

```
src/app/
├── login/                  # Login page (email/password, Google, manager code)
├── resource-form/          # Add new resource profiles
├── resource-table/         # View and select resources
├── request-pool/           # Manager view of requested resources
├── navbar/                 # Shared navigation bar
├── auth.service.ts         # Login, logout, and role lookup
├── firestore.service.ts    # Firestore CRUD for the "resources" collection
├── auth.guard.ts           # Requires a signed-in user
├── user.guard.ts           # Requires role "user" or "manager"
├── manager.guard.ts        # Requires role "manager"
└── resource.model.ts       # Resource data model
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or 22 LTS (minimum 18.19 for Angular 19)
- npm (included with Node.js)
- A Firebase project with Authentication and Firestore enabled

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   Open `src/app/environments/environment.ts` and replace `firebaseConfig` with the values from your own Firebase project (Project settings → Your apps → Web app).

   Update `.firebaserc` with your project ID if you deploy to a different project.

4. **Start the development server**

   ```bash
   npm start
   ```

   Open http://localhost:4200/ in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the dev server with live reload |
| `npm run build` | Create a production build in `dist/rmf/` |
| `npm test` | Run unit tests with Karma (requires Chrome) |
| `npm run serve:ssr:RMF` | Serve the SSR build from `dist/` on port 4000 |

## Deployment

The app deploys to Firebase Hosting from `dist/rmf/browser`.

```bash
npm run build
firebase login
firebase deploy --only hosting
```

Pushes to `main` can also deploy automatically through the workflows in `.github/workflows/`. These need a `FIREBASE_SERVICE_ACCOUNT` secret in the repository settings.

After deploying, add your hosting domain under **Authentication → Settings → Authorized domains** in the Firebase console so Google sign-in works.

## Security Notes

- **Firestore rules:** Restrict reads and writes to signed-in users with the correct role. Rules are set in the Firebase console and are not included in this repository.
- **Manager access code:** The code in `environment.ts` is bundled into client-side JavaScript, so it is **not a real security measure**. Manager permissions should be enforced through the `role` field and Firestore rules.
- **Firebase config:** The web API key is public by design. Protect your data with security rules, not by hiding the key.

## Known Limitations

- Resume uploads are not active. Firebase Storage is configured but commented out in `app.config.ts`, so the resume field only stores a link.
- Some development dependencies report audit warnings. They don't affect the deployed app, but should be updated over time with `npm audit fix`.


