import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/apm";

function init() {
  Sentry.init({
    dsn:
      "https://c154cbd9435c47bf897f97a348153b0a@o437687.ingest.sentry.io/5403688",
    release: "1-0-0",
    environment: "develoment-test",
    integrations: [new Integrations.Tracing()],
    tracesSampleRate: 1.0,
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default {
  init,
  log,
};
