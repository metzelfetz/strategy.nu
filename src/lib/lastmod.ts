import { execFileSync } from 'node:child_process';

/**
 * Date (YYYY-MM-DD) of the last commit that touched the given paths, for the
 * sitemap. Needs the full history, so CI checks out with `fetch-depth: 0`.
 * Returns undefined outside a git checkout, and the sitemap then omits it.
 */
export function lastCommitDate(...pathspecs: string[]): string | undefined {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...pathspecs], { encoding: 'utf8' });
    return out.trim() || undefined;
  } catch {
    return undefined;
  }
}
