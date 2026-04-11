{
  line = $0

  gsub(/@lemma\([^)]*\)[[:space:]]*/, "", line)
  gsub(/@link\([^)]*\)[[:space:]]*/, "", line)
  gsub(/@def\[[^\]]*\]/, "@def", line)

  print line
}
