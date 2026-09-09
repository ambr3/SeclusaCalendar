import { describe, it, expect } from 'vitest';
import core from './load-app.js';

const { isRecurringOnDate, parseDateKey } = core;
const d = (key) => parseDateKey(key);

describe('isRecurringOnDate', () => {
  const start = d('2024-01-15');

  it('returns false before the start date', () => {
    expect(isRecurringOnDate(start, d('2024-01-14'), { frequency: 'daily', interval: 1 })).toBe(false);
  });

  it('returns false on the start date (already stored separately)', () => {
    expect(isRecurringOnDate(start, d('2024-01-15'), { frequency: 'daily', interval: 1 })).toBe(false);
  });

  describe('daily', () => {
    it('matches every day with interval 1', () => {
      expect(isRecurringOnDate(start, d('2024-01-16'), { frequency: 'daily', interval: 1 })).toBe(true);
      expect(isRecurringOnDate(start, d('2024-01-17'), { frequency: 'daily', interval: 1 })).toBe(true);
    });

    it('matches on interval boundaries', () => {
      expect(isRecurringOnDate(start, d('2024-01-17'), { frequency: 'daily', interval: 2 })).toBe(true);
      expect(isRecurringOnDate(start, d('2024-01-18'), { frequency: 'daily', interval: 2 })).toBe(false);
    });
  });

  describe('weekly', () => {
    it('matches every week on the same weekday', () => {
      expect(isRecurringOnDate(start, d('2024-01-22'), { frequency: 'weekly', interval: 1 })).toBe(true);
      expect(isRecurringOnDate(start, d('2024-01-23'), { frequency: 'weekly', interval: 1 })).toBe(false);
    });

    it('respects interval', () => {
      expect(isRecurringOnDate(start, d('2024-01-29'), { frequency: 'weekly', interval: 2 })).toBe(true);
      expect(isRecurringOnDate(start, d('2024-01-22'), { frequency: 'weekly', interval: 2 })).toBe(false);
    });
  });

  describe('monthly', () => {
    it('matches the same day-of-month each month', () => {
      expect(isRecurringOnDate(start, d('2024-02-15'), { frequency: 'monthly', interval: 1 })).toBe(true);
      expect(isRecurringOnDate(start, d('2024-03-15'), { frequency: 'monthly', interval: 1 })).toBe(true);
    });

    it('clamps to the last day of the month when start day exceeds it', () => {
      const jan31 = d('2024-01-31');
      expect(isRecurringOnDate(jan31, d('2024-02-29'), { frequency: 'monthly', interval: 1 })).toBe(true);
      expect(isRecurringOnDate(jan31, d('2024-02-28'), { frequency: 'monthly', interval: 1 })).toBe(false);
      expect(isRecurringOnDate(jan31, d('2024-03-31'), { frequency: 'monthly', interval: 1 })).toBe(true);
      expect(isRecurringOnDate(jan31, d('2024-04-30'), { frequency: 'monthly', interval: 1 })).toBe(true);
    });

    it('matches the last day of shorter months (Feb) for 30th-start events', () => {
      const jul30 = d('2024-07-30');
      expect(isRecurringOnDate(jul30, d('2024-08-30'), { frequency: 'monthly', interval: 1 })).toBe(true);
      expect(isRecurringOnDate(jul30, d('2025-02-28'), { frequency: 'monthly', interval: 1 })).toBe(true);
      expect(isRecurringOnDate(jul30, d('2025-03-30'), { frequency: 'monthly', interval: 1 })).toBe(true);
    });

    it('respects interval', () => {
      expect(isRecurringOnDate(start, d('2024-03-15'), { frequency: 'monthly', interval: 2 })).toBe(true);
      expect(isRecurringOnDate(start, d('2024-02-15'), { frequency: 'monthly', interval: 2 })).toBe(false);
    });
  });

  describe('yearly', () => {
    it('matches the same month and day each year', () => {
      expect(isRecurringOnDate(start, d('2025-01-15'), { frequency: 'yearly', interval: 1 })).toBe(true);
      expect(isRecurringOnDate(start, d('2026-01-15'), { frequency: 'yearly', interval: 1 })).toBe(true);
      expect(isRecurringOnDate(start, d('2025-02-15'), { frequency: 'yearly', interval: 1 })).toBe(false);
    });
  });

  describe('endDate', () => {
    it('stops recurring after the end date', () => {
      const rec = { frequency: 'daily', interval: 1, endDate: '2024-01-20' };
      expect(isRecurringOnDate(start, d('2024-01-19'), rec)).toBe(true);
      expect(isRecurringOnDate(start, d('2024-01-21'), rec)).toBe(false);
    });
  });

  it('defaults interval to 1 when missing', () => {
    expect(isRecurringOnDate(start, d('2024-01-16'), { frequency: 'daily' })).toBe(true);
  });
});