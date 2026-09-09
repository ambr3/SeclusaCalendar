import { describe, it, expect } from 'vitest';
import core from './load-app.js';
const { dateKey, precomputeAllHolidays, precomputeImportantDates, WORLD_HOLIDAYS_DATA, IMPORTANT_DATES_META } = core;

describe('precomputeAllHolidays', () => {
  const holidays = precomputeAllHolidays(WORLD_HOLIDAYS_DATA);

  it('computes holidays for the data year range', () => {
    const year = new Date().getFullYear();
    expect(Object.keys(holidays.uk)).toContain(dateKey(year, 0, 1));
    expect(Object.keys(holidays.us)).toContain(dateKey(year, 6, 4));
  });

  it('includes computed UK bank holidays', () => {
    const year = new Date().getFullYear();
    expect(Object.values(holidays.uk).some((v) => v === 'Good Friday')).toBe(true);
  });

  it('defaults to at least one fixed holiday for all countries', () => {
    for (const [code, data] of Object.entries(holidays)) {
      expect(data).toBeDefined();
      expect(Object.keys(data).length).toBeGreaterThan(0);
    }
  });
});

describe('precomputeImportantDates', () => {
  const dates = precomputeImportantDates(IMPORTANT_DATES_META);
  const year = new Date().getFullYear();

  it('computes fixed important dates', () => {
    expect(dates.valentines[dateKey(year, 1, 14)]).toBe("Valentine's Day");
    expect(dates.halloween[dateKey(year, 9, 31)]).toBe('Halloween');
  });

  it("computes US Mother's Day (second Sunday of May)", () => {
    const keys = Object.keys(dates.mothers_day).filter((k) => k.startsWith(String(year)));
    expect(keys.length).toBe(1);
    const d = new Date(Date.parse(keys[0]));
    expect(d.getDay()).toBe(0);
    expect(d.getDate()).toBeGreaterThanOrEqual(8);
    expect(d.getDate()).toBeLessThanOrEqual(14);
  });

  it("computes US Father's Day (third Sunday of June)", () => {
    const keys = Object.keys(dates.fathers_day).filter((k) => k.startsWith(String(year)));
    expect(keys.length).toBe(1);
    const d = new Date(Date.parse(keys[0]));
    expect(d.getDay()).toBe(0);
    expect(d.getDate()).toBeGreaterThanOrEqual(15);
    expect(d.getDate()).toBeLessThanOrEqual(21);
  });
});