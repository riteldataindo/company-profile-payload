export type ConversionLocale = 'en' | 'id'
export type SolutionContext = 'shared' | 'retail' | 'mall'

export interface ConversionCopy {
  contact: {
    title: string
    intro: string
    email: string
    phone: string
    address: string
    hours: string
    neutralContact: string
    whatsapp: string
    messageTitle: string
    name: string
    emailField: string
    phoneField: string
    company: string
    solution: string
    message: string
    consent: string
    submit: string
    submitting: string
    sentTitle: string
    sentBody: string
    retry: string
    privacyLink: string
    validation: {
      name: string
      email: string
      message: string
      consent: string
    }
    genericError: string
    retryError: string
  }
  demo: {
    eyebrow: string
    title: string
    intro: string
    benefitsTitle: string
    benefits: Array<{ title: string; description: string }>
    contextTitle: string
    contextBody: string
    formTitle: string
    name: string
    email: string
    phone: string
    company: string
    solution: string
    storeCount: string
    storeCountPlaceholder: string
    storeOptions: Array<{ value: string; label: string }>
    message: string
    consent: string
    submit: string
    submitting: string
    sentTitle: string
    sentBody: string
    retry: string
    privacyLink: string
    validation: {
      name: string
      email: string
      phone: string
      company: string
      consent: string
    }
    genericError: string
    retryError: string
    solutionOptions: Array<{ value: SolutionContext; label: string }>
  }
}

