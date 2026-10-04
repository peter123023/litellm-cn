import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";
import type { Finding, IssueBrief } from "./types";

const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

export function sortedFindings(findings: Finding[]): Finding[] {
  const rank = { high: 0, medium: 1, low: 2 };
  return [...findings].sort(
    (a, b) =>
      rank[a.priority ?? "medium"] - rank[b.priority ?? "medium"] || Date.parse(b.last_seen) - Date.parse(a.last_seen),
  );
}

export interface EvidenceTarget {
  readonly source: string;
  readonly team: string;
  readonly id: string;
  readonly traceRef?: string;
}

export function evidenceTarget(id: string): EvidenceTarget | null {
  try {
    const parsed: unknown = JSON.parse(atob(id.replace(/-/g, "+").replace(/_/g, "/")));
    if (!Array.isArray(parsed) || ![3, 4].includes(parsed.length) || !parsed.every((item) => typeof item === "string"))
      return null;
    return { source: parsed[0], team: parsed[1], id: parsed[2], ...(parsed[3] ? { traceRef: parsed[3] } : {}) };
  } catch {
    return null;
  }
}

export function briefMarkdown(title: string, brief: IssueBrief, t: Translate = englishT): string {
  return [
    `# ${title}`,
    `## ${t("lens.investigations.briefHeadingProblem")}\n${brief.problem}`,
    `## ${t("lens.investigations.briefHeadingUserGoal")}\n${brief.user_goal}`,
    `## ${t("lens.investigations.briefHeadingWhatHappened")}\n${brief.what_happened}`,
    `## ${t("lens.investigations.briefHeadingTestCases")}\n${brief.test_cases
      .map((testCase, index) =>
        t("lens.investigations.briefCase", {
          index: index + 1,
          input: testCase.input,
          expected: testCase.expected,
        }),
      )
      .join("\n")}`,
  ].join("\n\n");
}

export function mergeFeedback(findings: Finding[], current: Finding[]): Finding[] {
  return findings.map((finding) => {
    const feedback = current.find((item) => item.id === finding.id);
    return feedback ? { ...finding, status: feedback.status, reason: feedback.reason } : finding;
  });
}
