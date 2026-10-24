<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const { locale, t } = useI18n()
const route = useRoute()
const router = useRouter()
const $q = useQuasar()

interface HolyNameI {
  name: string
  text: string
  transliterationKey: string
  meaningKey: string
}

type HolyCategory = 'mercy' | 'majesty' | 'creation' | 'knowledge' | 'peace'

interface HolyNameWithMeta extends HolyNameI {
  id: number
  category: HolyCategory
}

interface SparkleSpec {
  left: string
  top: string
  size: string
  delay: string
  duration: string
  opacity: string
}

const sparkleSpecs: SparkleSpec[] = [
  {
    left: '4%',
    top: '6%',
    size: '10px',
    delay: '0s',
    duration: '4.6s',
    opacity: '0.95',
  },
  {
    left: '14%',
    top: '18%',
    size: '7px',
    delay: '1.2s',
    duration: '5.4s',
    opacity: '0.8',
  },
  {
    left: '25%',
    top: '9%',
    size: '12px',
    delay: '2.4s',
    duration: '6.2s',
    opacity: '0.92',
  },
  {
    left: '38%',
    top: '22%',
    size: '8px',
    delay: '0.8s',
    duration: '4.9s',
    opacity: '0.76',
  },
  {
    left: '49%',
    top: '11%',
    size: '9px',
    delay: '1.8s',
    duration: '5.8s',
    opacity: '0.88',
  },
  {
    left: '61%',
    top: '20%',
    size: '11px',
    delay: '2.8s',
    duration: '6s',
    opacity: '0.85',
  },
  {
    left: '74%',
    top: '8%',
    size: '7px',
    delay: '1.1s',
    duration: '4.4s',
    opacity: '0.78',
  },
  {
    left: '87%',
    top: '17%',
    size: '10px',
    delay: '3.1s',
    duration: '5.6s',
    opacity: '0.9',
  },
  {
    left: '8%',
    top: '54%',
    size: '8px',
    delay: '2s',
    duration: '5.1s',
    opacity: '0.82',
  },
  {
    left: '22%',
    top: '68%',
    size: '12px',
    delay: '0.5s',
    duration: '6.4s',
    opacity: '0.96',
  },
  {
    left: '43%',
    top: '63%',
    size: '9px',
    delay: '2.1s',
    duration: '4.8s',
    opacity: '0.72',
  },
  {
    left: '58%',
    top: '76%',
    size: '7px',
    delay: '1.7s',
    duration: '5.2s',
    opacity: '0.74',
  },
  {
    left: '69%',
    top: '58%',
    size: '11px',
    delay: '2.9s',
    duration: '6.3s',
    opacity: '0.9',
  },
  {
    left: '82%',
    top: '72%',
    size: '8px',
    delay: '0.9s',
    duration: '4.7s',
    opacity: '0.79',
  },
  {
    left: '92%',
    top: '46%',
    size: '12px',
    delay: '3.4s',
    duration: '6.1s',
    opacity: '0.93',
  },
]

