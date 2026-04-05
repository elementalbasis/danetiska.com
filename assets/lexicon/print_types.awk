{
  while (match($0, /@typ\(([^)]*)\)/, m)) {
    typ = m[1]
    if (!(typ in seen)) {
      print typ
      seen[typ] = 1
    }
    $0 = substr($0, RSTART + RLENGTH)
  }
}
