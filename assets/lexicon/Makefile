# Files
RAW = raw
SRC = lexicon.txt
TMP = build
PREPENDED = $(TMP)/prepended.txt
EXPR_ATTACHED = $(TMP)/expr_attached.txt
MACROS_DELETED = $(TMP)/macros_deleted.txt
FAMILIES_EXPANDED = $(TMP)/families_expanded.txt
CLEAN = $(TMP)/clean.txt
SORTED = $(TMP)/sorted.txt
HTML = lexicon.html

# Scripts
CHECK = check_matching_brackets.awk
SYMBOLS = print_symbols.awk
TYPES = print_types.awk
PREPEND_LEMMA = prepend_lemma.awk
SORT = alphabetize.awk
ATTACH_EXPR = attach_expr.awk
EXPAND_FAMILIES = expand_families.awk
DELETE_MACROS = delete_macros.awk
TRANSFORM = transform_to_html.awk

# Default target
all: $(HTML)

# Step 1 — bracket check (FAIL HARD)
check:
	@cat $(RAW)/* > $(SRC)
	@echo "Checking brackets..."
	@awk -f $(CHECK) $(SRC)

# Step 2 — print symbols and types (NO FAIL)
symbols:
	@echo "Printing symbols..."
	@awk -f $(SYMBOLS) $(SRC) | sort -u
	@echo "Printing types..."
	@awk -f $(TYPES) $(SRC) | sort -u

# Step 3 — clean comments and empty lines
$(CLEAN): $(SRC)
	@mkdir -p $(TMP)
	@echo "Cleaning input..."
	@grep -vE '^[[:space:]]*(%|$$)' $(SRC) > $(CLEAN)

# Step 4 — alphabetize entries
$(SORTED): $(CLEAN)
	@echo "Sorting entries..."
	@awk -f $(PREPEND_LEMMA) $(CLEAN) > $(PREPENDED)
	@sort $(PREPENDED) > $(CLEAN)

# Step 5 — transform to HTML
$(HTML): check symbols $(SORTED)
	@echo "Transforming to HTML..."
	@awk -f $(ATTACH_EXPR) $(CLEAN) > $(EXPR_ATTACHED)
	@awk -f $(EXPAND_FAMILIES) $(EXPR_ATTACHED) > $(FAMILIES_EXPANDED)
	@awk -f $(DELETE_MACROS) $(FAMILIES_EXPANDED) > $(MACROS_DELETED)
	@awk -f $(TRANSFORM) $(MACROS_DELETED) > $(HTML)

# Clean build artifacts
clean:
	rm -rf $(TMP) $(SRC)