// The 99 Names of Allah
const holynames: HolyNameI[] = [
  {
    name: 'الرَّحْمَنُ',
    text: 'Ar-Rahman',
    transliterationKey: 'holyNames.1.transliteration',
    meaningKey: 'holyNames.1.meaning',
  },
  {
    name: 'الرَّحِيمُ',
    text: 'Ar-Raheem',
    transliterationKey: 'holyNames.2.transliteration',
    meaningKey: 'holyNames.2.meaning',
  },
  {
    name: 'الْمَلِكُ',
    text: 'Al-Malik',
    transliterationKey: 'holyNames.3.transliteration',
    meaningKey: 'holyNames.3.meaning',
  },
  {
    name: 'الْقُدُّوسُ',
    text: 'Al-Quddus',
    transliterationKey: 'holyNames.4.transliteration',
    meaningKey: 'holyNames.4.meaning',
  },
  {
    name: 'السَّلاَمُ',
    text: 'As-Salam',
    transliterationKey: 'holyNames.5.transliteration',
    meaningKey: 'holyNames.5.meaning',
  },
  {
    name: 'الْمُؤْمِنُ',
    text: "Al-Mu'min",
    transliterationKey: 'holyNames.6.transliteration',
    meaningKey: 'holyNames.6.meaning',
  },
  {
    name: 'الْمُهَيْمِنُ',
    text: 'Al-Muhaymin',
    transliterationKey: 'holyNames.7.transliteration',
    meaningKey: 'holyNames.7.meaning',
  },
  {
    name: 'الْعَزِيزُ',
    text: 'Al-Aziz',
    transliterationKey: 'holyNames.8.transliteration',
    meaningKey: 'holyNames.8.meaning',
  },
  {
    name: 'الْجَبَّارُ',
    text: 'Al-Jabbar',
    transliterationKey: 'holyNames.9.transliteration',
    meaningKey: 'holyNames.9.meaning',
  },
  {
    name: 'الْمُتَكَبِّرُ',
    text: 'Al-Mutakabbir',
    transliterationKey: 'holyNames.10.transliteration',
    meaningKey: 'holyNames.10.meaning',
  },
  {
    name: 'الْخَالِقُ',
    text: 'Al-Khaliq',
    transliterationKey: 'holyNames.11.transliteration',
    meaningKey: 'holyNames.11.meaning',
  },
  {
    name: 'الْبَارِئُ',
    text: 'Al-Bari',
    transliterationKey: 'holyNames.12.transliteration',
    meaningKey: 'holyNames.12.meaning',
  },
  {
    name: 'الْمُصَوِّرُ',
    text: 'Al-Musawwir',
    transliterationKey: 'holyNames.13.transliteration',
    meaningKey: 'holyNames.13.meaning',
  },
  {
    name: 'الْغَفَّارُ',
    text: 'Al-Ghaffar',
    transliterationKey: 'holyNames.14.transliteration',
    meaningKey: 'holyNames.14.meaning',
  },
  {
    name: 'الْقَهَّارُ',
    text: 'Al-Qahhar',
    transliterationKey: 'holyNames.15.transliteration',
    meaningKey: 'holyNames.15.meaning',
  },
  {
    name: 'الْوَهَّابُ',
    text: 'Al-Wahhab',
    transliterationKey: 'holyNames.16.transliteration',
    meaningKey: 'holyNames.16.meaning',
  },
  {
    name: 'الرَّزَّاقُ',
    text: 'Ar-Razzaq',
    transliterationKey: 'holyNames.17.transliteration',
    meaningKey: 'holyNames.17.meaning',
  },
  {
    name: 'الْفَتَّاحُ',
    text: 'Al-Fattah',
    transliterationKey: 'holyNames.18.transliteration',
    meaningKey: 'holyNames.18.meaning',
  },
  {
    name: 'الْعَلِيمُ',
    text: 'Al-Alim',
    transliterationKey: 'holyNames.19.transliteration',
    meaningKey: 'holyNames.19.meaning',
  },
  {
    name: 'الْقَابِضُ',
    text: 'Al-Qabid',
    transliterationKey: 'holyNames.20.transliteration',
    meaningKey: 'holyNames.20.meaning',
  },
  {
    name: 'الْبَاسِطُ',
    text: 'Al-Basit',
    transliterationKey: 'holyNames.21.transliteration',
    meaningKey: 'holyNames.21.meaning',
  },
  {
    name: 'الْخَافِضُ',
    text: 'Al-Khafid',
    transliterationKey: 'holyNames.22.transliteration',
    meaningKey: 'holyNames.22.meaning',
  },
  {
    name: 'الرَّافِعُ',
    text: 'Ar-Rafi',
    transliterationKey: 'holyNames.23.transliteration',
    meaningKey: 'holyNames.23.meaning',
  },
  {
    name: 'الْمُعِزُّ',
    text: "Al-Mu'izz",
    transliterationKey: 'holyNames.24.transliteration',
    meaningKey: 'holyNames.24.meaning',
  },
  {
    name: 'الْمُذِلُّ',
    text: 'Al-Muzil',
    transliterationKey: 'holyNames.25.transliteration',
    meaningKey: 'holyNames.25.meaning',
  },
  {
    name: 'السَّمِيعُ',
    text: 'As-Sami',
    transliterationKey: 'holyNames.26.transliteration',
    meaningKey: 'holyNames.26.meaning',
  },
  {
    name: 'الْبَصِيرُ',
    text: 'Al-Basir',
    transliterationKey: 'holyNames.27.transliteration',
    meaningKey: 'holyNames.27.meaning',
  },
  {
    name: 'الْحَكَمُ',
    text: 'Al-Hakam',
    transliterationKey: 'holyNames.28.transliteration',
    meaningKey: 'holyNames.28.meaning',
  },
  {
    name: 'الْعَدْلُ',
    text: 'Al-Adl',
    transliterationKey: 'holyNames.29.transliteration',
    meaningKey: 'holyNames.29.meaning',
  },
  {
    name: 'اللَّطِيفُ',
    text: 'Al-Latif',
    transliterationKey: 'holyNames.30.transliteration',
    meaningKey: 'holyNames.30.meaning',
  },
  {
    name: 'الْخَبِيرُ',
    text: 'Al-Khabir',
    transliterationKey: 'holyNames.31.transliteration',
    meaningKey: 'holyNames.31.meaning',
  },
  {
    name: 'الْحَلِيمُ',
    text: 'Al-Halim',
    transliterationKey: 'holyNames.32.transliteration',
    meaningKey: 'holyNames.32.meaning',
  },
  {
    name: 'الْعَظِيمُ',
    text: 'Al-Azim',
    transliterationKey: 'holyNames.33.transliteration',
    meaningKey: 'holyNames.33.meaning',
  },
  {
    name: 'الْغَفُورُ',
    text: 'Al-Ghafur',
    transliterationKey: 'holyNames.34.transliteration',
    meaningKey: 'holyNames.34.meaning',
  },
  {
    name: 'الشَّكُورُ',
    text: 'Ash-Shakur',
    transliterationKey: 'holyNames.35.transliteration',
    meaningKey: 'holyNames.35.meaning',
  },
  {
    name: 'الْعَلِيُّ',
    text: 'Al-Ali',
    transliterationKey: 'holyNames.36.transliteration',
    meaningKey: 'holyNames.36.meaning',
  },
  {
    name: 'الْكَبِيرُ',
    text: 'Al-Kabir',
    transliterationKey: 'holyNames.37.transliteration',
    meaningKey: 'holyNames.37.meaning',
  },
  {
    name: 'الْحَفِيظُ',
    text: 'Al-Hafiz',
    transliterationKey: 'holyNames.38.transliteration',
    meaningKey: 'holyNames.38.meaning',
  },
  {
    name: 'الْمُقِيتُ',
    text: 'Al-Muqit',
    transliterationKey: 'holyNames.39.transliteration',
    meaningKey: 'holyNames.39.meaning',
  },
  {
    name: 'الْحَسِيبُ',
    text: 'Al-Hasib',
    transliterationKey: 'holyNames.40.transliteration',
    meaningKey: 'holyNames.40.meaning',
  },
  {
    name: 'الْجَلِيلُ',
    text: 'Al-Jalil',
    transliterationKey: 'holyNames.41.transliteration',
    meaningKey: 'holyNames.41.meaning',
  },
  {
    name: 'الْكَرِيمُ',
    text: 'Al-Karim',
    transliterationKey: 'holyNames.42.transliteration',
    meaningKey: 'holyNames.42.meaning',
  },
  {
    name: 'الرَّقِيبُ',
    text: 'Ar-Raqib',
    transliterationKey: 'holyNames.43.transliteration',
    meaningKey: 'holyNames.43.meaning',
  },
  {
    name: 'الْمُجِيبُ',
    text: 'Al-Mujib',
    transliterationKey: 'holyNames.44.transliteration',
    meaningKey: 'holyNames.44.meaning',
  },
  {
    name: 'الْوَاسِعُ',
    text: 'Al-Wasi',
    transliterationKey: 'holyNames.45.transliteration',
    meaningKey: 'holyNames.45.meaning',
  },
  {
    name: 'الْحَكِيمُ',
    text: 'Al-Hakim',
    transliterationKey: 'holyNames.46.transliteration',
    meaningKey: 'holyNames.46.meaning',
  },
  {
    name: 'الْوَدُودُ',
    text: 'Al-Wadud',
    transliterationKey: 'holyNames.47.transliteration',
    meaningKey: 'holyNames.47.meaning',
  },
  {
    name: 'الْمَجِيدُ',
    text: 'Al-Majid',
    transliterationKey: 'holyNames.48.transliteration',
    meaningKey: 'holyNames.48.meaning',
  },
  {
    name: 'الْبَاعِثُ',
    text: "Al-Ba'ith",
    transliterationKey: 'holyNames.49.transliteration',
    meaningKey: 'holyNames.49.meaning',
  },
  {
    name: 'الشَّهِيدُ',
    text: 'Ash-Shahid',
    transliterationKey: 'holyNames.50.transliteration',
    meaningKey: 'holyNames.50.meaning',
  },
  {
    name: 'الْحَقُّ',
    text: 'Al-Haqq',
    transliterationKey: 'holyNames.51.transliteration',
    meaningKey: 'holyNames.51.meaning',
  },
  {
    name: 'الْوَكِيلُ',
    text: 'Al-Wakil',
    transliterationKey: 'holyNames.52.transliteration',
    meaningKey: 'holyNames.52.meaning',
  },
  {
    name: 'الْقَوِيُّ',
    text: 'Al-Qawiyy',
    transliterationKey: 'holyNames.53.transliteration',
    meaningKey: 'holyNames.53.meaning',
  },
  {
    name: 'الْمَتِينُ',
    text: 'Al-Matin',
    transliterationKey: 'holyNames.54.transliteration',
    meaningKey: 'holyNames.54.meaning',
  },
  {
    name: 'الْوَلِيُّ',
    text: 'Al-Waliyy',
    transliterationKey: 'holyNames.55.transliteration',
    meaningKey: 'holyNames.55.meaning',
  },
  {
    name: 'الْحَمِيدُ',
    text: 'Al-Hamid',
    transliterationKey: 'holyNames.56.transliteration',
    meaningKey: 'holyNames.56.meaning',
  },
  {
    name: 'الْمُحْصِي',
    text: 'Al-Muhsi',
    transliterationKey: 'holyNames.57.transliteration',
    meaningKey: 'holyNames.57.meaning',
  },
  {
    name: 'الْمُبْدِئُ',
    text: 'Al-Mubdi',
    transliterationKey: 'holyNames.58.transliteration',
    meaningKey: 'holyNames.58.meaning',
  },
  {
    name: 'الْمُعِيدُ',
    text: "Al-Mu'id",
    transliterationKey: 'holyNames.59.transliteration',
    meaningKey: 'holyNames.59.meaning',
  },
  {
    name: 'الْمُحْيِي',
    text: 'Al-Muhyi',
    transliterationKey: 'holyNames.60.transliteration',
    meaningKey: 'holyNames.60.meaning',
  },
  {
    name: 'الْمُمِيتُ',
    text: 'Al-Mumit',
    transliterationKey: 'holyNames.61.transliteration',
    meaningKey: 'holyNames.61.meaning',
  },
  {
    name: 'الْحَيُّ',
    text: 'Al-Hayy',
    transliterationKey: 'holyNames.62.transliteration',
    meaningKey: 'holyNames.62.meaning',
  },
  {
    name: 'الْقَيُّومُ',
    text: 'Al-Qayyum',
    transliterationKey: 'holyNames.63.transliteration',
    meaningKey: 'holyNames.63.meaning',
  },
  {
    name: 'الْوَاجِدُ',
    text: 'Al-Wajid',
    transliterationKey: 'holyNames.64.transliteration',
    meaningKey: 'holyNames.64.meaning',
  },
  {
    name: 'الْمَاجِدُ',
    text: 'Al-Majid',
    transliterationKey: 'holyNames.65.transliteration',
    meaningKey: 'holyNames.65.meaning',
  },
  {
    name: 'الْوَاحِدُ',
    text: 'Al-Wahid',
    transliterationKey: 'holyNames.66.transliteration',
    meaningKey: 'holyNames.66.meaning',
  },
  {
    name: 'الأَحَد',
    text: 'Al-Ahad',
    transliterationKey: 'holyNames.67.transliteration',
    meaningKey: 'holyNames.67.meaning',
  },
  {
    name: 'الصَّمَدُ',
    text: 'As-Samad',
    transliterationKey: 'holyNames.68.transliteration',
    meaningKey: 'holyNames.68.meaning',
  },
  {
    name: 'الْقَادِرُ',
    text: 'Al-Qadir',
    transliterationKey: 'holyNames.69.transliteration',
    meaningKey: 'holyNames.69.meaning',
  },
  {
    name: 'الْمُقْتَدِرُ',
    text: 'Al-Muqtadir',
    transliterationKey: 'holyNames.70.transliteration',
    meaningKey: 'holyNames.70.meaning',
  },
  {
    name: 'الْمُقَدِّمُ',
    text: 'Al-Muqaddim',
    transliterationKey: 'holyNames.71.transliteration',
    meaningKey: 'holyNames.71.meaning',
  },
  {
    name: 'الْمُؤَخِّرُ',
    text: "Al-Mu'akhkhir",
    transliterationKey: 'holyNames.72.transliteration',
    meaningKey: 'holyNames.72.meaning',
  },
  {
    name: 'الأَوَّلُ',
    text: 'Al-Awwal',
    transliterationKey: 'holyNames.73.transliteration',
    meaningKey: 'holyNames.73.meaning',
  },
  {
    name: 'الآخِرُ',
    text: 'Al-Akhir',
    transliterationKey: 'holyNames.74.transliteration',
    meaningKey: 'holyNames.74.meaning',
  },
  {
    name: 'الظَّاهِرُ',
    text: 'Az-Zahir',
    transliterationKey: 'holyNames.75.transliteration',
    meaningKey: 'holyNames.75.meaning',
  },
  {
    name: 'الْبَاطِنُ',
    text: 'Al-Batin',
    transliterationKey: 'holyNames.76.transliteration',
    meaningKey: 'holyNames.76.meaning',
  },
  {
    name: 'الْوَالِي',
    text: 'Al-Wali',
    transliterationKey: 'holyNames.77.transliteration',
    meaningKey: 'holyNames.77.meaning',
  },
  {
    name: 'الْمُتَعَالِي',
    text: "Al-Muta'ali",
    transliterationKey: 'holyNames.78.transliteration',
    meaningKey: 'holyNames.78.meaning',
  },
  {
    name: 'الْبَرُّ',
    text: 'Al-Barr',
    transliterationKey: 'holyNames.79.transliteration',
    meaningKey: 'holyNames.79.meaning',
  },
  {
    name: 'التَّوَّابُ',
    text: 'At-Tawwab',
    transliterationKey: 'holyNames.80.transliteration',
    meaningKey: 'holyNames.80.meaning',
  },
  {
    name: 'الْمُنْتَقِمُ',
    text: 'Al-Muntaqim',
    transliterationKey: 'holyNames.81.transliteration',
    meaningKey: 'holyNames.81.meaning',
  },
  {
    name: 'الْعَفُوُّ',
    text: 'Al-Afuww',
    transliterationKey: 'holyNames.82.transliteration',
    meaningKey: 'holyNames.82.meaning',
  },
  {
    name: 'الرَّؤُوفُ',
    text: "Ar-Ra'uf",
    transliterationKey: 'holyNames.83.transliteration',
    meaningKey: 'holyNames.83.meaning',
  },
  {
    name: 'مَالِكُ الْمُلْكِ',
    text: 'Malik-ul-Mulk',
    transliterationKey: 'holyNames.84.transliteration',
    meaningKey: 'holyNames.84.meaning',
  },
  {
    name: 'ذُو الْجَلاَلِ وَالإِكْرَامِ',
    text: 'Dhul-Jalali wal-Ikram',
    transliterationKey: 'holyNames.85.transliteration',
    meaningKey: 'holyNames.85.meaning',
  },
  {
    name: 'الْمُقْسِطُ',
    text: 'Al-Muqsit',
    transliterationKey: 'holyNames.86.transliteration',
    meaningKey: 'holyNames.86.meaning',
  },
  {
    name: 'الْجَامِعُ',
    text: 'Al-Jami',
    transliterationKey: 'holyNames.87.transliteration',
    meaningKey: 'holyNames.87.meaning',
  },
  {
    name: 'الْغَنِيُّ',
    text: 'Al-Ghani',
    transliterationKey: 'holyNames.88.transliteration',
    meaningKey: 'holyNames.88.meaning',
  },
  {
    name: 'الْمُغْنِي',
    text: 'Al-Mughni',
    transliterationKey: 'holyNames.89.transliteration',
    meaningKey: 'holyNames.89.meaning',
  },
  {
    name: 'الْمَانِعُ',
    text: 'Al-Mani',
    transliterationKey: 'holyNames.90.transliteration',
    meaningKey: 'holyNames.90.meaning',
  },
  {
    name: 'الضَّارُّ',
    text: 'Ad-Darr',
    transliterationKey: 'holyNames.91.transliteration',
    meaningKey: 'holyNames.91.meaning',
  },
  {
    name: 'النَّافِعُ',
    text: 'An-Nafi',
    transliterationKey: 'holyNames.92.transliteration',
    meaningKey: 'holyNames.92.meaning',
  },
  {
    name: 'النُّورُ',
    text: 'An-Nur',
    transliterationKey: 'holyNames.93.transliteration',
    meaningKey: 'holyNames.93.meaning',
  },
  {
    name: 'الْهَادِي',
    text: 'Al-Hadi',
    transliterationKey: 'holyNames.94.transliteration',
    meaningKey: 'holyNames.94.meaning',
  },
  {
    name: 'الْبَدِيعُ',
    text: 'Al-Badi',
    transliterationKey: 'holyNames.95.transliteration',
    meaningKey: 'holyNames.95.meaning',
  },
  {
    name: 'الْبَاقِي',
    text: 'Al-Baqi',
    transliterationKey: 'holyNames.96.transliteration',
    meaningKey: 'holyNames.96.meaning',
  },
  {
    name: 'الْوَارِثُ',
    text: 'Al-Warith',
    transliterationKey: 'holyNames.97.transliteration',
    meaningKey: 'holyNames.97.meaning',
  },
  {
    name: 'الرَّشِيدُ',
    text: 'Ar-Rashid',
    transliterationKey: 'holyNames.98.transliteration',
    meaningKey: 'holyNames.98.meaning',
  },
  {
    name: 'الصَّبُورُ',
    text: 'As-Sabur',
    transliterationKey: 'holyNames.99.transliteration',
    meaningKey: 'holyNames.99.meaning',
  },
]

