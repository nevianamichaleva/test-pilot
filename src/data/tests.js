/**
 * Дефиниции на тестове. Ключ: "class|subject|testSlug"
 *
 * Въпросите по предмет са в отделни файлове:
 * - bulgarski-tests.js (Български език)
 * - seventh-grade-tests.js (НВО БЕЛ 7. клас — виж бележките за конвенции в началото на файла)
 * - geografia-tests.js (География)
 * - english-tests.js (Английски език)
 * - istoriya-tests.js (История)
 * - priroda-tests.js (Човек и природа)
 * - literatura-tests.js (Литература)
 *
 * URL на тест: /test-pilot/клас/предмет/slug
 */

import {
  BULGARSKI_DUMITE_KATO_CHASTI_NA_IZRECHENIETO_OBOBSHTENIE_QUESTIONS,
  BULGARSKI_EZIK_LITERATURA_V_KLAS_2008_QUESTIONS,
  BULGARSKI_EZIK_LITERATURA_V_KLAS_2009_QUESTIONS,
  BULGARSKI_EZIK_LITERATURA_V_KLAS_QUESTIONS,
  BULGARSKI_GLAGOL_MINALO_QUESTIONS,
  BULGARSKI_GRAMATIKA_4_QUESTIONS,
  BULGARSKI_GRAMATIKA_IZBOR_QUESTIONS,
  BULGARSKI_GRAMATIKA_ZADACHI_QUESTIONS,
  BULGARSKI_HAYDUTI_5_KLAS_LITERATURA_2_QUESTIONS,
  BULGARSKI_HAYDUTI_5_KLAS_TEST_QUESTIONS,
  BULGARSKI_KLASNA_RABOTA_1_QUESTIONS,
  BULGARSKI_KLASNA_RABOTA_2_VARIANT_QUESTIONS,
  BULGARSKI_KLASNA_RABOTA_3_QUESTIONS,
  BULGARSKI_MORFOLOGIYA_QUESTIONS,
  BULGARSKI_NARECHIE_QUESTIONS,
  BULGARSKI_OBOBSHTENIE_QUESTIONS,
  BULGARSKI_OPREDELENIE_POPALVANE_QUESTIONS,
  BULGARSKI_PRAKTICHESKI_QUESTIONS,
  BULGARSKI_PREDLOG_QUESTIONS,
  BULGARSKI_PRICHASTIQ_QUESTIONS,
  BULGARSKI_PRITEJATELNO_MESTOIMENIE_QUESTIONS,
  BULGARSKI_PROSTO_IZRECHENIE_SYNTAKSIS_QUESTIONS,
  BULGARSKI_TETRADKA_IZBOR_QUESTIONS,
  BULGARSKI_VAZVRATNO_MESTOIMENIE_QUESTIONS,
} from './bulgarski-tests';

import {
  BULGARSKI_NVO_7_BEL_2016_V2_QUESTIONS,
  BULGARSKI_NVO_7_BEL_2017_V2_QUESTIONS,
  BULGARSKI_NVO_7_BEL_2018_V2_QUESTIONS,
  BULGARSKI_NVO_7_BEL_2019_V1_QUESTIONS,
  BULGARSKI_NVO_7_BEL_2020_V1_QUESTIONS,
  BULGARSKI_NVO_7_BEL_2021_V1_QUESTIONS,
  BULGARSKI_NVO_7_BEL_2022_V1_QUESTIONS,
  BULGARSKI_NVO_7_BEL_2023_13062023_V2_QUESTIONS,
  BULGARSKI_NVO_7_BEL_2024_QUESTIONS,
  BULGARSKI_NVO_7_BEL_2025_QUESTIONS,
  BULGARSKI_NVO_7_BEL_2026_MODEL_QUESTIONS,
} from './seventh-grade-tests';

import {
  GEOGRAFIA_DOPALNITELNI_QUESTIONS,
  GEOGRAFIA_IKONOMIKA_PART1,
  GEOGRAFIA_IKONOMIKA_PART2,
  GEOGRAFIA_IKONOMIKA_PART3,
  GEOGRAFIA_IZBOR_30_QUESTIONS,
  GEOGRAFIA_MIX_QUESTIONS,
  GEOGRAFIA_OBOBSTAVASHT_QUESTIONS,
  GEOGRAFIA_POPALVANE_QUESTIONS,
  GEOGRAFIA_PRIRODNI_ZONI_AFRIKA_QUESTIONS,
  GEOGRAFIA_VODITE_NA_AFRIKA_QUESTIONS,
} from './geografia-tests';

