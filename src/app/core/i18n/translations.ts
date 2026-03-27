// ─────────────────────────────────────────────────────────────────────────────
// Translation dictionary — add every UI string here.
// Key path mirrors the component/domain it belongs to.
// ─────────────────────────────────────────────────────────────────────────────

export type Language = 'en' | 'ms';

export interface Translations {
  // ── Common ─────────────────────────────────────────────────────────────────
  common: {
    save:        string;
    cancel:      string;
    delete:      string;
    edit:        string;
    view:        string;
    add:         string;
    search:      string;
    loading:     string;
    error:       string;
    success:     string;
    confirm:     string;
    back:        string;
    next:        string;
    close:       string;
    yes:         string;
    no:          string;
    all:         string;
    none:        string;
    actions:     string;
    status:      string;
    date:        string;
    name:        string;
    description: string;
    value:       string;
    category:    string;
    signedInAs:  string;
    vsLastMonth: string;
  };

  // ── Nav ────────────────────────────────────────────────────────────────────
  nav: {
    dashboard:   string;
    moduleA:     string;
    moduleB:     string;
    moduleC:     string;
    collapse:    string;
    expand:      string;
    openNav:     string;
    profile:     string;
    settings:    string;
    logout:      string;
    notifications: string;
  };

  // ── Auth ───────────────────────────────────────────────────────────────────
  auth: {
    signIn:          string;
    signInWith:      string;
    signingIn:       string;
    redirecting:     string;
    tagline:         string;
    taglineSubtitle: string;
    termsPrefix:     string;
    terms:           string;
    and:             string;
    privacy:         string;
    copyright:       string;
    orgAccount:      string;
    authFailed:      string;
    invalidCallback: string;
    completingSignIn: string;
  };

  // ── Dashboard ──────────────────────────────────────────────────────────────
  dashboard: {
    title:          string;
    welcome:        string;
    subtitle:       string;
    revenue:        string;
    revenueSubtitle: string;
    recentActivity: string;
    viewAll:        string;
    totalRevenue:   string;
    activeUsers:    string;
    openTickets:    string;
    conversionRate: string;
  };

  // ── Module A ───────────────────────────────────────────────────────────────
  moduleA: {
    title:       string;
    subtitle:    string;
    addItem:     string;
    colName:     string;
    colDesc:     string;
    colStatus:   string;
    colCreated:  string;
    statusActive:   string;
    statusPending:  string;
    statusInactive: string;
  };

  // ── Module B ───────────────────────────────────────────────────────────────
  moduleB: {
    title:    string;
    subtitle: string;
    colValue: string;
  };

  // ── Module C ───────────────────────────────────────────────────────────────
  moduleC: {
    title:       string;
    subtitle:    string;
    saveChanges: string;
    savedOk:     string;
  };

  // ── Loading overlay ────────────────────────────────────────────────────────
  loading: {
    message: string;
  };

