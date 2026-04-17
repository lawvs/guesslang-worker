import { css } from "hono/css";

export const Footer = () => {
  return (
    <footer
      class={css`
        padding-top: 32px;
        /* border-top: 1px solid #e2e2e3; */
        margin: 16px 0;
        text-align: center;
        line-height: 24px;
        font-size: 14px;
        font-weight: 500;
        color: rgb(60 60 67 / 78%);
      `}
    >
      <div class="container">
        <p class="message">
          Powered by{" "}
          <a
            href="https://github.com/yoeo/guesslang"
            target="_blank"
            rel="noopener noreferrer"
          >
            Guesslang
          </a>{" "}
          | Released under the{" "}
          <a
            href="https://github.com/lawvs/guesslang-worker/?tab=MIT-1-ov-file"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License
          </a>
          .
        </p>
        <p class="copyright">Copyright © 2026 whitewater</p>
      </div>
    </footer>
  );
};