const copy: Record<ConversionLocale, ConversionCopy> = {
  en: {
    contact: {
      title: 'Contact SmartCounter',
      intro: 'Tell us what you are evaluating and we will route your message to the right team.',
      email: 'Email',
      phone: 'Phone or WhatsApp',
      address: 'Address',
      hours: 'Office hours',
      neutralContact: 'Contact details are provided after the relevant team and channel are confirmed.',
      whatsapp: 'Open WhatsApp',
      messageTitle: 'Send a message',
      name: 'Full name',
      emailField: 'Work email',
      phoneField: 'Phone or WhatsApp (optional)',
      company: 'Company (optional)',
      solution: 'Context',
      message: 'How can we help?',
      consent: 'I agree that SmartCounter may use these details to respond to this request. See the privacy notice.',
      submit: 'Send message',
      submitting: 'Sending…',
      sentTitle: 'Message received',
      sentBody: 'Your request was saved. The team will review it and follow up using the contact details you provided.',
      retry: 'Send another message',
      privacyLink: 'Privacy notice',
      validation: {
        name: 'Enter at least 2 characters.',
        email: 'Enter a valid email address.',
        message: 'Enter at least 10 characters.',
        consent: 'Please confirm the privacy notice before sending.',
      },
      genericError: 'We could not save your message.',
      retryError: 'Check the highlighted fields and try again.',
    },
    demo: {
      eyebrow: 'Representative walkthrough',
      title: 'Request a site-fit demo',
      intro: 'Share the context you are evaluating. We will use it to discuss relevant product views, prerequisites, and next steps. Availability and performance are confirmed for each deployment.',
      benefitsTitle: 'What we can cover',
      benefits: [
        { title: 'Product workflow', description: 'Review the aggregate traffic, flow, or zone views relevant to your operation.' },
        { title: 'Site-fit questions', description: 'Discuss camera inputs, layout, network, and validation requirements.' },
        { title: 'Data boundary', description: 'Clarify processing, outputs, access, and deployment-specific limitations.' },
        { title: 'Next-step scope', description: 'Leave with the questions and information needed for an assessment.' },
      ],
      contextTitle: 'Bring your operating context',
      contextBody: 'A venue type, current camera setup, location count, or question about a metric is enough to start. Do not send camera URLs or other sensitive data through this form.',
      formTitle: 'Request a site-fit demo',
      name: 'Full name',
      email: 'Work email',
      phone: 'Phone or WhatsApp',
      company: 'Company',
      solution: 'Context',
      storeCount: 'Locations or stores (optional)',
      storeCountPlaceholder: 'Select a range',
      storeOptions: [
        { value: '1-5', label: '1–5' },
        { value: '6-20', label: '6–20' },
        { value: '21-50', label: '21–50' },
        { value: '50+', label: '50+' },
      ],
      message: 'Questions or goals (optional)',
      consent: 'I agree that SmartCounter may use these details to respond to this request. See the privacy notice.',
      submit: 'Request a site-fit demo',
      submitting: 'Sending…',
      sentTitle: 'Request received',
      sentBody: 'Your request was saved. The team will review the context you shared and follow up using the contact details you provided.',
      retry: 'Send another request',
      privacyLink: 'Privacy notice',
      validation: {
        name: 'Enter at least 2 characters.',
        email: 'Enter a valid email address.',
        phone: 'Enter a valid phone or WhatsApp number.',
        company: 'Enter at least 2 characters.',
        consent: 'Please confirm the privacy notice before sending.',
      },
      genericError: 'We could not save your request.',
      retryError: 'Check the highlighted fields and try again.',
      solutionOptions: [
        { value: 'shared', label: 'Retail or Mall — still assessing' },
        { value: 'retail', label: 'Retail' },
        { value: 'mall', label: 'Mall' },
      ],
    },
  },
  id: {
    contact: {
      title: 'Hubungi SmartCounter',
      intro: 'Ceritakan konteks evaluasi Anda agar pesan dapat diarahkan ke tim yang tepat.',
      email: 'Email',
      phone: 'Telepon atau WhatsApp',
      address: 'Alamat',
      hours: 'Jam kantor',
      neutralContact: 'Detail kontak akan ditampilkan setelah tim dan kanal yang tepat dikonfirmasi.',
      whatsapp: 'Buka WhatsApp',
      messageTitle: 'Kirim pesan',
      name: 'Nama lengkap',
      emailField: 'Email kerja',
      phoneField: 'Telepon atau WhatsApp (opsional)',
      company: 'Perusahaan (opsional)',
      solution: 'Konteks',
      message: 'Bagaimana kami dapat membantu?',
      consent: 'Saya setuju SmartCounter menggunakan detail ini untuk menanggapi permintaan saya. Lihat pemberitahuan privasi.',
      submit: 'Kirim pesan',
      submitting: 'Mengirim…',
      sentTitle: 'Pesan diterima',
      sentBody: 'Permintaan Anda tersimpan. Tim akan meninjaunya dan menghubungi Anda melalui detail yang diberikan.',
      retry: 'Kirim pesan lain',
      privacyLink: 'Pemberitahuan privasi',
      validation: {
        name: 'Masukkan setidaknya 2 karakter.',
        email: 'Masukkan alamat email yang valid.',
        message: 'Masukkan setidaknya 10 karakter.',
        consent: 'Konfirmasikan pemberitahuan privasi sebelum mengirim.',
      },
      genericError: 'Pesan tidak dapat disimpan.',
      retryError: 'Periksa kolom yang ditandai lalu coba lagi.',
    },
    demo: {
      eyebrow: 'Walkthrough representatif',
      title: 'Minta demo untuk menilai kesiapan lokasi',
      intro: 'Bagikan konteks yang sedang Anda evaluasi. Kami akan membahas tampilan produk, prasyarat, dan langkah berikutnya yang relevan. Ketersediaan dan performa dikonfirmasi untuk setiap deployment.',
      benefitsTitle: 'Hal yang dapat dibahas',
      benefits: [
        { title: 'Alur produk', description: 'Tinjau tampilan traffic, flow, atau zona agregat yang relevan dengan operasi Anda.' },
        { title: 'Pertanyaan kesiapan lokasi', description: 'Bahas input kamera, tata letak, jaringan, dan kebutuhan validasi.' },
        { title: 'Batas data', description: 'Perjelas pemrosesan, output, akses, dan batasan khusus deployment.' },
        { title: 'Ruang lingkup langkah berikutnya', description: 'Dapatkan daftar pertanyaan dan informasi yang dibutuhkan untuk assessment.' },
      ],
      contextTitle: 'Siapkan konteks operasi Anda',
      contextBody: 'Jenis lokasi, setup kamera saat ini, jumlah lokasi, atau pertanyaan tentang metrik sudah cukup untuk memulai. Jangan kirim URL kamera atau data sensitif lain melalui formulir ini.',
      formTitle: 'Minta demo site-fit',
      name: 'Nama lengkap',
      email: 'Email kerja',
      phone: 'Telepon atau WhatsApp',
      company: 'Perusahaan',
      solution: 'Konteks',
      storeCount: 'Lokasi atau toko (opsional)',
      storeCountPlaceholder: 'Pilih rentang',
      storeOptions: [
        { value: '1-5', label: '1–5' },
        { value: '6-20', label: '6–20' },
        { value: '21-50', label: '21–50' },
        { value: '50+', label: '50+' },
      ],
      message: 'Pertanyaan atau tujuan (opsional)',
      consent: 'Saya setuju SmartCounter menggunakan detail ini untuk menanggapi permintaan saya. Lihat pemberitahuan privasi.',
      submit: 'Minta demo site-fit',
      submitting: 'Mengirim…',
      sentTitle: 'Permintaan diterima',
      sentBody: 'Permintaan Anda tersimpan. Tim akan meninjau konteks yang dibagikan dan menghubungi Anda melalui detail yang diberikan.',
      retry: 'Kirim permintaan lain',
      privacyLink: 'Pemberitahuan privasi',
      validation: {
        name: 'Masukkan setidaknya 2 karakter.',
        email: 'Masukkan alamat email yang valid.',
        phone: 'Masukkan nomor telepon atau WhatsApp yang valid.',
        company: 'Masukkan setidaknya 2 karakter.',
        consent: 'Konfirmasikan pemberitahuan privasi sebelum mengirim.',
      },
      genericError: 'Permintaan tidak dapat disimpan.',
      retryError: 'Periksa kolom yang ditandai lalu coba lagi.',
      solutionOptions: [
        { value: 'shared', label: 'Retail atau Mall — masih menilai' },
        { value: 'retail', label: 'Retail' },
        { value: 'mall', label: 'Mall' },
      ],
    },
  },
}

export function getConversionCopy(locale: string): ConversionCopy {
  return copy[locale === 'id' ? 'id' : 'en']
}
