import { ref, computed, onMounted } from 'vue'

/**
 * Pure helper to test if a given date / query falls within the Friday Surah Al-Kahf window.
 * The Sunnah of reciting Surah Al-Kahf begins from Maghrib on Thursday (approx 17:00 / 5 PM)
 * and continues throughout the entire day of Friday (until midnight).
 */
export function isFridayKahfWindow(
  date: Date = new Date(),
  overrideQuery?: string | null
): boolean {
  if (overrideQuery === '1' || overrideQuery === 'true') {
    return true
  }

  const day = date.getDay() // 0 = Sun, 4 = Thu, 5 = Fri
  const hour = date.getHours()

  // Thursday evening after 17:00 (Islamic Friday night - Laylat al-Jumu'ah)
  if (day === 4 && hour >= 17) {
    return true
  }

  // All day Friday
  if (day === 5) {
    return true
  }

  return false
}

export function useFridayKahf() {
  const isDismissed = ref(false)

  const getTodayKey = (d: Date = new Date()): string => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `peace_friday_kahf_dismissed_${y}-${m}-${day}`
  }

  const queryOverride = computed(() => {
    if (typeof window === 'undefined') return null
    try {
      const sp = new URLSearchParams(window.location.search)
      return sp.get('friday') || sp.get('kahf')
    } catch {
      return null
    }
  })

  const isFriday = computed(() => {
    return isFridayKahfWindow(new Date(), queryOverride.value)
  })

  const shouldShowBanner = computed(() => {
    return isFriday.value && !isDismissed.value
  })

  onMounted(() => {
    if (typeof window !== 'undefined') {
      try {
        const key = getTodayKey()
        isDismissed.value = localStorage.getItem(key) === 'true'
      } catch {
        isDismissed.value = false
      }
    }
  })

  const dismiss = () => {
    isDismissed.value = true
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getTodayKey(), 'true')
      } catch {}
    }
  }

  const resetDismiss = () => {
    isDismissed.value = false
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(getTodayKey())
      } catch {}
    }
  }

  return {
    surahId: 18,
    surahNameEn: 'Al-Kahf',
    surahNameAr: 'الكهف',
    isFriday,
    isDismissed,
    shouldShowBanner,
    dismiss,
    resetDismiss,
  }
}

export default useFridayKahf
