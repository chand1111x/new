# new

A minimal GUI-based PDF analyzer.

## Usage

Open `/home/runner/work/new/new/index.html` in a browser, choose a PDF file, and click **Analyze PDF**.

The analyzer displays:
- file name
- file size
- PDF version
- page/object/stream counts
- encryption flag
- basic metadata (title, author, creator, producer)

## Tests

Run:

```bash
cd /home/runner/work/new/new
node --test tests/test-analyzer.test.js
```