// Helper to assign categories to 99 names
function getCategoryForId(id: number): HolyCategory {
  if (
    [1, 2, 14, 16, 17, 30, 33, 34, 35, 36, 47, 48, 79, 80, 81, 82, 83].includes(
      id
    )
  ) {
    return 'mercy'
  }
  if (
    [
      3, 4, 7, 8, 9, 10, 15, 20, 21, 22, 23, 24, 25, 37, 38, 40, 41, 42, 43,
      44, 53, 54, 55, 56, 63, 84, 85,
    ].includes(id)
  ) {
    return 'majesty'
  }
  if ([11, 12, 13, 57, 58, 59, 60, 61, 62, 70, 71, 72, 95].includes(id)) {
    return 'creation'
  }
  if ([5, 6, 32, 64, 65, 66, 67, 68].includes(id)) {
    return 'peace'
  }
  return 'knowledge'
}

const enrichedNames: HolyNameWithMeta[] = holynames.map((item, idx) => {
  const id = idx + 1
  return {
    ...item,
    id,
    category: getCategoryForId(id),
  }
})

const categories: { key: string; label: string; arabic: string; icon: string }[] =
  [
    { key: 'all', label: 'All Names', arabic: 'الكل', icon: 'auto_awesome' },
    {
      key: 'mercy',
      label: 'Mercy & Kindness',
      arabic: 'الرحمة واللطف',
      icon: 'favorite',
    },
    {
      key: 'majesty',
      label: 'Majesty & Power',
      arabic: 'الملك والجلال',
      icon: 'shield',
    },
    {
      key: 'creation',
      label: 'Creation & Life',
      arabic: 'الخلق والإحياء',
      icon: 'spa',
    },
    {
      key: 'knowledge',
      label: 'Wisdom & Knowledge',
      arabic: 'العلم والحكمة',
      icon: 'psychology',
    },
    {
      key: 'peace',
      label: 'Peace & Faith',
      arabic: 'السلام والإيمان',
      icon: 'wb_sunny',
    },
    { key: 'favorites', label: 'Bookmarked', arabic: 'المفضلة', icon: 'star' },
  ]

// View modes: 'random' (Default) | 'shuffled' | 'all'
const viewMode = ref<'random' | 'shuffled' | 'all'>('random')

// Random selection
const randomNameIndex = ref<number>(
  Math.floor(Math.random() * enrichedNames.length)
)
const currentRandomName = computed(
  () => enrichedNames[randomNameIndex.value] || enrichedNames[0]
)

// Shuffled array for non-iterative browsing
const shuffledIndices = ref<number[]>([])

function shuffleNames() {
  const arr = enrichedNames.map((_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  shuffledIndices.value = arr
  playChimeTone()
  $q.notify({
    message: '99 Holy Names shuffled randomly (non-iterative)',
    color: 'secondary',
    icon: 'shuffle',
    timeout: 1500,
  })
}

// Search & Filter
const searchQuery = ref('')
const selectedCategory = ref('all')

const filteredNames = computed(() => {
  let list = enrichedNames

  // If in shuffled mode and we have shuffled indices, order by shuffled indices
  if (
    viewMode.value === 'shuffled' &&
    shuffledIndices.value.length === enrichedNames.length
  ) {
    list = shuffledIndices.value.map((idx) => enrichedNames[idx])
  }

  // Category filter
  if (selectedCategory.value === 'favorites') {
    list = list.filter((item) => bookmarkedIds.value.includes(item.id))
  } else if (selectedCategory.value !== 'all') {
    list = list.filter((item) => item.category === selectedCategory.value)
  }

  // Search filter
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return list

  return list.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(query)
    const textMatch = item.text.toLowerCase().includes(query)
    const transMatch = t(item.transliterationKey).toLowerCase().includes(query)
    const meaningMatch = t(item.meaningKey).toLowerCase().includes(query)
    const idMatch = String(item.id) === query
    return nameMatch || textMatch || transMatch || meaningMatch || idMatch
  })
})

// Dhikr Tasbeeh counter
const dhikrCount = ref(0)
const dhikrTarget = ref<number>(33)
const targetOptions = [33, 99, 100, 999999]

function incrementDhikr() {
  dhikrCount.value++
  playBeadClick()
  if (navigator.vibrate) {
    navigator.vibrate(35)
  }
  if (dhikrCount.value === dhikrTarget.value) {
    playChimeTone()
    $q.notify({
      message: `Masha'Allah! Completed ${dhikrTarget.value} praises`,
      color: 'positive',
      icon: 'check_circle',
      timeout: 2000,
    })
  }
}

function resetDhikr() {
  dhikrCount.value = 0
}

function setDhikrTarget(val: number) {
  dhikrTarget.value = val
}

// Bookmarks
const bookmarkedIds = ref<number[]>([])

