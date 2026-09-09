import { describe, it, expect } from 'vitest';
import core from './load-app.js';
const {
  dateKey,
  parseDateKey,
  addDaysKey,
  dayOffset,
  timeToMinutes,
  formatTime,
  formatTimeRange,
} = core;

describe('dateKey', () => {
  it('pads month and day to two digits', () => {
    expect(dateKey(2024, 0, 1)).toBe('2024-01-01');
    expect(dateKey(2024, 11, 31)).toBe('2024-12-31');
  });
});

describe('parseDateKey', () => {
  it('parses a date key into a Date', () => {
    const d = parseDateKey('2024-03-15');
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(2);
    expect(d.getDate()).toBe(15);
  });
});

describe('date arithmetic', () => {
  it('addDaysKey adds days across month boundaries', () => {
    expect(addDaysKey('2024-01-31', 1)).toBe('2024-02-01');
    expect(addDaysKey('2024-02-28', 1)).toBe('2024-02-29');
  });

  it('dayOffset computes day difference', () => {
    expect(dayOffset('2024-01-01', '2024-01-02')).toBe(1);
    expect(dayOffset('2024-03-01', '2024-02-01')).toBe(-29);
  });
});

describe('timeToMinutes', () => {
  it('converts HH:MM to minutes', () => {
    expect(timeToMinutes('00:00')).toBe(0);
    expect(timeToMinutes('09:30')).toBe(570);
    expect(timeToMinutes('23:59')).toBe(1439);
    expect(timeToMinutes('')).toBe(0);
  });
});

describe('formatTime', () => {
  it('formats 24h time to 12h AM/PM', () => {
    expect(formatTime('09:05')).toBe('9:05 AM');
    expect(formatTime('13:30')).toBe('1:30 PM');
    expect(formatTime('00:00')).toBe('12:00 AM');
    expect(formatTime('12:00')).toBe('12:00 PM');
    expect(formatTime('')).toBe('');
  });
});

describe('formatTimeRange', () => {
  it('returns "All day" when no start', () => {
    expect(formatTimeRange('', '')).toBe('All day');
  });
  it('includes end time when present', () => {
    expect(formatTimeRange('09:00', '10:30')).toBe('9:00 AM \u2013 10:30 AM');
  });
});