import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useBookQuery } from "@/features/books/api/books.queries";
import { useSaveBookProgressMutation } from "@/features/books/api/books.mutations";
import type { Option, Section } from "@/entities/book";
import { indexSections, isEndingSection, validateBookForGameplay } from "./game.logic";

import {
  clamp,
  getConsequenceDeltaHp,
  getConsequenceText,
  getSectionIndex,
  toIdString,
} from "./gamePage.helpers";

import {
  AlertCard,
  CardFrame,
  ChoicesList,
  FooterActions,
  PageFrame,
  PrimaryButton,
  StatusBar,
  ToastCard,
  TopBar,
} from "./GamePage.components";

type GameState = {
  sectionIdOverride: string | null;
  hp: number;
  isPaused: boolean;
  navError: string | null;
  saveError: string | null;
  toastChoice: string | null;
  toastSaved: boolean;
  visitedIds: Set<string>;
};

const initialGameState: GameState = {
  sectionIdOverride: null,
  hp: 10,
  isPaused: false,
  navError: null,
  saveError: null,
  toastChoice: null,
  toastSaved: false,
  visitedIds: new Set(),
};

export function GamePage() {
  const { bookPath } = useParams<{ bookPath: string }>();
  const { data: book, isLoading, error } = useBookQuery(bookPath);

  const saveProgressMutation = useSaveBookProgressMutation();

  const sectionsById = useMemo(() => (book ? indexSections(book) : new Map<string, Section>()), [book]);

  const validity = useMemo(() => {
    if (!book) return null;
    return validateBookForGameplay(book);
  }, [book]);

  const [state, setState] = useState<GameState>(() => initialGameState);
  const { sectionIdOverride, hp, isPaused, navError, saveError, toastChoice, toastSaved, visitedIds } = state;

  const isDead = hp <= 0;

  useEffect(() => {
    setState({
      sectionIdOverride: null,
      hp: 10,
      isPaused: false,
      navError: null,
      saveError: null,
      toastChoice: null,
      toastSaved: false,
      visitedIds: new Set(),
    });
  }, [bookPath]);

  const currentSectionId = validity?.ok ? sectionIdOverride ?? validity.startId : null;
  const section = currentSectionId ? sectionsById.get(currentSectionId) : undefined;

  const sectionIdStr = section ? toIdString((section as unknown as { id?: unknown }).id) : null;
  const isEnding = section ? isEndingSection(section) : false;

  const startId = validity?.ok ? validity.startId : null;

  useEffect(() => {
    if (!validity?.ok) return;
    setState((prev) => ({ ...prev, visitedIds: new Set([validity.startId]) }));
  }, [validity, startId]);

  useEffect(() => {
    if (!sectionIdStr) return;
    setState((prev) => {
      if (prev.visitedIds.has(sectionIdStr)) return prev;
      const next = new Set(prev.visitedIds);
      next.add(sectionIdStr);
      return { ...prev, visitedIds: next };
    });
  }, [sectionIdStr]);

  const sectionHeadingRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    if (!sectionIdStr) return;
    sectionHeadingRef.current?.focus();
  }, [sectionIdStr]);

  const sectionNumber = book && sectionIdStr ? getSectionIndex(book.sections, sectionIdStr) : null;

  const pageTitle = book?.title ?? bookPath ?? "Game";

  const reachableCount = validity?.ok ? validity.reachableIds.size : 0;
  const visitedCountRaw = visitedIds.size;
  const visitedCount = validity?.ok ? (isEnding || isDead ? reachableCount : visitedCountRaw) : 0;
  const showProgress = validity?.ok && reachableCount > 0;

  function handleRestart() {
    setState((prev) => ({
      ...prev,
      navError: null,
      saveError: null,
      toastChoice: null,
      toastSaved: false,
      hp: 10,
      isPaused: false,
      sectionIdOverride: null,
      visitedIds: validity?.ok ? new Set([validity.startId]) : new Set(),
    }));
  }

  function handleTogglePause() {
    if (isDead) return;
    if (isEnding) return;
    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }

  function showChoiceToast(message: string) {
    setState((prev) => ({ ...prev, toastChoice: message }));
    window.setTimeout(() => setState((prev) => ({ ...prev, toastChoice: null })), 2500);
  }

  function showSavedToast() {
    setState((prev) => ({ ...prev, toastSaved: true }));
    window.setTimeout(() => setState((prev) => ({ ...prev, toastSaved: false })), 2500);
  }

  function handleChoose(option: Option) {
    setState((prev) => ({ ...prev, navError: null, saveError: null }));

    if (isPaused) return;
    if (isDead) return;

    const nextIdRaw = (option as unknown as { gotoId?: unknown }).gotoId;
    const nextId = toIdString(nextIdRaw);

    if (!nextId) {
      setState((prev) => ({ ...prev, navError: "This option has no target section (gotoId)." }));
      return;
    }

    if (!sectionsById.has(nextId)) {
      setState((prev) => ({ ...prev, navError: `Invalid next section id: ${nextId}` }));
      return;
    }

    const consequenceText = getConsequenceText(option);
    showChoiceToast(consequenceText ? consequenceText : "Choice made.");

    const deltaHp = getConsequenceDeltaHp(option);
    const nextHp = clamp(0, hp + deltaHp, 10);

    if (deltaHp !== 0) setState((prev) => ({ ...prev, hp: nextHp }));
    if (nextHp <= 0) return;

    setState((prev) => ({ ...prev, sectionIdOverride: nextId }));
  }

  async function handleSaveProgress() {
    setState((prev) => ({ ...prev, saveError: null }));

    if (!bookPath) {
      setState((prev) => ({ ...prev, saveError: "Cannot save: missing book id." }));
      return;
    }

    if (!sectionIdStr) {
      setState((prev) => ({ ...prev, saveError: "Cannot save: current section id is missing." }));
      return;
    }

    const sectionNum = Number(sectionIdStr);
    if (!Number.isInteger(sectionNum)) {
      setState((prev) => ({
        ...prev,
        saveError: `Cannot save: section "${sectionIdStr}" is not a number (API expects integer section).`,
      }));
      return;
    }

    try {
      await saveProgressMutation.mutateAsync({ bookPath, sectionNumber: sectionNum });
      showSavedToast();
    } catch (e) {
      setState((prev) => ({ ...prev, saveError: e instanceof Error ? e.message : "Failed to save progress." }));
    }
  }

  if (isLoading) {
    return (
      <PageFrame>
        <AlertCard title="Loading" message="Loading book…" />
      </PageFrame>
    );
  }

  if (error) {
    return (
      <PageFrame>
        <AlertCard
          title="Failed to load book"
          message={error instanceof Error ? error.message : "Unknown error"}
        />
      </PageFrame>
    );
  }

  if (!book || !validity) {
    return (
      <PageFrame>
        <AlertCard title="No book data" message="Book response is empty." />
      </PageFrame>
    );
  }

  if (!validity.ok) {
    return (
      <PageFrame>
        <CardFrame>
          <TopBar title={pageTitle} />
          <div className="px-6 py-6">
            <AlertCard title="Invalid book structure" message={validity.reason} />
          </div>
        </CardFrame>
      </PageFrame>
    );
  }

  if (!section || !sectionIdStr) {
    return (
      <PageFrame>
        <CardFrame>
          <TopBar
            title={pageTitle}
            right={<PrimaryButton onClick={handleRestart}>Restart</PrimaryButton>}
          />
          <div className="px-6 py-6">
            <AlertCard title="Cannot render section" message="Current section id is missing or not found in the book." />
          </div>
        </CardFrame>
      </PageFrame>
    );
  }

  const options: Option[] = (section.options ?? []) as Option[];

  return (
    <PageFrame>
      <CardFrame>
        <TopBar
          title={pageTitle}
          right={
            <PrimaryButton onClick={handleSaveProgress} disabled={saveProgressMutation.isPending || isDead}>
              {saveProgressMutation.isPending ? "Saving…" : "💾 Save Progress"}
            </PrimaryButton>
          }
        />

        <div className="px-6 pt-6">
          {toastChoice ? <ToastCard title="Choice Made" message={toastChoice} /> : null}
          {toastSaved ? <ToastCard title="Progress Saved" message="Your adventure progress has been bookmarked." /> : null}
          {saveError ? <AlertCard title="Save error" message={saveError} /> : null}
          {navError ? <AlertCard title="Navigation error" message={navError} /> : null}
        </div>

        <main className="px-6 pb-8">
          <div className="rounded-3xl border border-[#efe6da] bg-[#fffaf2] px-6 py-8">
            <StatusBar
              sectionIdStr={sectionIdStr}
              hpText={`${clamp(0, hp, 10)}/10`}
              progressText={showProgress ? `${visitedCount}/${reachableCount}` : null}
              isPaused={isPaused}
              isEnding={isEnding}
              isDead={isDead}
              onTogglePause={handleTogglePause}
              onRestart={handleRestart}
            />

            <h2
              id="section-title"
              ref={sectionHeadingRef}
              tabIndex={-1}
              className="mt-6 text-center font-serif text-3xl font-semibold text-[#2b2620]"
            >
              {isDead ? "Game Over" : isEnding ? "The End" : sectionNumber ? `Section ${sectionNumber}` : "What do you choose?"}
            </h2>

            <div className="mx-auto mt-6 max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-[#2b2620]">
              {isDead ? "Your health reached zero. The adventure is over." : section.text ?? "No text provided for this section."}
            </div>

            {!isDead ? (
              !isEnding ? (
                <div className="mx-auto mt-8 max-w-3xl">
                  <div className="mb-4 font-serif text-lg font-semibold text-[#2b2620]">What do you choose?</div>

                  <ChoicesList
                    options={options}
                    sectionIdStr={sectionIdStr}
                    isPaused={isPaused}
                    onChoose={handleChoose}
                    getConsequenceText={getConsequenceText}
                  />
                </div>
              ) : (
                <FooterActions leftText="✨ Adventure completed" primaryText="Play again" onPrimary={handleRestart} />
              )
            ) : (
              <FooterActions leftText="Game Over" primaryText="Restart" onPrimary={handleRestart} />
            )}
          </div>
        </main>
      </CardFrame>
    </PageFrame>
  );
}
