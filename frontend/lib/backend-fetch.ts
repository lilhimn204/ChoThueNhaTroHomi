const BACKEND_RETRY_DELAYS_MS = [300, 700, 1000, 1500, 2500, 3500, 5000];
const RETRYABLE_BACKEND_ERROR_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "EAI_AGAIN",
]);

type ErrorWithCause = Error & {
  cause?: {
    code?: string;
  };
};

function isRetryableBackendError(error: unknown) {
  if (!(error instanceof TypeError)) {
    return false;
  }

  const code = (error as ErrorWithCause).cause?.code;
  return Boolean(code && RETRYABLE_BACKEND_ERROR_CODES.has(code));
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchBackend(input: string | URL, init?: RequestInit) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= BACKEND_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await fetch(input, init);
    } catch (error) {
      lastError = error;

      if (!isRetryableBackendError(error) || attempt === BACKEND_RETRY_DELAYS_MS.length) {
        throw error;
      }

      await sleep(BACKEND_RETRY_DELAYS_MS[attempt]);
    }
  }

  throw lastError;
}