import {
  ENGLISH_14_04_2026_QUESTIONS,
  ENGLISH_6A_FIXED_TIMES_QUESTIONS,
  ENGLISH_ADVERBS_TRANSPORT_QUESTIONS,
  ENGLISH_GRAMMAR_6ABC_QUESTIONS,
  ENGLISH_HAVE_GO_DO_GET_QUESTIONS,
  ENGLISH_LANGUAGE_REVISION_QUESTIONS,
  ENGLISH_PRESENT_SIMPLE_AT_QUESTIONS,
  ENGLISH_ROUNDUP_6_WRITE_IN_QUESTIONS,
  ENGLISH_TIME_QUESTIONS,
  ENGLISH_UNIT_6C_QUESTIONS,
  ENGLISH_UNIT_7C_FILL_QUESTIONS,
  ENGLISH_UNIT_7C_VOCAB_QUESTIONS,
  ENGLISH_UNIT_8A_PAST_FILL_QUESTIONS,
  ENGLISH_UNIT_8A_PAST_QUESTIONS,
  ENGLISH_UNIT_8B_FILL_ONLY_QUESTIONS,
  ENGLISH_UNIT_8B_REGULAR_VERBS_MOTION_QUESTIONS,
  ENGLISH_UNIT_8B_TIGER_FILL_AND_VOCAB_QUESTIONS,
  ENGLISH_UNIT_8D_MOBILE_VOCAB_FILL_QUESTIONS,
  ENGLISH_UNIT_8C_PAST_SIMPLE_QUESTIONS,
} from './english-tests';

import {
  ISTORIA_CARSTVO_ODRISI,
  ISTORIA_OBOBSHTENIE_TRAKIYA,
  ISTORIA_ODRISKI_CARE,
  ISTORIA_OBSHTESTVO_I_RELIGIA_DREVEN_RIM_QUESTIONS,
  ISTORIA_PODREDBA_QUESTIONS,
  ISTORIA_RELIGIA,
  ISTORIA_RIM_POLITICI_I_POLITIKA_QUESTIONS,
  ISTORIA_RIM_SREDIZEMNOMORIETO_QUESTIONS,
  ISTORIA_RIMSKATA_IMPERIA_I_II_V_QUESTIONS,
  ISTORIA_SVAURZVANE_QUESTIONS,
  ISTORIA_UPRAJNENIE,
  ISTORIYA_DREVNA_TRAKIYA_QUESTIONS,
  ISTORIYA_TRAKIYA_OBSHTESTVO_QUESTIONS,
  KULTURA_TRAKIYA,
} from './istoriya-tests';

import {
  PRIRODA_CHP_TEST2_VESHTESTVA_I_TEHNI_SVOYSTVA_QUESTIONS,
  PRIRODA_EDNOKLETACHNI_MNOGOKLETACHNI_QUESTIONS,
  PRIRODA_FOTOSINTEZA_10_PLUS_3_QUESTIONS,
  PRIRODA_KLETKATA_OSNOVNA_GRADIVNA_EDINICA_QUESTIONS,
  PRIRODA_OBOBSHTENIE_VARIANT_1_QUESTIONS,
  PRIRODA_OBOBSHTENIE_VARIANT_2_QUESTIONS,
  PRIRODA_VESHTESTVA_SMESI_I_PROMENI_MIX_QUESTIONS,
  PRIRODA_VESHTESTVATA_I_TEHNITE_SVOYSTVA_QUESTIONS,
  PRIRODA_VODA_VAZDUH_SMESI_KONTROL_QUESTIONS,
  PRIRODA_VODATA_I_HORATA_QUESTIONS,
  PRIRODA_VOZDUH_QUESTIONS,
} from './priroda-tests';

import {
  LITERATURA_DA_PROVERIM_VAR1_QUESTIONS,
  LITERATURA_DA_PROVERIM_VAR2_QUESTIONS,
  LITERATURA_FOLKLOR_KALENDAR_QUESTIONS,
  LITERATURA_HAYDUTI_RABOTEN_LIST_18_03_2020_QUESTIONS,
  LITERATURA_HAYDUTI_TESTOVI_ZADACHI_PDF_QUESTIONS,
} from './literatura-tests';

