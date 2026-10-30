<template>
  <transition name="fade-slide">
    <div
      v-if="shouldShowBanner"
      class="friday-kahf-banner"
      :class="{ 'is-compact': compact }"
      role="complementary"
      aria-label="Friday Sunnah Surah Al-Kahf"
    >
      <div class="banner-glow" />

      <div class="banner-content">
        <!-- Badge & Dismiss Header -->
        <div class="banner-top-row">
          <div class="friday-badge">
            <q-icon name="auto_awesome" size="14px" class="q-mr-xs text-amber-4" />
            <span>{{ t('fridayKahf.badge') }}</span>
          </div>

          <q-btn
            v-if="allowDismiss"
            flat
            round
            dense
            icon="close"
            size="sm"
            class="dismiss-btn text-white-50"
            :aria-label="t('fridayKahf.dismiss')"
            @click="dismiss"
          >
            <q-tooltip>{{ t('fridayKahf.dismiss') }}</q-tooltip>
          </q-btn>
        </div>

        <!-- Main Body -->
        <div class="banner-main-row">
          <div class="banner-icon-container">
            <q-icon name="menu_book" size="28px" class="banner-icon text-amber-3" />
          </div>

          <div class="banner-text-col">
            <div class="banner-title-row">
              <h3 class="banner-title">
                {{ t('fridayKahf.title') }}
              </h3>
              <span class="banner-arabic font-amiri">{{ t('fridayKahf.arabicTitle') }}</span>
            </div>

            <p class="banner-quote">
              {{ t('fridayKahf.hadith') }}
              <span class="banner-source">— {{ t('fridayKahf.hadithSource') }}</span>
            </p>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="banner-actions">
          <q-btn
            unelevated
            no-caps
            color="amber-9"
            text-color="dark"
            icon="play_arrow"
            :label="t('fridayKahf.actionListen')"
            :to="`/quran/18?autoplay=true&highlight=word`"
            class="action-btn-primary text-weight-bold"
          />

          <q-btn
            outline
            no-caps
            color="white"
            icon="menu_book"
            :label="t('fridayKahf.action')"
            to="/quran/18"
            class="action-btn-secondary"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFridayKahf } from '@/composables/useFridayKahf'

withDefaults(
  defineProps<{
    compact?: boolean
    allowDismiss?: boolean
  }>(),
  {
    compact: false,
    allowDismiss: true,
  }
)

const { t } = useI18n()
const { shouldShowBanner, dismiss } = useFridayKahf()
</script>

<style scoped>
.friday-kahf-banner {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(135deg, #064e3b 0%, #065f46 45%, #0f766e 100%);
  border: 1px solid rgba(251, 191, 36, 0.45);
  box-shadow: 0 10px 30px rgba(6, 78, 59, 0.35), 0 0 20px rgba(251, 191, 36, 0.15);
  color: #fff;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(12px);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.friday-kahf-banner:hover {
  box-shadow: 0 14px 38px rgba(6, 78, 59, 0.45), 0 0 26px rgba(251, 191, 36, 0.25);
}

.banner-glow {
  position: absolute;
  top: -40%;
  right: -10%;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, transparent 70%);
  pointer-events: none;
}

.banner-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.banner-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.friday-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(251, 191, 36, 0.18);
  border: 1px solid rgba(251, 191, 36, 0.5);
  color: #fef08a;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.dismiss-btn {
  opacity: 0.75;
  transition: opacity 0.2s ease;
}
.dismiss-btn:hover {
  opacity: 1;
}

.banner-main-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.banner-icon-container {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
}

.banner-text-col {
  flex: 1;
  min-width: 0;
}

.banner-title-row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
}

.banner-title {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0;
  color: #fff;
  letter-spacing: -0.3px;
}

.banner-arabic {
  font-size: 1.45rem;
  color: #fef08a;
  line-height: 1;
}

.banner-quote {
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-style: italic;
}

.banner-source {
  font-style: normal;
  font-size: 0.8rem;
  color: rgba(254, 240, 138, 0.85);
  display: inline-block;
  margin-left: 0.35rem;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.action-btn-primary {
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 6px 18px;
  border-radius: 10px;
}
.action-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.55);
}

.action-btn-secondary {
  border-color: rgba(255, 255, 255, 0.35);
  border-radius: 10px;
  padding: 6px 16px;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.action-btn-secondary:hover {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

/* Compact Variation */
.friday-kahf-banner.is-compact {
  padding: 0.85rem 1.15rem;
  border-radius: 14px;
}
.friday-kahf-banner.is-compact .banner-title {
  font-size: 1.1rem;
}
.friday-kahf-banner.is-compact .banner-quote {
  font-size: 0.85rem;
}

/* Fade slide transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 600px) {
  .friday-kahf-banner {
    padding: 1rem 1.1rem;
  }
  .banner-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .action-btn-primary,
  .action-btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
