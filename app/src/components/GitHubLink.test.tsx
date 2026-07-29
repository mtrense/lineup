import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GitHubLink } from "./GitHubLink";
import { REPO_URL, repoDataDirUrl } from "@/lib/repo";

describe("GitHubLink", () => {
  it("links to the repository root by default", () => {
    render(<GitHubLink />);
    const link = screen.getByRole("link", { name: /github/i });
    expect(link).toHaveAttribute("href", REPO_URL);
  });

  it("links to a comparison's data directory when given one", () => {
    render(<GitHubLink href={repoDataDirUrl("databases")} />);
    const link = screen.getByRole("link", { name: /github/i });
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/mtrense/lineup/tree/main/data/databases"
    );
  });

  it("opens in a new tab without leaking the referrer", () => {
    render(<GitHubLink />);
    const link = screen.getByRole("link", { name: /github/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders subtly in muted grey and is excluded from print", () => {
    render(<GitHubLink />);
    const link = screen.getByRole("link", { name: /github/i });
    expect(link.className).toContain("text-muted-foreground");
    expect(link.className).toContain("no-print");
  });

  it("uses the given accessible label", () => {
    render(<GitHubLink label="View this comparison's data on GitHub" />);
    expect(
      screen.getByRole("link", { name: "View this comparison's data on GitHub" })
    ).toBeInTheDocument();
  });
});
