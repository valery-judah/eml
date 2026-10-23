#!/bin/sh
set -eu
npm ci --ignore-scripts --no-audit --no-fund
exec "$@"
