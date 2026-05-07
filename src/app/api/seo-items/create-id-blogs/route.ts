import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

function lexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map(p => ({
        type: 'paragraph',
        children: [{ type: 'text', text: p, version: 1 }],
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

interface BlogPostData {
  enSlug: string
  idSlug: string
  en: { title: string; excerpt: string; content: string[]; metaTitle: string; metaDesc: string }
  id: { title: string; excerpt: string; content: string[]; metaTitle: string; metaDesc: string }
  category: string
}

const BLOG_POSTS: BlogPostData[] = [
  {
    enSlug: 'apa-itu-people-counting-system',
    idSlug: 'apa-itu-people-counting-system',
    en: {
      title: 'What Is a People Counting System? Complete Guide for Retail',
      excerpt: 'A people counting system is AI technology that automatically counts visitors using CCTV cameras. Learn how it works, key benefits, and why Indonesian retail businesses need it.',
      metaTitle: 'What Is a People Counting System? — CCTV AI Visitor Analytics',
      metaDesc: 'People counting systems use AI to automatically count visitors via CCTV. Learn how it works, types of technology, and ROI for retail.',
      content: [
        'A people counting system is a technology powered by artificial intelligence (AI) that automatically counts the number of people entering and leaving a location. It uses existing CCTV cameras already installed in stores, malls, or commercial buildings without requiring any additional hardware. With accuracy up to 99.9%, this technology provides real-time data instantly available on a dashboard accessible from any device, anytime. Unlike manual counting which is prone to human error and inconsistency, people counting systems ensure every visitor is accurately recorded, giving retail businesses a solid data foundation for strategic decision-making.',
        'How Does a People Counting System Work?',
        'Modern people counting systems like SmartCounter use computer vision and deep learning to detect and track every individual passing through camera areas. The process begins when CCTV cameras capture continuous video streams, then AI algorithms based on YOLO (You Only Look Once) models process each frame to identify human presence. After detection, the DeepSORT tracking system assigns a temporary unique ID to each person and tracks their movement across frames, ensuring one individual is only counted once even if temporarily obscured. A virtual line configured at entrances determines entry or exit direction, giving stores precise net traffic data. All processing happens in real-time without storing facial data or personal information — fully compliant with privacy regulations.',
        'Types of People Counting Technology',
        'Several technologies are used for counting visitors, each with strengths and limitations. Infrared beam counters are the simplest — placing an infrared beam at the entrance and counting each interruption. The weakness is they cannot distinguish one person from two walking side by side, and are easily triggered by trolleys or strollers. Thermal sensors use body heat detection to count visitors. They are more accurate than infrared beams but have limited range and are relatively expensive for wide area coverage. Video-based AI technology like SmartCounter is the most advanced and cost-effective. Beyond counting visitors with the highest accuracy, these systems can also analyze visitor demographics, measure dwell time, create movement heatmaps, and detect queues — all from existing CCTV cameras.',
        'Why Do Retail Businesses Need People Counting?',
        'Without visitor traffic data, every retail business decision is based on estimates and intuition. When sales decline, store owners cannot determine whether the cause is fewer visitors (a marketing or location problem) or low conversion rates (a service or merchandising problem). People counting provides definitive answers with measurable data. Basic data from people counting includes visitor counts per hour, day, week, and month to identify traffic trends. Peak hours are identified precisely for staff scheduling optimization. Conversion rate is calculated from the ratio of visitors to POS transactions. Promotion effectiveness is measured by comparing traffic before and after campaigns. Multi-branch performance can be compared objectively based on data, not assumptions.',
        'Who Uses People Counting?',
        'People counting is used by various businesses serving physical visitors. Retail stores of all sizes — from small boutiques with one entrance to chains with 50+ branches — use people counting to measure conversion rates and optimize operations. Shopping malls leverage traffic data for tenant benchmarking, zone optimization, and fair lease pricing based on actual foot traffic. Pharmacies use these systems for prescription queue monitoring and pharmacist scheduling. Supermarkets benefit from checkout flow analysis, queue management, and product placement optimization. Fashion retail uses people counting for fitting room conversion tracking.',
        'ROI and Business Impact',
        'Retailers consistently implementing people counting report 15-25% sales increases within the first 6 months. Key ROI comes from several areas: store layout optimization based on heatmap data increases certain category sales by up to 20%, proper staff scheduling matching traffic patterns saves 15-18% in labor costs, accurate marketing campaign ROI measurement prevents spending on ineffective promotions, and identifying overstaffing hours enables resource reallocation to more productive times. With an average payback period of 2-3 months, people counting investment delivers one of the fastest returns compared to other retail technology investments.',
        'Why Choose SmartCounter?',
        'SmartCounter is a people counting platform designed specifically for the Indonesian market. Unlike expensive imported solutions that are difficult to support, SmartCounter is developed with deep understanding of Indonesian retail conditions — from varying store lighting and multi-entrance layouts to the need for dashboards in Bahasa Indonesia. The system is compatible with most CCTV brands common in Indonesia such as Hikvision, Dahua, and Uniview, requiring no new hardware investment. Supporting 5 languages (Indonesian, English, Korean, Japanese, Chinese) for multinational businesses. SmartCounter serves 300+ retail locations across Indonesia with 99.9% accuracy and an easy-to-understand real-time analytics dashboard.',
      ],
    },
    id: {
      title: 'Apa Itu People Counting System? Panduan Lengkap untuk Bisnis Retail',
    excerpt: 'People counting system adalah teknologi AI yang menghitung jumlah pengunjung secara otomatis menggunakan kamera CCTV. Pelajari cara kerja, manfaat, dan mengapa bisnis retail Indonesia membutuhkannya.',
    content: [
      'People counting system adalah teknologi berbasis kecerdasan buatan (AI) yang secara otomatis menghitung jumlah orang yang masuk dan keluar dari suatu lokasi. Sistem ini menggunakan kamera CCTV yang sudah terpasang di toko, mall, atau gedung komersial tanpa memerlukan perangkat keras tambahan. Dengan akurasi mencapai 99,9%, teknologi ini memberikan data real-time yang langsung tersedia di dashboard dan bisa diakses dari perangkat apa pun, kapan pun. Berbeda dengan penghitungan manual yang rawan human error dan tidak konsisten, people counting system memastikan setiap pengunjung tercatat secara akurat sehingga bisnis retail memiliki fondasi data yang solid untuk pengambilan keputusan strategis.',
      'Bagaimana Cara Kerja People Counting System?',
      'People counting system modern seperti SmartCounter menggunakan computer vision dan deep learning untuk mendeteksi serta melacak setiap individu yang melewati area kamera. Proses dimulai ketika kamera CCTV menangkap video stream secara kontinu, lalu algoritma AI berbasis model YOLO (You Only Look Once) memproses setiap frame untuk mengenali keberadaan manusia. Setelah terdeteksi, sistem tracking DeepSORT memberikan ID sementara unik kepada setiap orang dan melacak pergerakannya antar frame, memastikan satu individu hanya dihitung sekali meskipun sempat terhalang oleh objek lain atau orang lain. Garis virtual yang dikonfigurasi pada pintu masuk menentukan arah masuk atau keluar, sehingga toko mendapatkan data net traffic yang presisi. Semua pemrosesan ini terjadi secara real-time tanpa menyimpan data wajah atau informasi pribadi — sepenuhnya sesuai dengan regulasi privasi data di Indonesia.',
      'Jenis-Jenis Teknologi People Counting',
      'Ada beberapa teknologi yang digunakan untuk menghitung pengunjung, masing-masing dengan kelebihan dan keterbatasannya. Infrared beam counter adalah yang paling sederhana — memasang sinar inframerah di pintu masuk dan menghitung setiap kali sinar terputus. Kelemahannya, teknologi ini tidak bisa membedakan satu orang dari dua orang yang berjalan berdampingan, dan mudah terganggu oleh troli atau kereta bayi. Thermal sensor menggunakan deteksi panas tubuh untuk menghitung pengunjung. Teknologi ini lebih akurat dari infrared beam tetapi memiliki jangkauan terbatas dan harganya relatif mahal untuk coverage area yang luas. Teknologi berbasis video AI seperti SmartCounter adalah yang paling canggih dan cost-effective. Selain menghitung pengunjung dengan akurasi tertinggi, sistem ini juga mampu menganalisis demografi pengunjung, mengukur waktu kunjungan (dwell time), membuat visualisasi heatmap pergerakan, dan mendeteksi antrian — semua dari kamera CCTV yang sudah ada.',
      'Mengapa Bisnis Retail Membutuhkan People Counting?',
      'Tanpa data traffic pengunjung, setiap keputusan bisnis retail diambil berdasarkan perkiraan dan intuisi. Ketika penjualan menurun, pemilik toko tidak bisa menentukan apakah penyebabnya adalah berkurangnya pengunjung (masalah marketing) atau rendahnya tingkat konversi (masalah layanan/merchandising). People counting memberikan jawaban pasti dengan data yang terukur. Data dasar yang didapat dari people counting mencakup jumlah pengunjung per jam, hari, minggu, dan bulan untuk melihat tren traffic. Jam-jam sibuk (peak hours) teridentifikasi dengan presisi untuk optimasi jadwal staf. Tingkat konversi dihitung dari perbandingan jumlah pengunjung versus jumlah transaksi POS. Efektivitas promosi terukur dari perbandingan traffic sebelum dan sesudah kampanye. Performa antar cabang bisa dibandingkan secara objektif berdasarkan data, bukan asumsi.',
      'Siapa yang Menggunakan People Counting?',
      'People counting digunakan oleh berbagai jenis bisnis yang melayani pengunjung fisik. Toko retail dari berbagai ukuran — mulai dari boutique kecil dengan satu pintu masuk hingga jaringan ritel dengan 50+ cabang — menggunakan people counting untuk mengukur conversion rate dan optimasi operasional. Pusat perbelanjaan (mall) memanfaatkan data traffic untuk benchmarking tenant, optimasi zona, dan penentuan tarif sewa yang fair berdasarkan actual foot traffic. Apotek menggunakan sistem ini untuk monitoring antrian resep dan optimasi jadwal apoteker. Supermarket memanfaatkan data untuk analisis alur checkout, manajemen antrian kasir, dan optimasi penempatan produk. Fashion retail menggunakan people counting untuk tracking konversi fitting room — berapa pengunjung yang masuk fitting room dan berapa yang akhirnya membeli.',
      'ROI dan Dampak Bisnis People Counting',
      'Retailer yang mengimplementasikan people counting secara konsisten melaporkan peningkatan penjualan 15-25% dalam 6 bulan pertama penggunaan. ROI utama datang dari beberapa area: optimasi layout toko berdasarkan data heatmap meningkatkan penjualan kategori tertentu hingga 20%, penjadwalan staf yang tepat sesuai pola traffic menghemat 15-18% biaya tenaga kerja, pengukuran ROI kampanye marketing secara akurat menghindari pemborosan anggaran pada promosi yang tidak efektif, dan identifikasi jam-jam overstaffing memungkinkan realokasi sumber daya ke waktu yang lebih produktif. Dengan rata-rata payback period 2-3 bulan, investasi people counting termasuk yang paling cepat memberikan return dibandingkan investasi teknologi retail lainnya.',
      'Mengapa Memilih SmartCounter?',
      'SmartCounter adalah platform people counting yang dirancang khusus untuk pasar Indonesia. Berbeda dengan solusi impor yang mahal dan sulit di-support, SmartCounter dikembangkan dengan pemahaman mendalam tentang kondisi retail Indonesia — mulai dari variasi pencahayaan toko, layout dengan banyak pintu masuk, hingga kebutuhan dashboard dalam Bahasa Indonesia. Sistem ini kompatibel dengan mayoritas merek CCTV yang umum di Indonesia seperti Hikvision, Dahua, dan Uniview, sehingga tidak perlu investasi hardware baru. Mendukung 5 bahasa (Indonesia, Inggris, Korea, Jepang, China) untuk bisnis multinasional. SmartCounter telah melayani 300+ lokasi retail di seluruh nusantara dengan akurasi 99,9% dan dashboard analitik real-time yang mudah dipahami.',
    ],
      metaTitle: 'Apa Itu People Counting System? — People Counting & Analitik Pengunjung',
      metaDesc: 'People counting system adalah teknologi AI yang menghitung pengunjung secara otomatis via CCTV. Pelajari cara kerja, manfaat, dan ROI untuk bisnis retail Indonesia.',
    },
    category: 'Analytics',
  },
  {
    enSlug: 'cara-kerja-people-counting-cctv-ai',
    idSlug: 'cara-kerja-people-counting-cctv-ai',
    en: {
      title: 'How CCTV AI People Counting Works: Technology Behind 99.9% Accuracy',
      excerpt: 'Discover how AI and computer vision transform standard CCTV cameras into visitor counting systems with 99.9% accuracy. No additional sensors required.',
      metaTitle: 'How CCTV AI People Counting Works — Visitor Analytics',
      metaDesc: 'Computer vision and deep learning turn standard CCTV into 99.9% accurate visitor counters. Learn the system architecture and advantages over traditional sensors.',
      content: [
        'CCTV AI people counting applies computer vision and deep learning technology to CCTV cameras to automatically count, track, and analyze visitors with 99.9% accuracy. This technology transforms security cameras already installed in stores or buildings into advanced analytical sensors without requiring additional hardware. Over the past five years, advances in neural networks and GPU computing have made this technology increasingly accurate, fast, and affordable for retail businesses in Indonesia and across Southeast Asia.',
        'SmartCounter System Architecture',
        'SmartCounter uses an edge-cloud hybrid architecture consisting of three main components. First, the CCTV cameras already installed in stores serve as video stream inputs — the system is compatible with Hikvision, Dahua, Uniview, Axis, and other IP camera brands supporting RTSP protocol. Second, edge computing devices deployed on-site process video locally with low latency, ensuring counting occurs in real-time without network delays. Raw video is never transmitted to the cloud — only statistical data such as visitor counts, timestamps, and analytics metadata are sent. Third, the cloud dashboard presents data visualizations accessible from browsers or mobile apps anytime and from anywhere.',
        'Stage 1: Object Detection with Deep Learning',
        'The counting process begins with object detection using the latest YOLO (You Only Look Once) model, trained on millions of images of people in various positions, clothing, lighting conditions, and crowded environments. This model processes 30+ frames per second in real-time and distinguishes humans from other objects like shopping carts, mannequins, strollers, shadows, and mirror reflections. Detection accuracy reaches 99.9% even in low-light conditions, very crowded stores, or when visitors wear hats, masks, or carry large items. The model is periodically updated with the latest training data to maintain optimal accuracy.',
        'Stage 2: Multi-Object Tracking',
        'After detection, each individual receives a temporary unique ID and their movement is tracked frame-to-frame using the DeepSORT (Deep Simple Online and Realtime Tracking) algorithm. This algorithm combines visual information (appearance features) with motion prediction (Kalman filter) to maintain each person\'s identity even if temporarily obscured by objects, stopped, or changed direction. The result: each person is counted exactly once — no double counting that frequently occurs with traditional infrared sensors.',
        'Stage 3: Direction Classification and Zone Counting',
        'The system determines whether a person is entering or exiting based on their movement direction crossing a virtual line configured at the entrance during installation. This virtual line can be adjusted for position and angle for each camera. Beyond entry/exit counting, the system also supports zone counting — measuring how many people occupy specific areas at any given time. This is useful for per-zone occupancy monitoring, identifying popular areas, and measuring visitor dwell time in each store section.',
        'Stage 4: Advanced Analytics',
        'Beyond basic counting, AI extracts deeper business insights from the same video. Demographics estimation provides aggregate data on visitor age and gender without storing individual facial data. Dwell time analysis measures how long average visitors spend in specific zones — longer dwell times indicate higher engagement. Heatmaps visualize visitor movement patterns across the entire store, showing hot zones (heavily visited) and cold zones (rarely visited). Queue detection automatically identifies when queues form and estimates wait times, enabling managers to open additional checkout counters before lines become too long.',
        'Privacy and Data Security',
        'SmartCounter is designed with strict privacy-first principles. No facial recognition is performed, no images or video are stored on servers, and no individual personal data is collected. All data is processed in aggregate — only statistical numbers are stored such as visitor counts, age and gender distribution percentages, average visit duration, and anonymous movement patterns. The system fully complies with Indonesia\'s Personal Data Protection Law (UU PDP) and international privacy standards like GDPR. Complete audit trails are available to prove compliance to regulators or auditors.',
        'CCTV AI vs Traditional Sensors',
        'Compared to infrared beam counters achieving only 85-90% accuracy, CCTV AI delivers 99.9% accuracy because it can distinguish between individuals walking side by side. Thermal sensors offer better accuracy than infrared (92-95%) but are expensive with limited range. CCTV AI excels in all aspects: highest accuracy, lowest cost (utilizing existing cameras), most comprehensive analytics capabilities (demographics, heatmaps, queues), and best scalability — one server can process dozens of cameras simultaneously. For businesses with existing CCTV systems, migration to AI-powered people counting is the most logical and cost-effective upgrade.',
      ],
    },
    id: {
      title: 'Cara Kerja People Counting dengan CCTV AI: Teknologi di Balik Akurasi 99,9%',
      excerpt: 'Pelajari bagaimana teknologi AI dan computer vision mengubah kamera CCTV biasa menjadi sistem penghitung pengunjung dengan akurasi 99,9%. Tidak perlu sensor tambahan.',
      metaTitle: 'Cara Kerja People Counting CCTV AI — People Counting & Analitik Pengunjung',
      metaDesc: 'Teknologi computer vision dan deep learning mengubah CCTV biasa menjadi penghitung pengunjung 99,9% akurat. Pelajari arsitektur sistem dan keunggulannya vs sensor tradisional.',
      content: [
        'CCTV AI people counting adalah penerapan teknologi computer vision dan deep learning pada kamera CCTV untuk menghitung, melacak, dan menganalisis pengunjung secara otomatis dengan akurasi mencapai 99,9%. Teknologi ini mengubah kamera pengawas yang sudah terpasang di toko atau gedung menjadi sensor analitik canggih tanpa memerlukan perangkat keras tambahan. Dalam 5 tahun terakhir, kemajuan di bidang neural network dan GPU computing telah membuat teknologi ini semakin akurat, cepat, dan terjangkau untuk bisnis retail di Indonesia.',
        'Arsitektur Sistem SmartCounter',
        'SmartCounter menggunakan arsitektur edge-cloud hybrid yang terdiri dari tiga komponen utama. Pertama, kamera CCTV yang sudah terpasang di toko berfungsi sebagai input video stream — sistem kompatibel dengan Hikvision, Dahua, Uniview, Axis, dan merek IP camera lainnya yang mendukung protokol RTSP. Kedua, edge computing device yang terpasang di lokasi memproses video secara lokal dengan latensi rendah, sehingga penghitungan terjadi real-time tanpa delay jaringan. Video mentah tidak pernah dikirim ke cloud — yang dikirim hanya data statistik berupa angka pengunjung, timestamp, dan metadata analitik. Ketiga, cloud dashboard menyajikan visualisasi data yang bisa diakses dari browser atau aplikasi mobile kapan saja dan dari mana saja.',
        'Tahap 1: Deteksi Objek dengan Deep Learning',
        'Proses penghitungan dimulai dari deteksi objek menggunakan model YOLO (You Only Look Once) versi terbaru yang telah dilatih dengan jutaan gambar manusia dalam berbagai posisi, pakaian, pencahayaan, dan kondisi keramaian. Model ini mampu memproses 30+ frame per detik secara real-time dan membedakan manusia dari objek lain seperti kereta belanja, manekin, stroller, bayangan, dan pantulan cermin. Akurasi deteksi mencapai 99,9% bahkan dalam kondisi pencahayaan rendah, toko yang sangat ramai, atau saat pengunjung memakai topi, masker, atau membawa barang besar. Model secara berkala diperbarui dengan data training terbaru untuk mempertahankan akurasi optimal.',
        'Tahap 2: Tracking Multi-Objek',
        'Setelah terdeteksi, setiap individu diberi ID unik sementara dan dilacak pergerakannya dari frame ke frame menggunakan algoritma DeepSORT (Deep Simple Online and Realtime Tracking). Algoritma ini menggabungkan informasi visual (appearance features) dengan prediksi gerak (Kalman filter) untuk mempertahankan identitas setiap orang meskipun mereka sesaat terhalang oleh objek lain, berhenti, atau berubah arah. Hasilnya, satu orang dijamin hanya dihitung sekali — tidak ada double counting yang sering terjadi pada sensor infrared tradisional.',
        'Tahap 3: Klasifikasi Arah dan Zone Counting',
        'Sistem menentukan apakah seseorang masuk atau keluar berdasarkan arah pergerakannya melewati garis virtual (virtual line) yang dikonfigurasi pada pintu masuk saat instalasi. Garis virtual ini bisa disesuaikan posisi dan sudutnya untuk setiap kamera. Selain penghitungan masuk/keluar, sistem juga mendukung zone counting — menghitung berapa orang berada di zona tertentu pada waktu tertentu. Ini berguna untuk monitoring okupansi per area, mengidentifikasi zona populer, dan mengukur dwell time pengunjung di setiap section toko.',
        'Tahap 4: Analitik Lanjutan',
        'Selain counting dasar, AI mampu mengekstrak insight bisnis yang lebih dalam dari video yang sama. Estimasi demografi memberikan data agregat usia dan gender pengunjung tanpa menyimpan data wajah individual. Dwell time analysis mengukur berapa lama rata-rata pengunjung menghabiskan waktu di zona tertentu — waktu tinggal yang panjang mengindikasikan engagement tinggi. Heatmap memvisualisasikan pola pergerakan pengunjung di seluruh area toko, menunjukkan zona hot (banyak dikunjungi) dan zona cold (jarang dikunjungi). Queue detection secara otomatis mendeteksi terbentuknya antrian dan mengestimasi waktu tunggu, memungkinkan manajer membuka kasir tambahan sebelum antrian terlalu panjang.',
        'Privasi dan Keamanan Data',
        'SmartCounter dirancang dengan prinsip privacy-first yang ketat. Tidak ada pengenalan wajah (face recognition) yang dijalankan, tidak ada gambar atau video yang disimpan di server, dan tidak ada data pribadi individual yang dikumpulkan. Semua data diproses secara agregat — yang disimpan hanyalah angka statistik seperti jumlah pengunjung, distribusi usia dan gender secara persentase, rata-rata waktu kunjungan, dan pola pergerakan anonim. Sistem ini sepenuhnya mematuhi UU Perlindungan Data Pribadi Indonesia (UU PDP) dan standar privasi internasional seperti GDPR. Audit trail lengkap tersedia untuk membuktikan kepatuhan kepada regulator atau auditor.',
        'Keunggulan CCTV AI vs Sensor Tradisional',
        'Dibandingkan dengan sensor infrared beam counter yang hanya mencapai akurasi 85-90%, CCTV AI memberikan akurasi 99,9% karena mampu membedakan individu yang berjalan berdampingan. Sensor thermal memiliki akurasi lebih baik dari infrared (92-95%) tetapi harganya mahal dan jangkauan terbatas. CCTV AI unggul di semua aspek: akurasi tertinggi, biaya terendah (memanfaatkan kamera existing), kemampuan analitik paling lengkap (demografi, heatmap, antrian), dan skalabilitas terbaik — satu server bisa memproses puluhan kamera sekaligus. Bagi bisnis yang sudah memiliki sistem CCTV terpasang, migrasi ke people counting AI adalah upgrade yang paling logis dan cost-effective.',
      ],
    },
    category: 'Technical',
  },
  {
    enSlug: 'manfaat-visitor-counter-toko-retail',
    idSlug: 'manfaat-visitor-counter-toko-retail',
    en: {
      title: '7 Benefits of Visitor Counters for Retail Stores — Boost Sales 25-40%',
      excerpt: 'Visitor counters help retail stores optimize staffing, layout, and promotions based on real-time customer traffic data. Discover 7 key benefits that can increase sales up to 40%.',
      metaTitle: '7 Benefits of Visitor Counters for Retail Stores',
      metaDesc: 'Visitor counters optimize staffing, layout, and marketing for retail. Learn 7 benefits that boost sales 25-40% in the first year.',
      content: [
        'A visitor counter is a device or system that automatically and accurately counts the number of visitors entering a retail store. In modern contexts, AI-based visitor counters use existing CCTV cameras to provide real-time traffic data without additional hardware investment. Retail managers relying on intuition without visitor data are like driving with eyes closed — important decisions about staffing, layout, promotions, and inventory are made without solid data foundations. Visitor counters provide complete visibility into what happens in your store, and retailers consistently using this data report sales increases of 25-40% in the first year of implementation.',
        'Benefit 1: Measure True Conversion Rate',
        'Conversion rate is the most fundamental metric in retail — the ratio between the number of visitors entering the store and the number of transactions completed. Without a visitor counter, you know how many transactions occurred but not what percentage of visitors actually made a purchase. When sales drop this month, is it because fewer visitors came (a marketing or location problem) or because conversion is low (a service or merchandising problem)? A visitor counter provides the definitive answer. When stores first start measuring conversion rate, they are often surprised — the numbers are frequently much lower than estimated. The good news is that every small increase in conversion rate directly impacts revenue because you are converting the existing visitor traffic more effectively.',
        'Benefit 2: Optimize Staff Scheduling and Sizing',
        'Hourly visitor counter data shows precisely when your store is busy and when it is slow. Many stores in Indonesia schedule staff based on intuition or fixed schedules — the result is often overstaffing during quiet hours that wastes labor costs, and understaffing during peak hours that reduces service quality and conversion rates. By matching staff schedules to the actual traffic patterns shown by visitor counters, retailers save 15-20% in labor costs while improving service during busy periods. The recommended ideal ratio is one staff member per 10-15 active visitors in the sales area.',
        'Benefit 3: Accurately Measure Promotion ROI',
        'Before visitor counters, promotion evaluation was subjective: "Yesterday\'s promotion was busy, seems successful." After visitor counters, evaluation becomes data-driven: "Weekend promotion increased foot traffic 34% and conversion rate rose from 8% to 12% — positive ROI 3.2x the promotion cost." Traffic data concretely proves which promotions effectively drive visitors and which waste marketing budgets. You can compare the impact of different promotion types — price discounts vs. buy-one-get-one vs. in-store events — and allocate marketing budget to channels that truly generate foot traffic and sales.',
        'Benefit 4: Data-Driven Store Layout Optimization',
        'Visitor counters equipped with heatmap features visualize which areas of your store get the most visits (hot zones) and which are rarely visited by customers (cold zones or dead zones). This data transforms store layout from art into science. Retailers who move bestselling products and high-margin items to high-traffic zones report 15-20% sales increases for those categories. Dead zones can be revived by placing destination products (items customers seek specifically) or eye-catching signage, so traffic spreads throughout the store and every square meter generates optimal revenue.',
        'Benefit 5: Multi-Location Benchmarking',
        'For retail chains with multiple locations, visitor counters enable fair and objective performance comparison. Without visitor data, the location with highest sales is considered best — but it may simply be in a naturally high-traffic area. Conversely, a small location in a quiet area might have much higher conversion rate, indicating highly effective sales and merchandising teams. Visitor counters reveal these insights so best practices from high-conversion locations can be replicated elsewhere, and high-traffic but low-conversion locations can be investigated immediately.',
        'Benefit 6: Traffic Prediction and Inventory Planning',
        'With historical traffic data collected by visitor counters over several months, seasonal visitor patterns become clear and predictable. You know exactly when peak season begins and ends, how traffic patterns change during Ramadan, Eid, Christmas, or school holidays. This prediction enables accurate inventory planning — ordering the right stock for busy periods, avoiding overstock during slow periods, and preparing additional staff before visitor surges occur. Predictive data also helps negotiate with suppliers since you can show evidence of seasonal demand patterns.',
        'Benefit 7: Capacity Compliance and Safety',
        'Real-time occupancy monitoring ensures your store does not exceed the maximum capacity set by safety regulations and fire codes. Visitor counters provide automatic alerts when the number of people in the store approaches the limit, allowing staff to manage entry flow before the situation becomes unsafe or uncomfortable. This feature is crucial for regulatory compliance, provides a comfortable shopping experience for visitors, and in emergencies provides accurate data on how many people need evacuation.',
        'Visitor Counter ROI: Fast-Returning Investment',
        'SmartCounter visitor counter investment delivers a short payback period — averaging 2-3 months for retail stores in Indonesia. With the combination of sales increases from conversion rate optimization (10-25%), staff cost savings from efficient scheduling (15-20%), and marketing budget efficiency from accurate ROI measurement, total financial impact can reach 25-40% profitability improvement in the first year. SmartCounter provides an AI-based visitor counter solution designed specifically for Indonesian retail conditions, with local technical support and an Indonesian language dashboard.',
      ],
    },
    id: {
      title: 'Manfaat Visitor Counter untuk Toko Retail: Tingkatkan Penjualan hingga 40%',
      excerpt: 'Visitor counter membantu toko retail mengoptimalkan staf, layout, dan promosi berdasarkan data pengunjung real-time. Pelajari 7 manfaat utama yang bisa meningkatkan penjualan hingga 40%.',
      metaTitle: 'Manfaat Visitor Counter Toko Retail — People Counting & Analitik Pengunjung',
      metaDesc: 'Visitor counter tingkatkan penjualan toko retail hingga 40%. Pelajari 7 manfaat utama: konversi, optimasi staf, ROI promosi, heatmap layout, dan benchmarking cabang.',
      content: [
        'Visitor counter adalah perangkat atau sistem yang menghitung jumlah pengunjung yang masuk ke toko retail secara otomatis dan akurat. Dalam konteks modern, visitor counter berbasis AI menggunakan kamera CCTV yang sudah terpasang untuk memberikan data traffic real-time tanpa hardware tambahan. Retail manager yang mengandalkan intuisi tanpa data pengunjung ibarat mengemudi dengan mata tertutup — keputusan penting tentang staf, layout, promosi, dan inventori diambil tanpa fondasi data yang kuat. Visitor counter memberikan visibilitas penuh terhadap apa yang terjadi di toko, dan retailer yang memanfaatkan data ini secara konsisten melaporkan peningkatan penjualan 25-40% dalam tahun pertama implementasi.',
        'Manfaat 1: Mengukur Tingkat Konversi yang Sebenarnya',
        'Conversion rate adalah metrik paling fundamental dalam retail — perbandingan antara jumlah pengunjung yang masuk toko dengan jumlah transaksi yang terjadi. Tanpa visitor counter, Anda hanya tahu berapa transaksi terjadi tetapi tidak tahu berapa persen dari pengunjung yang benar-benar membeli. Ketika penjualan turun bulan ini, apakah penyebabnya pengunjung yang berkurang (masalah marketing/lokasi) atau konversi yang rendah (masalah layanan/merchandising)? Visitor counter memberikan jawaban definitif. Toko yang mulai mengukur conversion rate biasanya terkejut — angkanya sering jauh lebih rendah dari perkiraan. Kabar baiknya, setiap peningkatan kecil dalam conversion rate langsung berdampak pada revenue karena jumlah pengunjung yang sudah ada dikonversi lebih efektif.',
        'Manfaat 2: Optimasi Jadwal dan Jumlah Staf',
        'Data visitor counter per jam menunjukkan dengan presisi kapan toko ramai dan kapan sepi. Banyak toko di Indonesia menjadwalkan staf berdasarkan intuisi atau jadwal tetap — hasilnya sering kali kelebihan staf (overstaffing) di jam-jam sepi yang memboroskan biaya tenaga kerja, dan kekurangan staf (understaffing) di peak hours yang menurunkan kualitas pelayanan dan conversion rate. Dengan mencocokkan jadwal staf ke pola traffic aktual yang ditunjukkan visitor counter, retailer menghemat 15-20% biaya tenaga kerja sekaligus meningkatkan pelayanan di jam-jam sibuk. Rasio ideal yang direkomendasikan adalah 1 staf per 10-15 pengunjung aktif di area penjualan.',
        'Manfaat 3: Mengukur ROI Promosi Secara Akurat',
        'Sebelum visitor counter, evaluasi promosi bersifat subjektif: "Promo kemarin ramai, sepertinya berhasil." Sesudah visitor counter, evaluasi menjadi berbasis data: "Promo weekend meningkatkan foot traffic 34% dan conversion rate naik dari 8% ke 12% — ROI positif 3.2x dari biaya promosi." Data traffic membuktikan secara konkret promosi mana yang efektif mendatangkan pengunjung dan promosi mana yang hanya membuang anggaran marketing. Anda bisa membandingkan dampak berbagai jenis promosi — diskon harga vs buy-one-get-one vs event di toko — dan mengalokasikan budget marketing ke channel yang benar-benar menghasilkan foot traffic dan penjualan.',
        'Manfaat 4: Layout Toko Berbasis Data Heatmap',
        'Visitor counter yang dilengkapi fitur heatmap memvisualisasikan area toko mana yang paling banyak dikunjungi (zona hot) dan mana yang jarang disentuh pengunjung (zona cold/dead zone). Data ini mengubah penataan layout dari seni menjadi sains. Retailer yang memindahkan produk bestseller dan high-margin ke zona high-traffic melaporkan peningkatan penjualan 15-20% untuk kategori tersebut. Dead zone bisa dihidupkan dengan menempatkan produk destination (barang yang dicari pelanggan secara spesifik) atau signage yang menarik perhatian, sehingga traffic merata ke seluruh area toko dan setiap meter persegi menghasilkan revenue optimal.',
        'Manfaat 5: Benchmarking Antar Cabang',
        'Untuk jaringan retail dengan banyak cabang, visitor counter memungkinkan perbandingan performa yang fair dan objektif. Tanpa data pengunjung, cabang dengan penjualan tertinggi dianggap paling bagus — padahal mungkin cabang tersebut hanya berada di lokasi dengan traffic alami yang tinggi. Sebaliknya, cabang kecil di lokasi sepi mungkin memiliki conversion rate yang jauh lebih tinggi, menandakan tim sales dan merchandising yang sangat efektif. Visitor counter mengungkap insight ini sehingga best practices dari cabang high-conversion bisa direplikasi ke cabang lain, dan cabang dengan traffic tinggi tapi conversion rendah bisa segera diinvestigasi masalahnya.',
        'Manfaat 6: Prediksi Traffic dan Perencanaan Inventori',
        'Dengan data historis traffic yang dikumpulkan visitor counter selama beberapa bulan, pola pengunjung musiman menjadi jelas dan bisa diprediksi. Anda tahu persis kapan peak season dimulai dan berakhir, bagaimana pola traffic berubah saat Ramadhan, Lebaran, Natal, atau liburan sekolah. Prediksi ini memungkinkan perencanaan stok yang akurat — memesan inventori yang tepat untuk periode ramai, menghindari overstock di periode sepi, dan mempersiapkan staf tambahan sebelum lonjakan pengunjung terjadi. Data prediktif juga membantu negosiasi dengan supplier karena Anda bisa menunjukkan bukti data seasonal demand.',
        'Manfaat 7: Kepatuhan Kapasitas dan Keamanan',
        'Monitoring okupansi real-time memastikan toko tidak melebihi kapasitas maksimum yang ditentukan oleh regulasi keselamatan dan fire code. Visitor counter memberikan alert otomatis ketika jumlah orang di dalam toko mendekati batas, memungkinkan staf mengatur arus masuk sebelum situasi menjadi tidak aman atau tidak nyaman. Fitur ini penting untuk kepatuhan regulasi, memberikan pengalaman belanja yang nyaman bagi pengunjung, dan dalam situasi darurat menyediakan data akurat berapa orang yang perlu dievakuasi.',
        'ROI Visitor Counter: Investasi yang Cepat Kembali',
        'Investasi visitor counter SmartCounter memberikan payback period yang singkat — rata-rata 2-3 bulan untuk toko retail di Indonesia. Dengan kombinasi peningkatan penjualan dari optimasi conversion rate (10-25%), penghematan biaya staf dari jadwal yang lebih efisien (15-20%), dan efisiensi anggaran marketing dari pengukuran ROI yang akurat, total dampak finansial bisa mencapai 25-40% peningkatan profitabilitas dalam tahun pertama. SmartCounter menyediakan solusi visitor counter berbasis AI yang dirancang khusus untuk kondisi retail Indonesia, dengan dukungan teknis lokal dan dashboard dalam Bahasa Indonesia.',
      ],
    },
    category: 'Analytics',
  },
  {
    enSlug: 'cctv-ai-people-counting-visitor-analytics',
    idSlug: 'cctv-ai-people-counting-visitor-analytics',
    en: {
      title: 'CCTV AI for People Counting and Visitor Analytics: Complete Retail Solution',
      excerpt: 'CCTV AI transforms security cameras into powerful visitor analytics tools. Explore the full feature set: people counting, heatmaps, demographics, queue detection, and real-time dashboard integration.',
      metaTitle: 'CCTV AI People Counting & Visitor Analytics — SmartCounter',
      metaDesc: 'Transform existing CCTV into AI visitor analytics: 99.9% accurate people counting, heatmaps, demographics, and queue detection for retail.',
      content: [
        'CCTV AI visitor analytics is a technology that transforms ordinary security cameras into intelligent visitor analysis systems using artificial intelligence. Instead of only recording video for security purposes, CCTV AI extracts valuable business data from every video frame in real-time — counting visitors, analyzing behavior, visualizing movement patterns, and delivering actionable insights to increase sales. SmartCounter converts your existing CCTV investment into a high-value business data source without purchasing additional hardware, making it the most cost-effective visitor analytics solution available in Indonesia.',
        'From Passive CCTV to Active Analytics',
        'Conventional CCTV operates passively — recording video and storing it to be reviewed only when a security incident occurs. Studies show that over 90% of CCTV footage is never watched by anyone, making camera investment a pure cost center with no additional business value. With SmartCounter AI overlay, every video frame is analyzed in real-time to extract visitor data that directly benefits business operations. This transformation requires no camera replacement — SmartCounter works with any IP camera supporting RTSP streams including Hikvision, Dahua, Uniview, Axis, and other brands commonly used in Indonesia. The ROI shifts dramatically: from a security cost center to an analytics profit center.',
        'People Counting Feature',
        'People counting is SmartCounter\'s foundational feature, counting visitors entering and leaving stores with 99.9% accuracy. Data is available in real-time on the dashboard and accessible from both desktop browsers and smartphones. The system supports multi-entrance counting for stores with multiple doorways — traffic from all entrances is automatically aggregated to provide accurate total figures. Data is presented per hour, per day, per week, and per month, complete with period-over-period comparison trends. For retail chain owners, traffic data from all branches can be monitored and compared in a single unified dashboard.',
        'Heatmap Feature',
        'Heatmaps visualize visitor movement patterns across the entire store floor as a color overlay on the store layout. Red areas indicate high-traffic zones most frequently visited, yellow shows moderate traffic, and blue indicates areas rarely touched by visitors (dead zones). This heatmap data is invaluable for layout decisions — high-margin products are placed in hot zones to maximize exposure, while dead zones are revitalized with destination products or attention-grabbing signage. Retailers consistently optimizing layouts based on heatmap data report 15-20% sales increases for product categories moved to strategic zones.',
        'Demographics and Queue Detection',
        'SmartCounter provides aggregate age and gender estimates without storing facial data or individual personal information. Demographic data helps store owners understand who their visitors actually are — whether predominantly young adults, families, or professionals — so product assortment, visual merchandising, and marketing strategies can be tailored to actual customer profiles. Queue detection automatically identifies forming lines at checkout areas and estimates wait times. The system sends real-time alerts via email, push notification, or webhook when queue length exceeds defined thresholds, enabling managers to open additional registers before customers become frustrated and leave without purchasing.',
        'Dashboard, Reporting, and Integration',
        'All analytics data is displayed in a responsive real-time dashboard accessible via browser from any device. The dashboard presents hourly traffic graphs, daily trends, weekly comparisons, and monthly analytics for each location. Automated reports can be scheduled — daily summaries sent via email every morning, weekly reports every Monday, and monthly analytics reports for management meetings. PDF and Excel export formats are available for stakeholder presentations. A REST API is available for integration with existing POS, ERP, or BI tools already used by the company. SmartCounter is designed specifically for Indonesian retail conditions with multi-entrance support, variable lighting optimization, a dashboard available in 5 languages, and responsive local technical support in Jakarta.',
      ],
    },
    id: {
      title: 'CCTV AI untuk People Counting dan Visitor Analytics: Solusi Lengkap untuk Retail Indonesia',
      excerpt: 'CCTV AI mengubah kamera keamanan menjadi alat analitik pengunjung yang powerful. Pelajari fitur lengkap: people counting, heatmap, demografi, antrian, dan integrasi dashboard real-time.',
      metaTitle: 'CCTV AI People Counting & Visitor Analytics — Analitik Pengunjung',
      metaDesc: 'CCTV AI mengubah kamera keamanan menjadi alat visitor analytics: people counting 99,9% akurat, heatmap, demografi, antrian.',
      content: [
      'CCTV AI visitor analytics adalah teknologi yang mengubah kamera pengawas (CCTV) biasa menjadi sistem analitik pengunjung cerdas menggunakan kecerdasan buatan. Alih-alih hanya merekam video untuk keperluan keamanan, CCTV AI mengekstrak data bisnis yang berharga dari setiap frame video secara real-time — menghitung pengunjung, menganalisis perilaku, memvisualisasikan pola pergerakan, dan memberikan insight yang actionable untuk meningkatkan penjualan. SmartCounter mengubah investasi CCTV yang sudah ada di toko Anda menjadi sumber data bisnis bernilai tinggi tanpa perlu membeli perangkat keras tambahan, menjadikannya solusi paling cost-effective untuk visitor analytics di Indonesia.',
      'Dari CCTV Pasif ke Analitik Aktif',
      'CCTV konvensional beroperasi secara pasif — merekam video dan menyimpannya untuk ditonton jika terjadi insiden keamanan. Studi menunjukkan bahwa lebih dari 90% rekaman CCTV tidak pernah ditonton oleh siapapun, menjadikan investasi kamera sebagai cost center murni tanpa value bisnis tambahan. Dengan overlay AI dari SmartCounter, setiap frame video dianalisis secara real-time untuk mengekstrak data pengunjung yang langsung bermanfaat bagi operasional bisnis. Transformasi ini tidak memerlukan penggantian kamera — SmartCounter bekerja dengan kamera IP apa pun yang mendukung RTSP stream termasuk Hikvision, Dahua, Uniview, Axis, dan merek lainnya yang umum digunakan di Indonesia. ROI berubah drastis: dari cost center keamanan menjadi profit center analitik.',
      'Fitur People Counting',
      'People counting adalah fitur fundamental SmartCounter yang menghitung jumlah pengunjung yang masuk dan keluar toko dengan akurasi 99,9%. Data tersedia real-time di dashboard dan bisa diakses dari browser desktop maupun smartphone. Sistem mendukung multi-entrance counting untuk toko dengan banyak pintu masuk — traffic dari semua entrance diagregasi secara otomatis untuk memberikan angka total yang akurat. Data disajikan per jam, per hari, per minggu, dan per bulan, lengkap dengan tren perbandingan antar periode. Bagi pemilik jaringan retail, data traffic dari semua cabang bisa dimonitor dan dibandingkan dalam satu dashboard terpadu.',
      'Fitur Heatmap Pengunjung',
      'Heatmap memvisualisasikan pola pergerakan pengunjung di seluruh area toko dalam bentuk overlay warna pada denah toko. Area berwarna merah menunjukkan zona high-traffic yang paling banyak dikunjungi, kuning menunjukkan traffic sedang, dan biru menunjukkan area yang jarang disentuh pengunjung (dead zone). Data heatmap ini sangat berharga untuk keputusan layout — produk high-margin ditempatkan di zona hot untuk memaksimalkan exposure, sementara dead zone dihidupkan dengan signage atau produk destination yang menarik pengunjung. Retailer yang mengoptimasi layout berdasarkan data heatmap secara konsisten melaporkan peningkatan penjualan 15-20% untuk kategori produk yang dipindahkan ke zona strategis.',
      'Fitur Analisis Demografi',
      'SmartCounter menyediakan estimasi usia dan gender pengunjung secara agregat tanpa menyimpan data wajah atau informasi pribadi individual. Data demografi membantu pemilik toko memahami siapa sebenarnya pengunjung mereka — apakah dominan usia muda, keluarga, atau profesional — sehingga assortment produk, visual merchandising, dan strategi marketing bisa disesuaikan dengan profil pelanggan aktual. Semua data demografi diproses secara agregat dan statistik, sepenuhnya mematuhi UU Perlindungan Data Pribadi Indonesia dan standar privasi internasional.',
      'Fitur Monitoring Antrian',
      'Queue detection secara otomatis mendeteksi terbentuknya antrian di area kasir dan mengestimasi waktu tunggu berdasarkan panjang antrian dan kecepatan pemrosesan. Sistem mengirim alert real-time via email, push notification, atau webhook ketika panjang antrian melampaui threshold yang ditentukan — misalnya lebih dari 5 orang atau estimasi waktu tunggu lebih dari 3 menit. Alert ini memungkinkan manajer toko membuka kasir tambahan sebelum pengunjung frustrasi dan meninggalkan toko tanpa membeli. Retailer yang menggunakan queue management SmartCounter melaporkan pengurangan waktu tunggu rata-rata 30-40% dan peningkatan customer satisfaction yang terukur.',
      'Fitur Dwell Time dan Occupancy',
      'Dwell time analysis mengukur berapa lama rata-rata pengunjung menghabiskan waktu di setiap zona toko. Waktu tinggal yang panjang di area produk tertentu mengindikasikan engagement dan ketertarikan tinggi, sementara waktu tinggal yang sangat singkat mungkin menandakan masalah display atau merchandising. Occupancy monitoring memantau jumlah orang di dalam toko atau zona secara real-time dan memberikan alert ketika mendekati kapasitas maksimum. Fitur ini penting untuk kepatuhan fire code, kenyamanan pengunjung, dan dalam situasi darurat menyediakan data akurat untuk prosedur evakuasi.',
      'Dashboard dan Reporting',
      'Semua data analitik ditampilkan dalam dashboard real-time yang responsif dan bisa diakses via browser dari perangkat apa pun. Dashboard menyajikan grafik hourly traffic, daily trends, weekly comparisons, dan monthly analytics untuk setiap lokasi. Laporan otomatis bisa dijadwalkan — daily summary dikirim via email setiap pagi, weekly report setiap Senin, dan monthly analytics report untuk meeting manajemen. Format ekspor PDF dan Excel tersedia untuk presentasi kepada stakeholder. REST API tersedia untuk integrasi dengan sistem POS, ERP, atau BI tools yang sudah digunakan perusahaan.',
      'Implementasi dan Dukungan Lokal',
      'SmartCounter dirancang khusus untuk kondisi retail Indonesia dengan beberapa keunggulan spesifik: mendukung toko dengan banyak pintu masuk yang khas di Indonesia, bekerja optimal dalam pencahayaan toko yang bervariasi, dashboard tersedia dalam 5 bahasa (Indonesia, Inggris, Korea, Jepang, China), dan tim support teknis lokal di Jakarta yang responsif. Implementasi memakan waktu 1-2 hari per lokasi tanpa mengganggu operasional toko. SmartCounter telah melayani 300+ lokasi retail di seluruh Indonesia, dari boutique kecil hingga pusat perbelanjaan besar, dengan track record akurasi 99,9% dan uptime yang konsisten.',
    ],
    },
    category: 'Features',
  },
]

export async function POST() {
  try {
    const payload = await getPayload({ config: configPromise })
    const results = { created: 0, updated: 0, errors: [] as string[] }
    const readingTime = (content: string[]) => Math.ceil(content.join(' ').split(/\s+/).length / 200)

    for (const post of BLOG_POSTS) {
      try {
        // Resolve EN and ID content — new format has .en/.id, old format has flat fields
        const hasNewFormat = 'en' in post && 'id' in post
        const enData = hasNewFormat ? (post as any).en : { title: post.title, excerpt: post.excerpt, content: post.content, metaTitle: post.metaTitle, metaDesc: post.metaDesc }
        const idData = hasNewFormat ? (post as any).id : { title: post.title, excerpt: post.excerpt, content: post.content, metaTitle: post.metaTitle, metaDesc: post.metaDesc }

        const existing = await payload.find({
          collection: 'blog-posts', where: { slug: { equals: post.enSlug } }, locale: 'en', limit: 1,
        })

        if (existing.docs.length > 0) {
          const id = existing.docs[0].id
          // Update EN locale with English content
          await payload.update({
            collection: 'blog-posts', id, locale: 'en',
            data: {
              title: enData.title, slug: post.enSlug,
              content: lexical(enData.content), excerpt: enData.excerpt,
              readingTime: readingTime(enData.content),
              meta: { title: enData.metaTitle, description: enData.metaDesc },
            },
          })
          // Update ID locale with Indonesian content
          await payload.update({
            collection: 'blog-posts', id, locale: 'id',
            data: {
              title: idData.title, slug: post.idSlug,
              content: lexical(idData.content), excerpt: idData.excerpt,
              readingTime: readingTime(idData.content),
              meta: { title: idData.metaTitle, description: idData.metaDesc },
            },
          })
          results.updated++
        } else {
          const created = await payload.create({
            collection: 'blog-posts', locale: 'en',
            data: {
              title: enData.title, slug: post.enSlug,
              content: lexical(enData.content), excerpt: enData.excerpt,
              status: 'published', publishedAt: new Date().toISOString(),
              readingTime: readingTime(enData.content),
              meta: { title: enData.metaTitle, description: enData.metaDesc },
            },
          })
          await payload.update({
            collection: 'blog-posts', id: created.id, locale: 'id',
            data: {
              title: idData.title, slug: post.idSlug,
              content: lexical(idData.content), excerpt: idData.excerpt,
              meta: { title: idData.metaTitle, description: idData.metaDesc },
            },
          })
          results.created++
        }
      } catch (err) {
        results.errors.push(`${post.enSlug}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    return NextResponse.json({
      message: `Created ${results.created}, updated ${results.updated} blog posts`,
      created: results.created, updated: results.updated, errors: results.errors,
    })
  } catch (error) {
    console.error('Create ID blogs error:', error)
    return NextResponse.json(
      { error: 'Failed', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
