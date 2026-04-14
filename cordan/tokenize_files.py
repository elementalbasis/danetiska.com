#!/usr/bin/env python3
import glob
import re

def read_document(filename):
    with open(filename, encoding="utf-8") as f:
        return f.read()

def split_sentences(text):
    text = text.replace("\r\n", "\n").replace("\r", "\n").strip()
    # split on . ! ? followed by whitespace
    return [s for s in re.split(r'(?<=[.!?])\s+', text) if s]

def tokenize(sentence):
    # words (with internal apostrophes) OR punctuation
    return re.findall(r"\w+(?:['’-]\w+)*|[^\s]", sentence)

for filename in glob.glob("files-tmp/*.txt"):
    new_filename = filename[:-4] + ".tok"

    text = read_document(filename)
    sentences = split_sentences(text)

    with open(new_filename, "w", encoding="utf-8") as f:
        for sentence in sentences:
            tokens = tokenize(sentence)
            for tok in tokens:
                f.write(tok + "\n")
            f.write("\n")
