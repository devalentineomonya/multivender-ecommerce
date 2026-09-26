import fs from "fs";
import path from "path";

function searchDir(dir: string, results: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (file === "node_modules" || file === ".next" || file === ".git") continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchDir(full, results);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      const content = fs.readFileSync(full, "utf-8");
      if (content.includes('router.push("/")') || content.includes("router.push('/')") || content.includes('redirect("/")') || content.includes("redirect('/')")) {
        results.push(full);
      }
    }
  }
  return results;
}

const found = searchDir(process.cwd());
console.log("Files redirecting to /:");
for (const f of found) {
  console.log("-", f.replace(process.cwd(), ""));
}
process.exit(0);
