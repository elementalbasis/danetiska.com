{
  line = $0

  if (match(line, /@key\([^)]*\)/)) {
    key = substr(line, RSTART, RLENGTH)

    inner = key
    sub(/^@key\(/, "", inner)
    sub(/\)$/, "", inner)

    split(inner, parts, /[;,]/)

    lemma = parts[1]
    sub(/^[ \t]+/, "", lemma)
    sub(/[ \t]+$/, "", lemma)

    # insert before @key(...) in the same line
    line = substr(line, 1, RSTART-1) \
           "@lemma(" lemma ") " \
           substr(line, RSTART)
  }

  print line
}
