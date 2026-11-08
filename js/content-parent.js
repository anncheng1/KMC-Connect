/* KMC Connect — parent education content (EN / BM / 中文).
 * Adapted from: WHO. Parent counselling guide on kangaroo mother care (KMC). Geneva: WHO; 2025
 * and WHO. Kangaroo mother care: a clinical practice guide. Geneva: WHO; 2025. Licence CC BY-NC-SA 3.0 IGO.
 * Translations were not created by WHO. WHO is not responsible for their content or accuracy.
 */

/* All videos linked from the WHO KMC clinical practice guide (2025). */
const VIDEOS = [
  { n: 1, url: 'https://who.canto.global/b/GJ1MI', src: 'WHO', aud: 'hcp', title: { en: 'Mother–newborn care unit' } },
  { n: 2, url: 'https://globalhealthmedia.org/videos/wrap-designs-for-skin-to-skin-care/', src: 'Global Health Media', aud: 'both',
    title: { en: 'Wrap designs for skin-to-skin care', ms: 'Reka bentuk kain pengikat untuk kulit-ke-kulit', zh: '肌肤接触用的背带款式' } },
  { n: 3, url: 'https://who.canto.global/b/PEOF2', src: 'WHO', aud: 'hcp', title: { en: 'Antenatal counselling for KMC' } },
  { n: 4, url: 'https://globalhealthmedia.org/video/providing-essential-care-at-birth/', src: 'Global Health Media', aud: 'hcp', title: { en: 'Providing essential care at birth' } },
  { n: 5, url: 'https://who.canto.global/b/I8J7J', src: 'WHO', aud: 'hcp', title: { en: 'Initiating KMC for a small sick newborn immediately after birth' } },
  { n: 6, url: 'https://who.canto.global/b/G04P0', src: 'WHO', aud: 'both',
    title: { en: 'Postnatal counselling on KMC', ms: 'Kaunseling KMC selepas bersalin', zh: '产后袋鼠式护理辅导' } },
  { n: 7, url: 'https://who.canto.global/b/ORVHS', src: 'WHO', aud: 'both',
    title: { en: 'Placing a stable newborn in the KMC position', ms: 'Meletakkan bayi yang stabil dalam posisi KMC', zh: '将情况稳定的宝宝放成袋鼠式护理姿势' } },
  { n: 8, url: 'https://who.canto.global/b/HNMAD', src: 'WHO', aud: 'both',
    title: { en: 'Placing a sick newborn on CPAP in the KMC position', ms: 'Meletakkan bayi sakit yang menggunakan CPAP dalam posisi KMC', zh: '将使用CPAP的病宝宝放成袋鼠式护理姿势' } },
  { n: 9, url: 'https://who.canto.global/b/R4DO3', src: 'WHO', aud: 'hcp', title: { en: 'Newborn examination in KMC position' } },
  { n: 10, url: 'https://globalhealthmedia.org/video/danger-signs-in-the-small-baby/', src: 'Global Health Media', aud: 'both',
    title: { en: 'Danger signs in small newborns', ms: 'Tanda bahaya pada bayi kecil', zh: '小宝宝的危险信号' } },
  { n: 11, url: 'https://who.canto.global/b/QJD2T', src: 'WHO', aud: 'hcp', title: { en: 'Clinical procedures in KMC position' } },
  { n: 12, url: 'https://globalhealthmedia.org/video/breastfeeding-the-small-baby/', src: 'Global Health Media', aud: 'both',
    title: { en: 'Breastfeeding a small newborn', ms: 'Menyusukan bayi kecil', zh: '给小宝宝喂母乳' } },
  { n: 13, url: 'https://who.canto.global/b/V25V2', src: 'WHO', aud: 'both',
    title: { en: 'Breastfeeding in KMC position', ms: 'Menyusu dalam posisi KMC', zh: '袋鼠式护理姿势下哺乳' } },
  { n: 14, url: 'https://youtu.be/NS8UyAQexBg', src: 'YouTube', aud: 'hcp', title: { en: 'Breastfeeding positions (for health workers)' } },
  { n: 15, url: 'https://who.canto.global/b/NVSNV', src: 'WHO', aud: 'both',
    title: { en: 'Expressing breast milk in KMC position', ms: 'Memerah susu ibu dalam posisi KMC', zh: '袋鼠式护理姿势下挤母乳' } },
  { n: 16, url: 'https://who.canto.global/b/NRMJF', src: 'WHO', aud: 'both',
    title: { en: 'Discharge preparation and counselling', ms: 'Persediaan dan kaunseling sebelum pulang', zh: '出院准备与辅导' } },
  { n: 17, url: 'https://globalhealthmedia.org/video/newborn-physical-exam/', src: 'Global Health Media', aud: 'hcp', title: { en: 'Newborn physical exam in the community' } }
];

