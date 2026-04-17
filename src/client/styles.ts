import { css } from "hono/css";

export const globalClass = css`
  :-hono-global {
    html {
      font-family: Arial, Helvetica, sans-serif;
      padding: 0;
      margin: 0;
    }
    body {
      padding: 0;
      margin: 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0;
      line-height: 24px;
      font-size: 16px;
      font-weight: 400;
    }

    pre {
      margin: 0;
    }

    p {
      margin: 0;
    }

    a {
      color: #0070f3;
      text-decoration: none;
      transition: color 0.15s;
    }

    #root {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    #root > div {
      box-sizing: border-box;
      width: 100%;
      max-width: 62.5rem;
      padding: 0 64px;

      display: flex;
      flex-direction: column;
    }
  }
`;

export const titleClass = css`
  line-height: 64px;
  font-size: 48px;
  max-width: 600px;
  color: rgba(60, 60, 67);
  margin-top: 2rem;
`;

export const taglineClass = css`
  line-height: 36px;
  font-size: 24px;
  padding-top: 12px;
  max-width: 576px;
  color: rgb(60 60 67 / 78%);
  overflow-wrap: break-word;
`;

export const playgroundClass = css`
  width: 100%;
  min-height: 28rem;
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    Liberation Mono,
    Courier New,
    monospace;
  display: flex;
  flex-direction: column;
  line-height: 1.7;
  font-size: 1rem;
  border-radius: 8px;
  margin: 32px 0;
  padding: 20px 24px;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
`;

export const overlayClass = css`
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    Liberation Mono,
    Courier New,
    monospace;
  font-size: 14px;
  line-height: 1.7;
  letter-spacing: normal;
  tab-size: 4;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  white-space: pre;

  & > pre,
  & > pre > code {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    tab-size: inherit;
    white-space: pre;
  }

  & > pre {
    background-color: transparent !important;
  }
`;

export const textareaClass = css`
  z-index: 1;
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: 0;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.7;
  letter-spacing: normal;
  tab-size: 4;
  white-space: pre;
  caret-color: rgb(156 163 175);
`;

export const highlightClass = css`
  z-index: 2;
  pointer-events: none;

  /* Some grammars emit an empty .line, while txt wraps it in an empty span. */
  & > pre > code > .line:last-child:empty::before,
  & > pre > code > .line:last-child > span:only-child:empty::before {
    content: "\\200b";
  }
`;

export const buttonClass = css`
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s;
  cursor: pointer;

  border-color: transparent;
  color: #fff;
  background-color: #5086a1;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 1;
  }
`;

export const playgroundHeaderClass = css`
  display: flex;
  align-items: center;
  border-color: #9ca3af0d;
  border-bottom-style: solid;
  padding: 0.5rem;
  padding-left: 1.25rem;
  padding-right: 0.75rem;

  & > * {
  }

  & > * + * {
    margin-left: 1rem;
  }
`;
