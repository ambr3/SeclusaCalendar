import { describe, it, expect } from 'vitest';
import core from './load-app.js';
const { nextAnnualDate, resolvePresetNextDate, daysToGoLabel, getEasterKey, PRESET_COUNTDOWNS, addDaysKey } = core;

describe('nextAnnualDate', () => {
  it('returns the same-year date when it is still ahead', () => {
    expect(nextAnnualDate(12, 25, '2026-09-11')).toBe('2026-12-25');
  });

  it('rolls over to the next year when passed', () => {
    expect(nextAnnualDate(1, 1, '2026-09-11')).toBe('2027-01-01');
    expect(nextAnnualDate(9, 10, '2026-09-11')).toBe('2027-09-10');
  });

  it('returns today itself when the occasion is today', () => {
    expect(nextAnnualDate(9, 11, '2026-09-11')).toBe('2026-09-11');
  });

  it('clamps 29 February to 28 in non-leap years', () => {
    expect(nextAnnualDate(2, 29, '2027-01-01')).toBe('2027-02-28');
    expect(nextAnnualDate(2, 29, '2026-09-11')).toBe('2027-02-28');
  });

  it('keeps 29 February in leap years', () => {
    expect(nextAnnualDate(2, 29, '2027-03-01')).toBe('2028-02-29');
  });

  it('handles the last day of the year', () => {
    expect(nextAnnualDate(12, 31, '2026-12-31')).toBe('2026-12-31');
    expect(nextAnnualDate(12, 31, '2027-01-01')).toBe('2027-12-31');
  });
});

describe('resolvePresetNextDate', () => {
  it('resolves fixed dates', () => {
    const christmas = PRESET_COUNTDOWNS.find((p) => p.id === 'christmas');
    const nye = PRESET_COUNTDOWNS.find((p) => p.id === 'new_years_eve');
    expect(resolvePresetNextDate(christmas, '2026-09-11')).toBe('2026-12-25');
    expect(resolvePresetNextDate(nye, '2026-12-31')).toBe('2026-12-31');
  });

  it('resolves Easter-relative dates', () => {
    const easter = PRESET_COUNTDOWNS.find((p) => p.id === 'easter');
    const goodFriday = PRESET_COUNTDOWNS.find((p) => p.id === 'good_friday');
    expect(resolvePresetNextDate(easter, '2027-01-01')).toBe(getEasterKey(2027));
    expect(resolvePresetNextDate(goodFriday, '2027-01-01')).toBe(addDaysKey(getEasterKey(2027), -2));
    expect(resolvePresetNextDate(easter, '2027-04-02')).toBe(getEasterKey(2028));
  });

  it('returns a key string or null', () => {
    for (const p of PRESET_COUNTDOWNS) {
      const r = resolvePresetNextDate(p, '2026-09-11');
      expect(r === null || /^\d{4}-\d{2}-\d{2}$/.test(r)).toBe(true);
    }
  });
});

describe('daysToGoLabel', () => {
  it('labels today, tomorrow, plural days and passed', () => {
    expect(daysToGoLabel(0)).toBe('Today');
    expect(daysToGoLabel(1)).toBe('Tomorrow');
    expect(daysToGoLabel(2)).toBe('2 days');
    expect(daysToGoLabel(365)).toBe('365 days');
    expect(daysToGoLabel(-1)).toBe('Passed');
  });
});

describe('PRESET_COUNTDOWNS', () => {
  it('has well-formed entries', () => {
    expect(PRESET_COUNTDOWNS.length).toBeGreaterThan(0);
    const ids = new Set();
    for (const p of PRESET_COUNTDOWNS) {
      expect(typeof p.id).toBe('string');
      expect(typeof p.name).toBe('string');
      expect(p.name.length).toBeGreaterThan(0);
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);
      if (p.easter == null) {
        expect(p.month).toBeGreaterThanOrEqual(1);
        expect(p.month).toBeLessThanOrEqual(12);
        expect(p.day).toBeGreaterThanOrEqual(1);
        expect(p.day).toBeLessThanOrEqual(31);
      }
    }
  });

  it('includes the familiar occasions', () => {
    const names = PRESET_COUNTDOWNS.map((p) => p.id);
    expect(names).toContain('christmas');
    expect(names).toContain('new_year');
    expect(names).toContain('easter');
    expect(names).toContain('halloween');
  });
});

describe('getEasterKey', () => {
  it('returns a well-known Easter date', () => {
    expect(getEasterKey(2026)).toBe('2026-04-05');
    expect(getEasterKey(2027)).toBe('2027-03-28');
    expect(getEasterKey(2028)).toBe('2028-04-16');
  });
});