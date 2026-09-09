import { describe, it, expect } from 'vitest';
import core from './load-app.js';
const { icsEscape, icsUnescape } = core;

describe('icsEscape', () => {
  it('escapes backslashes, commas and semicolons', () => {
    expect(icsEscape('a\\b,c;d')).toBe('a\\\\b\\,c\\;d');
  });

  it('converts newlines to \\n', () => {
    expect(icsEscape('line1\nline2')).toBe('line1\\nline2');
    expect(icsEscape('line1\r\nline2')).toBe('line1\\nline2');
  });
});

describe('icsUnescape', () => {
  it('unescapes backslashes, commas and semicolons', () => {
    expect(icsUnescape('a\\\\b\\,c\\;d')).toBe('a\\b,c;d');
  });

  it('converts \\n back to newlines', () => {
    expect(icsUnescape('line1\\nline2')).toBe('line1\nline2');
  });

  it('round-trips through escape and unescape', () => {
    const s = 'Meeting, with; special\\chars\nand newline';
    expect(icsUnescape(icsEscape(s))).toBe(s);
  });
});