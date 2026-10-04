import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";
import type { Job } from "./types";
import { durationText } from "./format";

const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

export function analysisProgress(job: Job, t: Translate = englishT) {
  const {
    screened = 0,
    selected = 0,
    grouped_batches = 0,
    grouping_batches = 0,
    investigated = 0,
    candidates = 0,
  } = job.coverage ?? {};
  if (job.status === "queued") {
    return {
      step: -1,
      title: t("lens.common.progressQueuedTitle"),
      done: 0,
      total: 0,
      detail: t("lens.common.progressQueuedDetail"),
    };
  }
  if (job.stage === "Grouping observations") {
    return {
      step: 1,
      title: t("lens.common.progressFindingPatterns"),
      done: grouped_batches,
      total: grouping_batches,
      detail: grouping_batches
        ? t("lens.common.progressBatchesCompared", { done: grouped_batches, total: grouping_batches })
        : t("lens.common.progressComparingObservations", { screened }),
    };
  }
  if (job.stage === "Checking original evidence") {
    return {
      step: 2,
      title: t("lens.common.progressCheckingEvidence"),
      done: investigated,
      total: candidates,
      detail: candidates
        ? t("lens.common.progressPatternsCheckedOf", { done: investigated, total: candidates })
        : t("lens.common.progressPatternsChecked", { done: investigated }),
    };
  }
  if (!selected) {
    return {
      step: -1,
      title: t("lens.common.progressPreparingTitle"),
      done: 0,
      total: 0,
      detail: t("lens.common.progressPreparingDetail"),
    };
  }
  return {
    step: 0,
    title: t("lens.common.progressReviewingTitle"),
    done: screened,
    total: selected,
    detail: t("lens.common.progressRunsReviewed", { done: screened, total: selected }),
  };
}

export function analysisStages(job: Job): { done: number; total: number }[] {
  const {
    screened = 0,
    selected = 0,
    grouped_batches = 0,
    grouping_batches = 0,
    investigated = 0,
    candidates = 0,
  } = job.coverage ?? {};
  return [
    { done: screened, total: selected },
    { done: grouped_batches, total: grouping_batches },
    { done: investigated, total: candidates },
  ];
}

export interface ProgressSample {
  at: number;
  step: number;
  done: number;
  fraction: number;
}

const stageWeights = [0.6, 0.2, 0.2];

export function analysisFraction({
  step,
  done,
  total,
}: Pick<ReturnType<typeof analysisProgress>, "step" | "done" | "total">): number {
  if (step < 0) return 0;
  const before = stageWeights.slice(0, step).reduce((sum, weight) => sum + weight, 0);
  return before + stageWeights[step] * (total ? Math.min(1, done / total) : 0);
}

function windowStart(samples: readonly ProgressSample[], now: number): ProgressSample | undefined {
  return samples.findLast((sample) => now - sample.at >= 60000) ?? samples[0];
}

export function analysisPace(samples: readonly ProgressSample[], now: number) {
  const latest = samples.at(-1);
  if (!latest) return { perMinute: null, secondsLeft: null };
  const first = windowStart(
    samples.filter((sample) => sample.step === latest.step),
    now,
  );
  const anchor = windowStart(samples, now);
  if (!first || !anchor) return { perMinute: null, secondsLeft: null };
  const stepMinutes = (now - first.at) / 60000;
  const perMinute = stepMinutes >= 1 / 6 ? (latest.done - first.done) / stepMinutes : null;
  const spanSeconds = (now - anchor.at) / 1000;
  const gained = latest.fraction - anchor.fraction;
  const secondsLeft = spanSeconds >= 10 && gained > 0 ? ((1 - latest.fraction) * spanSeconds) / gained : null;
  return { perMinute, secondsLeft };
}

export function stageDurations(samples: readonly ProgressSample[], createdAt: string, now: number): (number | null)[] {
  const current = samples.at(-1)?.step ?? -1;
  const starts = [0, 1, 2].map((stage) => {
    if (stage === 0) return Date.parse(createdAt);
    const entered = samples.findIndex(
      (sample, index) => index > 0 && sample.step >= stage && samples[index - 1].step < stage,
    );
    return entered < 0 ? null : samples[entered].at;
  });
  return starts.map((start, stage) => {
    if (start === null || stage > current) return null;
    const end = stage === current ? now : starts[stage + 1];
    return end === null ? null : Math.max(0, Math.floor((end - start) / 1000));
  });
}

export function remainingLabel(seconds: number | null, t: Translate = englishT): string {
  if (seconds === null) return t("lens.common.estimating");
  if (seconds < 60) return t("lens.common.remainingUnderMinute");
  if (seconds < 3600) return t("lens.common.remainingMinutes", { minutes: Math.ceil(seconds / 60) });
  return t("lens.common.remainingHoursMinutes", {
    hours: Math.floor(seconds / 3600),
    minutes: Math.ceil((seconds % 3600) / 60),
  });
}

export function analysisElapsed(createdAt: string, now: number, t: Translate = englishT): string {
  return durationText(Math.max(0, Math.floor((now - Date.parse(createdAt)) / 1000)), t);
}
