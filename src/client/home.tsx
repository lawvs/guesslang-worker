import { css } from "hono/css";
import { use, useEffect, useRef, useState } from "hono/jsx";
import { codeToHtml } from "shiki";
import { DetectionOptions, DetectionResult } from "../types";
import type { ModelResult } from "../vscode-languagedetection";
import { Footer } from "./footer";
import { Loading } from "./loading";
import { Ribbon } from "./ribbon";
import {
  buttonClass,
  globalClass,
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
  const percent = (confidence * 100).toFixed(1);

  return (
    <div class={playgroundHeaderClass}>
      {loading && <Loading />}
      {!loading && (
        <>
          <div>{languageName}</div>
          <div title="Confidence">
            {percent}% {getEmoji(confidence)}
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

const Action = ({
  onClick,
}: {
  onClick: (options: Partial<DetectionOptions>) => void;
}) => {
  const [verbose, setVerbose] = useState(true);
  const [fineTune, setFineTune] = useState(true);

  const handleClick = () => {
    onClick({
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
          margin-left: 0.5rem;
        }
      `}
    >
      <div>
        <input
          type="checkbox"
          id="fine-tune"
          name="fine-tune"
          checked={verbose}
          onChange={() => setVerbose(!verbose)}
        />
        <label
          for="fine-tune"
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
          name="fine-tune"
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
      <button class={buttonClass} onClick={handleClick}>
        Guess
      </button>
    </div>
  );
};

const useShiki = ({ code }: { code: string }) => {
  const [html, setHtml] = useState("");
  useEffect(() => {
    const abortController = new AbortController();
    codeToHtml(code, {
      lang: "javascript",
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
  }, [code]);
  return { html };
};

const Playground = ({
  onChange,
}: {
  onChange?: (v: DetectionResult | null) => void;
}) => {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [guessResult, setGuessResult] =
    useState<DetectionResult>(DEFAULT_RESULT);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLDivElement>(null);
  const { html } = useShiki({ code: text });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.textContent = text;
    }
  }, []);

  const onClick = async (options: Partial<DetectionOptions>) => {
    if (!text || loading) {
      return;
    }
    setLoading(true);
    onChange?.(null);
    try {
      const result = await guessLanguage(text, options);
      if (!result) {
        setGuessResult(FALLBACK);
        return;
      }
      setGuessResult(result);
      onChange?.(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div class={playgroundClass}>
      <Header loading={loading} result={guessResult} />
      <div
        class={css`
          position: relative;
          flex: 1;
        `}
      >
        <span
          id="highlight"
          class={textareaClass}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div
          ref={textareaRef}
          contenteditable
          class={textareaClass}
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          onScroll={(event) => {
            const highlight = document.getElementById("highlight");
            if (!highlight) {
              return;
            }
            highlight.scrollTop = (
              event.target as HTMLTextAreaElement
            ).scrollTop;
          }}
          onInput={(event) => {
            if (!event.target) {
              throw new Error("No event target found");
            }
            setText((event.target as HTMLTextAreaElement).textContent ?? "");
          }}
        ></div>
      </div>
      <Action onClick={onClick} />
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
        <Playground onChange={setGuessResult} />
        {guessResult?.modelResults && (
          <Table modelResults={guessResult.modelResults} />
        )}
      </div>
      <Footer />
    </>
  );
};