function toggleBookmark(id: number) {
  if (bookmarkedIds.value.includes(id)) {
    bookmarkedIds.value = bookmarkedIds.value.filter((x) => x !== id)
  } else {
    bookmarkedIds.value.push(id)
  }
  try {
    localStorage.setItem(
      'peace2074_holy_bookmarks',
      JSON.stringify(bookmarkedIds.value)
    )
  } catch {}
}

function isBookmarked(id: number): boolean {
  return bookmarkedIds.value.includes(id)
}

// Pick Next Random Name
function pickRandomName() {
  let nextIdx = Math.floor(Math.random() * enrichedNames.length)
  if (nextIdx === randomNameIndex.value && enrichedNames.length > 1) {
    nextIdx = (nextIdx + 1) % enrichedNames.length
  }
  randomNameIndex.value = nextIdx
  resetDhikr()
  playChimeTone()
}

// Auto-Play ambient mode
const isAutoPlaying = ref(false)
let autoPlayTimer: any = null

function toggleAutoPlay() {
  isAutoPlaying.value = !isAutoPlaying.value
  if (isAutoPlaying.value) {
    autoPlayTimer = setInterval(() => {
      pickRandomName()
    }, 7000)
    $q.notify({
      message: 'Ambient contemplation enabled: cycling random names',
      color: 'primary',
      icon: 'auto_awesome',
      timeout: 2000,
    })
  } else {
    if (autoPlayTimer) clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// Interactive Modal for card clicks
const activeModalName = ref<HolyNameWithMeta | null>(null)
const modalDhikrCount = ref(0)
const isModalOpen = computed({
  get: () => !!activeModalName.value,
  set: (val: boolean) => {
    if (!val) activeModalName.value = null
  },
})

function openNameModal(item: HolyNameWithMeta) {
  activeModalName.value = item
  modalDhikrCount.value = 0
  playChimeTone()
}

function incrementModalDhikr() {
  modalDhikrCount.value++
  playBeadClick()
  if (navigator.vibrate) {
    navigator.vibrate(35)
  }
}

function resetModalDhikr() {
  modalDhikrCount.value = 0
}

function nextModalName() {
  if (!activeModalName.value) return
  const currentIdx = enrichedNames.findIndex(
    (x) => x.id === activeModalName.value!.id
  )
  const nextIdx = (currentIdx + 1) % enrichedNames.length
  activeModalName.value = enrichedNames[nextIdx]
  modalDhikrCount.value = 0
}

function prevModalName() {
  if (!activeModalName.value) return
  const currentIdx = enrichedNames.findIndex(
    (x) => x.id === activeModalName.value!.id
  )
  const prevIdx =
    (currentIdx - 1 + enrichedNames.length) % enrichedNames.length
  activeModalName.value = enrichedNames[prevIdx]
  modalDhikrCount.value = 0
}

function randomModalName() {
  let nextIdx = Math.floor(Math.random() * enrichedNames.length)
  if (
    activeModalName.value &&
    enrichedNames[nextIdx].id === activeModalName.value.id
  ) {
    nextIdx = (nextIdx + 1) % enrichedNames.length
  }
  activeModalName.value = enrichedNames[nextIdx]
  modalDhikrCount.value = 0
  playChimeTone()
}

// Audio Pronunciation & Synthesis
const isPlayingAudio = ref(false)

function playPronunciation(holyName: { name: string; text: string }) {
  if (typeof window === 'undefined') return
  isPlayingAudio.value = true
  playChimeTone()

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(holyName.name)
      utterance.lang = 'ar-SA'
      utterance.rate = 0.82
      utterance.pitch = 1.0

      const voices = window.speechSynthesis.getVoices()
      const arVoice = voices.find(
        (v) => v.lang.startsWith('ar') || v.lang.includes('Arabic')
      )
      if (arVoice) {
        utterance.voice = arVoice
      }

      utterance.onend = () => {
        isPlayingAudio.value = false
      }
      utterance.onerror = () => {
        isPlayingAudio.value = false
      }

      window.speechSynthesis.speak(utterance)
    } catch {
      isPlayingAudio.value = false
    }
  } else {
    setTimeout(() => {
      isPlayingAudio.value = false
    }, 800)
  }
}

function playChimeTone() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(528, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1056, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.65)
  } catch {}
}

function playBeadClick() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.09)
  } catch {}
}

// Copy & Share
async function shareOrCopyName(item: HolyNameWithMeta) {
  const trans = t(item.transliterationKey)
  const meaning = t(item.meaningKey)
  const text = `${item.name} (${item.text}) - ${trans}\nMeaning: ${meaning}\nReflect on the 99 Names of Allah: https://peace2074.com/holynames?id=${item.id}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${item.name} - ${item.text}`,
        text,
        url: `https://peace2074.com/holynames?id=${item.id}`,
      })
      return
    } catch {}
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    $q.notify({
      message: 'Holy name & meaning copied to clipboard',
      color: 'positive',
      icon: 'check',
      timeout: 1800,
    })
  }
}

// Keyboard shortcuts
function handleKeydown(e: KeyboardEvent) {
  if (
    e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLTextAreaElement
  ) {
    return
  }
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault()
    if (activeModalName.value) {
      incrementModalDhikr()
    } else if (viewMode.value === 'random') {
      incrementDhikr()
    }
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    if (activeModalName.value) {
      nextModalName()
    } else if (viewMode.value === 'random') {
      pickRandomName()
    }
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (activeModalName.value) {
      prevModalName()
    } else if (viewMode.value === 'random') {
      pickRandomName()
    }
  }
}

