const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC_DIR = path.join(ROOT, "src");
const TEMPLATES_DIR = path.join(SRC_DIR, "templates");
const PARTIALS_DIR = path.join(SRC_DIR, "partials");
const I18N_DIR = path.join(ROOT, "i18n");
const PUBLIC_DIR = path.join(ROOT, "public");
const DIST_DIR = path.join(ROOT, "dist");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function emptyDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  ensureDir(dir);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (src === PUBLIC_DIR && entry.isDirectory() && entry.name === "css") {
      continue;
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function getNestedValue(obj, key) {
  return key.split(".").reduce((acc, part) => acc?.[part], obj);
}

function renderPartials(template, data) {
  return template.replace(/\{\{\>\s*([a-zA-Z0-9_-]+)\s*\}\}/g, (_, partialName) => {
    const partialPath = path.join(PARTIALS_DIR, `${partialName}.html`);

    if (!fs.existsSync(partialPath)) {
      throw new Error(`Partial not found: ${partialName}`);
    }

    const partialContent = fs.readFileSync(partialPath, "utf8");
    return renderTemplate(partialContent, data);
  });
}

function renderVariables(template, data) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
    const value = getNestedValue(data, key);
    return value != null ? String(value) : `[missing: ${key}]`;
  });
}

function renderTemplate(template, data) {
  return renderVariables(renderPartials(template, data), data);
}

function loadLanguages() {
  return fs.readdirSync(I18N_DIR)
    .filter(file => file.endsWith(".json"))
    .map(file => {
      const langCode = path.basename(file, ".json");
      const data = JSON.parse(fs.readFileSync(path.join(I18N_DIR, file), "utf8"));
      return { langCode, data };
    });
}

function getPageInfo(templateFile) {
  const pageSlug = path.basename(templateFile, ".html");

  if (pageSlug === "index") {
    return {
      pageSlug,
      pageSuffix: "/",
      outputDirName: ""
    };
  }

  return {
    pageSlug,
    pageSuffix: `/${pageSlug}/`,
    outputDirName: pageSlug
  };
}

function bundleCSS() {
  const cssDir = path.join(PUBLIC_DIR, "css");
  const entryFile = path.join(cssDir, "style.css");

  if (!fs.existsSync(entryFile)) {
    console.log("No public/css/style.css found, skipping CSS bundle");
    return;
  }

  const seen = new Set();

  function inlineCss(filePath) {
    const absolutePath = path.resolve(filePath);

    if (seen.has(absolutePath)) {
      return "";
    }
    seen.add(absolutePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`CSS file not found: ${absolutePath}`);
    }

    let css = fs.readFileSync(absolutePath, "utf8");

    css = css.replace(/@import\s+["'](.+?)["'];?/g, (_, importPath) => {
      const importedFile = path.resolve(path.dirname(absolutePath), importPath);
      return inlineCss(importedFile);
    });

    return css;
  }

  let bundledCss = inlineCss(entryFile);

  bundledCss = bundledCss
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .trim();

  const outDir = path.join(DIST_DIR, "css");
  ensureDir(outDir);

  const outFile = path.join(outDir, "style.css");
  fs.writeFileSync(outFile, bundledCss, "utf8");

  console.log(`Bundled CSS to ${outFile}`);
}

function build() {
  emptyDir(DIST_DIR);
  copyDir(PUBLIC_DIR, DIST_DIR);
  bundleCSS();

  const languages = loadLanguages();
  const templateFiles = fs.readdirSync(TEMPLATES_DIR).filter(file => file.endsWith(".html"));

  for (const { langCode, data } of languages) {
    const langDir = path.join(DIST_DIR, langCode);
    ensureDir(langDir);

    const siteBaseUrl = data.site?.baseUrl || "";
    const langBase = `${siteBaseUrl}/${langCode}`;

    for (const templateFile of templateFiles) {
      const templatePath = path.join(TEMPLATES_DIR, templateFile);
      const templateContent = fs.readFileSync(templatePath, "utf8");
      const { pageSuffix, outputDirName } = getPageInfo(templateFile);

      const pageData = {
        ...data,
        lang: langCode,
        langBase,
        pageSuffix
      };

      const rendered = renderTemplate(templateContent, pageData);

      let outputDir = langDir;
      if (outputDirName) {
        outputDir = path.join(langDir, outputDirName);
      }

      ensureDir(outputDir);
      const outputPath = path.join(outputDir, "index.html");

      fs.writeFileSync(outputPath, rendered, "utf8");
      console.log(`Built ${outputPath}`);
    }
  }

  const rootIndex = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=./en/">
  <title>Redirecting...</title>
</head>
<body>
  <p><a href="./en/">Go to site</a></p>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST_DIR, "index.html"), rootIndex, "utf8");
  console.log("Built root redirect");
}

build();