import { Link } from "react-router-dom";
import type { Option } from "@/entities/book";

type AlertCardProps = {
  title: string;
  message: string;
};

export function AlertCard({ title, message }: AlertCardProps) {
  return (
    <div className="rounded-2xl border border-[#e7ded2] bg-white p-5" role="alert" aria-live="assertive">
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm opacity-80">{message}</div>
    </div>
  );
}

type ToastCardProps = {
  title: string;
  message: string;
};

export function ToastCard({ title, message }: ToastCardProps) {
  return (
    <div className="mb-4 rounded-2xl border border-[#e7ded2] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <div className="font-serif text-lg font-semibold">{title}</div>
      <div className="mt-1 text-sm opacity-80">{message}</div>
    </div>
  );
}

type PageFrameProps = {
  children: React.ReactNode;
};

export function PageFrame({ children }: PageFrameProps) {
  return (
    <div className="min-h-screen bg-[#fbf8f3]">
      <div className="mx-auto w-full max-w-4xl px-4 py-10">{children}</div>
    </div>
  );
}

type CardFrameProps = {
  children: React.ReactNode;
};

export function CardFrame({ children }: CardFrameProps) {
  return (
    <div className="rounded-3xl border border-[#e7ded2] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">{children}</div>
  );
}

type TopBarProps = {
  title: string;
  right?: React.ReactNode;
};

export function TopBar({ title, right }: TopBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#efe6da] px-6 py-4">
      <Link to="/" className="text-sm font-medium opacity-80 hover:opacity-100">
        ← Back to Library
      </Link>

      <div className="rounded-full border border-[#e7ded2] bg-[#f7efe5] px-3 py-1 text-sm font-semibold">📖 {title}</div>

      <div className="flex min-w-[140px] justify-end">{right ?? <div className="w-[140px]" />}</div>
    </div>
  );
}

type PrimaryButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export function PrimaryButton({ onClick, disabled, children }: PrimaryButtonProps) {
  return (
    <button
      className="rounded-xl border border-[#e7ded2] bg-white px-4 py-2 text-sm font-medium hover:bg-[#fbf8f3] disabled:opacity-50"
      onClick={onClick}
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

type StatusBarProps = {
  sectionIdStr: string;
  hpText: string;
  progressText: string | null;
  isPaused: boolean;
  isEnding: boolean;
  isDead: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
};

export function StatusBar({
  sectionIdStr,
  hpText,
  progressText,
  isPaused,
  isEnding,
  isDead,
  onTogglePause,
  onRestart,
}: StatusBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#e7ded2] bg-white px-3 py-1 text-xs opacity-90">
          📚 Section <span className="font-semibold">{sectionIdStr}</span>
        </span>

        {progressText ? (
          <span className="rounded-full border border-[#e7ded2] bg-white px-3 py-1 text-xs opacity-90">
            🕔 Progress <span className="font-semibold">{progressText}</span>
          </span>
        ) : null}

        <span className="rounded-full border border-[#e7ded2] bg-white px-3 py-1 text-xs opacity-90">
          HP <span className="font-semibold">{hpText}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        {!isEnding && !isDead ? (
          <button
            className="rounded-xl border border-[#e7ded2] bg-white px-3 py-2 text-sm font-medium hover:bg-[#fbf8f3]"
            onClick={onTogglePause}
            type="button"
          >
            {isPaused ? "✨ Resume" : "✨ Pause"}
          </button>
        ) : null}

        {isEnding || isDead ? (
          <button
            className="rounded-xl border border-[#e7ded2] bg-white px-3 py-2 text-sm font-medium hover:bg-[#fbf8f3]"
            onClick={onRestart}
            type="button"
          >
            Restart
          </button>
        ) : null}
      </div>
    </div>
  );
}

type ChoicesListProps = {
  options: Option[];
  sectionIdStr: string;
  isPaused: boolean;
  onChoose: (opt: Option) => void;
  getConsequenceText: (opt: Option) => string | null;
};

export function ChoicesList({ options, sectionIdStr, isPaused, onChoose, getConsequenceText }: ChoicesListProps) {
  if (options.length === 0) return <div className="text-sm opacity-70">No options available for this section.</div>;

  return (
    <ul className="grid gap-4" aria-label="Choices">
      {options.map((opt, idx) => {
        const consequenceText = getConsequenceText(opt);

        return (
          <li key={`${sectionIdStr}-${idx}`}>
            <button
              className="w-full rounded-2xl border border-[#e7ded2] bg-white px-5 py-4 text-left shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:bg-[#fbf8f3] disabled:opacity-50"
              onClick={() => onChoose(opt)}
              type="button"
              disabled={isPaused}
              aria-disabled={isPaused}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#2b2620] text-xs font-semibold text-white">
                  {idx + 1}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#2b2620]">{opt.description ?? "Continue"}</div>
                  {consequenceText ? <div className="mt-1 text-sm italic text-[#6b6259]">{consequenceText}</div> : null}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

type FooterActionsProps = {
  leftText: string;
  primaryText: string;
  onPrimary: () => void;
};

export function FooterActions({ leftText, primaryText, onPrimary }: FooterActionsProps) {
  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium" role="status" aria-live="polite">
          {leftText}
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-xl border border-[#e7ded2] bg-white px-3 py-2 text-sm font-medium hover:bg-[#fbf8f3]"
            onClick={onPrimary}
            type="button"
          >
            {primaryText}
          </button>

          <Link className="rounded-xl border border-[#e7ded2] bg-white px-3 py-2 text-sm font-medium hover:bg-[#fbf8f3]" to="/">
            ← Back to Library
          </Link>
        </div>
      </div>
    </div>
  );
}