const NVO_7_POINTS_BY_QNUM = {
  1: 1,
  2: 1,
  3: 2,
  4: 1,
  5: 2,
  6: 2,
  7: 1,
  8: 2,
  9: 2,
  10: 2,
  11: 2,
  12: 2,
  13: 2,
  14: 2,
  15: 2,
  16: 3,
  17: 14,
  18: 2,
  19: 2,
  20: 2,
  21: 2,
  22: 2,
  23: 2,
  24: 4,
  25: 6,
};

function addNvo7Points(questions) {
  if (!Array.isArray(questions)) return questions;
  return questions.map((q) => {
    if (!q || typeof q !== 'object') return q;
    if (typeof q.points === 'number') return q;
    const text = typeof q.q === 'string' ? q.q : '';
    const m = text.match(/^\s*(\d+)\./);
    if (!m) return q;
    const num = Number(m[1]);
    const pts = NVO_7_POINTS_BY_QNUM[num];
    if (typeof pts !== 'number') return q;
    return { ...q, points: pts };
  });
}

const TESTS = {
  '5|bg|morfolojiya': {
    title: 'Морфология – Изменяеми части на речта. Местоимение',
    slug: 'morfolojiya',
    questions: BULGARSKI_MORFOLOGIYA_QUESTIONS,
  },
  '5|bg|praktitcheski-zadachi': {
    title: 'Практически задачи – текст, морфология, правопис (стр. 62–63)',
    slug: 'praktitcheski-zadachi',
    questions: BULGARSKI_PRAKTICHESKI_QUESTIONS,
  },
  '5|bg|gramatika-izbor': {
    title: 'Граматика с избор – части на речта, време, синтаксис, правопис',
    slug: 'gramatika-izbor',
    questions: BULGARSKI_GRAMATIKA_IZBOR_QUESTIONS,
  },
  '5|bg|gramatika-zadachi': {
    title: 'Граматика – глаголи, предлози, причастия, наречия, местоимения',
    slug: 'gramatika-zadachi',
    questions: BULGARSKI_GRAMATIKA_ZADACHI_QUESTIONS,
  },
  '5|bg|vazvratno-mestoimenie': {
    title: 'Възвратно лично местоимение – се / си',
    slug: 'vazvratno-mestoimenie',
    questions: BULGARSKI_VAZVRATNO_MESTOIMENIE_QUESTIONS,
  },
  '5|bg|pritejatelno-mestoimenie': {
    title: 'Притежателно и възвратно притежателно местоимение',
    slug: 'pritejatelno-mestoimenie',
    questions: BULGARSKI_PRITEJATELNO_MESTOIMENIE_QUESTIONS,
  },
  '5|bg|glagol-minalo-vreme': {
    title: 'Глагол – минало свършено и минало несвършено време',
    slug: 'glagol-minalo-vreme',
    questions: BULGARSKI_GLAGOL_MINALO_QUESTIONS,
  },
  '5|bg|prichastiq': {
    title: 'Причастия – минало свършено и несвършено деятелно причастие',
    slug: 'prichastiq',
    questions: BULGARSKI_PRICHASTIQ_QUESTIONS,
  },
  '5|bg|narechie': {
    title: 'Неизменяеми части на речта. Наречие',
    slug: 'narechie',
    questions: BULGARSKI_NARECHIE_QUESTIONS,
  },
  '5|bg|predlog': {
    title: 'Неизменяеми части на речта. Предлог',
    slug: 'predlog',
    questions: BULGARSKI_PREDLOG_QUESTIONS,
  },
  '5|bg|obobshtenie': {
    title: 'Обобщение – думите като части на речта',
    slug: 'obobshtenie',
    questions: BULGARSKI_OBOBSHTENIE_QUESTIONS,
  },
  '5|bg|ezik-literatura-v-klas': {
    title: 'Български език и литература V клас (външно оценяване)',
    slug: 'ezik-literatura-v-klas',
    questions: BULGARSKI_EZIK_LITERATURA_V_KLAS_QUESTIONS,
  },
  '5|bg|ezik-literatura-v-klas-2009': {
    title: 'Български език и литература V клас – юни 2009',
    slug: 'ezik-literatura-v-klas-2009',
    questions: BULGARSKI_EZIK_LITERATURA_V_KLAS_2009_QUESTIONS,
  },
  '5|bg|ezik-literatura-v-klas-2008': {
    title: 'Български език и литература V клас – май 2008',
    slug: 'ezik-literatura-v-klas-2008',
    questions: BULGARSKI_EZIK_LITERATURA_V_KLAS_2008_QUESTIONS,
  },
  '5|bg|tetradka-izbor': {
    title: 'Български език – упражнения от тетрадка (избор)',
    slug: 'tetradka-izbor',
    questions: BULGARSKI_TETRADKA_IZBOR_QUESTIONS,
  },
  '5|bg|gramatika-4': {
    title: 'Български език – граматика (избор от 4 отговора)',
    slug: 'gramatika-4',
    questions: BULGARSKI_GRAMATIKA_4_QUESTIONS,
  },
  '5|bg|prosto-izrechenie-sintaksis': {
    title: 'Български език – Просто изречение и синтаксис',
    slug: 'prosto-izrechenie-sintaksis',
    questions: BULGARSKI_PROSTO_IZRECHENIE_SYNTAKSIS_QUESTIONS,
  },
  '5|bg|opredelenie-popalvane-10': {
    title: 'Български език – Определение (попълване, 10 въпроса)',
    slug: 'opredelenie-popalvane-10',
    questions: BULGARSKI_OPREDELENIE_POPALVANE_QUESTIONS,
  },
  '5|bg|klasna-rabota-1': {
    title: 'Класна работа №1 (част 1) – БЕЛ 5. клас',
    slug: 'klasna-rabota-1',
    questions: BULGARSKI_KLASNA_RABOTA_1_QUESTIONS,
  },
  '5|bg|klasna-rabota-2-variant': {
    title: 'Класна работа №2 – БЕЛ 5. клас (вариант)',
    slug: 'klasna-rabota-2-variant',
    questions: BULGARSKI_KLASNA_RABOTA_2_VARIANT_QUESTIONS,
  },
  '5|bg|klasna-rabota-3': {
    title: 'Класна работа №3 – БЕЛ 5. клас',
    slug: 'klasna-rabota-3',
    questions: BULGARSKI_KLASNA_RABOTA_3_QUESTIONS,
  },
  '5|bg|dumite-kato-chasti-na-izrechenieto-obobshtenie': {
    title: 'Български език – Думите като части на изречението (обобщение, смесен тест)',
    slug: 'dumite-kato-chasti-na-izrechenieto-obobshtenie',
    questions: BULGARSKI_DUMITE_KATO_CHASTI_NA_IZRECHENIETO_OBOBSHTENIE_QUESTIONS,
  },
  '7|bg|bel-2024': {
    title: 'БЕЛ-2024',
    slug: 'bel-2024',
    questions: addNvo7Points(BULGARSKI_NVO_7_BEL_2024_QUESTIONS),
  },
  '7|bg|bel-2025': {
    title: 'БЕЛ-2025',
    slug: 'bel-2025',
    questions: addNvo7Points(BULGARSKI_NVO_7_BEL_2025_QUESTIONS),
  },
  '7|bg|bel-2023-13062023': {
    title: 'БЕЛ-2023 (13.06.2023)',
    slug: 'bel-2023-13062023',
    questions: addNvo7Points(BULGARSKI_NVO_7_BEL_2023_13062023_V2_QUESTIONS),
  },
  '7|bg|bel-2022-14062022': {
    title: 'БЕЛ-2022 (14.06.2022)',
    slug: 'bel-2022-14062022',
    questions: addNvo7Points(BULGARSKI_NVO_7_BEL_2022_V1_QUESTIONS),
  },
  '7|bg|bel-2021-16062021': {
    title: 'БЕЛ-2021 (16.06.2021)',
    slug: 'bel-2021-16062021',
    questions: addNvo7Points(BULGARSKI_NVO_7_BEL_2021_V1_QUESTIONS),
  },
  '7|bg|bel-2020-15062020': {
    title: 'БЕЛ-2020 (15.06.2020)',
    slug: 'bel-2020-15062020',
    questions: addNvo7Points(BULGARSKI_NVO_7_BEL_2020_V1_QUESTIONS),
  },
  '7|bg|bel-2019-17062019': {
    title: 'БЕЛ-2019 (17.06.2019)',
    slug: 'bel-2019-17062019',
    questions: addNvo7Points(BULGARSKI_NVO_7_BEL_2019_V1_QUESTIONS),
  },
  '7|bg|bel-2018-21052018': {
    title: 'БЕЛ-2018 (21.05.2018)',
    slug: 'bel-2018-21052018',
    questions: addNvo7Points(BULGARSKI_NVO_7_BEL_2018_V2_QUESTIONS),
  },
  '7|bg|bel-2017-19052017': {
    title: 'БЕЛ-2017 (19.05.2017)',
    slug: 'bel-2017-19052017',
    questions: addNvo7Points(BULGARSKI_NVO_7_BEL_2017_V2_QUESTIONS),
  },
  '7|bg|bel-2016-18052016': {
    title: 'БЕЛ-2016 (18.05.2016)',
    slug: 'bel-2016-18052016',
    questions: addNvo7Points(BULGARSKI_NVO_7_BEL_2016_V2_QUESTIONS),
  },
  '5|geografia|geografia-ikonomika-1': {
    title: 'География и стопанство (част 1)',
    slug: 'geografia-ikonomika-1',
    questions: GEOGRAFIA_IKONOMIKA_PART1,
  },
  '7|bg|bel-2026-model': {
    title: 'БЕЛ – модел 2025/2026',
    slug: 'bel-2026-model',
    questions: addNvo7Points(BULGARSKI_NVO_7_BEL_2026_MODEL_QUESTIONS),
  },
  '5|geografia|geografia-ikonomika-2': {
    title: 'География и стопанство (част 2)',
    slug: 'geografia-ikonomika-2',
    questions: GEOGRAFIA_IKONOMIKA_PART2,
  },
  '5|geografia|geografia-ikonomika-3': {
    title: 'География и стопанство (част 3)',
    slug: 'geografia-ikonomika-3',
    questions: GEOGRAFIA_IKONOMIKA_PART3,
  },
  '5|geografia|geografia-obobstavasht': {
    title: 'География – обобщаващ тест (тематичен контрол 4)',
    slug: 'geografia-obobstavasht',
    questions: GEOGRAFIA_OBOBSTAVASHT_QUESTIONS,
  },
  '5|geografia|geografia-dopalnitelni': {
    title: 'География – селища, стопанство, транспорт',
    slug: 'geografia-dopalnitelni',
    questions: GEOGRAFIA_DOPALNITELNI_QUESTIONS,
  },
  '5|geografia|geografia-izbor-30': {
    title: 'География – население, стопанство, отрасли, ООН, ЕС (30 въпроса)',
    slug: 'geografia-izbor-30',
    questions: GEOGRAFIA_IZBOR_30_QUESTIONS,
  },
  '5|geografia|geografia-popylvane': {
    title: 'География – попълване (1 дума или цифра)',
    slug: 'geografia-popylvane',
    questions: GEOGRAFIA_POPALVANE_QUESTIONS,
  },
  '5|geografia|geografia-mix': {
    title: 'География – население, раси, религии, селища, стопанство (избор и попълване)',
    slug: 'geografia-mix',
    questions: GEOGRAFIA_MIX_QUESTIONS,
  },
  '5|geografia|vodite-na-afrika': {
    title: 'География – Водите на Африка (урок 52)',
    slug: 'vodite-na-afrika',
    questions: GEOGRAFIA_VODITE_NA_AFRIKA_QUESTIONS,
  },
  '5|geografia|prirodni-zoni-v-afrika': {
    title: 'География – Природни зони в Африка',
    slug: 'prirodni-zoni-v-afrika',
    questions: GEOGRAFIA_PRIRODNI_ZONI_AFRIKA_QUESTIONS,
  },
  '5|english|language-revision': {
    title: 'Language Revision (English)',
    slug: 'language-revision',
    questions: ENGLISH_LANGUAGE_REVISION_QUESTIONS,
  },
  '5|english|have-go-do-get': {
    title: 'Have / Go / Do / Get',
    slug: 'have-go-do-get',
    questions: ENGLISH_HAVE_GO_DO_GET_QUESTIONS,
  },
  '5|english|adverbs-and-transport': {
    title: 'Adverbs of frequency & Transport',
    slug: 'adverbs-and-transport',
    questions: ENGLISH_ADVERBS_TRANSPORT_QUESTIONS,
  },
  '5|english|present-simple-at': {
    title: 'Present Simple & at (time)',
    slug: 'present-simple-at',
    questions: ENGLISH_PRESENT_SIMPLE_AT_QUESTIONS,
  },
  '5|english|time': {
    title: 'Time in words and numbers',
    slug: 'time',
    questions: ENGLISH_TIME_QUESTIONS,
  },
  '5|istoriya|drevna-trakiya': {
    title: 'Древна Тракия',
    slug: 'drevna-trakiya',
    questions: ISTORIYA_DREVNA_TRAKIYA_QUESTIONS,
  },
  '5|istoriya|trakiya-obshtestvo': {
    title: 'Общество и всекидневен живот на траките (урок 27)',
    slug: 'trakiya-obshtestvo',
    questions: ISTORIYA_TRAKIYA_OBSHTESTVO_QUESTIONS,
  },
  '5|istoriya|carstvo-odrisi': {
    title: 'История – Одриско царство',
    slug: 'carstvo-odrisi',
    questions: ISTORIA_CARSTVO_ODRISI,
  },
  '5|istoriya|odriski-care': {
    title: 'История – Одриски царе',
    slug: 'odriski-care',
    questions: ISTORIA_ODRISKI_CARE,
  },
  '5|istoriya|religia': {
    title: 'История – Религия на траките',
    slug: 'religia',
    questions: ISTORIA_RELIGIA,
  },
  '5|istoriya|kultura-trakiya': {
    title: 'История – Култура на траките',
    slug: 'kultura-trakiya',
    questions: KULTURA_TRAKIYA,
  },
  '5|istoriya|uprajnenie': {
    title: 'История – Управление',
    slug: 'uprajnenie',
    questions: ISTORIA_UPRAJNENIE,
  },
  '5|istoriya|obobshtenie-trakiya': {
    title: 'История – Обобщение Тракия',
    slug: 'obobshtenie-trakiya',
    questions: ISTORIA_OBOBSHTENIE_TRAKIYA,
  },
  '5|istoriya|svarzvane': {
    title: 'История – Свързване (личност/термин с описание)',
    slug: 'svarzvane',
    questions: ISTORIA_SVAURZVANE_QUESTIONS,
  },
  '5|istoriya|podredba': {
    title: 'История – Подреждане по време (Урок 26)',
    slug: 'podredba',
    questions: ISTORIA_PODREDBA_QUESTIONS,
  },
  '5|istoriya|rim-sredizemnomorieto': {
    title: 'История – Рим, господар на Средиземноморието (урок 32)',
    slug: 'rim-sredizemnomorieto',
    questions: ISTORIA_RIM_SREDIZEMNOMORIETO_QUESTIONS,
  },
  '5|istoriya|rim-politici-politika': {
    title: 'История – Политици и политика в Древен Рим',
    slug: 'rim-politici-politika',
    questions: ISTORIA_RIM_POLITICI_I_POLITIKA_QUESTIONS,
  },
  '5|istoriya|rimskata-imperia-1-2-vek': {
    title: 'История – Римската империя през I–II в. (урок 33)',
    slug: 'rimskata-imperia-1-2-vek',
    questions: ISTORIA_RIMSKATA_IMPERIA_I_II_V_QUESTIONS,
  },
  '5|istoriya|obshtestvo-i-religia-dreven-rim': {
    title: 'История – Общество и религия на Древен Рим (урок 34)',
    slug: 'obshtestvo-i-religia-dreven-rim',
    questions: ISTORIA_OBSHTESTVO_I_RELIGIA_DREVEN_RIM_QUESTIONS,
  },
  '5|priroda|vozduh': {
    title: 'Човек и природа – Въздухът',
    slug: 'vozduh',
    questions: PRIRODA_VOZDUH_QUESTIONS,
  },
  '5|priroda|veshtestva-smesi-promeni-mix': {
    title: 'Човек и природа – Вещества, смеси и промени (избор и попълване)',
    slug: 'veshtestva-smesi-promeni-mix',
    questions: PRIRODA_VESHTESTVA_SMESI_I_PROMENI_MIX_QUESTIONS,
  },
  '5|priroda|veshtestvata-i-tehnite-svoystva': {
    title: 'Човек и природа – Веществата и техните свойства',
    slug: 'veshtestvata-i-tehnite-svoystva',
    questions: PRIRODA_VESHTESTVATA_I_TEHNITE_SVOYSTVA_QUESTIONS,
  },
  '5|priroda|obobshtenie-variant-1': {
    title: 'Човек и природа – Обобщение (Вариант 1)',
    slug: 'obobshtenie-variant-1',
    questions: PRIRODA_OBOBSHTENIE_VARIANT_1_QUESTIONS,
  },
  '5|priroda|obobshtenie-variant-2': {
    title: 'Човек и природа – Обобщение (Вариант 2)',
    slug: 'obobshtenie-variant-2',
    questions: PRIRODA_OBOBSHTENIE_VARIANT_2_QUESTIONS,
  },
  '5|priroda|voda-vazduh-i-smesi-kontrol': {
    title: 'Човек и природа – Вода, въздух и смеси (контрол)',
    slug: 'voda-vazduh-i-smesi-kontrol',
    questions: PRIRODA_VODA_VAZDUH_SMESI_KONTROL_QUESTIONS,
  },
  '5|priroda|chp-test-2-veshtestva': {
    title: 'Човек и природа – Тест 2: Веществата и техните свойства',
    slug: 'chp-test-2-veshtestva',
    questions: PRIRODA_CHP_TEST2_VESHTESTVA_I_TEHNI_SVOYSTVA_QUESTIONS,
  },
  '5|priroda|kletkata-osnovna-gradivna-edinica': {
    title: 'Човек и природа – Клетката, основна градивна единица на организмите (урок 51)',
    slug: 'kletkata-osnovna-gradivna-edinica',
    questions: PRIRODA_KLETKATA_OSNOVNA_GRADIVNA_EDINICA_QUESTIONS,
  },
  '5|priroda|vodata-i-horata': {
    title: 'Човек и природа – Водата и хората',
    slug: 'vodata-i-horata',
    questions: PRIRODA_VODATA_I_HORATA_QUESTIONS,
  },
  '5|priroda|ednokletachni-mnogokletachni': {
    title: 'Човек и природа – Едноклетъчни и многоклетъчни организми (урок 52)',
    slug: 'ednokletachni-mnogokletachni',
    questions: PRIRODA_EDNOKLETACHNI_MNOGOKLETACHNI_QUESTIONS,
  },
  '5|priroda|fotosinteza-10-plus-3': {
    title: 'Човек и природа – Фотосинтеза (10 избираеми + 3 попълване)',
    slug: 'fotosinteza-10-plus-3',
    questions: PRIRODA_FOTOSINTEZA_10_PLUS_3_QUESTIONS,
  },
  '5|literatura|da-proverim-var1': {
    title: 'Да проверим – Литература (Вариант 1)',
    slug: 'da-proverim-var1',
    questions: LITERATURA_DA_PROVERIM_VAR1_QUESTIONS,
  },
  '5|literatura|da-proverim-var2': {
    title: 'Да проверим – Литература (Вариант 2)',
    slug: 'da-proverim-var2',
    questions: LITERATURA_DA_PROVERIM_VAR2_QUESTIONS,
  },
  '5|literatura|folklore-kalendar': {
    title: 'Литература – фолклорен календар, празници и обичаи',
    slug: 'folklore-kalendar',
    questions: LITERATURA_FOLKLOR_KALENDAR_QUESTIONS,
  },
  '5|literatura|hayduti-hristo-botev': {
    title: '„Хайдути“ – Христо Ботев (тест, 5. клас)',
    slug: 'hayduti-hristo-botev',
    questions: BULGARSKI_HAYDUTI_5_KLAS_TEST_QUESTIONS,
  },
  '5|literatura|hayduti-literatura-5-klas-2': {
    title: '„Хайдути“ – литература, 5. клас (тест 2)',
    slug: 'hayduti-literatura-5-klas-2',
    questions: BULGARSKI_HAYDUTI_5_KLAS_LITERATURA_2_QUESTIONS,
  },
  '5|literatura|hayduti-raboten-list-18-03-2020': {
    title: '„Хайдути“ – работен лист (18.03.2020, 5. клас)',
    slug: 'hayduti-raboten-list-18-03-2020',
    questions: LITERATURA_HAYDUTI_RABOTEN_LIST_18_03_2020_QUESTIONS,
  },
  '5|literatura|hayduti-testovi-zadachi': {
    title: '„Хайдути“ – тестови задачи с ключ (5. клас)',
    slug: 'hayduti-testovi-zadachi',
    questions: LITERATURA_HAYDUTI_TESTOVI_ZADACHI_PDF_QUESTIONS,
  },
  '5|english|unit-6c-once-a-week': {
    title: 'Unit 6c – Once a week (frequency & personality)',
    slug: 'unit-6c-once-a-week',
    questions: ENGLISH_UNIT_6C_QUESTIONS,
  },
  '5|english|roundup-6-write-in': {
    title: 'Round up 3 & 6b/6c – с написване на отговор',
    slug: 'roundup-6-write-in',
    questions: ENGLISH_ROUNDUP_6_WRITE_IN_QUESTIONS,
  },
  '5|english|grammar-6abc': {
    title: 'Grammar Summary & 6c/7a (попълване и a,b,c)',
    slug: 'grammar-6abc',
    questions: ENGLISH_GRAMMAR_6ABC_QUESTIONS,
  },
  '5|english|6a-fixed-times': {
    title: '6a – Present simple & fixed times (попълване и тестови)',
    slug: '6a-fixed-times',
    questions: ENGLISH_6A_FIXED_TIMES_QUESTIONS,
  },
  '5|english|unit-8a-the-past': {
    title: 'Unit 8a – The Past (was/were, time phrases)',
    slug: 'unit-8a-the-past',
    questions: ENGLISH_UNIT_8A_PAST_QUESTIONS,
  },
  '5|english|unit-8a-the-past-fill': {
    title: 'Unit 8a – The Past (practice 1–5, попълване)',
    slug: 'unit-8a-the-past-fill',
    questions: ENGLISH_UNIT_8A_PAST_FILL_QUESTIONS,
  },
  '5|english|unit-7c-fill': {
    title: 'Unit 7c – Don\'t look at the ground: йога инструкции, здравни съвети, части на тялото и болести (попълване)',
    slug: 'unit-7c-fill',
    questions: ENGLISH_UNIT_7C_FILL_QUESTIONS,
  },
  '5|english|unit-7c-vocab': {
    title: 'Unit 7c – Don\'t look at the ground: йога инструкции, здравни съвети, части на тялото и болести (проверка за думи)',
    slug: 'unit-7c-vocab',
    questions: ENGLISH_UNIT_7C_VOCAB_QUESTIONS,
  },
  '5|english|angl-14-04-2026': {
    title: 'Англ. 14.04.2026',
    slug: 'angl-14-04-2026',
    questions: ENGLISH_14_04_2026_QUESTIONS,
  },
  '5|english|unit-8b-regular-verbs-motion': {
    title: 'Unit 8b – Past Simple regular verbs & prepositions of motion',
    slug: 'unit-8b-regular-verbs-motion',
    questions: ENGLISH_UNIT_8B_REGULAR_VERBS_MOTION_QUESTIONS,
  },
  '5|english|unit-8b-fill': {
    title: 'Unit 8b – само попълване (regular verbs & motion)',
    slug: 'unit-8b-fill',
    questions: ENGLISH_UNIT_8B_FILL_ONLY_QUESTIONS,
  },
  '5|english|unit-8b-tiger-fill-vocab': {
    title: 'Unit 8b – They noticed a large animal (попълване + нови думи)',
    slug: 'unit-8b-tiger-fill-vocab',
    questions: ENGLISH_UNIT_8B_TIGER_FILL_AND_VOCAB_QUESTIONS,
  },
  '5|english|unit-8c-past-simple-questions': {
    title: 'Unit 8c – Past Simple regular verbs: questions and short answers',
    slug: 'unit-8c-past-simple-questions',
    questions: ENGLISH_UNIT_8C_PAST_SIMPLE_QUESTIONS,
  },
  '5|english|unit-8d-mobile-vocab-fill': {
    title: 'Unit 8d – Modern inventions (vocabulary fill)',
    slug: 'unit-8d-mobile-vocab-fill',
    questions: ENGLISH_UNIT_8D_MOBILE_VOCAB_FILL_QUESTIONS,
  },
};

/**
 * Връща данни за тест по клас, предмет и slug на теста, или null ако няма такъв тест.
 */
export function getTest(classNum, subject, testSlug) {
  const key = `${classNum}|${subject}|${testSlug}`;
  return TESTS[key] ?? null;
}

/**
 * Връща списък с всички тестове за обобщената страница.
 * Всеки елемент: { classNum, subject, slug, title, questionCount }
 */
export function getAllTests() {
  const list = Object.entries(TESTS).map(([key, data]) => {
    const [classNum, subject, slug] = key.split('|');
    return {
      classNum,
      subject,
      slug,
      title: data.title,
      questionCount: data.questions.length,
    };
  });
  // Последно добавените тестове в TESTS да се показват първи в списъците.
  return list.reverse();
}
