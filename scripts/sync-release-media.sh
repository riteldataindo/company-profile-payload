#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 prepare|capture SHARED_MEDIA_DIR RELEASE_DIR" >&2
  exit 2
}

[[ $# -eq 3 ]] || usage

mode=$1
shared_dir=$(realpath -m -- "$2")
release_dir=$(realpath -m -- "$3")
release_media_dir="$release_dir/public/media"

if [[ "$shared_dir" == "/" || "$release_dir" == "/" || "$release_media_dir" == "/" ]]; then
  echo "Refusing to synchronize a root directory" >&2
  exit 2
fi

case "$mode" in
  prepare)
    [[ -d "$shared_dir" ]] || {
      echo "Shared media directory does not exist: $shared_dir" >&2
      exit 2
    }
    [[ -d "$release_dir" ]] || {
      echo "Release directory does not exist: $release_dir" >&2
      exit 2
    }
    mkdir -p -- "$release_media_dir"
    rsync -a -- "$shared_dir/" "$release_media_dir/"
    ;;
  capture)
    [[ -d "$release_media_dir" ]] || {
      echo "Release media directory does not exist: $release_media_dir" >&2
      exit 2
    }
    mkdir -p -- "$shared_dir"
    rsync -a -- "$release_media_dir/" "$shared_dir/"
    ;;
  *)
    usage
    ;;
esac

echo "$mode media synchronization completed"
