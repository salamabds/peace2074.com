import { describe, expect, it } from 'vitest'
import { isFridayKahfWindow } from '../src/composables/useFridayKahf'

describe('isFridayKahfWindow', () => {
  it('returns true on Friday morning and evening', () => {
    // 2026-10-30 is a Friday
    const fridayMorning = new Date(2026, 9, 30, 8, 30, 0)
    const fridayEvening = new Date(2026, 9, 30, 20, 0, 0)

    expect(isFridayKahfWindow(fridayMorning)).toBe(true)
    expect(isFridayKahfWindow(fridayEvening)).toBe(true)
  })

  it('returns true on Thursday evening starting at 17:00 (Maghrib window)', () => {
    // 2026-10-29 is Thursday
    const thursdayAfternoon = new Date(2026, 9, 29, 14, 0, 0)
    const thursdayEve17 = new Date(2026, 9, 29, 17, 0, 0)
    const thursdayNight = new Date(2026, 9, 29, 21, 30, 0)

    expect(isFridayKahfWindow(thursdayAfternoon)).toBe(false)
    expect(isFridayKahfWindow(thursdayEve17)).toBe(true)
    expect(isFridayKahfWindow(thursdayNight)).toBe(true)
  })

  it('returns false on Saturday or Sunday or Wednesday', () => {
    // 2026-10-31 is Saturday, 2026-10-28 is Wednesday
    const saturday = new Date(2026, 9, 31, 10, 0, 0)
    const wednesday = new Date(2026, 9, 28, 12, 0, 0)

    expect(isFridayKahfWindow(saturday)).toBe(false)
    expect(isFridayKahfWindow(wednesday)).toBe(false)
  })

  it('honors override query parameter even on non-Friday days', () => {
    const saturday = new Date(2026, 9, 31, 10, 0, 0)
    expect(isFridayKahfWindow(saturday, '1')).toBe(true)
    expect(isFridayKahfWindow(saturday, 'true')).toBe(true)
    expect(isFridayKahfWindow(saturday, '0')).toBe(false)
  })
})
