const assert = require('assert');

require('../js/app.js');

const core = globalThis.__SECLUSA_CORE__;
const { dateKey, parseDateKey, addDaysKey, dayOffset } = core;

const HOLIDAYS = core.precomputeAllHolidays(core.WORLD_HOLIDAYS_DATA);

function holidaysFor(country, year) {
  return Object.entries(HOLIDAYS[country] || {})
    .filter(([k]) => k.startsWith(String(year)))
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([k, v]) => `${k}@${v}`);
}

function clockChanges(country, year) {
  return holidaysFor(country, year)
    .filter((e) => e.includes('Clocks'))
    .map((e) => e.split('@')[0]);
}

const UK_2026 = holidaysFor('uk', 2026);
assert.ok(
  UK_2026.includes('2026-11-05@Bonfire Night'),
  'UK should include Bonfire Night on 5 Nov 2026',
);
assert.deepStrictEqual(clockChanges('uk', 2026), ['2026-03-29', '2026-10-25'], 'UK/EU DST 2026');
assert.deepStrictEqual(clockChanges('uk', 2027), ['2027-03-28', '2027-10-31'], 'UK/EU DST 2027');
assert.deepStrictEqual(clockChanges('us', 2026), ['2026-03-08', '2026-11-01'], 'US DST 2026');
assert.deepStrictEqual(clockChanges('ca', 2026), ['2026-03-08', '2026-11-01'], 'CA DST 2026');
assert.deepStrictEqual(clockChanges('nz', 2026), ['2026-04-05', '2026-09-27'], 'NZ DST 2026');
assert.deepStrictEqual(clockChanges('mx', 2026), [], 'Mexico abolished DST');
assert.deepStrictEqual(clockChanges('au', 2026), [], 'Australia skips DST (state dependent)');

for (const code of Object.keys(core.WORLD_HOLIDAYS_DATA)) {
  assert.ok(HOLIDAYS[code], `holiday table missing for ${code}`);
}
Object.values(HOLIDAYS).forEach((table) => {
  Object.keys(table).forEach((k) => assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(k), `bad holiday key ${k}`));
});

const IN_2025 = holidaysFor('in_', 2025);
assert.deepStrictEqual(
  IN_2025.filter((e) => e.includes('Republic')),
  ['2025-01-26@Republic Day'],
  'India must not double up Republic Day',
);

const IMPORTANT = core.precomputeImportantDates(core.IMPORTANT_DATES_META);
assert.ok(IMPORTANT.mothers_day['2026-05-10'], 'Mother\'s Day 2026 should be 10 May');
assert.ok(IMPORTANT.fathers_day['2026-06-21'], 'Father\'s Day 2026 should be 21 Jun');
assert.ok(IMPORTANT.halloween['2026-10-31'], 'Halloween 2026 present');

const clean = core.sanitizeEvent({
  id: 'id\u0000\r\n<',
  title: 'x'.repeat(500),
  time: '99:99',
  color: 'red',
  reminder: 0,
  desc: 'd'.repeat(5000),
});
assert.strictEqual(clean.time, null, 'invalid time rejected');
assert.strictEqual(clean.color, '#6cb5e6', 'invalid color falls back');
assert.strictEqual(clean.reminder, 0, 'reminder 0 preserved (not clobbered to null)');
assert.strictEqual(clean.title.length, 300, 'title capped at 300');
assert.strictEqual(clean.id.includes('\r'), false, 'CR stripped from id');
assert.strictEqual(clean.id.includes('\n'), false, 'LF stripped from id');

const start = parseDateKey('2026-01-01');
const R = (frequency, interval = 1, endDate = null) => ({ frequency, interval, endDate });
assert.strictEqual(core.isRecurringOnDate(start, parseDateKey('2026-01-05'), R('daily')), true);
assert.strictEqual(core.isRecurringOnDate(start, parseDateKey('2026-01-07'), R('daily', 2)), true);
assert.strictEqual(core.isRecurringOnDate(start, parseDateKey('2026-01-15'), R('weekly', 2)), true);
assert.strictEqual(core.isRecurringOnDate(parseDateKey('2026-01-31'), parseDateKey('2026-04-30'), R('monthly')), true);
assert.strictEqual(core.isRecurringOnDate(parseDateKey('2026-02-14'), parseDateKey('2027-02-14'), R('yearly')), true);
assert.strictEqual(core.isRecurringOnDate(start, parseDateKey('2026-01-20'), R('daily', 1, '2026-01-10')), false);

assert.strictEqual(core.icsUnescape(core.icsEscape('a;b,c\\d\nline2')), 'a;b,c\\d\nline2', 'ics escape round trip');

assert.strictEqual(core.nextAnnualDate(2, 29, '2027-01-01'), '2027-02-28', 'Feb 29 clamps in non-leap year');
assert.strictEqual(core.nextAnnualDate(12, 25, '2026-09-20'), '2026-12-25', 'next Christmas');
assert.strictEqual(addDaysKey('2026-12-31', 1), '2027-01-01', 'addDaysKey across year');
assert.strictEqual(dayOffset('2026-09-20', '2026-09-30'), 10, 'dayOffset');

assert.ok(core.daysToGoLabel(0) === 'Today', 'daysToGoLabel today');
assert.ok(core.daysToGoLabel(5) === '5 days', 'daysToGoLabel countdown');

const { PRESET_COUNTDOWNS } = core;
assert.ok(PRESET_COUNTDOWNS.length >= 7, 'preset countdowns present');
PRESET_COUNTDOWNS.forEach((p) => {
  const next = core.resolvePresetNextDate(p, '2026-09-20');
  assert.ok(next && next >= '2026-09-20', `preset ${p.name} resolves forward`);
});

const exportJson = JSON.parse(core.jsonExportContent({
  events: { '2026-09-20': [{ id: 'a', title: 'Test', color: '#6cb5e6' }] },
  selectedCountries: ['uk'],
  enabledImportantDates: ['halloween'],
  weekStart: 0,
  lang: 'en',
}));
assert.strictEqual(exportJson.events['2026-09-20'][0].title, 'Test', 'json export includes events');
assert.strictEqual(exportJson.settings.countries[0], 'uk', 'json export includes settings');

console.log('All core tests passed.');