onMounted(() => {
  // Load bookmarks
  try {
    const saved = localStorage.getItem('peace2074_holy_bookmarks')
    if (saved) {
      bookmarkedIds.value = JSON.parse(saved)
    }
  } catch {}

  // Check URL query parameters
  if (route.query.id) {
    const qId = parseInt(route.query.id as string, 10)
    if (!isNaN(qId) && qId >= 1 && qId <= 99) {
      randomNameIndex.value = qId - 1
    }
  }
  if (
    route.query.mode &&
    ['random', 'shuffled', 'all'].includes(route.query.mode as string)
  ) {
    viewMode.value = route.query.mode as 'random' | 'shuffled' | 'all'
  }

  // Pre-shuffle for shuffled mode
  const arr = enrichedNames.map((_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  shuffledIndices.value = arr

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (autoPlayTimer) clearInterval(autoPlayTimer)
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }
})
</script>

<template>
  <q-page class="holynames-page">
    <div class="sparkle-layer" aria-hidden="true">
      <span
        v-for="(sparkle, index) in sparkleSpecs"
        :key="`sparkle-${index}`"
        class="sparkle"
        :style="{
          '--sparkle-left': sparkle.left,
          '--sparkle-top': sparkle.top,
          '--sparkle-size': sparkle.size,
          '--sparkle-delay': sparkle.delay,
          '--sparkle-duration': sparkle.duration,
          '--sparkle-opacity': sparkle.opacity,
        }"
      />
    </div>

    <div class="page-content">
      <div class="bismillah">﷽</div>

      <h1 class="page-title text-h3 q-mb-xs">
        {{ $t('The 99 Holy Names of Allah') }}
      </h1>

      <div class="subtitle text-subtitle1 q-mb-md">
        {{ $t("Asma' Allah Al-Husna") }}
      </div>

      <!-- View Mode Tabs: Random (Default), Shuffled 99, or All 99 -->
      <div class="view-mode-bar q-mb-lg">
        <button
          type="button"
          class="mode-pill"
          :class="{ active: viewMode === 'random' }"
          @click="viewMode = 'random'"
        >
          <q-icon name="casino" size="18px" class="q-mr-xs" />
          <span>{{ $t('Random Reflection') || 'Random Reflection' }}</span>
        </button>
        <button
          type="button"
          class="mode-pill"
          :class="{ active: viewMode === 'shuffled' }"
          @click="
            () => {
              viewMode = 'shuffled'
              if (shuffledIndices.length === 0) shuffleNames()
            }
          "
        >
          <q-icon name="shuffle" size="18px" class="q-mr-xs" />
          <span>{{ $t('Shuffled Names') || 'Shuffled (Non-Iterative)' }}</span>
        </button>
        <button
          type="button"
          class="mode-pill"
          :class="{ active: viewMode === 'all' }"
          @click="viewMode = 'all'"
        >
          <q-icon name="format_list_numbered" size="18px" class="q-mr-xs" />
          <span>{{ $t('All 99 Names') || 'All 99 (Sequential)' }}</span>
        </button>
      </div>

      <!-- ── MODE 1: RANDOM REFLECTION (DEFAULT FOCUS CARD) ── -->
      <section v-if="viewMode === 'random'" class="random-section">
        <div class="random-hero-card islamic-border">
          <div class="card-top-bar">
            <span class="random-badge">
              <q-icon name="auto_awesome" size="14px" class="q-mr-xs" />
              <span>Name #{{ currentRandomName.id }} of 99</span>
            </span>

            <span class="category-pill">
              {{ currentRandomName.category }}
            </span>

            <div class="card-quick-actions">
              <button
                type="button"
                class="icon-action-btn"
                :class="{ bookmarked: isBookmarked(currentRandomName.id) }"
                title="Bookmark"
                @click="toggleBookmark(currentRandomName.id)"
              >
                <q-icon
                  :name="
                    isBookmarked(currentRandomName.id) ? 'star' : 'star_outline'
                  "
                  size="20px"
                />
              </button>
              <button
                type="button"
                class="icon-action-btn"
                title="Share or Copy"
                @click="shareOrCopyName(currentRandomName)"
              >
                <q-icon name="share" size="18px" />
              </button>
            </div>
          </div>

          <!-- Majestic Arabic Calligraphy -->
          <div class="hero-arabic-wrap">
            <div class="hero-arabic-name">{{ currentRandomName.name }}</div>
          </div>

          <!-- Transliteration & Meaning -->
          <div class="hero-info">
            <div class="hero-latin-name">{{ currentRandomName.text }}</div>
            <div class="hero-transliteration">
              {{ $t(currentRandomName.transliterationKey) }}
            </div>
            <div class="hero-meaning">
              {{ $t(currentRandomName.meaningKey) }}
            </div>
          </div>

          <!-- Pronunciation & Recitation Audio -->
          <div class="hero-audio-row q-mt-md">
            <button
              type="button"
              class="hero-audio-btn"
              :class="{ playing: isPlayingAudio }"
              @click="playPronunciation(currentRandomName)"
            >
              <q-icon
                :name="isPlayingAudio ? 'volume_up' : 'volume_up'"
                size="20px"
                class="q-mr-xs"
              />
              <span>
                {{
                  isPlayingAudio
                    ? 'Reciting...'
                    : 'Listen Pronunciation (صوت النطق)'
                }}
              </span>
            </button>
          </div>

          <!-- Interactive Dhikr Counter (Tasbeeh Beads) -->
          <div class="hero-dhikr-box q-mt-lg">
            <div class="dhikr-label">
              <span>Reflective Dhikr / الذكر</span>
              <button
                type="button"
                class="dhikr-reset-btn"
                title="Reset counter"
                @click="resetDhikr"
              >
                <q-icon name="refresh" size="16px" class="q-mr-xs" />
                <span>Reset</span>
              </button>
            </div>

            <div class="dhikr-counter-orb" @click="incrementDhikr">
              <div class="dhikr-num">{{ dhikrCount }}</div>
              <div class="dhikr-target">
                /
                {{
                  dhikrTarget === 999999 ? '∞' : dhikrTarget
                }}
              </div>
              <div class="dhikr-subtext">Tap to count • انقر للذكر</div>
            </div>

            <div class="target-chips-row q-mt-sm">
              <span class="target-title">Target:</span>
              <button
                v-for="opt in targetOptions"
                :key="opt"
                type="button"
                class="target-pill"
                :class="{ active: dhikrTarget === opt }"
                @click="setDhikrTarget(opt)"
              >
                {{ opt === 999999 ? '∞' : opt }}
              </button>
            </div>
          </div>

          <!-- Hero Action Controls -->
          <div class="hero-actions-row q-mt-xl">
            <button
              type="button"
              class="cta-random-btn"
              @click="pickRandomName"
            >
              <q-icon name="casino" size="24px" class="q-mr-sm" />
              <span>{{ $t('Pick Another Random Name') || 'Next Random Name (اسم آخر عشوائي)' }}</span>
            </button>

            <button
              type="button"
              class="ambient-btn"
              :class="{ active: isAutoPlaying }"
              @click="toggleAutoPlay"
            >
              <q-icon
                :name="isAutoPlaying ? 'pause_circle' : 'play_circle'"
                size="20px"
                class="q-mr-xs"
              />
              <span>{{ isAutoPlaying ? 'Pause Ambient' : 'Auto-Cycle (7s)' }}</span>
            </button>
          </div>

          <div class="keyboard-hints q-mt-sm">
            <span>Tip: Press <code>Space</code> to count Dhikr, <code>→</code> for Next Random</span>
          </div>

          <!-- Jump to grid link -->
          <div class="jump-link-row q-mt-lg">
            <button
              type="button"
              class="text-link-btn"
              @click="viewMode = 'shuffled'"
            >
              <q-icon name="grid_view" size="16px" class="q-mr-xs" />
              <span>Browse All 99 Names in Shuffled Order ↓</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ── MODE 2 & 3: SHUFFLED / ALL 99 GRID ── -->
      <section v-else class="grid-section">
        <!-- Banner for Shuffled Mode -->
        <div v-if="viewMode === 'shuffled'" class="shuffled-banner q-mb-md">
          <div class="shuffled-banner-text">
            <q-icon name="shuffle" size="20px" class="q-mr-xs" />
            <span>
              <strong>Randomized Non-Iterative Grid:</strong> The 99 names are
              shuffled randomly for spontaneous reflection.
            </span>
          </div>
          <button
            type="button"
            class="reshuffle-btn"
            @click="shuffleNames"
          >
            <q-icon name="shuffle" size="16px" class="q-mr-xs" />
            <span>Reshuffle</span>
          </button>
        </div>

        <!-- Interactive Search & Category Filters -->
        <div class="filter-controls q-mb-lg">
          <div class="search-input-wrap">
            <q-icon name="search" size="20px" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Search by Arabic name, English, transliteration, or meaning..."
            />
            <button
              v-if="searchQuery"
              type="button"
              class="clear-search-btn"
              @click="searchQuery = ''"
            >
              <q-icon name="close" size="16px" />
            </button>
          </div>

          <div class="category-chips-scroll">
            <button
              v-for="cat in categories"
              :key="cat.key"
              type="button"
              class="cat-chip"
              :class="{ active: selectedCategory === cat.key }"
              @click="selectedCategory = cat.key"
            >
              <q-icon :name="cat.icon" size="15px" class="q-mr-xs" />
              <span>{{ cat.label }}</span>
            </button>
          </div>

          <div class="result-count-row">
            <span>Showing {{ filteredNames.length }} of 99 names</span>
            <button
              type="button"
              class="switch-to-random-btn"
              @click="viewMode = 'random'"
            >
              <q-icon name="casino" size="14px" class="q-mr-xs" />
              <span>Random Focus Card</span>
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredNames.length === 0" class="empty-state">
          <q-icon name="search_off" size="48px" color="amber-8" />
          <div class="empty-title">No matching Holy Names found</div>
          <button
            type="button"
            class="reset-filters-btn"
            @click="
              () => {
                searchQuery = ''
                selectedCategory = 'all'
              }
            "
          >
            Clear Filters
          </button>
        </div>

        <!-- Masonry Grid with Interactive Cards -->
        <div v-else class="names-grid">
          <div
            v-for="one in filteredNames"
            :key="one.id"
            class="glory-card islamic-border interactive"
            @click="openNameModal(one)"
          >
            <div class="card-meta-top">
              <span class="card-id-badge">#{{ one.id }}</span>
              <div class="card-mini-actions" @click.stop>
                <button
                  type="button"
                  class="mini-audio-btn"
                  title="Listen"
                  @click.stop="playPronunciation(one)"
                >
                  <q-icon name="volume_up" size="16px" />
                </button>
                <button
                  type="button"
                  class="mini-bookmark-btn"
                  :class="{ bookmarked: isBookmarked(one.id) }"
                  title="Bookmark"
                  @click.stop="toggleBookmark(one.id)"
                >
                  <q-icon
                    :name="isBookmarked(one.id) ? 'star' : 'star_outline'"
                    size="16px"
                  />
                </button>
              </div>
            </div>

            <span class="arabic-name">{{ one.name }}</span>
            <span v-if="locale !== 'ar'" class="latin-name">{{ one.text }}</span>
            <span class="transliteration">{{ $t(one.transliterationKey) }}</span>
            <span class="meaning">{{ $t(one.meaningKey) }}</span>

            <div class="card-footer-tap">
              <span>Tap for Tasbeeh & reflection ➔</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ── INTERACTIVE MODAL DIALOG FOR ANY CLICKED NAME ── -->
    <q-dialog v-model="isModalOpen">
      <div v-if="activeModalName" class="holy-dialog-card islamic-border">
        <div class="dialog-header">
          <span class="random-badge">
            #{{ activeModalName.id }} of 99 • {{ activeModalName.category }}
          </span>
          <button
            type="button"
            class="dialog-close-btn"
            @click="closeNameModal"
          >
            <q-icon name="close" size="20px" />
          </button>
        </div>

        <div class="dialog-arabic-name">{{ activeModalName.name }}</div>
        <div class="dialog-latin-name">{{ activeModalName.text }}</div>
        <div class="dialog-transliteration">
          {{ $t(activeModalName.transliterationKey) }}
        </div>
        <div class="dialog-meaning">
          {{ $t(activeModalName.meaningKey) }}
        </div>

        <!-- Audio recitation in modal -->
        <div class="dialog-audio-row q-mt-md">
          <button
            type="button"
            class="hero-audio-btn"
            :class="{ playing: isPlayingAudio }"
            @click="playPronunciation(activeModalName)"
          >
            <q-icon name="volume_up" size="18px" class="q-mr-xs" />
            <span>Listen Pronunciation</span>
          </button>
        </div>

        <!-- Tasbeeh Counter in modal -->
        <div class="modal-dhikr-box q-mt-md">
          <div class="dhikr-counter-orb" @click="incrementModalDhikr">
            <div class="dhikr-num">{{ modalDhikrCount }}</div>
            <div class="dhikr-subtext">Tap to praise • ذكر</div>
          </div>
          <button
            type="button"
            class="dhikr-reset-btn q-mt-xs"
            @click="resetModalDhikr"
          >
            Reset Count
          </button>
        </div>

        <!-- Modal Controls: Prev, Random, Next, Share -->
        <div class="modal-nav-row q-mt-lg">
          <button type="button" class="nav-arrow-btn" @click="prevModalName">
            <q-icon name="arrow_back" size="18px" />
            <span>Prev</span>
          </button>
          <button type="button" class="modal-random-btn" @click="randomModalName">
            <q-icon name="casino" size="18px" class="q-mr-xs" />
            <span>Random</span>
          </button>
          <button type="button" class="nav-arrow-btn" @click="nextModalName">
            <span>Next</span>
            <q-icon name="arrow_forward" size="18px" />
          </button>
        </div>

        <div class="modal-bottom-actions q-mt-md">
          <button
            type="button"
            class="modal-share-btn"
            @click="shareOrCopyName(activeModalName)"
          >
            <q-icon name="share" size="16px" class="q-mr-xs" />
            <span>Share / Copy</span>
          </button>
          <button
            type="button"
            class="modal-fav-btn"
            :class="{ bookmarked: isBookmarked(activeModalName.id) }"
            @click="toggleBookmark(activeModalName.id)"
          >
            <q-icon
              :name="
                isBookmarked(activeModalName.id) ? 'star' : 'star_outline'
              "
              size="16px"
              class="q-mr-xs"
            />
            <span>
              {{
                isBookmarked(activeModalName.id)
                  ? 'Bookmarked'
                  : 'Add to Bookmarks'
              }}
            </span>
          </button>
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<style lang="scss" scoped>
.holynames-page {
  background: linear-gradient(135deg, #f9fafb 0%, #e8f0e8 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  position: relative;
  z-index: 1;
}

.sparkle-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.sparkle {
  position: absolute;
  left: var(--sparkle-left);
  top: var(--sparkle-top);
  width: var(--sparkle-size);
  height: var(--sparkle-size);
  border-radius: 999px;
  opacity: var(--sparkle-opacity);
  background: radial-gradient(
    circle,
    rgba(255, 249, 214, 1) 0%,
    rgba(246, 208, 107, 0.95) 35%,
    rgba(246, 208, 107, 0.18) 68%,
    transparent 74%
  );
  filter: drop-shadow(0 0 8px rgba(246, 208, 107, 0.32));
  animation:
    sparklePulse var(--sparkle-duration) ease-in-out infinite,
    sparkleFloat calc(var(--sparkle-duration) + 1.4s) ease-in-out infinite;
  animation-delay: var(--sparkle-delay);
}

.sparkle::before,
.sparkle::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 245, 200, 0.95) 50%,
    transparent 100%
  );
}

