{
  if (match($0, /@key\(([^)]*)\)/, m)) {
    key = m[1]

    # take everything before first comma OR semicolon
    split(key, parts, /[,;]/)
    head = parts[1]

    # trim whitespace
    sub(/^[ \t]+/, "", head)
    sub(/[ \t]+$/, "", head)

    print tolower(head) "\t" $0
  } else {
    print "\t" $0
  }
}