const PARENT_GUIDE_URL = 'https://iris.who.int/handle/10665/383268';
const CLINICAL_GUIDE_URL = 'https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/newborn-health/kangaroo-mother-care-practice-guide';

const LESSONS = [
  {
    id: 1, icon: '🤱',
    title: { en: 'What is KMC?', ms: 'Apa itu KMC?', zh: '什么是袋鼠式护理？' },
    msgs: {
      en: ['Kangaroo Mother Care (KMC) is a special way of caring for small babies: many hours of skin-to-skin contact on your bare chest, plus feeding only breast milk.',
           'KMC is for babies born too early (before 37 weeks) or too small (less than 2500 g at birth).',
           'KMC can be given to twins and triplets too.',
           'The mother is the best person to give KMC. The father and other family members can and should help.'],
      ms: ['Kaedah Penjagaan Ibu Kanggaru (KMC) ialah cara khas menjaga bayi kecil: sentuhan kulit-ke-kulit di dada anda selama berjam-jam, dan memberi susu ibu sahaja.',
           'KMC adalah untuk bayi yang lahir terlalu awal (sebelum 37 minggu) atau terlalu kecil (kurang daripada 2500 g semasa lahir).',
           'KMC juga boleh diberikan kepada bayi kembar dua dan kembar tiga.',
           'Ibu adalah orang terbaik untuk memberi KMC. Bapa dan ahli keluarga lain boleh dan patut membantu.'],
      zh: ['袋鼠式护理（KMC）是照顾小宝宝的特别方法：让宝宝长时间趴在您裸露的胸前，肌肤贴肌肤，并且只喂母乳。',
           '袋鼠式护理适用于早产（未满37周出生）或出生体重过轻（少于2500克）的宝宝。',
           '双胞胎和三胞胎也可以进行袋鼠式护理。',
           '妈妈是进行袋鼠式护理的最佳人选。爸爸和其他家人也可以、也应该帮忙。']
    }, video: 6
  },
  {
    id: 2, icon: '💗',
    title: { en: 'Benefits of KMC', ms: 'Kebaikan KMC', zh: '袋鼠式护理的好处' },
    msgs: {
      en: ['Helps more small babies survive.', 'Keeps your baby warm, with steadier breathing and heartbeat.', 'Fewer infections.',
           'Breastfeeding starts earlier and lasts longer.', 'Better weight gain.', 'Better brain development and learning later in life.',
           'You and your baby can go home sooner.', 'Stronger bond with your baby, and less worry and sadness for mothers.'],
      ms: ['Membantu lebih ramai bayi kecil terus hidup.', 'Memastikan bayi hangat, dengan pernafasan dan degupan jantung lebih stabil.', 'Kurang jangkitan.',
           'Penyusuan susu ibu bermula lebih awal dan berterusan lebih lama.', 'Kenaikan berat badan lebih baik.', 'Perkembangan otak dan pembelajaran yang lebih baik kemudian hari.',
           'Anda dan bayi boleh pulang ke rumah lebih awal.', 'Ikatan kasih dengan bayi lebih kuat, dan ibu kurang risau serta murung.'],
      zh: ['帮助更多小宝宝存活。', '让宝宝保暖，呼吸和心跳更稳定。', '减少感染。',
           '更早开始哺乳，哺乳时间也更长。', '体重增长更好。', '促进大脑发育，将来学习更好。',
           '您和宝宝可以更早出院回家。', '增进亲子感情，减少妈妈的焦虑和忧郁。']
    }
  },
  {
    id: 3, icon: '⏰',
    title: { en: 'When, who, where and how long', ms: 'Bila, siapa, di mana dan berapa lama', zh: '何时、谁、在哪里、多久' },
    msgs: {
      en: ['Start KMC as soon as possible after birth — even if your baby is sick, and after a normal or caesarean birth.',
           'KMC can be done anywhere in the hospital: labour room, newborn unit or KMC ward. Mother and baby should stay together.',
           'Aim for as close to 24 hours a day as possible, including while you sleep. The minimum is 8 hours every day.',
           'Each session should last at least 1 hour. Eat, use the toilet and wash before you start.',
           'Breastfeed every 2–3 hours while your baby is in KMC.',
           'When the mother needs rest, the father, grandmother or another family member can take a turn.',
           'Record the hours every day — use the KMC Tracker in this app.'],
      ms: ['Mulakan KMC secepat mungkin selepas lahir — walaupun bayi sakit, dan selepas kelahiran normal atau pembedahan caesarean.',
           'KMC boleh dilakukan di mana-mana dalam hospital: bilik bersalin, unit neonatal atau wad KMC. Ibu dan bayi patut sentiasa bersama.',
           'Sasarkan hampir 24 jam sehari, termasuk semasa tidur. Minimum 8 jam setiap hari.',
           'Setiap sesi sekurang-kurangnya 1 jam. Makan, ke tandas dan bersihkan diri sebelum mula.',
           'Susukan bayi setiap 2–3 jam semasa dalam KMC.',
           'Apabila ibu perlu berehat, bapa, nenek atau ahli keluarga lain boleh bergilir.',
           'Rekod jam setiap hari — gunakan Penjejak KMC dalam aplikasi ini.'],
      zh: ['出生后尽快开始袋鼠式护理——即使宝宝生病，无论顺产或剖腹产。',
           '医院里任何地方都可以进行：产房、新生儿病房或袋鼠护理病房。妈妈和宝宝应该一直在一起。',
           '每天尽量接近24小时，包括睡觉的时候。最少每天8小时。',
           '每次至少持续1小时。开始前先吃饭、上厕所和梳洗。',
           '宝宝在袋鼠式护理时，每2–3小时喂一次母乳。',
           '妈妈需要休息时，爸爸、祖母或其他家人可以轮流。',
           '每天记录时数——使用本应用的“袋鼠护理记录”。']
    }
  },
  {
    id: 4, icon: '🍼',
    title: { en: 'Breast milk and breastfeeding', ms: 'Susu ibu dan penyusuan', zh: '母乳与哺乳' },
    msgs: {
      en: ['Breast milk is like medicine for small babies — it protects against infection and helps the brain grow.',
           'Give only breast milk for the first 6 months — no water, formula or other food unless your doctor advises it.',
           'If your baby cannot suck yet, start expressing colostrum (first milk) within the first hour. Every drop counts.',
           'Express milk by hand or pump every 2–3 hours (8–12 times a day), including at night.',
           'Breastfeed 8–12 times in 24 hours, day and night. Watch for feeding cues: turning to the breast, sucking hands, smacking lips.',
           'Good latch: chin touches the breast, mouth wide open, lower lip turned out, more of the dark area seen above the top lip.',
           'Signs baby is feeding well: many wet nappies, steady weight gain, swallowing sounds.'],
      ms: ['Susu ibu ibarat ubat untuk bayi kecil — melindungi daripada jangkitan dan membantu otak berkembang.',
           'Beri susu ibu sahaja selama 6 bulan pertama — tiada air, susu formula atau makanan lain kecuali dinasihati doktor.',
           'Jika bayi belum boleh menghisap, mula perah kolostrum (susu pertama) dalam satu jam pertama. Setiap titis berharga.',
           'Perah susu dengan tangan atau pam setiap 2–3 jam (8–12 kali sehari), termasuk waktu malam.',
           'Susukan bayi 8–12 kali dalam 24 jam, siang dan malam. Perhatikan tanda lapar: berpaling ke arah payudara, menghisap tangan, berbunyi mengecap bibir.',
           'Pelekapan yang baik: dagu menyentuh payudara, mulut terbuka luas, bibir bawah melentik ke luar, lebih banyak areola kelihatan di atas bibir atas.',
           'Tanda bayi menyusu dengan baik: banyak lampin basah, berat naik dengan stabil, bunyi menelan.'],
      zh: ['母乳就像小宝宝的良药——预防感染，帮助大脑成长。',
           '头6个月只喂母乳——除非医生指示，不喂水、配方奶或其他食物。',
           '如果宝宝还不会吸吮，在出生后一小时内开始挤初乳。每一滴都珍贵。',
           '每2–3小时用手或吸奶器挤奶一次（每天8–12次），包括晚上。',
           '24小时内哺乳8–12次，日夜都喂。留意饥饿信号：转头找乳房、吸手、咂嘴。',
           '正确含乳：下巴贴着乳房、嘴巴张大、下唇外翻、上唇上方露出的乳晕比下唇下方多。',
           '宝宝吃得好的迹象：尿布常湿、体重稳定增长、听到吞咽声。']
    }, video: 12
  },
  {
    id: 5, icon: '🫶', steps: true,
    title: { en: 'Placing your baby in the KMC position', ms: 'Meletakkan bayi dalam posisi KMC', zh: '把宝宝放成袋鼠式护理姿势' },
    msgs: { en: [], ms: [], zh: [] }, video: 7
  },
  {
    id: 6, icon: '✅',
    title: { en: 'Is the position right?', ms: 'Adakah posisinya betul?', zh: '姿势正确吗？' },
    msgs: {
      en: ['Baby is upright, tummy against your chest, between your breasts.',
           'Head turned to one side, neck slightly tilted back so the nose and mouth are free. Never chin-on-chest.',
           'Arms and legs bent, hips slightly apart.',
           'Binder wraps high under your arms; its top edge sits just below baby’s ear. Baby’s face is never covered.',
           'Cloth binder: tie it firmly at your side so baby is snug but not squeezed, with knots easy to untie. Stretchy tube binder: roll it down, place baby, then pull it up.',
           'Change the side baby’s head faces every 1–2 hours.',
           'You can walk, rest and even sleep half-sitting (about 20–30°) with your baby secured — never lie completely flat.'],
      ms: ['Bayi dalam keadaan tegak, perut menghadap dada anda, di antara payudara.',
           'Kepala dipaling ke satu sisi, leher sedikit mendongak supaya hidung dan mulut bebas. Jangan sekali-kali dagu tertunduk ke dada.',
           'Tangan dan kaki dibengkokkan, pinggul sedikit terbuka.',
           'Kain pengikat dililit tinggi di bawah ketiak; tepi atasnya betul-betul di bawah telinga bayi. Muka bayi tidak boleh ditutup.',
           'Kain pengikat biasa: ikat kemas di sisi badan supaya bayi rapat tetapi tidak tertekan, dengan simpulan yang mudah dibuka. Pengikat tiub elastik: gulung ke bawah, letak bayi, kemudian tarik ke atas.',
           'Tukar arah kepala bayi setiap 1–2 jam.',
           'Anda boleh berjalan, berehat dan tidur separa duduk (kira-kira 20–30°) dengan bayi diikat kemas — jangan baring rata sepenuhnya.'],
      zh: ['宝宝直立，肚子贴着您的胸口，位于两乳之间。',
           '头侧向一边，颈部稍微后仰，让鼻子和嘴巴保持通畅。绝不能下巴贴胸。',
           '手脚弯曲，髋部稍微张开。',
           '背带绑在腋下高处，上缘刚好在宝宝耳朵下方。绝不能盖住宝宝的脸。',
           '布背带：在身侧绑紧，让宝宝贴身但不被挤压，结要容易解开。弹性筒状背带：先卷下，放好宝宝，再往上拉。',
           '每1–2小时换一边头的方向。',
           '宝宝固定好后，您可以走动、休息，甚至半坐（约20–30°）睡觉——绝不要完全平躺。']
    }, video: 2
  },
  {
    id: 7, icon: '🥄',
    title: { en: 'Feeding while in KMC', ms: 'Memberi susu semasa KMC', zh: '袋鼠式护理时喂奶' },
    msgs: {
      en: ['To breastfeed, loosen the binder so your baby can move to the breast.',
           'Keep baby’s ear, shoulder and hip in a straight line, with the nose opposite your nipple. Bring baby to the breast, not the breast to baby.',
           'Cup feeding expressed milk: hold baby upright, rest the cup gently on the lower lip and let baby lap or sip at their own pace. Never pour milk into the mouth. A feed can take up to 30 minutes.',
           'Your health worker will tell you how much milk to give, based on your baby’s weight and age.',
           'Store expressed milk in a clean covered container, labelled with the date and time.',
           'After feeding, put baby back in the KMC position, tie the binder again and wash your hands.'],
      ms: ['Untuk menyusu, longgarkan kain pengikat supaya bayi boleh bergerak ke payudara.',
           'Pastikan telinga, bahu dan pinggul bayi dalam satu garisan lurus, dengan hidung bertentangan puting. Bawa bayi ke payudara, bukan payudara ke bayi.',
           'Memberi susu perahan dengan cawan: pegang bayi tegak, letak cawan perlahan di bibir bawah dan biar bayi menjilat atau menghirup mengikut rentaknya sendiri. Jangan tuang susu ke dalam mulut. Satu penyusuan boleh mengambil masa sehingga 30 minit.',
           'Anggota kesihatan akan memberitahu berapa banyak susu perlu diberi, berdasarkan berat dan umur bayi.',
           'Simpan susu perahan dalam bekas bersih bertutup, dilabel dengan tarikh dan masa.',
           'Selepas menyusu, letakkan semula bayi dalam posisi KMC, ikat semula kain pengikat dan basuh tangan.'],
      zh: ['亲喂时，放松背带，让宝宝可以移到乳房。',
           '宝宝的耳朵、肩膀和髋部成一直线，鼻子对着乳头。把宝宝带向乳房，而不是把乳房塞给宝宝。',
           '用杯子喂挤出的母乳：让宝宝直立，杯子轻放在下唇，让宝宝按自己的节奏舔或啜。绝不要把奶倒进嘴里。每次可以喂到30分钟。',
           '医护人员会根据宝宝的体重和年龄告诉您要喂多少。',
           '挤出的母乳放在干净有盖的容器里，标上日期和时间。',
           '喂完后，把宝宝放回袋鼠式护理姿势，重新绑好背带，然后洗手。']
    }, video: 13
  },
  {
    id: 8, icon: '👀',
    title: { en: 'Watching your baby during KMC', ms: 'Memerhati bayi semasa KMC', zh: '袋鼠式护理时观察宝宝' },
    msgs: {
      en: ['Check your baby at least every 6 hours: warmth, breathing, movement and feeding. Health workers will check too.',
           'Feel your baby’s feet — they should be warm. Normal temperature is 36.5–37.5 °C.',
           'Small babies may breathe unevenly, with a few fast breaths and short pauses. This can be normal.',
           'A pause longer than 20 seconds, or baby turning blue or pale, is NOT normal: gently rub the back and soles of the feet and call for help.',
           'If your baby is on a monitor, ask the nurse to show you the oxygen numbers (usually 90–95%) and what the alarms mean.',
           'Learn the danger signs (see the red “Danger signs” page).'],
      ms: ['Periksa bayi sekurang-kurangnya setiap 6 jam: kehangatan, pernafasan, pergerakan dan penyusuan. Anggota kesihatan juga akan memeriksa.',
           'Rasa kaki bayi — sepatutnya hangat. Suhu normal ialah 36.5–37.5 °C.',
           'Bayi kecil mungkin bernafas tidak sekata, dengan beberapa nafas laju dan jeda pendek. Ini boleh jadi normal.',
           'Jeda lebih daripada 20 saat, atau bayi menjadi biru atau pucat, adalah TIDAK normal: gosok perlahan belakang dan tapak kaki bayi dan minta bantuan.',
           'Jika bayi menggunakan monitor, minta jururawat tunjukkan bacaan oksigen (biasanya 90–95%) dan maksud bunyi penggera.',
           'Ketahui tanda-tanda bahaya (lihat halaman merah “Tanda bahaya”).'],
      zh: ['至少每6小时检查宝宝一次：体温、呼吸、动作和吃奶情况。医护人员也会检查。',
           '摸摸宝宝的脚——应该是暖的。正常体温是36.5–37.5 °C。',
           '小宝宝的呼吸可能不规则，会有几下快速呼吸和短暂停顿。这可能是正常的。',
           '停顿超过20秒，或宝宝发紫、脸色苍白，就不正常：轻揉背部和脚底并求助。',
           '如果宝宝接着监测仪，请护士教您看血氧数字（通常90–95%）和警报的意思。',
           '认识危险信号（请看红色“危险信号”页面）。']
    }, video: 10
  },
  {
    id: 9, icon: '🏠',
    title: { en: 'Going home', ms: 'Pulang ke rumah', zh: '出院回家' },
    msgs: {
      en: ['With KMC, you and your baby can go home sooner. Take your baby home in the KMC position.',
           'Continue KMC at home as much as possible — at least 8 hours a day.',
           'Choose a warm, quiet room (at least 25 °C). A fan is fine if it does not blow directly on your baby.',
           'Keep the cord clean and dry; put nothing on it. Fold the nappy below the cord. Redness or pus — see a doctor.',
           'Do not bathe your baby until they can stay warm without KMC. Wipe the face, neck, armpits and bottom instead.',
           'When not in KMC, lay your baby on the back to sleep on a firm surface, without pillows or soft toys.',
           'Give iron or vitamins if advised, and keep immunisations up to date.',
           'Mother: eat well, rest, walk a little every day, and avoid smoking and alcohol. Family can help with housework.'],
      ms: ['Dengan KMC, anda dan bayi boleh pulang lebih awal. Bawa bayi pulang dalam posisi KMC.',
           'Teruskan KMC di rumah sebanyak mungkin — sekurang-kurangnya 8 jam sehari.',
           'Pilih bilik yang hangat dan tenang (sekurang-kurangnya 25 °C). Kipas boleh digunakan jika tidak dihalakan terus kepada bayi.',
           'Pastikan tali pusat bersih dan kering; jangan letak apa-apa padanya. Lipat lampin di bawah tali pusat. Merah atau bernanah — jumpa doktor.',
           'Jangan mandikan bayi sehingga bayi boleh kekal hangat tanpa KMC. Lap muka, leher, ketiak dan punggung sahaja.',
           'Apabila tidak dalam KMC, tidurkan bayi secara terlentang di atas permukaan yang keras, tanpa bantal atau anak patung lembut.',
           'Beri zat besi atau vitamin jika dinasihatkan, dan pastikan imunisasi lengkap.',
           'Ibu: makan dengan baik, berehat, berjalan sedikit setiap hari, dan elakkan merokok serta alkohol. Keluarga boleh membantu kerja rumah.'],
      zh: ['进行袋鼠式护理，您和宝宝可以更早回家。用袋鼠式护理姿势带宝宝回家。',
           '在家尽量继续袋鼠式护理——每天至少8小时。',
           '选择温暖安静的房间（至少25 °C）。风扇可以用，但不要直接吹向宝宝。',
           '保持脐带清洁干燥，不要涂任何东西。尿布折在脐带下方。发红或有脓——请看医生。',
           '宝宝在没有袋鼠式护理时也能保暖之前，不要给宝宝洗澡。只擦脸、颈、腋下和屁股。',
           '不做袋鼠式护理时，让宝宝仰睡在硬的表面上，不放枕头或软玩具。',
           '如有指示，给宝宝补铁或维生素，并按时接种疫苗。',
           '妈妈：吃好、休息、每天散步一会儿，不吸烟不喝酒。家人可以帮忙做家务。']
    }, video: 16
  },
  {
    id: 10, icon: '📅',
    title: { en: 'KMC at home and when to stop', ms: 'KMC di rumah dan bila berhenti', zh: '在家袋鼠式护理与何时停止' },
    msgs: {
      en: ['Keep doing KMC for more than 8 hours every day, and record the hours in the tracker.',
           'Continue until your baby reaches about 2500 g or 38–40 weeks corrected age. A baby who is ready to stop will try to wriggle out of the KMC position.',
           'Feed only breast milk for 6 months, on demand, day and night. Get help early if breastfeeding is difficult.',
           'Watch your baby’s temperature and the danger signs. Get help immediately if any appear.',
           'Go to every follow-up appointment — these check growth, feeding, development and immunisations.',
           'KMC works best when the whole family helps: holding the baby, housework and emotional support.'],
      ms: ['Teruskan KMC lebih daripada 8 jam setiap hari, dan rekod jamnya dalam penjejak.',
           'Teruskan sehingga bayi mencapai kira-kira 2500 g atau 38–40 minggu usia diperbetulkan. Bayi yang sudah bersedia untuk berhenti akan cuba meronta keluar dari posisi KMC.',
           'Beri susu ibu sahaja selama 6 bulan, mengikut permintaan, siang dan malam. Dapatkan bantuan awal jika penyusuan sukar.',
           'Perhatikan suhu bayi dan tanda bahaya. Dapatkan bantuan segera jika ada.',
           'Hadiri setiap temujanji susulan — untuk memeriksa tumbesaran, penyusuan, perkembangan dan imunisasi.',
           'KMC paling berkesan apabila seluruh keluarga membantu: memegang bayi, kerja rumah dan sokongan emosi.'],
      zh: ['每天继续袋鼠式护理超过8小时，并在记录中写下时数。',
           '一直持续到宝宝约2500克或矫正胎龄38–40周。准备好停止的宝宝会想扭动离开袋鼠式护理姿势。',
           '头6个月只喂母乳，按需喂养，日夜都喂。哺乳有困难时尽早求助。',
           '留意宝宝的体温和危险信号。一出现就立即求助。',
           '每次复诊都要去——检查成长、喂养、发育和疫苗接种。',
           '全家一起帮忙，袋鼠式护理效果最好：轮流抱宝宝、分担家务、给予情感支持。']
    }
  }
];

