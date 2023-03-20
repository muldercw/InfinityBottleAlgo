const fs = require("fs");
const { execSync } = require("child_process");

const API_DIR = "src/app/api";
const API_BAK = "src/app/_api_bak";

// Clean cached types
fs.rmSync(".next", { recursive: true, force: true });

// Temporarily move API routes out (incompatible with static export)
let movedApi = false;
if (fs.existsSync(API_DIR)) {
  fs.renameSync(API_DIR, API_BAK);
  movedApi = true;
}

try {
  execSync("npx cross-env NEXT_PUBLIC_STORAGE=local next build", {
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_STORAGE: "local" },
  });
} finally {
  // Always restore API routes
  if (movedApi && fs.existsSync(API_BAK)) {
    fs.renameSync(API_BAK, API_DIR);
  }
}
