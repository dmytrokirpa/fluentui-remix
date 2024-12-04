import type { EntryContext } from "@remix-run/node";
import { PassThrough } from "node:stream";
import { RemixServer } from "@remix-run/react";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { renderToStaticMarkup, renderToPipeableStream } from "react-dom/server";
import { isbot } from "isbot";
// 1. Import required Fluent UI SSR utilities
import {
  createDOMRenderer,
  RendererProvider,
  renderToStyleElements,
  SSRProvider,
} from "@fluentui/react-components";

const ABORT_DELAY = 5000;

// 2. Define constants for style injection
const FLUENT_UI_INSERTION_POINT_TAG = `<meta name="fluentui-insertion-point" content="fluentui-insertion-point"/>`;
const FLUENT_UI_INSERTION_TAG_REGEX = new RegExp(
  FLUENT_UI_INSERTION_POINT_TAG.replaceAll(" ", "(\\s)*")
);

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  // 3. Create Fluent UI renderer
  const renderer = createDOMRenderer();

  return new Promise((resolve, reject) => {
    let shellRendered = false;

    // 4. Track style extraction state
    let isStyleExtracted = false;

    const { pipe, abort } = renderToPipeableStream(
      // 5. Wrap RemixServer with Fluent UI providers
      <RendererProvider renderer={renderer}>
        <SSRProvider>
          <RemixServer context={remixContext} url={request.url} />
        </SSRProvider>
      </RendererProvider>,
      {
        [callbackName]: () => {
          shellRendered = true;
          const body = new PassThrough({
            // 6. Transform stream to inject Fluent UI styles
            transform(chunk, _, callback) {
              const str = chunk.toString();
              const style = renderToStaticMarkup(
                <>{renderToStyleElements(renderer)}</>
              );

              if (
                !isStyleExtracted &&
                FLUENT_UI_INSERTION_TAG_REGEX.test(str)
              ) {
                chunk = str.replace(
                  FLUENT_UI_INSERTION_TAG_REGEX,
                  `${FLUENT_UI_INSERTION_POINT_TAG}${style}`
                );
                isStyleExtracted = true;
              }

              callback(null, chunk);
            },
          });
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
