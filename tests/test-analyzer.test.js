const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzePdfBytes } = require('../analyzer');

function toBytes(text) {
  return new TextEncoder().encode(text);
}

test('analyzePdfBytes reads structural counts and metadata', () => {
  const fakePdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R >>
endobj
4 0 obj
<< /Type /Page /Parent 2 0 R >>
endobj
5 0 obj
<< /Title (Sample Report) /Author (QA Team) /Creator (Unit Test) /Producer (Node) >>
stream
BT
ET
endstream
endobj
`;

  const result = analyzePdfBytes(toBytes(fakePdf), 'sample.pdf');

  assert.equal(result.fileName, 'sample.pdf');
  assert.equal(result.pdfVersion, '1.4');
  assert.equal(result.pageCount, 2);
  assert.equal(result.objectCount, 5);
  assert.equal(result.streamCount, 1);
  assert.equal(result.metadata.title, 'Sample Report');
  assert.equal(result.metadata.author, 'QA Team');
  assert.equal(result.metadata.creator, 'Unit Test');
  assert.equal(result.metadata.producer, 'Node');
});

test('analyzePdfBytes rejects invalid PDF input', () => {
  assert.throws(() => analyzePdfBytes(new Uint8Array([1, 2, 3])), /valid PDF/i);
});
