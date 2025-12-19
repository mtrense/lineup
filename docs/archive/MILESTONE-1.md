# Tasks - Milestone 1: Project Foundation

## 1. Initialize pnpm project
- [x] Create `app/` directory
- [x] Run `pnpm init` in `app/`
- [x] Configure `package.json` with project metadata

## 2. Set up Vite with React and TypeScript
- [x] Install Vite, React, React DOM, and TypeScript dependencies
- [x] Create `vite.config.ts` with React plugin
- [x] Create `tsconfig.json` and `tsconfig.node.json`
- [x] Create entry point `index.html`
- [x] Create `src/main.tsx` and `src/App.tsx`
- [x] Verify dev server runs (`pnpm dev`)

## 3. Configure Tailwind CSS
- [x] Install Tailwind CSS v4 with Vite plugin
- [x] Add Tailwind directives to `src/index.css`
- [x] Import CSS in `main.tsx`
- [x] Verify Tailwind classes work in App component

## 4. Install and configure shadcn/ui
- [x] Run `shadcn init` with appropriate options
- [x] Configure `components.json` for project structure
- [x] Install base components (Button, Card) to verify setup
- [x] Verify components render correctly

## 5. Set up project structure
- [x] Create directory structure:
  ```
  app/src/
  ├── components/
  │   └── ui/          # shadcn components
  ├── lib/             # Utilities
  └── types/           # TypeScript types
  ```
- [x] Organize files into proper locations

## 6. Configure development tooling
- [x] Add ESLint with TypeScript and React rules
- [x] Add Prettier for code formatting
- [x] Add npm scripts: `dev`, `build`, `preview`, `lint`, `format`
- [x] Verify `pnpm build` produces working production build

## 7. Create placeholder app shell
- [x] Create basic App component with header/main layout
- [x] Add placeholder text indicating the app is working
- [x] Style with Tailwind to confirm integration
- [x] Include shadcn components (Button, Card) to confirm setup

## 8. Final verification and commit
- [x] Dev server starts without errors
- [x] Build completes without errors
- [x] Tailwind styles apply correctly
- [x] shadcn components render correctly
- [x] TypeScript compilation passes
- [x] Commit with message: "feat: initialize React app with Vite, Tailwind, and shadcn"
