# Files
SRC = lexicon.txt
TMP = build
CLEAN = $(TMP)/clean.txt
SORTED = $(TMP)/sorted.txt
HTML = _lexicon.html

# Scripts
CHECK = check_matching_brackets.awk
SYMBOLS = print_symbols.awk
SORT = alphabetize.awk
TRANSFORM = transform_to_html.awk

# Default target
all: $(HTML)

# Step 1 — bracket check (FAIL HARD)
check:
	@echo "Checking brackets..."
	@awk -f $(CHECK) $(SRC)

# Step 2 — print symbols (NO FAIL)
symbols:
	@echo "Printing symbols..."
	@awk -f $(SYMBOLS) $(SRC) | sort -u

# Step 3 — clean comments and empty lines
$(CLEAN): $(SRC)
	@mkdir -p $(TMP)
	@echo "Cleaning input..."
	@grep -vE '^[[:space:]]*(%|$$)' $(SRC) > $(CLEAN)

# Step 4 — alphabetize entries
$(SORTED): $(CLEAN)
	@echo "Sorting entries..."
	@awk -f $(SORT) $(CLEAN) | sort -k1 | cut -f2- > $(SORTED)

# Step 5 — transform to HTML
$(HTML): check symbols $(SORTED)
	@echo "Transforming to HTML..."
	@awk -f $(TRANSFORM) $(SORTED) > $(HTML)

# Clean build artifacts
clean:
	rm -rf $(TMP)
