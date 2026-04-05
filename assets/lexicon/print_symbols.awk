{
  while (match($0, /[@\\][a-zA-Z]+/)) {
    print substr($0, RSTART, RLENGTH)
    $0 = substr($0, RSTART + RLENGTH)
  }
}
