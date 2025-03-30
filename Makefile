PANDOC = pandoc
TEMPLATE = templates/base.html
CONTENT_DIR = content
OUTPUT_DIR = docs
ASSETS = css fonts scripts calendar assets

MD_FILES := $(shell find $(CONTENT_DIR) -type f -name '*.md')
HTML_FILES := $(patsubst $(CONTENT_DIR)/%.md,$(OUTPUT_DIR)/%.html,$(MD_FILES))

all: assets $(HTML_FILES)

$(OUTPUT_DIR)/%.html: $(CONTENT_DIR)/%.md ${TEMPLATE}
	@mkdir -p $(dir $@)
	$(PANDOC) $< --template=$(TEMPLATE) -o $@
	@echo "✔ $< → $@"

assets:
	@echo "Copying static assets..."
	@for item in $(ASSETS); do \
		if [ -e $$item ]; then \
			rm -rf ${OUTPUT_DIR}/$$item; \
			mkdir -p $(OUTPUT_DIR)/$$(dirname $$item); \
			cp -r $$item $(OUTPUT_DIR)/$$item; \
		fi \
	done

clean:
	#find ${OUTPUT_DIR} -type f -name '*.html' -delete
	rm -r ${OUTPUT_DIR}

.PHONY: all clean assets
