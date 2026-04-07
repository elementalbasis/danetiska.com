{
  line = $0

  gsub(/@lemma\([^)]*\)[[:space:]]*/, "", line)
  gsub(/@link\([^)]*\)[[:space:]]*/, "", line)

  print line
}
