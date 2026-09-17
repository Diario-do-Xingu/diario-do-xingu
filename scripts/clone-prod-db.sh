#!/usr/bin/env bash
# Copies production into your local database, so migrations and schema changes can be rehearsed
# against real shapes and volumes rather than a handful of seeded documents.
#
#   pnpm db:clone-prod
#
# Reads PROD_DATABASE_URI (source, read-only) and DATABASE_URI (target, dropped and replaced)
# from .env. Production is never written to, and neither URI is ever printed.
set -euo pipefail

cd "$(dirname "$0")/.."

read_env() { grep "^$1=" .env 2>/dev/null | head -1 | cut -d= -f2- || true; }

SOURCE_URI="$(read_env PROD_DATABASE_URI)"
TARGET_URI="$(read_env DATABASE_URI)"

[ -n "$SOURCE_URI" ] || { echo "PROD_DATABASE_URI is not set in .env" >&2; exit 1; }
[ -n "$TARGET_URI" ] || { echo "DATABASE_URI is not set in .env" >&2; exit 1; }

# The dangerous mistake this script can make is restoring over production, so refuse anything
# that is not plainly a local target. Override only if you know exactly what you are doing.
TARGET_HOST="$(printf '%s' "$TARGET_URI" | sed -E 's|^[a-z+]+://||; s|^[^@]*@||; s|[/?].*$||; s|:[0-9]+$||')"
if [ "${CLONE_ALLOW_REMOTE_TARGET:-0}" != "1" ]; then
  case "$TARGET_HOST" in
    localhost|127.0.0.1|0.0.0.0|::1|host.docker.internal) ;;
    *)
      echo "Refusing to restore into '$TARGET_HOST': it is not a local host." >&2
      echo "Point DATABASE_URI at a local database, or set CLONE_ALLOW_REMOTE_TARGET=1." >&2
      exit 1
      ;;
  esac
fi
[ "$SOURCE_URI" != "$TARGET_URI" ] || { echo "Source and target are the same database." >&2; exit 1; }

SOURCE_DB="$(printf '%s' "$SOURCE_URI" | sed -E 's|\?.*$||; s|.*/||')"
TARGET_DB="$(printf '%s' "$TARGET_URI" | sed -E 's|\?.*$||; s|.*/||')"
ARCHIVE="${CLONE_ARCHIVE_DIR:-$HOME/backups}/$(date +%Y%m%d-%H%M%S)-prod.archive.gz"
mkdir -p "$(dirname "$ARCHIVE")"

# Prefer the local database tools; fall back to the mongo image, which bundles them.
if command -v mongodump >/dev/null 2>&1 && command -v mongorestore >/dev/null 2>&1; then
  run_dump()    { mongodump --uri="$SOURCE_URI" --archive="$ARCHIVE" --gzip; }
  run_restore() { mongorestore --uri="$TARGET_URI" --archive="$ARCHIVE" --gzip --drop \
                    --nsFrom="$SOURCE_DB.*" --nsTo="$TARGET_DB.*"; }
else
  command -v docker >/dev/null 2>&1 || {
    echo "Needs either the MongoDB database tools or docker on PATH." >&2; exit 1; }
  MONGO_IMAGE="${MONGO_IMAGE:-mongo:8}"
  run_dump() {
    docker run --rm --network host -e URI="$SOURCE_URI" -v "$(dirname "$ARCHIVE")":/backup \
      "$MONGO_IMAGE" sh -c "mongodump --uri=\"\$URI\" --archive=/backup/$(basename "$ARCHIVE") --gzip"
  }
  run_restore() {
    docker run --rm --network host -e URI="$TARGET_URI" -v "$(dirname "$ARCHIVE")":/backup \
      "$MONGO_IMAGE" sh -c "mongorestore --uri=\"\$URI\" --archive=/backup/$(basename "$ARCHIVE") \
        --gzip --drop --nsFrom='$SOURCE_DB.*' --nsTo='$TARGET_DB.*'"
  }
fi

echo "Dumping production..."
run_dump >/dev/null 2>&1 || { echo "mongodump failed" >&2; exit 1; }
echo "Archive kept at $ARCHIVE"

echo "Restoring into local '$TARGET_DB' (dropping what is there)..."
run_restore 2>&1 | tail -1

echo "Done. The archive above doubles as a backup; delete it when you no longer need it."