.sparkle::before {
  width: calc(var(--sparkle-size) * 3.2);
  height: 1px;
}

.sparkle::after {
  width: 1px;
  height: calc(var(--sparkle-size) * 3.2);
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 245, 200, 0.95) 50%,
    transparent 100%
  );
}

.bismillah {
  font-family: 'Amiri', serif;
  font-size: clamp(2rem, 6vw, 8rem);
  color: #bfa14a;
  text-align: center;
  letter-spacing: 0.2em;
  text-shadow: 0 2px 8px #e0d7c6;
  margin-bottom: 2rem;
}

.page-title {
  text-align: center;
  font-family: 'Noto Naskh Arabic', 'Amiri', serif;
  color: #176a3a;
  font-weight: bold;
  letter-spacing: 0.05em;
}

.subtitle {
  text-align: center;
  font-family: 'Amiri', serif;
  color: #bfa14a;
  letter-spacing: 0.1em;
}

.names-grid {
  column-count: 4;
  column-gap: 2rem;
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 1rem;
  box-sizing: border-box;
}

@media (max-width: 1200px) {
  .names-grid {
    column-count: 3;
  }
}

@media (max-width: 900px) {
  .names-grid {
    column-count: 2;
  }
}

@media (max-width: 600px) {
  .names-grid {
    column-count: 1;
  }
}

.glory-card {
  background: #fffbe6;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(34, 139, 34, 0.08);
  padding: 1.2rem 0.5rem;
  text-align: center;
  border: 2px solid #e0d7c6;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  word-break: break-word;
  box-sizing: border-box;
  margin-bottom: 2rem;
  break-inside: avoid;
  page-break-inside: avoid;
}

.glory-card::before {
  content: '';
  position: absolute;
  inset: -120% -30%;
  background: linear-gradient(
    120deg,
    transparent 34%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 66%
  );
  transform: translateX(-130%) rotate(12deg);
  transition:
    transform 0.9s ease,
    opacity 0.35s ease;
  opacity: 0;
}

.glory-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 8px 32px 0 rgba(34, 139, 34, 0.18);
  border-color: #bfa14a;
}

.glory-card:hover::before {
  transform: translateX(130%) rotate(12deg);
  opacity: 1;
}

.islamic-border {
  border-image: url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="38" height="38" rx="8" stroke="%23bfa14a" stroke-width="2" stroke-dasharray="6 4"/></svg>')
    8 stretch;
}

.arabic-name {
  display: block;
  font-family: 'Noto Naskh Arabic', 'Amiri', serif;
  font-size: 2.2rem;
  color: #176a3a;
  margin-bottom: 0.5rem;
  font-weight: bold;
  letter-spacing: 0.1em;
}

.latin-name {
  display: block;
  font-size: 1.1rem;
  color: #7c6f57;
  font-family: 'Lato', sans-serif;
  margin-top: 0.2rem;
}

.transliteration {
  display: block;
  font-size: 1rem;
  color: #bfa14a;
  font-family: 'Lato', sans-serif;
  margin-top: 0.2rem;
}

.meaning {
  display: block;
  font-size: 0.95rem;
  color: #176a3a;
  font-family: 'Lato', sans-serif;
  margin-top: 0.2rem;
}

:global(body.body--dark) .holynames-page {
  background: linear-gradient(180deg, #040404 0%, #000000 100%);
}

:global(body.body--dark) .holynames-page .sparkle-layer {
  opacity: 1;
}

:global(body.body--dark) .holynames-page .bismillah {
  color: #efd48a;
  text-shadow:
    0 0 18px rgba(239, 212, 138, 0.26),
    0 0 42px rgba(191, 161, 74, 0.14);
}

:global(body.body--dark) .holynames-page .page-title {
  color: #f4e7b2;
  text-shadow: 0 0 26px rgba(191, 161, 74, 0.18);
}

:global(body.body--dark) .holynames-page .subtitle {
  color: #d8bb64;
}

:global(body.body--dark) .holynames-page .glory-card {
  background: linear-gradient(
    180deg,
    rgba(8, 8, 8, 0.96) 0%,
    rgba(15, 15, 15, 0.95) 100%
  );
  border-color: rgba(191, 161, 74, 0.34);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.52),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

:global(body.body--dark) .holynames-page .glory-card:hover {
  border-color: #f1d37a;
  box-shadow:
    0 18px 38px rgba(0, 0, 0, 0.62),
    0 0 28px rgba(191, 161, 74, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

:global(body.body--dark) .holynames-page .arabic-name {
  color: #f7efcb;
}

:global(body.body--dark) .holynames-page .latin-name {
  color: #d0c3a3;
}

:global(body.body--dark) .holynames-page .transliteration {
  color: #e0bd61;
}

:global(body.body--dark) .holynames-page .meaning {
  color: #a7d2b4;
}

@keyframes sparklePulse {
  0%,
  100% {
    opacity: calc(var(--sparkle-opacity) * 0.45);
    transform: scale(0.82) rotate(0deg);
  }
  40% {
    opacity: var(--sparkle-opacity);
    transform: scale(1.12) rotate(8deg);
  }
  65% {
    opacity: calc(var(--sparkle-opacity) * 0.7);
    transform: scale(0.96) rotate(-6deg);
  }
}

@keyframes sparkleFloat {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-10px) translateX(4px);
  }
}

@media (max-width: 600px) {
  .names-grid {
    column-count: 1;
    padding: 0 0.3rem;
  }

  .glory-card {
    padding: 1rem 0.3rem;
    font-size: 1.1rem;
    margin-bottom: 1.2rem;
  }

  .arabic-name {
    font-size: 1.4rem;
  }

  :global(body.body--dark) .holynames-page .sparkle-layer {
    opacity: 0.82;
  }
}

/* ── VIEW MODE BAR ── */
.view-mode-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.mode-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgba(191, 161, 74, 0.4);
  background: rgba(255, 255, 255, 0.7);
  color: #176a3a;
  font-family: 'Lato', sans-serif;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 250, 230, 0.95);
    border-color: #bfa14a;
    transform: translateY(-2px);
  }

  &.active {
    background: linear-gradient(135deg, #bfa14a 0%, #947225 100%);
    color: #ffffff;
    border-color: #947225;
    box-shadow: 0 4px 14px rgba(191, 161, 74, 0.35);
  }
}

/* ── RANDOM HERO CARD (MODE 1) ── */
.random-section {
  max-width: 680px;
  margin: 0 auto 3rem auto;
}

