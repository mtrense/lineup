# Tasks - Milestone 1: Project Foundation

## 1. Initialize pnpm project
- [ ] Create `app/` directory
- [ ] Run `pnpm init` in `app/`
- [ ] Configure `package.json` with project metadata

## 2. Set up Vite with React and TypeScript
- [ ] Install Vite, React, React DOM, and TypeScript dependencies
- [ ] Create `vite.config.ts` with React plugin
- [ ] Create `tsconfig.json` and `tsconfig.node.json`
- [ ] Create entry point `index.html`
- [ ] Create `src/main.tsx` and `src/App.tsx`
- [ ] Verify dev server runs (`pnpm dev`)

## 3. Configure Tailwind CSS
- [ ] Install Tailwind CSS, PostCSS, and Autoprefixer
- [ ] Create `tailwind.config.js` with content paths
- [ ] Create `postcss.config.js`
- [ ] Add Tailwind directives to `src/index.css`
- [ ] Import CSS in `main.tsx`
- [ ] Verify Tailwind classes work in App component

## 4. Install and configure shadcn/ui
- [ ] Install shadcn/ui CLI
- [ ] Run `shadcn init` with appropriate options
- [ ] Configure `components.json` for project structure
- [ ] Install a few base components (Button, Card) to verify setup
- [ ] Verify components render correctly

## 5. Set up project structure
- [ ] Create directory structure:
  ```
  app/src/
  ├── components/
  │   └── ui/          # shadcn components
  ├── lib/             # Utilities
  ├── types/           # TypeScript types
  └── styles/          # Global styles
  ```
- [ ] Move/organize files into proper locations
- [ ] Update import paths as needed

## 6. Configure development tooling
- [ ] Add ESLint with TypeScript and React rules
- [ ] Add Prettier for code formatting
- [ ] Add npm scripts: `dev`, `build`, `preview`, `lint`, `format`
- [ ] Verify `pnpm build` produces working production build

## 7. Create placeholder app shell
- [ ] Create basic App component with header/main layout
- [ ] Add placeholder text indicating the app is working
- [ ] Style with Tailwind to confirm integration
- [ ] Include at least one shadcn component to confirm setup

## 8. Final verification and commit
- [ ] Dev server starts without errors
- [ ] Build completes without errors
- [ ] Tailwind styles apply correctly
- [ ] shadcn components render correctly
- [ ] TypeScript compilation passes
- [ ] Commit with message: "feat: initialize React app with Vite, Tailwind, and shadcn"
