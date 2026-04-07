function trim(s) {
  sub(/^[ \t\r\n]+/, "", s)
  sub(/[ \t\r\n]+$/, "", s)
  return s
}

function arg_of(line, tag,    tmp, pat) {
  pat = "@" tag "\\([^)]*\\)"
  if (match(line, pat)) {
    tmp = substr(line, RSTART, RLENGTH)
    sub("^@" tag "\\(", "", tmp)
    sub("\\)$", "", tmp)
    return tmp
  }
  return ""
}

{
  line = $0

  # Collect expression lines and bucket them by linked lemma
  if (line ~ /^[[:space:]]*@expr\(/) {
    links = arg_of(line, "link")
    n = split(links, parts, /,/)

    for (i = 1; i <= n; i++) {
      lemma = trim(parts[i])
      if (lemma != "") {
        exprs[lemma] = exprs[lemma] " " line
      }
    }
    next
  }

  # Store all non-expression lines in order
  lines[++count] = line
}

END {
  for (i = 1; i <= count; i++) {
    line = lines[i]

    if (match(line, /@lemma\([^)]*\)/)) {
      tmp = substr(line, RSTART, RLENGTH)
      sub(/^@lemma\(/, "", tmp)
      sub(/\)$/, "", tmp)
      lemma = trim(tmp)

      if (lemma in exprs) {
        line = line exprs[lemma]
      }
    }

    print line
  }
}