.random-hero-card {
  background: linear-gradient(180deg, #fffdf2 0%, #fff9e6 100%);
  border-radius: 2rem;
  padding: 2rem 1.8rem;
  text-align: center;
  border: 2px solid #e0d7c6;
  box-shadow: 0 16px 48px rgba(34, 139, 34, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  gap: 0.5rem;
}

.random-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(191, 161, 74, 0.16);
  color: #8c6d1f;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(23, 106, 58, 0.12);
  color: #176a3a;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: capitalize;
}

.card-quick-actions {
  display: flex;
  gap: 0.4rem;
}

.icon-action-btn {
  background: transparent;
  border: none;
  color: #7c6f57;
  padding: 0.4rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(191, 161, 74, 0.15);
    color: #bfa14a;
  }

  &.bookmarked {
    color: #e0bd61;
  }
}

.hero-arabic-wrap {
  margin: 1.2rem 0;
}

.hero-arabic-name {
  font-family: 'Noto Naskh Arabic', 'Amiri', serif;
  font-size: clamp(3rem, 8vw, 5.2rem);
  color: #176a3a;
  font-weight: bold;
  letter-spacing: 0.08em;
  line-height: 1.25;
  text-shadow: 0 4px 16px rgba(191, 161, 74, 0.22);
}

.hero-info {
  margin-bottom: 1.2rem;
}

.hero-latin-name {
  font-size: 1.45rem;
  color: #7c6f57;
  font-weight: 600;
  font-family: 'Lato', sans-serif;
}

.hero-transliteration {
  font-size: 1.25rem;
  color: #bfa14a;
  font-weight: 600;
  margin-top: 0.3rem;
}

.hero-meaning {
  font-size: 1.15rem;
  color: #176a3a;
  margin-top: 0.35rem;
  font-style: italic;
}

/* Audio button */
.hero-audio-row {
  display: flex;
  justify-content: center;
}

.hero-audio-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  background: rgba(23, 106, 58, 0.08);
  border: 1px solid rgba(23, 106, 58, 0.25);
  color: #176a3a;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(23, 106, 58, 0.16);
    border-color: #176a3a;
    transform: scale(1.02);
  }

  &.playing {
    background: #176a3a;
    color: #ffffff;
    box-shadow: 0 0 16px rgba(23, 106, 58, 0.4);
    animation: pulseAudio 1.5s infinite;
  }
}

@keyframes pulseAudio {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

/* Dhikr Tasbeeh section */
.hero-dhikr-box {
  background: rgba(255, 255, 255, 0.65);
  border: 1px dashed rgba(191, 161, 74, 0.45);
  border-radius: 1.5rem;
  padding: 1.2rem 1rem;
  margin: 1.5rem auto 0 auto;
  max-width: 440px;
}

.dhikr-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.86rem;
  font-weight: 700;
  color: #7c6f57;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.8rem;
}

.dhikr-reset-btn {
  background: transparent;
  border: none;
  color: #947225;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;

  &:hover {
    background: rgba(191, 161, 74, 0.15);
  }
}

.dhikr-counter-orb {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  margin: 0.5rem auto;
  background: radial-gradient(circle, #ffffff 0%, #fff7d6 75%, #f2e3ad 100%);
  border: 3px solid #bfa14a;
  box-shadow:
    0 8px 24px rgba(191, 161, 74, 0.25),
    inset 0 0 12px rgba(191, 161, 74, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition:
    transform 0.1s ease,
    box-shadow 0.15s ease;

  &:active {
    transform: scale(0.94);
    box-shadow: 0 4px 12px rgba(191, 161, 74, 0.35);
  }
}

.dhikr-num {
  font-size: 2.4rem;
  font-weight: 800;
  color: #176a3a;
  line-height: 1;
}

.dhikr-target {
  font-size: 0.82rem;
  color: #7c6f57;
  font-weight: 600;
}

.dhikr-subtext {
  font-size: 0.65rem;
  color: #8c6d1f;
  margin-top: 0.2rem;
}

.target-chips-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
}

.target-title {
  font-size: 0.8rem;
  color: #7c6f57;
  font-weight: 600;
}

.target-pill {
  background: transparent;
  border: 1px solid rgba(191, 161, 74, 0.35);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #7c6f57;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #bfa14a;
    color: #176a3a;
  }

  &.active {
    background: #bfa14a;
    color: #ffffff;
    border-color: #bfa14a;
  }
}

/* Hero primary actions */
.hero-actions-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.cta-random-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.85rem 1.8rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #d4af37 0%, #aa771c 100%);
  border: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(170, 119, 28, 0.35);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 30px rgba(170, 119, 28, 0.45);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
}

.ambient-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.85rem 1.4rem;
  border-radius: 999px;
  background: rgba(23, 106, 58, 0.08);
  border: 1.5px solid rgba(23, 106, 58, 0.25);
  color: #176a3a;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(23, 106, 58, 0.16);
    border-color: #176a3a;
  }

  &.active {
    background: #176a3a;
    color: #ffffff;
    border-color: #176a3a;
    box-shadow: 0 0 16px rgba(23, 106, 58, 0.35);
  }
}

.keyboard-hints {
  font-size: 0.76rem;
  color: #7c6f57;

  code {
    background: rgba(191, 161, 74, 0.15);
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    font-weight: 700;
  }
}

.jump-link-row {
  margin-top: 1.5rem;
}

.text-link-btn {
  background: transparent;
  border: none;
  color: #947225;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: underline;
  text-underline-offset: 4px;

  &:hover {
    color: #176a3a;
  }
}

/* ── SHUFFLED BANNER ── */
.shuffled-banner {
  max-width: 1200px;
  margin: 0 auto 1.5rem auto;
  padding: 0.75rem 1.2rem;
  background: rgba(23, 106, 58, 0.08);
  border: 1px dashed rgba(23, 106, 58, 0.3);
  border-radius: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.shuffled-banner-text {
  display: flex;
  align-items: center;
  color: #176a3a;
  font-size: 0.9rem;
}

.reshuffle-btn {
  display: inline-flex;
  align-items: center;
  background: #176a3a;
  color: #ffffff;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #12522c;
    transform: scale(1.03);
  }
}

/* ── SEARCH & CATEGORY FILTERS ── */
.filter-controls {
  max-width: 1200px;
  margin: 0 auto;
}

.search-input-wrap {
  position: relative;
  max-width: 620px;
  margin: 0 auto 1rem auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #947225;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.8rem;
  border-radius: 999px;
  border: 2px solid rgba(191, 161, 74, 0.4);
  background: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  color: #1f2937;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #bfa14a;
    box-shadow: 0 0 16px rgba(191, 161, 74, 0.25);
    background: #ffffff;
  }
}

.clear-search-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #7c6f57;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 50%;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
}

.category-chips-scroll {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 0.8rem;
}

.cat-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(191, 161, 74, 0.3);
  color: #7c6f57;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 250, 230, 0.9);
    border-color: #bfa14a;
    color: #176a3a;
  }

  &.active {
    background: #176a3a;
    color: #ffffff;
    border-color: #176a3a;
    box-shadow: 0 2px 8px rgba(23, 106, 58, 0.25);
  }
}

.result-count-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.84rem;
  color: #7c6f57;
  padding: 0 0.5rem;
}

.switch-to-random-btn {
  background: transparent;
  border: 1px solid rgba(191, 161, 74, 0.4);
  color: #947225;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  &:hover {
    background: rgba(191, 161, 74, 0.15);
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-title {
  font-size: 1.2rem;
  color: #7c6f57;
  margin: 0.8rem 0 1rem 0;
}

.reset-filters-btn {
  background: #176a3a;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
}

/* Interactive Card additions */
.glory-card.interactive {
  cursor: pointer;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
}

.card-meta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.4rem;
}

.card-id-badge {
  background: rgba(191, 161, 74, 0.15);
  color: #947225;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
}

.card-mini-actions {
  display: flex;
  gap: 0.25rem;
}

.mini-audio-btn,
.mini-bookmark-btn {
  background: transparent;
  border: none;
  color: #7c6f57;
  padding: 0.2rem;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #176a3a;
    background: rgba(23, 106, 58, 0.1);
  }

  &.bookmarked {
    color: #e0bd61;
  }
}

.card-footer-tap {
  margin-top: 0.6rem;
  font-size: 0.72rem;
  color: #947225;
  font-weight: 600;
  opacity: 0.85;
}