  // ── Settings ───────────────────────────────────────────────────────────────
  settings: {
    lightMode:  string;
    darkMode:   string;
    language:   string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// English
// ─────────────────────────────────────────────────────────────────────────────
export const EN: Translations = {
  common: {
    save:        'Save',
    cancel:      'Cancel',
    delete:      'Delete',
    edit:        'Edit',
    view:        'View',
    add:         'Add',
    search:      'Search',
    loading:     'Loading…',
    error:       'Error',
    success:     'Success',
    confirm:     'Confirm',
    back:        'Back',
    next:        'Next',
    close:       'Close',
    yes:         'Yes',
    no:          'No',
    all:         'All',
    none:        'None',
    actions:     'Actions',
    status:      'Status',
    date:        'Date',
    name:        'Name',
    description: 'Description',
    value:       'Value',
    category:    'Category',
    signedInAs:  'Signed in as',
    vsLastMonth: 'vs last month',
  },
  nav: {
    dashboard:     'Dashboard',
    moduleA:       'Module A',
    moduleB:       'Module B',
    moduleC:       'Module C',
    collapse:      'Collapse',
    expand:        'Expand',
    openNav:       'Open navigation',
    profile:       'Profile',
    settings:      'Settings',
    logout:        'Logout',
    notifications: 'Notifications',
  },
  auth: {
    signIn:           'Sign in',
    signInWith:       'Sign in with SSO',
    signingIn:        'Redirecting…',
    redirecting:      'Completing sign in…',
    tagline:          'Built for teams that move fast.',
    taglineSubtitle:  'Secure, scalable, and ready for production.',
    termsPrefix:      'By signing in you agree to our',
    terms:            'Terms',
    and:              'and',
    privacy:          'Privacy Policy',
    copyright:        '© 2025 Enterprise. All rights reserved.',
    orgAccount:       'Use your organisation account to continue.',
    authFailed:       'Authorization failed',
    invalidCallback:  'Invalid callback — missing code or state.',
    completingSignIn: 'Completing sign in…',
  },
  dashboard: {
    title:           'Dashboard',
    welcome:         'Welcome back',
    subtitle:        "Here's what's happening across your workspace today.",
    revenue:         'Revenue',
    revenueSubtitle: 'Last 12 months',
    recentActivity:  'Recent Activity',
    viewAll:         'View all activity',
    totalRevenue:    'Total Revenue',
    activeUsers:     'Active Users',
    openTickets:     'Open Tickets',
    conversionRate:  'Conversion Rate',
  },
  moduleA: {
    title:          'Module A',
    subtitle:       'Manage your Module A resources.',
    addItem:        'Add Item',
    colName:        'Name',
    colDesc:        'Description',
    colStatus:      'Status',
    colCreated:     'Created',
    statusActive:   'active',
    statusPending:  'pending',
    statusInactive: 'inactive',
  },
  moduleB: {
    title:    'Module B',
    subtitle: 'Track and manage Module B data.',
    colValue: 'Value',
  },
  moduleC: {
    title:       'Module C — Configuration',
    subtitle:    'Manage system-wide settings and configuration.',
    saveChanges: 'Save Changes',
    savedOk:     'Configuration saved successfully.',
  },
  loading: {
    message: 'Please wait…',
  },
  settings: {
    lightMode: 'Switch to light mode',
    darkMode:  'Switch to dark mode',
    language:  'Language',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Bahasa Malaysia
// ─────────────────────────────────────────────────────────────────────────────
export const MS: Translations = {
  common: {
    save:        'Simpan',
    cancel:      'Batal',
    delete:      'Padam',
    edit:        'Edit',
    view:        'Lihat',
    add:         'Tambah',
    search:      'Cari',
    loading:     'Memuatkan…',
    error:       'Ralat',
    success:     'Berjaya',
    confirm:     'Sahkan',
    back:        'Kembali',
    next:        'Seterusnya',
    close:       'Tutup',
    yes:         'Ya',
    no:          'Tidak',
    all:         'Semua',
    none:        'Tiada',
    actions:     'Tindakan',
    status:      'Status',
    date:        'Tarikh',
    name:        'Nama',
    description: 'Penerangan',
    value:       'Nilai',
    category:    'Kategori',
    signedInAs:  'Log masuk sebagai',
    vsLastMonth: 'vs bulan lalu',
  },
  nav: {
    dashboard:     'Papan Pemuka',
    moduleA:       'Modul A',
    moduleB:       'Modul B',
    moduleC:       'Modul C',
    collapse:      'Runtuhkan',
    expand:        'Kembangkan',
    openNav:       'Buka navigasi',
    profile:       'Profil',
    settings:      'Tetapan',
    logout:        'Log Keluar',
    notifications: 'Pemberitahuan',
  },
  auth: {
    signIn:           'Log Masuk',
    signInWith:       'Log Masuk dengan SSO',
    signingIn:        'Mengalih hala…',
    redirecting:      'Melengkapkan log masuk…',
    tagline:          'Dibina untuk pasukan yang bergerak pantas.',
    taglineSubtitle:  'Selamat, berskala, dan sedia untuk pengeluaran.',
    termsPrefix:      'Dengan log masuk, anda bersetuju dengan',
    terms:            'Terma',
    and:              'dan',
    privacy:          'Dasar Privasi',
    copyright:        '© 2025 Enterprise. Hak cipta terpelihara.',
    orgAccount:       'Gunakan akaun organisasi anda untuk meneruskan.',
    authFailed:       'Kebenaran gagal',
    invalidCallback:  'Panggilan balik tidak sah — kod atau keadaan tiada.',
    completingSignIn: 'Melengkapkan log masuk…',
  },
  dashboard: {
    title:           'Papan Pemuka',
    welcome:         'Selamat kembali',
    subtitle:        'Inilah yang berlaku merentas ruang kerja anda hari ini.',
    revenue:         'Hasil',
    revenueSubtitle: '12 bulan lepas',
    recentActivity:  'Aktiviti Terkini',
    viewAll:         'Lihat semua aktiviti',
    totalRevenue:    'Jumlah Hasil',
    activeUsers:     'Pengguna Aktif',
    openTickets:     'Tiket Terbuka',
    conversionRate:  'Kadar Penukaran',
  },
  moduleA: {
    title:          'Modul A',
    subtitle:       'Urus sumber Modul A anda.',
    addItem:        'Tambah Item',
    colName:        'Nama',
    colDesc:        'Penerangan',
    colStatus:      'Status',
    colCreated:     'Dicipta',
    statusActive:   'aktif',
    statusPending:  'tertunda',
    statusInactive: 'tidak aktif',
  },
  moduleB: {
    title:    'Modul B',
    subtitle: 'Jejak dan urus data Modul B.',
    colValue: 'Nilai',
  },
  moduleC: {
    title:       'Modul C — Konfigurasi',
    subtitle:    'Urus tetapan dan konfigurasi seluruh sistem.',
    saveChanges: 'Simpan Perubahan',
    savedOk:     'Konfigurasi berjaya disimpan.',
  },
  loading: {
    message: 'Sila tunggu…',
  },
  settings: {
    lightMode: 'Tukar ke mod cerah',
    darkMode:  'Tukar ke mod gelap',
    language:  'Bahasa',
  },
};

export const TRANSLATIONS: Record<Language, Translations> = { en: EN, ms: MS };
