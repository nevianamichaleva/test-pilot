"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import { PhraseDualVisual } from "@/components/games/PhraseVisuals";
import {
  PHRASE_CARDS,
  PHRASE_MODES,
  PHRASE_QUIZ,
  PHRASE_ROUNDS,
  phraseById,
  phraseQuestionNumber,
  taskTotalForPhraseMode,
} from "@/data/bel-phraseologisms";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./PhraseologismCards.module.css";

function shuffleArray(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * @param {{ exitHref?: string, game?: object | null }} props
 */
export default function PhraseologismCards({ exitHref = "/igri", game = null }) {
  const [phase, setPhase] = useState("intro");
  const [participantName, setParticipantName] = useState("");
  const [mode, setMode] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);

  const [flashIndex, setFlashIndex] = useState(0);
  const [flashFlipped, setFlashFlipped] = useState(false);
  const [flashSeen, setFlashSeen] = useState([]);

  const [roundIndex, setRoundIndex] = useState(0);
  const [meaningOrder, setMeaningOrder] = useState([]);
  const [matched, setMatched] = useState([]);
  const [selectedPhrase, setSelectedPhrase] = useState(null);
  const [dragPhrase, setDragPhrase] = useState(null);
  const [dragOverMeaning, setDragOverMeaning] = useState(null);
  const [matchFeedback, setMatchFeedback] = useState(null);
  const [matchAttempts, setMatchAttempts] = useState({});

  const [quizOrder, setQuizOrder] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizPick, setQuizPick] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState("");

  const finished = phase === "won";
  const taskTotal = mode ? taskTotalForPhraseMode(mode) : 0;
  const round = PHRASE_ROUNDS[roundIndex];

  const roundCards = useMemo(
    () => (round ? round.ids.map((id) => phraseById(id)).filter(Boolean) : []),
    [round]
  );

  const currentFlash = PHRASE_CARDS[flashIndex];
  const currentQuiz = quizOrder[quizIndex] ? PHRASE_QUIZ.find((q) => q.id === quizOrder[quizIndex]) : null;

  useSaveGameResultOnEnd(finished && Boolean(game?.slug), () => ({
    game,
    name: participantName,
    questionResults,
    correct: questionResults.filter((q) => q.isCorrect).length,
    total: questionResults.length || taskTotal,
    completed: true,
    won: true,
  }));

  const recordResult = (questionNumber, questionText, firstAnswer, correctAnswer, isCorrect) => {
    setQuestionResults((prev) => {
      if (prev.some((item) => item.questionNumber === questionNumber)) return prev;
      return [
        ...prev,
        {
          questionNumber,
          questionText,
          firstAnswer,
          correctAnswer,
          isCorrect,
          status: isCorrect ? "correct" : "wrong",
        },
      ];
    });
  };

  const startMatchRound = (idx) => {
    const r = PHRASE_ROUNDS[idx];
    setRoundIndex(idx);
    setMeaningOrder(shuffleArray(r.ids));
    setMatched([]);
    setSelectedPhrase(null);
    setDragPhrase(null);
    setMatchFeedback(null);
    setPhase("play");
  };

  const startMode = (nextMode) => {
    setMode(nextMode);
    setQuestionResults([]);
    setPhase("play");

    if (nextMode === "flash") {
      setFlashIndex(0);
      setFlashFlipped(false);
      setFlashSeen([]);
    } else if (nextMode === "match") {
      setMatchAttempts({});
      startMatchRound(0);
      return;
    } else if (nextMode === "quiz") {
      setQuizOrder(shuffleArray(PHRASE_QUIZ.map((q) => q.id)));
      setQuizIndex(0);
      setQuizPick(null);
      setQuizChecked(false);
      setQuizFeedback("");
    }
  };

  const finishGame = () => setPhase("won");

  const recordMatchPair = (phraseId, ok) => {
    const card = phraseById(phraseId);
    if (!card) return;
    recordResult(
      phraseQuestionNumber(roundIndex, phraseId),
      card.phrase,
      ok ? card.meaning : "грешна двойка",
      card.meaning,
      ok
    );
  };

  const tryMatch = (phraseId, meaningId) => {
    if (!phraseId || matched.includes(phraseId) || matched.includes(meaningId)) return;
    const card = phraseById(phraseId);
    if (!card) return;

    const isFirst = matchAttempts[phraseId] == null;
    if (isFirst) setMatchAttempts((p) => ({ ...p, [phraseId]: meaningId }));

    if (phraseId === meaningId) {
      const ok = isFirst || matchAttempts[phraseId] === meaningId;
      recordMatchPair(phraseId, ok);
      setMatched((m) => [...m, phraseId]);
      setMatchFeedback({ kind: "ok", text: card.example, id: phraseId });
      setSelectedPhrase(null);
      setDragPhrase(null);

      if (matched.length + 1 >= round.ids.length) {
        if (roundIndex + 1 >= PHRASE_ROUNDS.length) finishGame();
        else startMatchRound(roundIndex + 1);
      }
    } else {
      setMatchFeedback({
        kind: "hint",
        text: card.hint,
      });
      setSelectedPhrase(null);
      setDragPhrase(null);
    }
  };

  const onPhraseDragStart = (e, id) => {
    e.dataTransfer.setData("text/phrase-id", id);
    e.dataTransfer.effectAllowed = "move";
    setDragPhrase(id);
    setSelectedPhrase(id);
  };

  const onMeaningDrop = (e, meaningId) => {
    e.preventDefault();
    setDragOverMeaning(null);
    const phraseId = e.dataTransfer.getData("text/phrase-id") || dragPhrase || selectedPhrase;
    if (phraseId) tryMatch(phraseId, meaningId);
  };

  const markFlashSeen = () => {
    if (!currentFlash || flashSeen.includes(currentFlash.id)) return;
    setFlashSeen((s) => [...s, currentFlash.id]);
    recordResult(
      flashIndex + 1,
      currentFlash.phrase,
      "прегледана",
      currentFlash.meaning,
      true
    );
  };

  const goFlashNext = () => {
    if (flashIndex + 1 >= PHRASE_CARDS.length) {
      finishGame();
      return;
    }
    setFlashIndex((i) => i + 1);
    setFlashFlipped(false);
  };

  const goFlashPrev = () => {
    if (flashIndex <= 0) return;
    setFlashIndex((i) => i - 1);
    setFlashFlipped(false);
  };

  const toggleFlash = () => {
    const next = !flashFlipped;
    setFlashFlipped(next);
    if (next) markFlashSeen();
  };

  const checkQuiz = () => {
    if (!currentQuiz || !quizPick) return;
    const chosen = currentQuiz.options.find((o) => o.id === quizPick);
    const correct = currentQuiz.options.find((o) => o.correct);
    const ok = Boolean(chosen?.correct);
    setQuizChecked(true);
    setQuizFeedback(ok ? "Вярно." : `Не точно. ${correct?.text ?? ""}`);
    recordResult(
      quizIndex + 1,
      currentQuiz.sentence,
      chosen?.text ?? "",
      correct?.text ?? "",
      ok
    );
  };

  const goQuizNext = () => {
    if (quizIndex + 1 >= quizOrder.length) {
      finishGame();
      return;
    }
    setQuizIndex((i) => i + 1);
    setQuizPick(null);
    setQuizChecked(false);
    setQuizFeedback("");
  };

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>Български език</p>
          <h2 className={styles.introTitle}>Фразеологични карти</h2>
          <p className={styles.introSub}>
            Три спокойни режима — без таймер, без мигащи ефекти. Флаш картите имат цветни
            детски илюстрации с две картинки — като в приказка.
          </p>
          <div className={styles.modeGrid}>
            {PHRASE_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={[styles.modeCard, mode === m.id ? styles.modeCardActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setMode(m.id)}
              >
                <span className={styles.modeTitle}>{m.title}</span>
                <span className={styles.modeDesc}>{m.desc}</span>
              </button>
            ))}
          </div>
          <p className={styles.credit}>
            По „Златното българско слово: Фразеологични карти“, Силвия Анова
          </p>
          <GameNameGate
            inputId="phrase-cards-name"
            buttonLabel="Започни"
            onStart={(name) => {
              if (!mode) return;
              setParticipantName(name);
              startMode(mode);
            }}
          />
        </div>
      </div>
    );
  }

  if (phase === "won") {
    const correctCount = questionResults.filter((q) => q.isCorrect).length;
    const modeLabel = PHRASE_MODES.find((m) => m.id === mode)?.title ?? "";
    return (
      <div className={styles.shell}>
        <div className={styles.result}>
          <h2 className={styles.resultOk}>Готово!</h2>
          {participantName ? (
            <p className={styles.resultMsg}>
              Участник: <strong>{participantName}</strong>
            </p>
          ) : null}
          <p className={styles.resultMsg}>
            {mode === "flash"
              ? `Прегледа всички ${PHRASE_CARDS.length} фразеологизма.`
              : buildGamePointsLabel(correctCount, questionResults.length || taskTotal)}
            {modeLabel ? ` · ${modeLabel}` : ""}
          </p>
          <GameResultSummary items={questionResults} />
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => {
                setPhase("intro");
                setMode(null);
              }}
            >
              Избери режим отново
            </button>
            <Link href={exitHref} className={styles.menuBtn}>
              Към игрите
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "flash" && currentFlash) {
    return (
      <div className={styles.shell}>
        <header className={styles.topBar}>
          <Link href={exitHref} className={styles.backLink}>
            ← Към игрите
          </Link>
          <div className={styles.progress}>
            Карта {flashIndex + 1} / {PHRASE_CARDS.length}
          </div>
        </header>

        <p className={styles.prompt}>Флаш карти — докосни, за да обърнеш</p>

        <button
          type="button"
          className={[styles.flashCard, flashFlipped ? styles.flashFlipped : "", currentFlash.flashIllustration ? styles.flashCardIllustrated : ""].filter(Boolean).join(" ")}
          onClick={toggleFlash}
          aria-pressed={flashFlipped}
        >
          <div className={styles.flashInner}>
            <div className={styles.flashFront}>
              {currentFlash.flashIllustration ? (
                <div className={styles.flashFrontArt}>
                  <img
                    src={currentFlash.flashIllustration}
                    alt=""
                    className={styles.flashIllustrationMuted}
                  />
                  <div className={styles.flashFrontOverlay}>
                    <p className={styles.flashPhrase}>{currentFlash.phrase}</p>
                    <p className={styles.flashHint}>Докосни за обяснение</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className={styles.flashPhrase}>{currentFlash.phrase}</p>
                  <p className={styles.flashHint}>Докосни за обяснение</p>
                </>
              )}
            </div>
            <div className={styles.flashBack}>
              {currentFlash.flashIllustration ? (
                <img
                  src={currentFlash.flashIllustration}
                  alt=""
                  className={styles.flashIllustration}
                />
              ) : (
                <PhraseDualVisual
                  id={currentFlash.id}
                  literalCaption={currentFlash.literalCaption}
                  figurativeCaption={currentFlash.figurativeCaption}
                  compact
                />
              )}
              <p className={styles.flashMeaning}>{currentFlash.meaning}</p>
              <p className={styles.flashExample}>
                <span className={styles.exampleLabel}>Пример:</span> {currentFlash.example}
              </p>
            </div>
          </div>
        </button>

        <div className={styles.navRow}>
          <button type="button" className={styles.navBtn} onClick={goFlashPrev} disabled={flashIndex <= 0}>
            ← Назад
          </button>
          <button type="button" className={styles.navBtnPrimary} onClick={goFlashNext}>
            {flashIndex + 1 >= PHRASE_CARDS.length ? "Край" : "Напред →"}
          </button>
        </div>
      </div>
    );
  }

  if (mode === "match" && round) {
    return (
      <div className={styles.shell}>
        <header className={styles.topBar}>
          <Link href={exitHref} className={styles.backLink}>
            ← Към игрите
          </Link>
          <div className={styles.progress}>
            Кръг {roundIndex + 1} / {PHRASE_ROUNDS.length} · {matched.length}/{round.ids.length}
          </div>
        </header>

        <p className={styles.prompt}>Свържи фразеологизма със значението</p>

        {matchFeedback ? (
          <div
            className={matchFeedback.kind === "ok" ? styles.feedbackOk : styles.feedbackHint}
            role="status"
          >
            {matchFeedback.kind === "ok" ? (
              <>
                <PhraseDualVisual
                  id={matchFeedback.id}
                  literalCaption={phraseById(matchFeedback.id)?.literalCaption}
                  figurativeCaption={phraseById(matchFeedback.id)?.figurativeCaption}
                  compact
                />
                <p className={styles.feedbackText}>
                  <span className={styles.exampleLabel}>Пример:</span> {matchFeedback.text}
                </p>
              </>
            ) : (
              matchFeedback.text
            )}
          </div>
        ) : (
          <div className={styles.feedbackSpacer} />
        )}

        <div className={styles.board}>
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Фразеологизъм</h3>
            {roundCards.map((card) => {
              if (matched.includes(card.id)) return null;
              const selected = selectedPhrase === card.id;
              return (
                <div
                  key={card.id}
                  draggable
                  role="button"
                  tabIndex={0}
                  className={[
                    styles.phraseCard,
                    selected ? styles.cardSelected : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setSelectedPhrase((cur) => (cur === card.id ? null : card.id))}
                  onDragStart={(e) => onPhraseDragStart(e, card.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedPhrase((cur) => (cur === card.id ? null : card.id));
                    }
                  }}
                >
                  <span className={styles.phraseText}>{card.phrase}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Значение</h3>
            {meaningOrder.map((id) => {
              if (matched.includes(id)) return null;
              const card = phraseById(id);
              if (!card) return null;
              const hover = dragOverMeaning === id;
              return (
                <div
                  key={`m-${id}`}
                  role="button"
                  tabIndex={0}
                  className={[
                    styles.meaningCard,
                    selectedPhrase || dragPhrase ? styles.meaningReady : "",
                    hover ? styles.meaningHover : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    const phraseId = selectedPhrase || dragPhrase;
                    if (phraseId) tryMatch(phraseId, id);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setDragOverMeaning(id);
                  }}
                  onDragLeave={() => setDragOverMeaning(null)}
                  onDrop={(e) => onMeaningDrop(e, id)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && (selectedPhrase || dragPhrase)) {
                      e.preventDefault();
                      tryMatch(selectedPhrase || dragPhrase, id);
                    }
                  }}
                >
                  {card.meaning}
                </div>
              );
            })}
          </div>
        </div>

        <p className={styles.touchHint}>
          {selectedPhrase || dragPhrase
            ? "Пусни върху значението или го докосни"
            : "Завлечи фразата или я докосни, после значението"}
        </p>
      </div>
    );
  }

  if (mode === "quiz" && currentQuiz) {
    const card = phraseById(currentQuiz.id);
    return (
      <div className={styles.shell}>
        <header className={styles.topBar}>
          <Link href={exitHref} className={styles.backLink}>
            ← Към игрите
          </Link>
          <div className={styles.progress}>
            Въпрос {quizIndex + 1} / {quizOrder.length}
          </div>
        </header>

        <p className={styles.prompt}>Викторина — избери правилния отговор</p>

        {card?.flashIllustration ? (
          <img
            src={card.flashIllustration}
            alt=""
            className={styles.quizIllustration}
          />
        ) : card ? (
          <PhraseDualVisual
            id={card.id}
            literalCaption={card.literalCaption}
            figurativeCaption={card.figurativeCaption}
            compact
          />
        ) : null}

        <blockquote className={styles.quizSentence}>{currentQuiz.sentence}</blockquote>
        <p className={styles.quizQuestion}>{currentQuiz.question}</p>

        <div className={styles.quizOptions}>
          {currentQuiz.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const picked = quizPick === opt.id;
            const showResult = quizChecked;
            const isCorrect = opt.correct;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={quizChecked}
                className={[
                  styles.quizOption,
                  picked ? styles.quizOptionPicked : "",
                  showResult && isCorrect ? styles.quizOptionCorrect : "",
                  showResult && picked && !isCorrect ? styles.quizOptionWrong : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setQuizPick(opt.id)}
              >
                <span className={styles.quizLetter}>{letter})</span> {opt.text}
              </button>
            );
          })}
        </div>

        {quizFeedback ? (
          <p className={quizChecked && quizPick && currentQuiz.options.find((o) => o.id === quizPick)?.correct ? styles.feedbackOkInline : styles.feedbackHintInline} role="status">
            {quizFeedback}
          </p>
        ) : (
          <p className={styles.feedbackSpacer} />
        )}

        <div className={styles.navRow}>
          {!quizChecked ? (
            <button
              type="button"
              className={styles.navBtnPrimary}
              onClick={checkQuiz}
              disabled={!quizPick}
            >
              Провери
            </button>
          ) : (
            <button type="button" className={styles.navBtnPrimary} onClick={goQuizNext}>
              {quizIndex + 1 >= quizOrder.length ? "Край" : "Напред →"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
