function close_entry() {
  if (in_entry) {
    if (in_block) {
      print "    </ol>"
      print "  </section>"
      in_block = 0
    }
    print "</article>"
    in_entry = 0
  }
}

function open_sense_block() {
  if (!in_block) {
    print "  <section class=\"sense-block\">"
    print "    <ol>"
    in_block = 1
  }
}

function arg_of(token,    s) {
  s = token
  sub(/^@[a-z]+\(/, "", s)
  sub(/\)$/, "", s)
  return s
}

function replace_onearg(s, macro, label, star, raw, inner, repl, pat, start, len) {
  pat = "\\\\" macro "\\{[^{}]*\\}"
  while (match(s, pat)) {
    start = RSTART
    len   = RLENGTH
    raw   = substr(s, start, len)

    inner = raw
    sub("^\\\\" macro "\\{", "", inner)
    sub("\\}$", "", inner)

    if (star)
      repl = label " <i>*" inner "</i>"
    else
      repl = label " <i>" inner "</i>"

    s = substr(s, 1, start - 1) repl substr(s, start + len)
  }
  return s
}

function replace_twoarg(s, macro, label, raw, tmp, parts, arg1, arg2, repl, pat, start, len) {
  pat = "\\\\" macro "\\{[^{}]*\\}\\{[^{}]*\\}"
  while (match(s, pat)) {
    start = RSTART
    len   = RLENGTH
    raw   = substr(s, start, len)

    tmp = raw
    sub("^\\\\" macro "\\{", "", tmp)
    split(tmp, parts, /\}\{/)
    arg1 = parts[1]
    arg2 = parts[2]
    sub("\\}$", "", arg2)

    repl = label " " arg1 " <i>" arg2 "</i>"
    s = substr(s, 1, start - 1) repl substr(s, start + len)
  }
  return s
}

function expand_inline(s, raw, inner, repl, start, len) {

  gsub(/\\cf/,  "cf.",  s)
  gsub(/\\etc/, "etc.", s)
  gsub(/\\ono/, "onom.", s)

  s = replace_onearg(s, "pie", "PIE", 1)
  s = replace_onearg(s, "lat", "Lat.", 0)
  s = replace_onearg(s, "eng", "Eng.", 0)
  s = replace_onearg(s, "dnt", "Dan.", 0)
  s = replace_onearg(s, "protrk", "Proto-Turk.", 0)

  s = replace_twoarg(s, "grc", "Grc.")
  s = replace_twoarg(s, "rus", "Rus.")
  s = replace_twoarg(s, "ara", "Ar.")
  s = replace_twoarg(s, "per", "Pers.")
  s = replace_twoarg(s, "kyr", "Kyrg.")

  while (match(s, /\\par\{[^{}]*\}/)) {
    start = RSTART
    len   = RLENGTH
    raw   = substr(s, start, len)

    inner = raw
    sub(/^\\par\{/, "", inner)
    sub(/\}$/, "", inner)

    repl = "<span class=\"qualifier\">" inner "</span>"
    s = substr(s, 1, start - 1) repl substr(s, start + len)
  }

  while (match(s, /\$\{[^{}]*\}/)) {
    start = RSTART
    len   = RLENGTH
    raw   = substr(s, start, len)

    inner = raw
    sub(/^\$\{/, "", inner)
    sub(/\}$/, "", inner)

    #repl = "<i>" inner "</i>"
    repl = inner
    s = substr(s, 1, start - 1) repl substr(s, start + len)
  }

#  while (match(s, /\$[[:alnum:]_.:-]+/)) {
#    start = RSTART
#    len   = RLENGTH
#    raw   = substr(s, start, len)
#
#    inner = substr(raw, 2)
#    repl = "<i>" inner "</i>"
#    s = substr(s, 1, start - 1) repl substr(s, start + len)
#  }

  while (match(s, /\$\{[^{}]*\}/)) {
    start = RSTART
    len   = RLENGTH
    raw   = substr(s, start, len)

    inner = raw
    sub(/^\$\{/, "", inner)
    sub(/\}$/, "", inner)

    repl = "<span class=\"gloss\">" inner "</span>"
    s = substr(s, 1, start - 1) repl substr(s, start + len)
  }

  while (match(s, /\$[[:alnum:]_.:-]+/)) {
    start = RSTART
    len   = RLENGTH
    raw   = substr(s, start, len)

    inner = substr(raw, 2)
    repl = "<span class=\"gloss\">" inner "</span>"
    s = substr(s, 1, start - 1) repl substr(s, start + len)
  }

  return s
}

BEGIN {
  in_entry = 0
  in_block = 0
  current_typ = ""
}

{
  while (match($0, /@(key|ety|typ|def)\([^()]*\)/)) {
    start = RSTART
    len   = RLENGTH
    token = substr($0, start, len)

    if (token ~ /^@key\(/) {
      close_entry()
      key = arg_of(token)
      print "<article class=\"entry\">"
      print "  <h1 class=\"lemma\">" key "</h1>"
      in_entry = 1
      current_typ = ""
    }

    else if (token ~ /^@ety\(/) {
      ety = expand_inline(arg_of(token))
      print "  <p class=\"etymology\">" ety "</p>"
    }

    else if (token ~ /^@typ\(/) {
      current_typ = arg_of(token)
    }

    else if (token ~ /^@def\(/) {
      def = expand_inline(arg_of(token))
      open_sense_block()
      print "      <li><span class=\"pos\">" current_typ ".</span> " def "</li>"
    }

    $0 = substr($0, start + len)
  }
}

END {
  close_entry()
}
