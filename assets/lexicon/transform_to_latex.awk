#!/usr/bin/awk -f

function is_alpha(c) {
    return c ~ /[A-Za-z_]/
}

function is_alnum(c) {
    return c ~ /[A-Za-z0-9_]/
}

function is_word_char(c) {
    return c ~ /[A-Za-z0-9_-]/
}

function prefix_backslash_tags(s,    out, i, c, j, name) {
    out = ""
    i = 1

    while (i <= length(s)) {
        c = substr(s, i, 1)

        if (c == "\\" && i < length(s) && is_alpha(substr(s, i + 1, 1))) {
            j = i + 1
            name = ""

            while (j <= length(s) && is_alnum(substr(s, j, 1))) {
                name = name substr(s, j, 1)
                j++
            }

            out = out "\\my" name
            i = j
            continue
        }

        out = out c
        i++
    }

    return out
}

function convert_glosses(s,    out, i, c, j, txt) {
    out = ""
    i = 1

    while (i <= length(s)) {
        c = substr(s, i, 1)

        # $word or ${multi word}
        if (c == "$") {
            if (substr(s, i + 1, 1) == "{") {
                j = i + 2
                txt = ""

                while (j <= length(s) && substr(s, j, 1) != "}") {
                    txt = txt substr(s, j, 1)
                    j++
                }

                if (j > length(s)) {
                    out = out c
                    i++
                    continue
                }

                out = out "\\mygloss{" txt "}"
                i = j + 1
                continue
            } else {
                j = i + 1
                txt = ""

                while (j <= length(s) && is_word_char(substr(s, j, 1))) {
                    txt = txt substr(s, j, 1)
                    j++
                }

                if (txt == "") {
                    out = out c
                    i++
                    continue
                }

                out = out "\\mygloss{" txt "}"
                i = j
                continue
            }
        }

        # &word or &{multi word}
        if (c == "&") {
            if (substr(s, i + 1, 1) == "{") {
                j = i + 2
                txt = ""

                while (j <= length(s) && substr(s, j, 1) != "}") {
                    txt = txt substr(s, j, 1)
                    j++
                }

                if (j > length(s)) {
                    out = out c
                    i++
                    continue
                }

                out = out "\\mysilentgloss{" txt "}"
                i = j + 1
                continue
            } else {
                j = i + 1
                txt = ""

                while (j <= length(s) && is_word_char(substr(s, j, 1))) {
                    txt = txt substr(s, j, 1)
                    j++
                }

                if (txt == "") {
                    out = out c
                    i++
                    continue
                }

                out = out "\\mysilentgloss{" txt "}"
                i = j
                continue
            }
        }

        out = out c
        i++
    }

    return out
}

function convert_at_macros(s,    out, i, c, j, start, name, opt, arg, depth) {
    out = ""
    i = 1

    while (i <= length(s)) {
        c = substr(s, i, 1)

        if (c == "@" && i < length(s) && is_alpha(substr(s, i + 1, 1))) {
            start = i
            j = i + 1
            name = ""

            while (j <= length(s) && is_alnum(substr(s, j, 1))) {
                name = name substr(s, j, 1)
                j++
            }

            if (name == "") {
                out = out c
                i++
                continue
            }

            opt = ""
            if (substr(s, j, 1) == "[") {
                opt = "["
                j++

                while (j <= length(s) && substr(s, j, 1) != "]") {
                    opt = opt substr(s, j, 1)
                    j++
                }

                if (j > length(s)) {
                    out = out c
                    i++
                    continue
                }

                opt = opt "]"
                j++
            }

            if (substr(s, j, 1) != "(") {
                out = out c
                i++
                continue
            }

            j++
            depth = 1
            arg = ""

            while (j <= length(s) && depth > 0) {
                c = substr(s, j, 1)

                if (c == "(") {
                    depth++
                    arg = arg c
                } else if (c == ")") {
                    depth--
                    if (depth > 0)
                        arg = arg c
                } else {
                    arg = arg c
                }

                j++
            }

            if (depth != 0) {
                out = out substr(s, start, 1)
                i = start + 1
                continue
            }

            out = out "\\my" name opt "{" arg "}"
            i = j
            continue
        }

        out = out c
        i++
    }

    return out
}

{
    line = $0

    # Order matters:
    # 1. Prefix existing \tags
    # 2. Convert @macros
    # 3. Convert gloss markers that may appear inside macro arguments
    line = prefix_backslash_tags(line)
    line = convert_at_macros(line)
    line = convert_glosses(line)

    print line
}
