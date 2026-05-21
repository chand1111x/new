function decodePdfBytes(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length === 0) {
    throw new Error('A non-empty PDF byte array is required.');
  }
  return new TextDecoder('latin1').decode(bytes);
}

function readMetadata(content, key) {
  const regex = new RegExp(`/${key}\\s*\\(([^)]*)\\)`);
  const match = content.match(regex);
  return match ? match[1].trim() : 'N/A';
}

function countMatches(content, pattern) {
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

function analyzePdfBytes(bytes, fileName = 'Unknown') {
  const content = decodePdfBytes(bytes);

  const versionMatch = content.match(/%PDF-(\d\.\d)/);
  if (!versionMatch) {
    throw new Error('Selected file is not a valid PDF.');
  }

  return {
    fileName,
    fileSizeBytes: bytes.length,
    pdfVersion: versionMatch[1],
    pageCount: countMatches(content, /\/Type\s*\/Page\b/g),
    objectCount: countMatches(content, /\b\d+\s+\d+\s+obj\b/g),
    streamCount: countMatches(content, /\bstream\b/g),
    isEncrypted: /\/Encrypt\b/.test(content),
    metadata: {
      title: readMetadata(content, 'Title'),
      author: readMetadata(content, 'Author'),
      creator: readMetadata(content, 'Creator'),
      producer: readMetadata(content, 'Producer')
    }
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { analyzePdfBytes };
}

if (typeof window !== 'undefined') {
  window.PdfAnalyzer = { analyzePdfBytes };
}
