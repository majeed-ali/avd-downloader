type LogData = Record<string, unknown>;

const logDirectory = "logs";
const logFile = "logs/debug.log";

const debugLoggingEnabled =
  process.env.DEBUG_FILE_LOGGING === "true";

type NodeFsPromises = {
  appendFile: (
    path: string,
    data: string,
    options: string
  ) => Promise<void>;
  mkdir: (
    path: string,
    options: { recursive: boolean }
  ) => Promise<void>;
};

let nodeFsPromises: NodeFsPromises | null = null;

async function getNodeFsPromises(): Promise<NodeFsPromises | null> {
  if (typeof process === "undefined" || !process.versions?.node) {
    return null;
  }

  if (!nodeFsPromises) {
    const nodeRequire = Function(
      "return typeof require === 'function' ? require : null"
    )() as ((specifier: string) => NodeFsPromises) | null;

    if (!nodeRequire) {
      return null;
    }

    nodeFsPromises = nodeRequire("fs/promises");
  }

  return nodeFsPromises;
}

function sanitizeValue(
  key: string,
  value: unknown
): unknown {
  const sensitiveKeys = [
    "apikey",
    "apiKey",
    "authorization",
    "downloadUrl",
    "download_url",
    "url",
    "videoUrl",
  ];

  if (sensitiveKeys.includes(key)) {
    return "[REDACTED]";
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  return value;
}

function sanitizeData(data: LogData): LogData {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      sanitizeValue(key, value),
    ])
  );
}

export async function debugLog(
  event: string,
  data: LogData = {}
): Promise<void> {
  if (!debugLoggingEnabled) {
    return;
  }

  try {
    const fsPromises = await getNodeFsPromises();

    if (!fsPromises) {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          event,
          ...sanitizeData(data),
        })
      );

      return;
    }

    await fsPromises.mkdir(logDirectory, {
      recursive: true,
    });

    const entry = {
      timestamp: new Date().toISOString(),
      event,
      ...sanitizeData(data),
    };

    await fsPromises.appendFile(
      logFile,
      `${JSON.stringify(entry)}\n`,
      "utf8"
    );
  } catch {
    /*
     * Do not throw if logging fails.
     * Logging must never break the download process.
     */
  }
}