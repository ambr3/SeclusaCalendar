import { describe, it, expect } from 'vitest';
import core from './load-app.js';
const { sanitizeEvent } = core;

describe('sanitizeEvent', () => {
  it('returns null for non-objects', () => {
    expect(sanitizeEvent(null)).toBeNull();
    expect(sanitizeEvent('string')).toBeNull();
    expect(sanitizeEvent(undefined)).toBeNull();
  });

  it('sanitizes a valid event', () => {
    const ev = sanitizeEvent({
      id: 'abc-123',
      title: 'Team standup',
      time: '09:00',
      endTime: '09:30',
      endDate: '2024-12-31',
      reminder: 10,
      desc: 'Daily sync',
      color: '#6366f1',
    });
    expect(ev).toMatchObject({
      id: 'abc-123',
      title: 'Team standup',
      time: '09:00',
      endTime: '09:30',
      endDate: '2024-12-31',
      reminder: 10,
      desc: 'Daily sync',
      color: '#6366f1',
    });
  });

  it('rejects invalid time values', () => {
    const ev = sanitizeEvent({ id: 'x', title: 'T', time: '25:00' });
    expect(ev.time).toBeNull();
  });

  it('rejects invalid date values', () => {
    const ev = sanitizeEvent({ id: 'x', title: 'T', endDate: '2024/12/31' });
    expect(ev.endDate).toBeNull();
  });

  it('normalizes invalid color to default', () => {
    const ev = sanitizeEvent({ id: 'x', title: 'T', color: 'red' });
    expect(ev.color).toBe('#6cb5e6');
  });

  it('preserves valid color', () => {
    const ev = sanitizeEvent({ id: 'x', title: 'T', color: '#ef4444' });
    expect(ev.color).toBe('#ef4444');
  });

  it('truncates long titles and descriptions', () => {
    const ev = sanitizeEvent({ id: 'x', title: 'a'.repeat(400), desc: 'd'.repeat(3000) });
    expect(ev.title.length).toBe(300);
    expect(ev.desc.length).toBe(2000);
  });

  it('strips newlines from ids', () => {
    const ev = sanitizeEvent({ id: 'bad\nid', title: 'T' });
    expect(ev.id).not.toContain('\n');
    expect(ev.id).not.toContain('\r');
  });

  describe('recurrence', () => {
    it('accepts valid recurrence', () => {
      const ev = sanitizeEvent({
        id: 'x',
        title: 'T',
        recurrence: { frequency: 'weekly', interval: 2, endDate: '2025-01-01' },
      });
      expect(ev.recurrence).toEqual({ frequency: 'weekly', interval: 2, endDate: '2025-01-01' });
    });

    it('rejects unknown frequency', () => {
      const ev = sanitizeEvent({ id: 'x', title: 'T', recurrence: { frequency: 'hourly' } });
      expect(ev.recurrence).toBeUndefined();
    });

    it('ensures minimum interval of 1', () => {
      const ev = sanitizeEvent({ id: 'x', title: 'T', recurrence: { frequency: 'daily', interval: 0 } });
      expect(ev.recurrence.interval).toBe(1);
    });

    it('rejects invalid interval', () => {
      const ev = sanitizeEvent({ id: 'x', title: 'T', recurrence: { frequency: 'daily', interval: 'abc' } });
      expect(ev.recurrence.interval).toBe(1);
    });
  });

  it('generates an id when none is provided', () => {
    const ev = sanitizeEvent({ title: 'T' });
    expect(ev.id).toBeTruthy();
  });
});