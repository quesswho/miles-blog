#!/usr/bin/env bash
# Builds _src/turnstile/*.jsx into assets/js/turnstile.js.
#
# GitHub Pages only runs Jekyll, so the bundle is built here and committed.
# Re-run this after editing anything under _src/turnstile/.
#
# No Node.js required: esbuild ships a standalone binary, and the React
# packages are plain tarballs from the npm registry. Both are cached in
# _src/.cache/ (gitignored) and fetched on first run.
set -euo pipefail

ESBUILD_VERSION=0.25.9
REACT_VERSION=19.2.8
SCHEDULER_VERSION=0.27.0

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SRC_DIR")"
CACHE_DIR="$SRC_DIR/.cache"
MODULES_DIR="$SRC_DIR/node_modules"
OUT_FILE="$ROOT_DIR/assets/js/turnstile.js"

fetch_package() { # name version dest
  local name="$1" version="$2" dest="$3"
  local tarball="$CACHE_DIR/${name//\//-}-$version.tgz"
  [ -f "$tarball" ] || curl -sSfL \
    "https://registry.npmjs.org/$name/-/$(basename "$name")-$version.tgz" -o "$tarball"
  rm -rf "$dest"
  mkdir -p "$dest"
  tar xzf "$tarball" -C "$dest" --strip-components=1
}

mkdir -p "$CACHE_DIR" "$MODULES_DIR" "$(dirname "$OUT_FILE")"

case "$(uname -s)-$(uname -m)" in
  Linux-x86_64)  ESBUILD_PLATFORM=linux-x64 ;;
  Linux-aarch64) ESBUILD_PLATFORM=linux-arm64 ;;
  Darwin-x86_64) ESBUILD_PLATFORM=darwin-x64 ;;
  Darwin-arm64)  ESBUILD_PLATFORM=darwin-arm64 ;;
  *) echo "no esbuild binary mapped for $(uname -s)-$(uname -m)" >&2; exit 1 ;;
esac

ESBUILD="$CACHE_DIR/esbuild-$ESBUILD_VERSION/bin/esbuild"
if [ ! -x "$ESBUILD" ]; then
  fetch_package "@esbuild/$ESBUILD_PLATFORM" "$ESBUILD_VERSION" "$CACHE_DIR/esbuild-$ESBUILD_VERSION"
  chmod +x "$ESBUILD"
fi

[ -f "$MODULES_DIR/react/package.json" ] || fetch_package react "$REACT_VERSION" "$MODULES_DIR/react"
[ -f "$MODULES_DIR/react-dom/package.json" ] || fetch_package react-dom "$REACT_VERSION" "$MODULES_DIR/react-dom"
[ -f "$MODULES_DIR/scheduler/package.json" ] || fetch_package scheduler "$SCHEDULER_VERSION" "$MODULES_DIR/scheduler"

"$ESBUILD" "$SRC_DIR/turnstile/main.jsx" \
  --bundle \
  --minify \
  --target=es2019 \
  --loader:.jsx=jsx \
  --jsx=automatic \
  --define:process.env.NODE_ENV=\"production\" \
  --outfile="$OUT_FILE"

echo "built $OUT_FILE ($(du -h "$OUT_FILE" | cut -f1))"
