import { css } from "hono/css";
import { useEffect, useRef, useState } from "hono/jsx";
import { codeToHtml } from "shiki";
import { DetectionOptions, DetectionResult } from "../types";
import type { ModelResult } from "../vscode-languagedetection";
import { Footer } from "./footer";
import { Loading } from "./loading";
import { Ribbon } from "./ribbon";
import {
  buttonClass,
  globalClass,
  highlightClass,
  overlayClass,
  playgroundClass,
  playgroundHeaderClass,
  taglineClass,
  textareaClass,
  titleClass,
} from "./styles";
import {
  DEFAULT_RESULT,
  DEFAULT_TEXT,
  FALLBACK,
  getEmoji,
  guessLanguage,
} from "./utils";

const Table = ({ modelResults }: { modelResults: ModelResult[] }) => {
  return (
    <table
      class={css`
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
        text-align: center;
        align-self: center;

        & th {
          font-size: 14px;
          font-weight: 600;
          color: rgb(60 60 67 / 78%);
          background-color: #f6f6f7;
        }

        & th,
        td {
          border: 1px solid #e2e2e3;
          padding: 8px 16px;
        }
      `}
    >
      <thead>
        <tr>
          <th>Language</th>
          <th>Confidence</th>
        </tr>
      </thead>
      <tbody>
        {modelResults.map((result) => (
          <tr>
            <td>{result.languageId}</td>
            <td>{(result.confidence * 100).toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Header = ({
  loading,
  result,
}: {
  loading: boolean;
  result: DetectionResult;
}) => {
  const { languageName, confidence } = result;
  const [emoji, setEmoji] = useState(() => getEmoji(confidence));
  const percent = confidence === 0 ? "" : (confidence * 100).toFixed(1) + "%";

  useEffect(() => {
    setEmoji(getEmoji(confidence));
  }, [confidence]);

  return (
    <div class={playgroundHeaderClass}>
      {loading && <Loading />}
      {!loading && (
        <>
          <div>{languageName}</div>
          <div title="Confidence">
            {percent} {emoji}
          </div>
        </>
      )}
      <div
        class={css`
          margin-left: auto;
          opacity: 0.5;
          font-size: 0.75rem;
          line-height: 1rem;
        `}
      >
        Playground
      </div>
    </div>
  );
};

const ActionBar = ({
  onGuess,
  onChangeAutoGuess,
}: {
  onGuess?: (options: Partial<DetectionOptions>) => void;
  onChangeAutoGuess?: (autoGuess: boolean) => void;
}) => {
  const [verbose, setVerbose] = useState(true);
  const [fineTune, setFineTune] = useState(true);

  const handleClick = () => {
    onGuess?.({
      fineTune,
      verbose,
    });
  };

  return (
    <div
      class={css`
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0.5rem;
        padding-left: 1.25rem;
        padding-right: 0.75rem;

        & > * + * {
          margin-left: 1rem;
        }
        & > button {
          margin-left: auto;
        }
      `}
    >
      <div>
        <input
          type="checkbox"
          id="show-details"
          checked={verbose}
          onChange={() => setVerbose(!verbose)}
        />
        <label
          for="show-details"
          class={css`
            user-select: none;
          `}
        >
          Show details
        </label>
      </div>
      <div>
        <input
          type="checkbox"
          id="fine-tune"
          checked={fineTune}
          onChange={() => setFineTune(!fineTune)}
        />
        <label
          for="fine-tune"
          class={css`
            user-select: none;
          `}
        >
          Fine-tune
        </label>
      </div>

      <div>
        <input
          type="checkbox"
          id="auto-guess"
          checked={false}
          onChange={(e) => {
            const autoGuess = (e.target as HTMLInputElement).checked;
            onChangeAutoGuess?.(autoGuess);
          }}
        />
        <label
          for="auto-guess"
          class={css`
            user-select: none;
          `}
        >
          Auto guess
        </label>
      </div>
      <button class={buttonClass} onClick={handleClick}>
        Guess
      </button>
    </div>
  );
};

const useShiki = ({ code, lang }: { code: string; lang: string }) => {
  const [html, setHtml] = useState("");
  useEffect(() => {
    const abortController = new AbortController();
    codeToHtml(code, {
      lang,
      theme: "github-light",
    }).then((html) => {
      if (abortController.signal.aborted) {
        return;
      }
      setHtml(html);
    });
    return () => {
      abortController.abort();
    };
  }, [code, lang]);
  return { html };
};

const Playground = ({
  onUpdateResult,
}: {
  onUpdateResult?: (v: DetectionResult | null) => void;
}) => {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [guessResult, setGuessResult] =
    useState<DetectionResult>(DEFAULT_RESULT);
  const [loading, setLoading] = useState(false);
  const [autoGuess, setAutoGuess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { html } = useShiki({ code: text, lang: guessResult.languageId });

  useEffect(() => {
    if (!textareaRef.current) {
      throw new Error("No textareaRef found");
    }
    // Set initial text
    textareaRef.current.value = text;
  }, []);

  const onGuess = async (options: Partial<DetectionOptions> = {}) => {
    if (!text || text === "\n" || loading) {
      return;
    }
    setLoading(true);
    onUpdateResult?.(null);
    try {
      const result = await guessLanguage(text, options);
      if (!result) {
        setGuessResult(FALLBACK);
        return;
      }
      setGuessResult(result);
      onUpdateResult?.(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const syncScroll = () => {
    const textArea = textareaRef.current;
    const highlight = document.getElementById("highlight");
    if (!highlight || !textArea) {
      return;
    }
    highlight.scrollTop = textArea.scrollTop;
    highlight.scrollLeft = textArea.scrollLeft;
  };
  useEffect(() => {
    syncScroll();
  }, [html]);

  const [time, setTime] = useState(() => new Date().getTime());
  useEffect(() => {
    const MIN_INTERVAL = 4000;
    if (!autoGuess) {
      return;
    }
    const timer = setTimeout(() => {
      if (!autoGuess || new Date().getTime() - time < MIN_INTERVAL) {
        return;
      }
      setTime(new Date().getTime());
      onGuess();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [autoGuess, text]);

  return (
    <div class={playgroundClass}>
      <Header loading={loading} result={guessResult} />
      <div
        class={css`
          position: relative;
          flex: 1;
        `}
      >
        <textarea
          ref={textareaRef}
          class={`${overlayClass} ${textareaClass}`}
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck={false}
          onInput={(event) => {
            if (!event.target) {
              throw new Error("No event target found");
            }
            setText((event.target as HTMLTextAreaElement).value);
          }}
          onScroll={syncScroll}
        />
        <span
          id="highlight"
          class={`${overlayClass} ${highlightClass}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <ActionBar onGuess={onGuess} onChangeAutoGuess={setAutoGuess} />
    </div>
  );
};

export const Home = () => {
  const [guessResult, setGuessResult] = useState<DetectionResult | null>(null);

  return (
    <>
      <Ribbon />
      <div class={globalClass}>
        <div>
          <h1 class={titleClass}>🎲 Guess Language Online!</h1>
          <p class={taglineClass}>
            🤖 Uses ML model to detect source code languages
          </p>
        </div>
        <Playground onUpdateResult={setGuessResult} />
        {guessResult?.modelResults && (
          <Table modelResults={guessResult.modelResults} />
        )}
      </div>
      <Footer />
    </>
  );
};
