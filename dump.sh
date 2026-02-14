OUTPUT="project_dump.txt"

(
  echo "===== FILE CONTENTS ====="

  find . -path "./.git" -prune -o -type f -print0 |
  while IFS= read -r -d '' file; do
    if [ "$file" != "./$OUTPUT" ] && file --mime "$file" | grep -q "text/"; then
      echo ""
      echo "===== $file ====="
      cat "$file"
    fi
  done

  echo ""
  echo "===== FILE STRUCTURE ====="

  find . -path "./.git" -prune -o -print

) > "$OUTPUT"