/* Step-by-step placement (Parent counselling guide section 5a) */
const POSITION_STEPS = [
  { e: '🧼', t: { en: 'Wash your hands with soap and water.', ms: 'Basuh tangan dengan sabun dan air.', zh: '用肥皂和水洗手。' } },
  { e: '🚿', t: { en: 'Get ready: bathe daily, keep nails short, remove necklaces, rings and bangles. Wear a loose front-opening top with the binder underneath.',
                  ms: 'Bersedia: mandi setiap hari, potong kuku pendek, tanggalkan rantai, cincin dan gelang. Pakai baju longgar berbutang depan dengan kain pengikat di bawahnya.',
                  zh: '做好准备：每天洗澡，剪短指甲，摘下项链、戒指和手镯。穿宽松的前开扣上衣，里面系好背带。' } },
  { e: '🛋️', t: { en: 'Sit or lie half-reclined (about 30°) on a bed or chair with back and foot support.',
                  ms: 'Duduk atau baring separa bersandar (kira-kira 30°) di atas katil atau kerusi yang menyokong belakang dan kaki.',
                  zh: '在有背部和脚部支撑的床或椅子上半躺（约30°）。' } },
  { e: '🧢', t: { en: 'Dress your baby in only a cap and a nappy.', ms: 'Pakaikan bayi topi dan lampin sahaja.', zh: '宝宝只戴帽子、穿尿布。' } },
  { e: '🤲', t: { en: 'Lift your baby: one hand supports the neck, the other supports the bottom.', ms: 'Angkat bayi: satu tangan menyokong leher, satu lagi menyokong punggung.', zh: '抱起宝宝：一只手托住颈部，另一只手托住臀部。' } },
  { e: '💗', t: { en: 'Place your baby upright on your bare chest between the breasts, head turned to one side, neck slightly tilted back, arms and legs bent.',
                  ms: 'Letakkan bayi tegak di dada anda yang terdedah di antara payudara, kepala dipaling ke satu sisi, leher sedikit mendongak, tangan dan kaki dibengkokkan.',
                  zh: '让宝宝直立趴在您裸露的胸前、两乳之间，头侧向一边，颈部稍微后仰，手脚弯曲。' } },
  { e: '🎀', t: { en: 'Secure with the binder — high under your arms, top edge just below baby’s ear. Snug, not tight.',
                  ms: 'Ikat dengan kain pengikat — tinggi di bawah ketiak, tepi atas betul-betul di bawah telinga bayi. Kemas, tidak ketat.',
                  zh: '用背带固定——绑在腋下高处，上缘刚好在宝宝耳朵下方。贴身，不要太紧。' } },
  { e: '🧥', t: { en: 'Close your KMC top over the binder (tie it underneath if it has ties). Add a blanket if the room is cold.',
                  ms: 'Tutup baju KMC di atas kain pengikat (ikat di bawah jika ada tali). Tambah selimut jika bilik sejuk.',
                  zh: '在背带外面穿好袋鼠护理衣（如有绑带，在下方绑好）。房间冷的话加盖毯子。' } }
];

