#!/usr/bin/env bash
# Local preview with live reload:
#
#   ./serve.sh            ->  http://localhost:4000/miles-blog/
#
# Saving any post, layout, include, or stylesheet rebuilds the affected pages
# and refreshes the open browser tab on its own. Ctrl-C to stop. Extra Jekyll
# flags are passed through, e.g.  ./serve.sh --port 4001
#
# Runs through _dev/jekyll.rb, which patches the 2021-era gem stack that
# github-pages pins so it runs on modern Ruby. See the notes in that file.
set -euo pipefail
cd "$(dirname "$0")"
exec bundle exec ruby _dev/jekyll.rb serve --livereload --drafts --future "$@"