/* ── INTERACTIVE MODAL DIALOG ── */
.holy-dialog-card {
  background: linear-gradient(180deg, #fffdf2 0%, #fff9e6 100%);
  border-radius: 1.8rem;
  padding: 1.8rem;
  max-width: 540px;
  width: 90vw;
  text-align: center;
  border: 2px solid #bfa14a;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  position: relative;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dialog-close-btn {
  background: transparent;
  border: none;
  color: #7c6f57;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
}

.dialog-arabic-name {
  font-family: 'Noto Naskh Arabic', 'Amiri', serif;
  font-size: clamp(2.8rem, 7vw, 4.2rem);
  color: #176a3a;
  font-weight: bold;
  letter-spacing: 0.08em;
  margin: 0.5rem 0;
}

.dialog-latin-name {
  font-size: 1.3rem;
  color: #7c6f57;
  font-weight: 600;
}

.dialog-transliteration {
  font-size: 1.15rem;
  color: #bfa14a;
  font-weight: 600;
}

.dialog-meaning {
  font-size: 1.05rem;
  color: #176a3a;
  font-style: italic;
  margin-top: 0.3rem;
}

.dialog-audio-row {
  display: flex;
  justify-content: center;
}

.modal-dhikr-box {
  background: rgba(255, 255, 255, 0.65);
  border: 1px dashed rgba(191, 161, 74, 0.45);
  border-radius: 1.2rem;
  padding: 1rem;
  max-width: 320px;
  margin: 1rem auto;
}

.modal-nav-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.nav-arrow-btn {
  background: rgba(23, 106, 58, 0.08);
  border: 1px solid rgba(23, 106, 58, 0.25);
  color: #176a3a;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background: rgba(23, 106, 58, 0.16);
  }
}

.modal-random-btn {
  background: linear-gradient(135deg, #d4af37 0%, #aa771c 100%);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  &:hover {
    transform: scale(1.03);
  }
}

.modal-bottom-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.modal-share-btn,
.modal-fav-btn {
  background: transparent;
  border: 1px solid rgba(191, 161, 74, 0.4);
  color: #7c6f57;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  &:hover {
    border-color: #bfa14a;
    color: #176a3a;
  }

  &.bookmarked {
    color: #e0bd61;
    border-color: #e0bd61;
  }
}

/* ── DARK MODE OVERRIDES ── */
:global(body.body--dark) .holynames-page {
  .mode-pill {
    background: rgba(20, 20, 20, 0.8);
    border-color: rgba(191, 161, 74, 0.3);
    color: #d8bb64;

    &:hover {
      background: rgba(35, 35, 35, 0.9);
      border-color: #f1d37a;
    }

    &.active {
      background: linear-gradient(135deg, #d4af37 0%, #aa771c 100%);
      color: #000000;
      border-color: #f1d37a;
      box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
    }
  }

  .random-hero-card {
    background: linear-gradient(
      180deg,
      rgba(14, 14, 14, 0.96) 0%,
      rgba(8, 8, 8, 0.98) 100%
    );
    border-color: rgba(191, 161, 74, 0.4);
    box-shadow:
      0 16px 48px rgba(0, 0, 0, 0.75),
      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  .random-badge {
    background: rgba(191, 161, 74, 0.22);
    color: #f1d37a;
  }

  .category-pill {
    background: rgba(23, 106, 58, 0.35);
    color: #a7d2b4;
  }

  .icon-action-btn {
    color: #a0937a;

    &:hover {
      background: rgba(191, 161, 74, 0.2);
      color: #f1d37a;
    }

    &.bookmarked {
      color: #f1d37a;
    }
  }

  .hero-arabic-name {
    color: #f7efcb;
    text-shadow: 0 0 24px rgba(246, 208, 107, 0.35);
  }

  .hero-latin-name {
    color: #d0c3a3;
  }

  .hero-transliteration {
    color: #f1d37a;
  }

  .hero-meaning {
    color: #a7d2b4;
  }

  .hero-audio-btn {
    background: rgba(23, 106, 58, 0.25);
    border-color: rgba(167, 210, 180, 0.35);
    color: #a7d2b4;

    &:hover {
      background: rgba(23, 106, 58, 0.45);
      border-color: #a7d2b4;
    }

    &.playing {
      background: #176a3a;
      color: #ffffff;
      box-shadow: 0 0 20px rgba(167, 210, 180, 0.5);
    }
  }

  .hero-dhikr-box {
    background: rgba(20, 20, 20, 0.85);
    border-color: rgba(191, 161, 74, 0.3);
  }

  .dhikr-label {
    color: #a0937a;
  }

  .dhikr-reset-btn {
    color: #f1d37a;

    &:hover {
      background: rgba(191, 161, 74, 0.2);
    }
  }

  .dhikr-counter-orb {
    background: radial-gradient(circle, #252525 0%, #151515 70%, #0d0d0d 100%);
    border-color: #d4af37;
    box-shadow:
      0 8px 28px rgba(0, 0, 0, 0.8),
      inset 0 0 16px rgba(212, 175, 55, 0.2);
  }

  .dhikr-num {
    color: #f1d37a;
  }

  .dhikr-target {
    color: #a0937a;
  }

  .dhikr-subtext {
    color: #d8bb64;
  }

  .target-title {
    color: #a0937a;
  }

  .target-pill {
    border-color: rgba(191, 161, 74, 0.3);
    color: #a0937a;

    &:hover {
      border-color: #f1d37a;
      color: #f1d37a;
    }

    &.active {
      background: #d4af37;
      color: #000000;
      border-color: #d4af37;
    }
  }

  .cta-random-btn {
    background: linear-gradient(135deg, #f1d37a 0%, #d4af37 100%);
    color: #000000;
    box-shadow: 0 8px 24px rgba(241, 211, 122, 0.35);
  }

  .ambient-btn {
    background: rgba(20, 20, 20, 0.85);
    border-color: rgba(191, 161, 74, 0.35);
    color: #f1d37a;

    &:hover {
      background: rgba(35, 35, 35, 0.95);
      border-color: #f1d37a;
    }

    &.active {
      background: #176a3a;
      color: #ffffff;
      border-color: #176a3a;
    }
  }

  .keyboard-hints {
    color: #8c826e;

    code {
      background: rgba(191, 161, 74, 0.2);
      color: #f1d37a;
    }
  }

  .text-link-btn {
    color: #f1d37a;

    &:hover {
      color: #ffffff;
    }
  }

  .shuffled-banner {
    background: rgba(23, 106, 58, 0.2);
    border-color: rgba(167, 210, 180, 0.25);
  }

  .shuffled-banner-text {
    color: #a7d2b4;
  }

  .reshuffle-btn {
    background: #176a3a;
    color: #ffffff;

    &:hover {
      background: #1e7b45;
    }
  }

  .search-input {
    background: rgba(20, 20, 20, 0.85);
    border-color: rgba(191, 161, 74, 0.35);
    color: #f3f4f6;

    &:focus {
      border-color: #f1d37a;
      box-shadow: 0 0 20px rgba(241, 211, 122, 0.25);
      background: rgba(30, 30, 30, 0.95);
    }
  }

  .search-icon {
    color: #f1d37a;
  }

  .clear-search-btn {
    color: #a0937a;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .cat-chip {
    background: rgba(20, 20, 20, 0.85);
    border-color: rgba(191, 161, 74, 0.3);
    color: #d0c3a3;

    &:hover {
      border-color: #f1d37a;
      color: #f1d37a;
      background: rgba(35, 35, 35, 0.95);
    }

    &.active {
      background: #176a3a;
      color: #ffffff;
      border-color: #176a3a;
      box-shadow: 0 2px 10px rgba(23, 106, 58, 0.5);
    }
  }

  .result-count-row {
    color: #a0937a;
  }

  .switch-to-random-btn {
    border-color: rgba(191, 161, 74, 0.35);
    color: #f1d37a;

    &:hover {
      background: rgba(191, 161, 74, 0.2);
    }
  }

  .empty-title {
    color: #a0937a;
  }

  .card-id-badge {
    background: rgba(191, 161, 74, 0.2);
    color: #f1d37a;
  }

  .mini-audio-btn,
  .mini-bookmark-btn {
    color: #a0937a;

    &:hover {
      color: #f1d37a;
      background: rgba(191, 161, 74, 0.2);
    }

    &.bookmarked {
      color: #f1d37a;
    }
  }

  .card-footer-tap {
    color: #f1d37a;
  }

  .holy-dialog-card {
    background: linear-gradient(
      180deg,
      rgba(15, 15, 15, 0.98) 0%,
      rgba(8, 8, 8, 0.99) 100%
    );
    border-color: #d4af37;
    box-shadow:
      0 24px 60px rgba(0, 0, 0, 0.9),
      0 0 35px rgba(212, 175, 55, 0.25);
  }

  .dialog-close-btn {
    color: #a0937a;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .dialog-arabic-name {
    color: #f7efcb;
    text-shadow: 0 0 20px rgba(246, 208, 107, 0.35);
  }

  .dialog-latin-name {
    color: #d0c3a3;
  }

  .dialog-transliteration {
    color: #f1d37a;
  }

  .dialog-meaning {
    color: #a7d2b4;
  }

  .modal-dhikr-box {
    background: rgba(20, 20, 20, 0.85);
    border-color: rgba(191, 161, 74, 0.3);
  }

  .nav-arrow-btn {
    background: rgba(20, 20, 20, 0.85);
    border-color: rgba(191, 161, 74, 0.3);
    color: #f1d37a;

    &:hover {
      background: rgba(35, 35, 35, 0.95);
    }
  }

  .modal-random-btn {
    background: linear-gradient(135deg, #f1d37a 0%, #d4af37 100%);
    color: #000000;
  }

  .modal-share-btn,
  .modal-fav-btn {
    border-color: rgba(191, 161, 74, 0.35);
    color: #a0937a;

    &:hover {
      border-color: #f1d37a;
      color: #f1d37a;
    }

    &.bookmarked {
      color: #f1d37a;
      border-color: #f1d37a;
    }
  }
}
</style>