/* Danger signs (Parent guide section 8, Clinical guide 4.3.5 & 5.2.3) */
const DANGER_SIGNS = [
  { e: '🍼', t: { en: 'Stops feeding well or cannot feed', ms: 'Tidak lagi menyusu dengan baik atau tidak boleh menyusu', zh: '吃奶变差或无法吃奶' } },
  { e: '😴', t: { en: 'Moves less or not at all, very sleepy or floppy', ms: 'Kurang bergerak atau tidak bergerak langsung, sangat mengantuk atau lembik', zh: '动得少或完全不动、非常嗜睡或软绵绵' } },
  { e: '🫁', t: { en: 'Fast breathing (more than 60 breaths a minute) or very slow breathing', ms: 'Bernafas laju (lebih 60 kali seminit) atau sangat perlahan', zh: '呼吸急促（每分钟超过60次）或非常缓慢' } },
  { e: '⬇️', t: { en: 'Chest sucks in when breathing (chest indrawing) or grunting', ms: 'Dada tertarik ke dalam semasa bernafas atau berdengus', zh: '呼吸时胸部凹陷或发出呻吟声' } },
  { e: '💙', t: { en: 'Stops breathing for more than 20 seconds, or turns blue or pale', ms: 'Berhenti bernafas lebih 20 saat, atau menjadi biru atau pucat', zh: '停止呼吸超过20秒，或发紫、苍白' } },
  { e: '⚡', t: { en: 'Fits, convulsions or twitching', ms: 'Sawan, kejang atau tersentak-sentak', zh: '抽搐、痉挛或抽动' } },
  { e: '🌡️', t: { en: 'Feels cold (below 36.5 °C) or hot (above 37.5 °C)', ms: 'Terasa sejuk (bawah 36.5 °C) atau panas (atas 37.5 °C)', zh: '摸起来冷（低于36.5 °C）或发热（高于37.5 °C）' } },
  { e: '🟡', t: { en: 'Yellow skin spreading to the palms and soles', ms: 'Kulit kuning merebak ke tapak tangan dan tapak kaki', zh: '皮肤发黄蔓延到手掌和脚底' } },
  { e: '🔴', t: { en: 'Redness, pus or bleeding around the cord', ms: 'Kemerahan, nanah atau darah di sekitar tali pusat', zh: '脐带周围发红、有脓或流血' } },
  { e: '🤮', t: { en: 'Vomits all feeds or the tummy is swollen', ms: 'Muntah setiap kali menyusu atau perut membengkak', zh: '每次吃奶都吐或肚子胀大' } },
  { e: '🔔', t: { en: 'In hospital: any alarm from the monitor — call the nurse', ms: 'Di hospital: sebarang bunyi penggera monitor — panggil jururawat', zh: '在医院：监测仪发出任何警报——叫护士' } }
];

/* Labels for the KMC position illustration */
const FIG_LABELS = {
  head: { en: 'Head turned to one side', ms: 'Kepala dipaling ke satu sisi', zh: '头侧向一边' },
  neck: { en: 'Neck slightly tilted back', ms: 'Leher sedikit mendongak', zh: '颈部稍微后仰' },
  binder: { en: 'Binder top edge below the ear', ms: 'Tepi atas pengikat di bawah telinga', zh: '背带上缘在耳朵下方' },
  limbs: { en: 'Arms and legs bent, hips apart', ms: 'Tangan dan kaki bengkok, pinggul terbuka', zh: '手脚弯曲，髋部张开' },
  chest: { en: 'Skin-to-skin, between the breasts', ms: 'Kulit-ke-kulit, di antara payudara', zh: '肌肤相贴，在两乳之间' }
};
