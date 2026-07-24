/**
 * LandingSections — four static explanatory sections rendered below the
 * grouped comparison grid on the landing page.
 *
 * Sections:
 *   1. What is Lineup?
 *   2. How it's built
 *   3. Where the data comes from
 *   4. How to do your own comparisons
 *   5. How to contribute
 *
 * Purely presentational — no props, no comparison data dependency.
 * Uses semantic <section> + heading elements so the heading hierarchy
 * continues cleanly from the grid's <h2> group headings.
 */

const REPO_URL = "https://github.com/mtrense/lineup";

export function LandingSections() {
  return (
    <div className="mt-24 space-y-16 border-t pt-16">
      {/* 1 — What is Lineup? */}
      <section aria-labelledby="section-what">
        <h2
          id="section-what"
          className="mb-4 text-2xl font-semibold"
        >
          What is Lineup?
        </h2>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Lineup is an open-source comparison tool that lets you evaluate
          options side-by-side across a rich set of shared attributes. Whether
          you&apos;re choosing a database engine, a frontend framework, or a
          hardware board, Lineup surfaces the details that matter in a
          structured, scannable format.
        </p>
      </section>

      {/* 2 — How it's built */}
      <section aria-labelledby="section-built">
        <h2
          id="section-built"
          className="mb-4 text-2xl font-semibold"
        >
          How it&apos;s built
        </h2>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Lineup is a static React application powered by Vite. All comparison
          data lives in plain JSON files under the <code>data/</code> directory
          and is compiled into the bundle at build time — no backend, no API,
          no runtime database queries. The result is a fast, fully cacheable,
          zero-infrastructure site that can be deployed anywhere static files
          are served.
        </p>
      </section>

      {/* 3 — Where the data comes from */}
      <section aria-labelledby="section-data">
        <h2
          id="section-data"
          className="mb-4 text-2xl font-semibold"
        >
          Where the data comes from
        </h2>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Each comparison type ships with a <code>RESEARCH.md</code> guide that
          defines scope, attributes, and preferred sources. Candidate data files
          are researched against those guidelines using a combination of primary
          sources (official documentation, GitHub repositories) and an
          AI-assisted research workflow — the <em>gather-data</em> skill drives
          web searches, verifies claims, and records values together with source
          URLs so every data point is traceable.
        </p>
      </section>

      {/* 4 — How to do your own comparisons */}
      <section aria-labelledby="section-diy">
        <h2
          id="section-diy"
          className="mb-4 text-2xl font-semibold"
        >
          How to do your own comparisons
        </h2>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Lineup ships with a set of packaged Claude Code skills that walk you
          through building a comparison end-to-end — no need to hand-write JSON.
          A typical run looks like this:
        </p>
        <ol className="mt-4 max-w-2xl list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
          <li>
            <code>/new-type</code> — scope a new comparison through a short
            Socratic dialog and draft its <code>RESEARCH.md</code> guide
            (attributes, scope, and preferred sources).
          </li>
          <li>
            <code>/scaffold-type</code> — turn that guide into the schema files
            (<code>attributes.json</code>), register the type in{" "}
            <code>data/index.json</code>, and create a stub for each candidate.
          </li>
          <li>
            <code>/gather-data</code> — research each candidate against the
            guide, populating attribute values with cited sources. Reach for{" "}
            <code>/gather-data-cycle</code> to research the whole roster in
            parallel batches. Use <code>/add-candidate</code> or{" "}
            <code>/discover-candidates</code> to grow the roster,{" "}
            <code>/extend-comparison</code> to add new attributes to an existing
            type, and <code>/generate-tile</code> for a landing-page graphic.
          </li>
        </ol>
        <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
          To preview your work, run the app locally with{" "}
          <code>pnpm --dir app dev</code> from the repository root and open the
          printed URL. The comparison data is compiled in at build time, so your
          new type shows up as soon as the dev server reloads.
        </p>
      </section>

      {/* 5 — How to contribute */}
      <section aria-labelledby="section-contribute">
        <h2
          id="section-contribute"
          className="mb-4 text-2xl font-semibold"
        >
          How to contribute
        </h2>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Contributions are welcome — new comparison types, additional
          candidates, data corrections, and UI improvements all help. The
          AI-assisted workflow lowers the barrier: add a <code>RESEARCH.md</code>{" "}
          for a new type, then run the <em>gather-data</em> skill to populate
          candidate files automatically. Visit the repository on{" "}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            GitHub
          </a>{" "}
          to open an issue or pull request.
        </p>
      </section>
    </div>
  );
}
