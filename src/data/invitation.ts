export interface Guardian {
  name: string;
  title?: string;
}

export interface SonCouple {
  label: string;
  groomName: string;
  groomTitle: string;
  brideLabel: string;
  brideFather: string;
  brideTitle: string;
}

export interface InvitationData {
  groomName: string;
  formalWording: string;
  guardians: Guardian[];

  sons: SonCouple[];

  brideFamilyLine1: string;
  brideFamilyLine2: string;
  brideFamilyLine3: string;
  brideName: string;

  inShaaAllah: string;
  presenceText: string;

  nikahDate: string;
  nikahDay: string;
  nikahDayNumeral: string;
  nikahMonth: string;
  nikahYear: string;
  nikahTime: string;
  nikahDinnerNote: string;
  nikahVenue: string;
  nikahAddress: string[];
  nikahMapsUrl: string;

  valimaDate: string;
  valimaDay: string;
  valimaDayNumeral: string;
  valimaMonth: string;
  valimaYear: string;
  valimaTime: string;
  valimaVenue: string;
  valimaAddress: string[];
  valimaMapsUrl: string;

  ayahReference: string;
  ayahArabic: string;
  ayahTranslation: string;

  countdownTarget: Date;

  closingLines: string[];
  closingBlessing: string;
}

export const invitation: InvitationData = {
  /*
   * Kept for compatibility with the existing project.
   * The introduction now renders both sons from the `sons` array.
   */
  groomName: 'Mirza Obed Baig',

  formalWording:
      'Solicit your gracious presence on the auspicious occasion of the Valima ceremony of her sons',

  guardians: [
    {
      name: 'Mrs. Late Mirza Rasheed Baig Sahab',
      title: 'Timber Merchant',
    },
    {
      name: 'Mrs. Late Mirza Hassan Baig',
    },
  ],

  /*
   * ================================================================
   * THE TWO SONS AND THEIR BRIDES
   *
   * These details are taken directly from the two reference
   * invitation cards supplied for this project.
   *
   * The bride names are not printed on the supplied cards, so they
   * are intentionally not invented.
   * ================================================================
   */

  sons: [
    {
      label: 'Eldest Son',
      groomName: 'Dr. Mirza Ashraf Baig',
      groomTitle: 'MBBS',

      brideLabel: 'Bride',
      brideFather:
          'Daughter of Mr. Alhaj Mohammed Rafi Uddin Sahab',
      brideTitle: 'Nayab Khazi & Business (Jadcherla)',
    },

    {
      label: 'Younger Son',
      groomName: 'Mirza Obed Baig',
      groomTitle: 'Timber Merchant',

      brideLabel: 'Bride',
      brideFather:
          'Daughter of Mr. Mohammed Afsar Khan Sahab',
      brideTitle: 'Business',
    },
  ],

  /*
   * Kept for compatibility with the existing data structure.
   * The new couple layout uses `sons` above.
   */
  brideFamilyLine1: 'Daughter',
  brideFamilyLine2: 'of Mr. Mohammed Afsar Khan Sahab',
  brideFamilyLine3: 'Business',
  brideName: "[Bride's Name]",

  inShaaAllah: 'In Sha Allah',

  presenceText:
      'Your presence and prayers will make this occasion even more special for our family.',

  // Nikah
  nikahDate: 'Friday, 23 October 2026',
  nikahDay: 'Friday',
  nikahDayNumeral: '23',
  nikahMonth: 'October',
  nikahYear: '2026',
  nikahTime: '9:00 PM',
  nikahDinnerNote: 'Dinner follows',
  nikahVenue: 'White House Convention Hall',
  nikahAddress: [
    'Appanapalli',
    'Backside Hyundai Showroom',
    'Hyderabad Road',
    'Mahbubnagar',
  ],
  nikahMapsUrl:
      'https://maps.google.com/?q=White+House+Convention+Hall+Appanapalli+Mahbubnagar',

  // Valima
  valimaDate: 'Sunday, 25 October 2026',
  valimaDay: 'Sunday',
  valimaDayNumeral: '25',
  valimaMonth: 'October',
  valimaYear: '2026',
  valimaTime: '9:00 PM',
  valimaVenue: 'White House Convention Hall',
  valimaAddress: [
    'Appanapalli',
    'Backside Hyundai Showroom',
    'Hyderabad Road',
    'Mahbubnagar',
  ],
  valimaMapsUrl:
      'https://maps.google.com/?q=White+House+Convention+Hall+Appanapalli+Mahbubnagar',

  // Qur'an
  ayahReference: 'Surah Ar-Rum — 30:21',

  ayahArabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ',

  ayahTranslation:
      'And among His Signs is that He created for you spouses from among yourselves so that you may find tranquility in them; and He has placed between you affection and mercy. Surely in this are signs for those who reflect.',

  // Countdown — 25 Oct 2026, 9:00 PM IST
  countdownTarget: new Date('2026-10-25T15:30:00Z'),

  closingLines: [
    'Your presence will make this occasion even more special.',
    'We look forward to your gracious presence.',
  ],

  closingBlessing: 'Jazakum Allahu Khairan',
};