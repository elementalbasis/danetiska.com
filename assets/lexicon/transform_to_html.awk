function open_sense_block() {
  if (!in_sense_block) {
    print "  <section class=\"sense-block\">"
    print "    <ol>"
    in_sense_block = 1
  }
}

function close_sense_block() {
  if (in_sense_block) {
    print "    </ol>"
    print "  </section>"
    in_sense_block = 0
  }
}

function open_expr_block(expr_text) {
  print "  <section class=\"expr-block\">"
  print "    <h3 class=\"expr-head\">" expand_inline(expr_text) "</h3>"
  print "    <ol>"
  in_expr_block = 1
}

function close_expr_block() {
  if (in_expr_block) {
    print "    </ol>"
    print "  </section>"
    in_expr_block = 0
  }
}

function close_entry() {
  close_sense_block()
  close_expr_block()
  if (in_entry) {
    if (in_sense_block) {
      print "    </ol>"
      print "  </section>"
      in_sense_block = 0
    }
    print "</article>"
    in_entry = 0
  }
}


function arg_of(token, s) {
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

function ensure_final_period(s) {
  sub(/[[:space:]]+$/, "", s)
  if (s !~ /[.!?:;]$/) {
    s = s "."
  }
  return s
}

function fix_silent_spacing(s) {
  gsub(/[ \t\r\n]+<span class="silent-gloss"/, "<span class=\"silent-gloss\"", s)
  gsub(/<\/span>[ \t\r\n]+/, "</span>", s)
  return s
}

function expand_inline(s, raw, inner, repl, start, len) {

  # Expand simple macros

  gsub(/\\cf/,  "cf.",  s)
  gsub(/\\etc/, "etc.", s)
  gsub(/\\ono/, "Onomatopoeic", s)
  gsub(/\\chem\{/, "\\par{chemical element with atomic number ", s)
  gsub(/\\unknown/, "Unknown", s)
  #gsub(/\\field/, "\\par", s)
  #gsub(/\\reg/, "\\par", s)

  s = replace_onearg(s, "pie", "Proto-Indo-European", 1)
  s = replace_onearg(s, "lat", "Latin", 0)
  s = replace_onearg(s, "eng", "English", 0)
  s = replace_onearg(s, "dnt", "Danetian", 0)
  s = replace_onearg(s, "protrk", "Proto-Turkic", 0)
  s = replace_onearg(s, "protung", "Proto-Tungusic", 0)
  s = replace_onearg(s, "dan", "Danish", 0)
  s = replace_onearg(s, "fra", "French", 0)
  s = replace_onearg(s, "ger", "German", 0)
  s = replace_onearg(s, "ita", "Italian", 0)
  s = replace_onearg(s, "cat", "Catalan")

  s = replace_twoarg(s, "grc", "Ancient Greek")
  s = replace_twoarg(s, "rus", "Russian")
  s = replace_twoarg(s, "ara", "Arabic")
  s = replace_twoarg(s, "per", "Persian")
  s = replace_twoarg(s, "kyr", "Kyrgyz")
  s = replace_twoarg(s, "bg", "Bulgarian")



  # Expand macros like \par{}, \reg{}, \field{}

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

  while (match(s, /\\field\{[^{}]*\}/)) {
    start = RSTART
    len   = RLENGTH
    raw   = substr(s, start, len)

    inner = raw
    sub(/^\\field\{/, "", inner)
    sub(/\}$/, "", inner)
    inner = ensure_final_period(inner)

    repl = "<span class=\"field-of-usage\">" inner "</span>"
    s = substr(s, 1, start - 1) repl substr(s, start + len)
  }

  while (match(s, /\\reg\{[^{}]*\}/)) {
    start = RSTART
    len   = RLENGTH
    raw   = substr(s, start, len)

    inner = raw
    sub(/^\\reg\{/, "", inner)
    sub(/\}$/, "", inner)
    inner = ensure_final_period(inner)

    repl = "<span class=\"linguistic-register\">" inner "</span>"
    s = substr(s, 1, start - 1) repl substr(s, start + len)
  }



  # Handle tags like $this or ${like this}

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



  # Handle silent tags like &this or &{like this}

  while (match(s, /&[[:alnum:]_.:-]+/)) {
    start = RSTART
    len   = RLENGTH
    raw   = substr(s, start, len)

    inner = substr(raw, 2)
    repl = "<span class=\"silent-gloss\">" inner "</span>"
    s = substr(s, 1, start - 1) repl substr(s, start + len)
  }

  while (match(s, /&\{[^{}]*\}/)) {
    start = RSTART
    len   = RLENGTH
    raw   = substr(s, start, len)

    inner = raw
    sub(/^&\{/, "", inner)
    sub(/\}$/, "", inner)

    repl = "<span class=\"silent-gloss>" inner "</span>"
    s = substr(s, 1, start - 1) repl substr(s, start + len)
  }

  s = fix_silent_spacing(s)
  return s
}

function trim(s) {
  sub(/^[ \t\r\n]+/, "", s)
  sub(/[ \t\r\n]+$/, "", s)
  return s
}

function render_expression(i,    out, lines, n, k) {
  out = "    <li><span class=\"expr\">" expr_text[i] "</span>"

  n = split(expr_defs[i], lines, /\n/)
  if (n > 0) {
    out = out " — " lines[1]
    for (k = 2; k <= n; k++) {
      out = out "; " lines[k]
    }
  }

  out = out "</li>\n"
  return out
}

function lemma_head_of(key,    parts, s) {
  split(key, parts, /[;,]/)
  s = parts[1]
  return trim(s)
}

BEGIN {
  in_entry = 0
  in_sense_block = 0
  in_expr_block = 0
  current_typ = ""
}

# Ignore any lines that begin with @expr
#/^[[:space:]]*@expr\(/ {
#  next
#}

{
  while (match($0, /@(key|ety|typ|def|see|expr)\([^()]*\)/)) {
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
      ety = ensure_final_period(ety)
      print "  <p class=\"etymology\">" ety "</p>"
    }

    else if (token ~ /^@typ\(/) {
      current_typ = arg_of(token)
    }

    else if (token ~ /^@def\(/) {
      def = expand_inline(arg_of(token))
      if (!in_sense_block && !in_expr_block) {
        open_sense_block()
      }
      print "      <li><span class=\"pos\">" current_typ ".</span> " def "</li>"
    }

    else if (token ~ /^@see\(/) {
      ref = arg_of(token)
      print "&rarr; <span class=\"inline-lemma\"><a href=\"/dictionary?q=" ref "&mode=lemma-exact\">" ref "</a></span>"
    }

    else if (token ~ /^@expr\(/) {
      close_sense_block()
      close_expr_block()

      current_typ = "phr"
      open_expr_block(arg_of(token))
    }

    $0 = substr($0, start + len)
  }
}

END {
  close_entry()
}
