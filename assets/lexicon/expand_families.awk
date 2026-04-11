#!/usr/bin/awk -f

function trim(s) {
    sub(/^[ \t\r\n]+/, "", s)
    sub(/[ \t\r\n]+$/, "", s)
    return s
}

function parse_item(item,    lb, rb) {
    item = trim(item)
    parsed_lemma = item
    parsed_sense = ""

    lb = index(item, "[")
    rb = index(item, "]")

    if (lb > 0 && rb > lb) {
        parsed_lemma = trim(substr(item, 1, lb - 1))
        parsed_sense = trim(substr(item, lb + 1, rb - lb - 1))
    }
}

function extract_syn_inside(line,    s) {
    s = trim(line)
    sub(/^@syn\(/, "", s)
    sub(/\)$/, "", s)
    return s
}

function parse_syn_line(line, arr,    inside, n, i, parts) {
    delete arr
    line = trim(line)

    if (line !~ /^@syn\(/)
        return 0

    inside = extract_syn_inside(line)
    n = split(inside, parts, ",")

    for (i = 1; i <= n; i++)
        arr[i] = trim(parts[i])

    return n
}

function build_selfless_group(items, n, skip_i,    i, out, first) {
    out = ""
    first = 1

    for (i = 1; i <= n; i++) {
        if (i == skip_i)
            continue

        parse_item(items[i])

        if (!first)
            out = out ", "
        out = out parsed_lemma
        first = 0
    }

    return out
}

function get_head_value(line, macro,    s, p1, p2, pat) {
    pat = "@" macro "("
    p1 = index(line, pat)
    if (p1 == 0)
        return ""

    s = substr(line, p1 + length(pat))
    p2 = index(s, ")")
    if (p2 == 0)
        return ""

    return substr(s, 1, p2 - 1)
}

function get_lemma(line,    x) {
    x = get_head_value(line, "lemma")
    if (x != "")
        return x
    x = get_head_value(line, "key")
    return x
}

function append_pending(lemma, sense, syntext) {
    pending_count++
    pending_lemma[pending_count] = lemma
    pending_sense[pending_count] = sense
    pending_syn[pending_count] = syntext
}

function collect_synonyms_from_line(line,    n, i, syn_items, selfless, host_lemma, host_sense) {
    n = parse_syn_line(line, syn_items)
    if (n < 2)
        return

    for (i = 1; i <= n; i++) {
        parse_item(syn_items[i])
        host_lemma = parsed_lemma
        host_sense = parsed_sense

        selfless = build_selfless_group(syn_items, n, i)
        if (selfless != "")
            append_pending(host_lemma, host_sense, "@syn(" selfless ")")
    }
}

function find_first_expr_pos(line) {
    return index(line, "@expr")
}

function append_before_expr_or_end(line, syntext,    exprpos, prefix, suffix, spacer_before) {
    exprpos = find_first_expr_pos(line)

    if (exprpos == 0) {
        if (line == "")
            return syntext
        if (substr(line, length(line), 1) == " ")
            return line syntext
        return line " " syntext
    }

    prefix = substr(line, 1, exprpos - 1)
    suffix = substr(line, exprpos)

    if (prefix == "" || substr(prefix, length(prefix), 1) == " ")
        spacer_before = ""
    else
        spacer_before = " "

    return prefix spacer_before syntext " " suffix
}

function find_anchor_pos(line, sense) {
    if (sense == "")
        return 0
    return index(line, "@def[" sense "](")
}

function first_positive(a, b) {
    if (a > 0 && b > 0)
        return (a < b ? a : b)
    if (a > 0)
        return a
    if (b > 0)
        return b
    return 0
}

function insert_before_next_def_or_expr(line, sense, syntext,
    anchor, rest, nextdef1, nextdef2, nextdef, exprpos, nextrel,
    inspos, prefix, suffix, spacer_before) {

    anchor = find_anchor_pos(line, sense)

    if (anchor == 0)
        return line

    rest = substr(line, anchor + 1)

    nextdef1 = index(rest, "@def[")
    nextdef2 = index(rest, "@def(")
    nextdef = first_positive(nextdef1, nextdef2)

    exprpos = find_first_expr_pos(line)
    if (exprpos > 0 && exprpos <= anchor)
        exprpos = 0

    if (exprpos > 0) {
        nextrel = exprpos - anchor
        if (nextdef > 0 && nextdef < nextrel)
            nextrel = nextdef
    } else {
        nextrel = nextdef
    }

    if (nextrel == 0)
        return append_before_expr_or_end(line, syntext)

    inspos = anchor + nextrel

    prefix = substr(line, 1, inspos - 1)
    suffix = substr(line, inspos)

    if (prefix == "" || substr(prefix, length(prefix), 1) == " ")
        spacer_before = ""
    else
        spacer_before = " "

    return prefix spacer_before syntext " " suffix
}

function apply_pending_to_line(line, lemma,    i, out) {
    out = line

    for (i = 1; i <= pending_count; i++) {
        if (pending_lemma[i] != lemma)
            continue

        if (pending_sense[i] == "") {
            out = append_before_expr_or_end(out, pending_syn[i])
        } else {
            out = insert_before_next_def_or_expr(out, pending_sense[i], pending_syn[i])
        }
    }

    return out
}

{
    line = $0
    trimmed = trim(line)

    if (trimmed ~ /^@syn\(/) {
        collect_synonyms_from_line(trimmed)
    } else {
        lex_count++
        lex_line[lex_count] = line
    }
}

END {
    for (i = 1; i <= lex_count; i++) {
        lemma = get_lemma(lex_line[i])

        if (lemma == "")
            print lex_line[i]
        else
            print apply_pending_to_line(lex_line[i], lemma)
    }
}
