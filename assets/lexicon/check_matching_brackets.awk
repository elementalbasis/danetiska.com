{
  for (i = 1; i <= length($0); i++) {
    c = substr($0, i, 1)

    # Opening brackets
    if (c == "(" || c == "[" || c == "{") {
      stack[++top] = c
      line[top] = NR
      col[top] = i
    }

    # Closing brackets
    else if (c == ")" || c == "]" || c == "}") {

      if (top == 0) {
        printf "Extra closing %s at line %d, col %d\n", c, NR, i
        continue
      }

      open = stack[top]

      # Check matching pair
      if ((open == "(" && c != ")") ||
          (open == "[" && c != "]") ||
          (open == "{" && c != "}")) {

        printf "Mismatch: %s opened at line %d col %d, but closed by %s at line %d col %d\n",
               open, line[top], col[top], c, NR, i
      }

      top--
    }
  }
}

END {
  if (top > 0) {
    print "Unclosed brackets:"
    for (i = top; i >= 1; i--) {
      printf "  %s opened at line %d col %d\n", stack[i], line[i], col[i]
    }
  }
}
