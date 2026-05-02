import { spawn, spawnSync } from "node:child_process";

const port = process.env.SMOKE_PORT ?? "3210";
const preferredBaseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
let baseUrl = process.env.SMOKE_BASE_URL ?? `http://127.0.0.1:${port}`;

const routes = [
  "/",
  "/rooms",
  "/saved-rooms",
  "/contact-history",
  "/host",
  "/host/posts",
  "/host/posts/create",
  "/host/customers",
  "/host/profile",
  "/admin",
  "/admin/rooms",
  "/admin/news",
  "/admin/contact-requests",
  "/admin/room-reports",
  "/admin/support-tickets",
  "/admin/users",
  "/cms",
  "/cms/articles",
  "/cms/articles/create",
  "/cms/categories",
  "/cms/media",
  "/cms/settings",
  "/profile",
  "/login",
  "/register",
  "/forgot-password",
  "/news",
  "/explore/kinh-nghiem-thue-phong",
  "/explore/meo-tranh-lua-dao",
  "/explore/khu-vuc-pho-bien",
  "/explore/cam-nang-sinh-vien-nguoi-di-lam",
  "/explore/checklist-truoc-khi-thue",
  "/support/huong-dan-tim-phong",
  "/support/faq",
  "/support/bao-cao-tin-sai",
  "/support/lien-he",
  "/support/chinh-sach-bao-mat",
  "/support/dieu-khoan-su-dung",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function startServer() {
  if (process.platform === "win32") {
    return spawn(
      process.env.ComSpec ?? "cmd.exe",
      ["/d", "/s", "/c", `npm run dev -- --hostname 127.0.0.1 --port ${port}`],
      {
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
  }

  return spawn("npm", ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", port], {
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function stopServer(child) {
  if (!child) return;
  if (!child.pid || child.killed) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
    return;
  }

  child.kill("SIGTERM");
}

async function canReach(url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function waitUntilReady(child) {
  const startedAt = Date.now();
  let lastError = "";

  while (Date.now() - startedAt < 45000) {
    if (child.exitCode !== null) {
      throw new Error(`Dev server exited early with code ${child.exitCode}`);
    }

    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status < 500) return;
      lastError = `status ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await sleep(750);
  }

  throw new Error(`Timed out waiting for ${baseUrl}. Last error: ${lastError}`);
}

async function requestRoute(route) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  const ok = response.status >= 200 && response.status < 400;
  return { route, status: response.status, ok };
}

async function main() {
  let child = null;
  let output = "";

  try {
    if (await canReach(preferredBaseUrl)) {
      baseUrl = preferredBaseUrl;
      console.log(`Using existing server ${baseUrl}`);
    } else {
      child = startServer();
      child.stdout.on("data", (chunk) => {
        output += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        output += chunk.toString();
      });
      await waitUntilReady(child);
    }

    const results = [];
    for (const route of routes) {
      results.push(await requestRoute(route));
    }

    const failed = results.filter((result) => !result.ok);
    for (const result of results) {
      const marker = result.ok ? "OK" : "FAIL";
      console.log(`${marker} ${result.status} ${result.route}`);
    }

    if (failed.length > 0) {
      throw new Error(`${failed.length} route(s) failed smoke test.`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    if (output.trim()) {
      console.error("\nDev server output:\n");
      console.error(output.trim());
    }
    process.exitCode = 1;
  } finally {
    stopServer(child);
  }
}

await main();
