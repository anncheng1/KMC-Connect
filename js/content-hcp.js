/* KMC Connect — healthcare provider training content (English).
 * Source: WHO. Kangaroo mother care: a clinical practice guide. Geneva: WHO; 2025. CC BY-NC-SA 3.0 IGO.
 * Adapted for training; follow your national / hospital protocols where they differ.
 * Quiz format: { q, o: [options], a: index of correct option, x: explanation }
 */
const PASS_MARK = 80; // percent

const MODULES = [
  {
    id: 'm1', title: 'Understanding KMC', mins: 15,
    obj: ['Define KMC and its components', 'Identify which newborns should receive KMC', 'State daily duration targets', 'Explain who can provide KMC and when it stops'],
    sec: [
      { h: 'Definition', b: [
        'KMC = care of a preterm (<37 weeks) or low-birth-weight (LBW, <2500 g) newborn in prolonged skin-to-skin contact (SSC) — as close to 24 h/day as possible, minimum 8 h/day — initiated as soon as possible after birth, with exclusive breast milk feeding.',
        'In facilities, KMC also includes timely discharge from NICU/SCN to a lower level of care or home, with continued SSC and close monitoring.',
        'Routine SSC in the first hour is for ALL newborns; prolonged SSC + exclusive breast milk feeding is what defines KMC.'] },
      { h: 'WHO recommendations (2022)', b: [
        'Recommendation 1 — KMC should be initiated as soon as possible after birth for all preterm or LBW newborns (immediate KMC).',
        'Recommendation 2 — KMC is routine care for all preterm or LBW newborns, initiated in a facility or at home, for 8–24 h/day.'] },
      { h: 'Who should receive KMC', b: [
        'All preterm or LBW newborns regardless of clinical condition, unless haemodynamically unstable (e.g. shock) or unable to breathe spontaneously (mechanical ventilation).',
        'Suitable for newborns on non-invasive respiratory support (CPAP, oxygen), IV therapy and continuous monitoring.',
        'No lower gestational age or birth weight threshold is set; experienced units provide KMC to extremely preterm newborns with close monitoring.',
        'Some major malformations (e.g. abdominal wall defects) may make the KMC position unfeasible.'] },
      { h: 'Who provides KMC', b: [
        'Mother is the primary caregiver — SSC with the mother stimulates milk production and colonises the baby with maternal microbiota.',
        'Maternal contraindications: uncontrolled epilepsy, mental illness affecting routine caregiving, contagious skin infection. Minor illness (including COVID-19) is NOT a contraindication with hand hygiene and a facemask.',
        'Additional caregiver (father or family member) provides SSC when the mother rests, is sick, under anaesthesia/sedation, or chooses not to. Identify and prepare them before birth.'] },
      { h: 'Key benefits (Box 2)', b: [
        '32% reduction in neonatal mortality; 25% reduction in mortality by 6 months.',
        '68% reduction in hypothermia; 15% reduction in severe infection/sepsis; 48% increase in exclusive breastfeeding duration.',
        'Better weight gain, shorter stay, reduced hypoglycaemia, physiological stability, pain protection; long-term brain and academic benefits.',
        'Mothers: bonding, less anxiety and depression, less postpartum haemorrhage. Health workers: job satisfaction. Systems: lower costs.'] },
      { h: 'Terminology and duration', b: [
        '“KMC position” replaces “kangaroo position”. Terms “frog-leg” and “fetal position” are no longer used (fetal position implies a flexed, unsafe neck).',
        'Continue as long as the newborn accepts it. Newborns typically wriggle out at ~2500 g or 38–40 weeks corrected gestational age; small-for-gestational-age newborns may do so earlier.'] }
    ],
    videos: [6],
    quiz: [
      { q: 'What is the WHO minimum daily duration of skin-to-skin contact for KMC?', o: ['1 hour', '4 hours', '8 hours', '12 hours'], a: 2, x: 'KMC is 8–24 h/day; as close to 24 h as possible, minimum 8 h.' },
      { q: 'Which newborn should NOT yet be placed in KMC?', o: ['30-week newborn on CPAP', 'LBW newborn on IV antibiotics', 'Newborn in shock on inotropes', '27-week newborn on nasal cannula oxygen'], a: 2, x: 'KMC is withheld only if haemodynamically unstable or unable to breathe spontaneously.' },
      { q: 'A mother has a mild respiratory infection (e.g. COVID-19). What is the advice?', o: ['KMC is contraindicated', 'Continue KMC with hand hygiene and a facemask', 'Stop KMC for 14 days', 'Only the father may provide SSC'], a: 1, x: 'Minor illness is not a contraindication if hand hygiene and precautions are followed.' },
      { q: 'KMC reduces neonatal mortality by approximately:', o: ['10%', '32%', '50%', '68%'], a: 1, x: '32% reduction in neonatal mortality. 68% is the reduction in hypothermia.' },
      { q: 'Newborns typically wriggle out of the KMC position at about:', o: ['1800 g or 34 weeks', '2000 g or 36 weeks', '2500 g or 38–40 weeks corrected GA', '3500 g or 44 weeks'], a: 2, x: 'At this point they can maintain temperature without SSC.' }
    ]
  },
  {
    id: 'm2', title: 'Setting up KMC in the facility', mins: 15,
    obj: ['Describe the mother–newborn care unit (MNCU)', 'List essential KMC equipment and binders', 'State environmental and record-keeping requirements'],
    sec: [
      { h: 'Policies', b: [
        'Policies must let the mother stay with her newborn 24/7, with coordinated maternal and newborn care, and allow family to help with KMC.',
        'Mothers need clean water, nutritious food, toilets, bathing facilities and postnatal care while staying with the newborn.'] },
      { h: 'Mother–newborn care unit (MNCU)', b: [
        'A level 2 or 3 newborn unit with a bed for the mother beside the warmer/incubator, so the dyad stays together 24/7.',
        'In the WHO Immediate KMC study, MNCUs enabled KMC within 2 h of birth, ~17 h/day of SSC and a 25% reduction in neonatal mortality.',
        'Interim solution if no space for beds: open the unit 24/7 to parents with reclining chairs at the cot side.',
        'Stable newborns step down to a KMC area/ward until discharge.'] },
      { h: 'Environment and equipment', b: [
        'Room temperature at least 25 °C in childbirth areas, MNCU and KMC areas; avoid draughts.',
        'Wide reclinable bed with side rails in childbirth areas; recliner beds/KMC chairs with back and leg support in newborn areas.',
        'Binders: plain cloth (needs a KMC garment tied underneath for support), stretchy tube binders (may not need an outer garment) or customised pouches. Any binder that keeps the newborn between the breasts with the neck slightly extended can be used.',
        'At least two sets of garments and binders per mother so KMC is not interrupted by washing.',
        'Wheelchair/transport bed, pulse oximeters, CPAP with blended oxygen (level 2+), breast pumps, counselling aids.',
        'Safety pins are NOT recommended for securing binders.'] },
      { h: 'Records and workforce', b: [
        'Record time of SSC initiation and first breast milk feed in birth registers; daily SSC duration and feeding details in newborn records.',
        'More newborns now qualify (all <2500 g, not only <2000 g), so extra staff time and training in KMC, lactation and maternal postnatal care are needed.',
        'Joint maternal–newborn rounds or an assigned midwife ensure postnatal care for mothers in the MNCU.'] }
    ],
    videos: [1, 2],
    quiz: [
      { q: 'In the WHO Immediate KMC study, MNCUs achieved approximately how many hours of SSC per day?', o: ['4', '8', '17', '24'], a: 2, x: 'Almost 17 h/day, with a 25% reduction in neonatal mortality.' },
      { q: 'Minimum room temperature recommended for MNCU and KMC areas:', o: ['20 °C', '22 °C', '25 °C', '28 °C'], a: 2, x: 'At least 25 °C.' },
      { q: 'Minimum number of KMC garment/binder sets per mother:', o: ['1', '2', '3', '5'], a: 1, x: 'At least two sets to avoid interruptions during washing and drying.' },
      { q: 'A plain cloth binder tied at the side needs:', o: ['No further support', 'Additional support from below, e.g. a KMC garment tied underneath', 'Safety pins to secure it', 'A knot at the front over the baby'], a: 1, x: 'Cloth binders need support from below to stop the newborn slipping.' },
      { q: 'Which is an essential facility record for KMC?', o: ['Daily SSC duration and breastfeeding frequency in the newborn record', 'Parents’ income', 'Number of visitors per day', 'Brand of formula used'], a: 0, x: 'KMC-specific variables include age at initiation, daily SSC duration and feeding frequency.' }
    ]
  },
  {
    id: 'm3', title: 'Immediate KMC at birth', mins: 20,
    obj: ['Apply the first-hour algorithm for preterm/LBW newborns', 'Manage respiratory distress while maintaining SSC', 'Adapt for caesarean and multiple births', 'Transfer the dyad safely'],
    sec: [
      { h: 'First minute', b: [
        'Place the newborn immediately in SSC on the mother’s chest or abdomen with the cord attached; dry thoroughly and assess breathing.',
        'Not breathing well: keep warm, stimulate, clear airway if needed. Not breathing: cut cord, call for help and ventilate.',
        'Delayed cord clamping in SSC. Mother receives a uterotonic within 1 minute.'] },
      { h: 'Minutes 2–60', b: [
        'Breathing well: cut cord, place in KMC position, cover with dry cloth and blanket, cap on, postpone bathing and weighing.',
        'Monitor breathing and temperature every 15 minutes; monitor the mother every 15 minutes (BP, pulse, uterine tone, blood loss).',
        'Respiratory distress (RR >60/min, chest indrawing, grunting): level 2+ start CPAP with blended oxygen under pulse oximetry and place in KMC position with CPAP; primary level — refer, ideally in SSC.',
        'Support breastfeeding initiation — newborns can self-attach within the first hour.'] },
      { h: 'Colostrum and early lactation', b: [
        'Give any amount of colostrum by spoon, syringe or dropper; for very preterm newborns, apply colostrum to the oral mucosa with a 1 mL syringe or swab (oral immune therapy).',
        'Mother expresses ideally within 1–3 hours of birth and 8–12 times per 24 h — even when an additional caregiver is providing SSC.',
        'If mother’s milk is insufficient use donor human milk; formula only when neither is available.'] },
      { h: 'Special situations', b: [
        'Caesarean: place newborn on mother’s thighs for 1–3 min for initial steps, then transversely on her chest after cord clamping; a designated health worker cares for the newborn.',
        'Mother under general anaesthesia/sedated/unstable: additional caregiver starts SSC; help early colostrum expression.',
        'Twins: one on each side of the chest; alternate positions. Triplets: plan additional caregivers before birth.'] },
      { h: 'Transfer after the first hour', b: [
        'Full examination, weight (digital scale), best-estimate GA, vitamin K, eye and cord care.',
        'Secure in KMC position with binder and garment; attach pulse oximeter; transfer the dyad together on a wheelchair, movable bed or trolley.',
        'Transfer on CPAP with adequate pressure and FiO2; avoid routine 100% oxygen. Emergencies may require transfer in a transport incubator.'] }
    ],
    videos: [3, 4, 5],
    quiz: [
      { q: 'During the first hour, how often should a preterm newborn’s breathing and temperature be monitored?', o: ['Every 5 minutes', 'Every 15 minutes', 'Every 30 minutes', 'Every hour'], a: 1, x: 'Every 15 minutes until the first complete examination.' },
      { q: 'After a caesarean birth, where is the newborn placed for the first 1–3 minutes?', o: ['Radiant warmer', 'Mother’s thighs', 'Father’s chest', 'Weighing scale'], a: 1, x: 'Initial steps on the thighs, then transversely on the mother’s chest.' },
      { q: 'At 20 minutes a preterm newborn has RR 70/min and chest indrawing in a level 2 facility. Best action?', o: ['Separate to an incubator and defer KMC for 24 h', 'Start CPAP with blended oxygen under pulse oximetry and continue care in the KMC position', 'Give 100% oxygen by head box', 'Give formula to calm the baby'], a: 1, x: 'CPAP can be initiated in the KMC position at level 2 and above.' },
      { q: 'Ideally, a mother should start expressing breast milk within:', o: ['1–3 hours of birth', '12 hours', '24 hours', '72 hours'], a: 0, x: 'Frequent expression starting within 1–3 hours is important.' },
      { q: 'Preferred method of transferring the dyad within the facility:', o: ['Mother walks alone carrying the baby', 'Together in a wheelchair or movable bed, newborn in KMC position with pulse oximetry', 'Newborn alone in an open cot', 'Newborn carried by a porter'], a: 1, x: 'Wheelchair, movable bed or trolley is safest, with continuous monitoring.' }
    ]
  },
  {
    id: 'm4', title: 'Placing a stable newborn in the KMC position', mins: 15,
    obj: ['Demonstrate the 9 steps of placing a stable newborn in KMC', 'Describe the correct KMC position', 'Advise on session length, movement and sleep'],
    sec: [
      { h: 'Steps (Table 3)', b: [
        '1. Hand hygiene — health worker and mother.',
        '2. Prepare the mother: upright or semi-reclined; front-opening clothes, no bra/vest; cloth binder around chest under the garment, or tube binder rolled below breasts.',
        '3. Prepare the newborn: cap and dry diaper; pulse oximeter probe on hand/foot.',
        '4. Move the newborn supine (support head/neck and jaw, other hand under buttocks) or prone (palm under chest, index finger supporting chin, other hand flexing hips).',
        '5. Place prone, high on the chest between the breasts, head turned to one side, neck slightly extended; arms flexed, hand near mouth; hips and knees flexed, hips partially abducted. Mother can kiss the head.',
        '6. Secure with binder: wraps high under the axillae, top edge below the newborn’s ear; tight part over upper back, abdomen at mother’s epigastrium; knots at side, easy to untie. Let a restless baby settle before tightening.',
        '7. Secure cables and tubes by taping or clipping to the garment or skin; check clinical condition and mother’s comfort.',
        '8. KMC garment over a cloth binder, tied from below; blanket if cold; let the dyad settle under supervision.',
        '9. Educate the mother on observing the newborn; encourage movement.'] },
      { h: 'Maintaining prolonged SSC', b: [
        'Each session at least 1 hour (allows sleep cycles and thermoregulation). Change head direction each session or every 1–2 h.',
        'Additional caregiver takes over when the mother needs a break; otherwise warm cot, radiant warmer or incubator.',
        'Mother can walk if no lines attached; if attached, she moves feet and legs while seated.',
        'Sleep semi-recumbent at 20–30° (adjustable bed, pillows or reclining chair) — never flat.',
        'Address boredom: education sessions, peer support, reading and singing to the newborn.'] }
    ],
    videos: [7, 2],
    quiz: [
      { q: 'Where should the top edge of the binder sit?', o: ['Over the newborn’s ear', 'Just below the newborn’s ear', 'At the newborn’s waist', 'Covering the head'], a: 1, x: 'Top edge just below the ear, avoiding the face.' },
      { q: 'The correct neck position in the KMC position is:', o: ['Flexed, chin to chest', 'Slightly extended', 'Hyperextended', 'Any position the baby prefers'], a: 1, x: 'Slight extension keeps the airway patent; avoid flexion and hyperextension.' },
      { q: 'How often should the direction of the newborn’s head be changed in long sessions?', o: ['Every 15 minutes', 'Each session or every 1–2 hours', 'Once a day', 'Never'], a: 1, x: 'Change at each session, or every 1–2 h when sessions are longer.' },
      { q: 'Minimum duration of a single KMC session:', o: ['15 minutes', '30 minutes', '1 hour', '4 hours'], a: 2, x: 'At least one hour to avoid unnecessary stress.' },
      { q: 'Safe position for a mother to sleep while providing KMC:', o: ['Flat on her back', 'Prone', 'Semi-recumbent at about 20–30°', 'Upright without back support'], a: 2, x: 'Semi-recumbent 20–30°, never completely flat.' }
    ]
  },
  {
    id: 'm5', title: 'KMC for sick newborns on respiratory support', mins: 15,
    obj: ['Perform a two-person transfer of a newborn on CPAP to KMC', 'List procedures that can be performed in the KMC position'],
    sec: [
      { h: 'Preparation', b: [
        'At least two health workers (a third if IV lines or extra tubes). A health worker trained in neonatal life support available; resuscitation equipment checked and at hand.',
        'Newborn calm, relaxed and breathing easily on current settings; cap, dry diaper, pulse oximeter.',
        'Mother semi-reclined, close enough to equipment that tubes and lines reach; front-opening clothes.'] },
      { h: 'Transfer (Table 4)', b: [
        'Health worker 1 moves the newborn (supine or prone hold) laterally with slow, controlled movements.',
        'Health worker 2 holds the CPAP tubing so the interface stays in place and watches SpO2.',
        'Place prone on the chest; mother places her hands over the health worker’s before they withdraw.',
        'Check position, clinical condition, all tubes and cables; secure binder and garment. With a tube binder, run cables from the top for quick access in emergencies.',
        'Tape tubes/leads to the garment or skin; cover with a blanket if cold; stay until settled; teach the mother what to watch. A mirror helps her see the face.'] },
      { h: 'Care that can be given in the KMC position (Box 9)', b: [
        'Full examination; CPAP/NIV/oxygen including interface changes; OG/NG tube placement and feeding; IV cannulation and IV medicines; blood sampling; phototherapy; cranial ultrasound and echocardiography; ROP examination.',
        'Painful procedures (e.g. heel prick) should be done in KMC — SSC reduces pain responses and crying time.',
        'Move the newborn only for weighing, investigations like chest X-ray, or emergency procedures (resuscitation, intubation).'] },
      { h: 'Developmentally supportive care', b: [
        'Reduce noise and light; cluster care; monitor stress cues (irregular breathing, desaturation, mottling); containment between sessions.',
        'Daily bathing is not needed; clean diaper area and skin folds; frequent maternal handwashing.'] }
    ],
    videos: [8, 11, 9],
    quiz: [
      { q: 'Minimum number of health workers to move a newborn on CPAP into KMC:', o: ['1', '2', '4', 'The mother alone'], a: 1, x: 'At least two; a third may be needed for IV lines.' },
      { q: 'Which usually CANNOT be done in the KMC position?', o: ['Cranial ultrasound', 'ROP examination', 'Chest radiograph', 'IV cannulation'], a: 2, x: 'Chest X-ray and weighing require moving the newborn.' },
      { q: 'With a tube-type elastic binder on a sick newborn, cables should:', o: ['Run from the bottom', 'Run from the top for quick access', 'Be compressed under the binder', 'Be disconnected during KMC'], a: 1, x: 'Allows quick removal of the binder in an emergency.' },
      { q: 'Heel-prick blood sampling during KMC is:', o: ['Contraindicated', 'Recommended — SSC reduces pain', 'Only allowed with general anaesthesia', 'Only allowed with the father'], a: 1, x: 'SSC is a safe and effective pain-relief measure.' },
      { q: 'Before transfer, the newborn on CPAP should be:', o: ['Crying vigorously', 'Calm, relaxed and breathing easily on current settings', 'Fed within the last 5 minutes', 'Taken off CPAP'], a: 1, x: 'Stability on current support is checked first.' }
    ]
  },
  {
    id: 'm6', title: 'Monitoring, thermal care, apnoea and danger signs', mins: 20,
    obj: ['Monitor newborns in KMC at the right frequency', 'Measure axillary temperature in KMC and manage hypothermia', 'Recognise and manage apnoea', 'Teach parents danger signs'],
    sec: [
      { h: 'Monitoring frequency', b: [
        'HR, RR, temperature, SpO2, activity and feeding at least every 6 hours irrespective of place of care; more often for very small or sick newborns (including glucose).',
        'Temperature 6-hourly until stable for 3 consecutive days, then twice daily. Engage the mother in monitoring.'] },
      { h: 'Axillary temperature in KMC', b: [
        'Keep the newborn in SSC and covered; loosen the binder and expose one arm only.',
        'Thermometer bulb high in the middle of the axilla, full skin contact; hold arm against chest.',
        'Mercury: at least 3 minutes; digital: until it beeps. Re-secure the binder and record.'] },
      { h: 'Low temperature (<36.5 °C) in KMC — Box 7', b: [
        'Remove wet clothes, change diaper, put on a cap; extra blankets over mother and baby.',
        'Warm the room, reduce draughts, cover cold surfaces; minimise interruptions in SSC.',
        'Recheck after 1 hour. If unable to maintain temperature, consider radiant warmer/incubator (trained providers only — overheating is dangerous).',
        'Look for causes: cold room, fan, recent bath, poor feeding, infection, hypoglycaemia; assess for possible bacterial infection if no cause.'] },
      { h: 'Breathing and apnoea', b: [
        'Periodic breathing (fast breaths alternating with brief pauses) is normal in preterm newborns and needs no treatment.',
        'Apnoea: cessation of breathing ≥20 s, or shorter with bradycardia (<100/min), pallor, cyanosis or SpO2 <85%. Monitor all newborns <35 weeks during the first week.',
        'Immediate actions: correct neck position, suction if secretions, tactile stimulation, oxygen if hypoxic, PPV if no response. Then find and treat the cause; caffeine for apnoea of prematurity.',
        'Teach families: any abnormal breathing, colour change, limpness or unresponsiveness requires immediate help — do not wait 20 seconds. Explain the prescribed SpO2 target for that individual newborn; 90–95% is not a universal target. Parents must not adjust oxygen or make treatment decisions from an oximeter reading.'] },
      { h: 'Danger signs to teach parents', b: [
        'Stops feeding well; no spontaneous movement; fast or very slow breathing; chest indrawing; convulsions or twitching; cold or hot to touch; any monitor alarm.',
        'Onset of serious illness in small newborns is subtle — respond promptly to a mother’s concern.'] }
    ],
    videos: [9, 10],
    quiz: [
      { q: 'Apnoea in a preterm newborn is defined as cessation of breathing for:', o: ['≥10 seconds', '≥20 seconds, or shorter with bradycardia, cyanosis, pallor or SpO2 <85%', 'Any irregular breathing', 'RR below 40/min'], a: 1, x: 'Periodic breathing with brief pauses is normal.' },
      { q: 'Axillary temperature is 36.2 °C during KMC. First actions?', o: ['Move immediately to an incubator', 'Remove wet clothes, cap, extra blankets, warm the room, minimise interruptions, recheck in 1 hour', 'Start antibiotics', 'Give a warm bath'], a: 1, x: 'Box 7 steps first; alternative warming only if hypothermia persists.' },
      { q: 'Periodic breathing in a preterm newborn:', o: ['Needs caffeine', 'Is normal and needs no treatment', 'Is a sign of sepsis', 'Is an indication for intubation'], a: 1, x: 'It reflects immature respiratory control.' },
      { q: 'Which SpO2 range do you teach parents as normal?', o: ['80–85%', '85–89%', '90–95%', '98–100%'], a: 2, x: 'Explain the prescribed target for the individual newborn; do not present one range as universal.' },
      { q: 'With a mercury thermometer, keep it in the axilla for at least:', o: ['30 seconds', '1 minute', '3 minutes', '10 minutes'], a: 2, x: 'At least 3 minutes (digital: until it beeps).' }
    ]
  },
  {
    id: 'm7', title: 'Breastfeeding and breast milk feeding in KMC', mins: 25,
    obj: ['Choose the initial feeding method by maturity', 'Support breastfeeding and cup feeding in KMC', 'Guide milk expression and expected volumes', 'Monitor feeding adequacy and growth'],
    sec: [
      { h: 'Initial method of feeding (Fig. 28) — newborn-led, GA indicative', b: [
        '<32 weeks: often cannot coordinate suck–swallow–breathe → OG/NG tube feeding (can be done in KMC); non-nutritive sucking at the emptied breast from ~28 weeks.',
        '32–34 weeks: can latch but suck may be ineffective → short frequent breastfeeds plus EBM by cup or spoon.',
        '>34 weeks: many breastfeed effectively; cup/spoon top-ups if intake inadequate.',
        'Breastfeeding can start as soon as the newborn is haemodynamically stable without severe apnoea — even from 27 weeks rooting and latching may occur.'] },
      { h: 'Breastfeeding in KMC (Box 11)', b: [
        'Loosen binder; ear–shoulder–hip aligned; nose opposite nipple; brush nipple across lips, wait for a wide gape, bring baby to breast; C-hold if needed.',
        'Good attachment: chin touching breast, mouth wide open, lower lip everted, more areola above than below.',
        'Breast compression during pauses; first breast until suckling ineffective, then the other; feed 8–12 times/24 h; wake if needed.',
        'In very preterm infants, urine output and weight gain are the most reliable indicators of adequate intake (≥6 wet nappies/day).'] },
      { h: 'Cup / spoon feeding', b: [
        'Measured volume; loosen binder; newborn semi-upright in SSC; rest cup on lower lip touching upper lip; tip so milk reaches lips; let baby lap — never pour.',
        'Up to 30 minutes per feed; at least 8 feeds/day; return to KMC after feeding.'] },
      { h: 'Volumes', b: [
        'Typical start 60–80 mL/kg/day, 2–3 hourly, increasing by 30–40 mL/kg/day to ~180 mL/kg/day (some up to 200 if tolerated). Follow local protocol.',
        'Expected expressed milk (both breasts, ≥8 sessions/day): day 1–2 drops–120 mL/day; day 3 160–360; day 4–5 400–600; day 6–9 600–720; day 10+ ≥720 mL/day.',
        'Express 8–12 times/24 h including at least once at night; initially no more than 4–5 h between sessions; express in SSC to increase yield; focus on total daily yield.'] },
      { h: 'Supplements and growth', b: [
        'Enteral iron 2–4 mg/kg/day elemental iron once feeds established for breast-milk-fed preterm/LBW newborns.',
        'Conditional: multicomponent fortifier for <32 weeks or <1.5 kg; zinc 1–3 mg/kg/day; vitamin D 400–800 IU/day; vitamin A 1000–5000 IU/day for very preterm.',
        'Target weight gain ~15–20 g/kg/day; head circumference ~1 cm/week. Weigh daily (naked, same scale), length and HC weekly; plot on Fenton/INTERGROWTH charts.',
        'Donor milk is a bridge to mother’s own milk, not a replacement. Twins: reassure, feed one at a time initially, ensure the weaker twin gets enough.'] }
    ],
    videos: [12, 13, 14, 15],
    quiz: [
      { q: 'A 30-week newborn shows rooting but cannot coordinate sucking and breathing. Initial feeding method?', o: ['Direct breastfeeding only', 'OG/NG tube feeding of breast milk, with non-nutritive sucking at the emptied breast', 'Bottle feeding', 'Nil by mouth for 2 weeks'], a: 1, x: 'Tube feeding can be given in the KMC position.' },
      { q: 'Typical starting enteral feed volume:', o: ['20–30 mL/kg/day', '60–80 mL/kg/day', '120 mL/kg/day', '180 mL/kg/day'], a: 1, x: 'Then increase by 30–40 mL/kg/day as tolerated.' },
      { q: 'How often should a mother express milk to establish supply?', o: ['4–6 times/day', '8–12 times in 24 h, including at least once at night', 'Only when breasts feel full', 'Every hour'], a: 1, x: 'No more than 4–5 h between sessions initially.' },
      { q: 'From day 10, a full maintained milk supply is about:', o: ['120 mL/day', '360 mL/day', '720 mL/day or more', '2 L/day'], a: 2, x: 'Table 5: ≥90 mL per session, ~720 mL/day.' },
      { q: 'Recommended enteral iron dose for breast-milk-fed preterm/LBW newborns:', o: ['0.5–1 mg/kg/day', '2–4 mg/kg/day', '6–8 mg/kg/day', '10 mg/kg/day'], a: 1, x: 'Started once enteral feeds are well established.' }
    ]
  },
  {
    id: 'm8', title: 'Counselling parents and families', mins: 15,
    obj: ['Use the Greet–Ask–Listen–Praise–Advise–Confirm approach', 'Deliver antenatal and postnatal KMC counselling', 'Use the WHO parent counselling guide (built into this app)'],
    sec: [
      { h: 'Antenatal counselling (Boxes 3 and 4)', b: [
        'At least one breastfeeding counselling contact before birth; earlier and more detailed for women at high risk of preterm/LBW birth.',
        'Explain KMC, benefits, starting immediately after birth, ≥8 h/day, early and frequent breastfeeding, colostrum expression, reassurance that milk will come even after extreme prematurity.',
        'Preparations: hand hygiene, no jewellery, suitable clothing, binders. What to expect if mother or baby needs special care.',
        'Identify and prepare a family member as an additional caregiver.'] },
      { h: 'Counselling skills (Box 5)', b: [
        'GREET — build rapport, introduce yourself, learn names; sit facing, open posture, eye contact.',
        'ASK — open-ended questions (“How are you feeling today?”).',
        'LISTEN — paraphrase and reflect feelings (“It seems you are worried — am I right?”).',
        'PRAISE — “It is okay to feel scared. It is good that you are here.”',
        'ADVISE — what KMC is, benefits, how it is done, the goal.',
        'CONFIRM — ask the family to repeat key points; summarise next steps.'] },
      { h: 'Postnatal counselling (Box 6)', b: [
        'Demonstrate positioning, binders and garments; let the mother practise safely; sessions ≥1 h; breastfeed every 2–3 h; move legs for circulation.',
        'Re-emphasise colostrum/breast milk; demonstrate breastfeeding in KMC and expression.',
        'Hygiene; involve mother in daily care; explain machines and alarms in NICU; daily counselling on tracking SSC hours and feeds; peer support; plan for KMC at home.'] },
      { h: 'Using the parent counselling guide', b: [
        'Sections 1–4 for antenatal counselling; sections 1–10 for the first postnatal session(s); sections 5–10 for daily sessions until discharge.',
        'Show the picture, ask “What do you see?”, explain, discuss, praise good practice and gently correct harmful practice.',
        'KMC should be an informed, shared decision — recommended best care, not an obligation. Be culturally sensitive and address myths.'] }
    ],
    videos: [3, 6],
    quiz: [
      { q: 'Correct order of the counselling approach:', o: ['Advise – Ask – Greet – Praise – Listen – Confirm', 'Greet – Ask – Listen – Praise – Advise – Confirm', 'Greet – Advise – Confirm – Ask', 'Ask – Advise – Praise'], a: 1, x: 'GALPAC.' },
      { q: 'Which parent guide sections are used for antenatal counselling?', o: ['1–4', '5–10', '9–10', 'Only section 8'], a: 0, x: '1–4 antenatal; 1–10 first postnatal; 5–10 daily maintenance.' },
      { q: 'A mother says: “My baby is on a machine. I’m scared to hold him.” Best first response?', o: ['“Don’t worry, it’s safe.” and move on', '“It seems you are worried about your baby’s condition — am I right?”', 'Ask the father to do KMC instead', 'Postpone KMC until discharge'], a: 1, x: 'Reflect feelings before advising.' },
      { q: 'Minimum number of breastfeeding counselling contacts before birth:', o: ['None', 'At least one', 'At least three', 'Five'], a: 1, x: 'WHO recommends at least one antenatal breastfeeding counselling contact.' },
      { q: 'Adopting KMC should be:', o: ['Mandatory for all mothers', 'An informed, shared decision', 'Only for literate mothers', 'Only started after discharge'], a: 1, x: 'Viewed as the recommended best care, not an obligation.' }
    ]
  },
  {
    id: 'm9', title: 'Discharge, KMC at home and follow-up', mins: 20,
    obj: ['Apply discharge readiness criteria', 'Deliver discharge counselling', 'Support KMC at home including at night', 'Plan follow-up visits'],
    sec: [
      { h: 'Discharge readiness', b: [
        'No illness preventing discharge (e.g. apnoea); newborn screening completed including eye and hearing tests.',
        'Maintains 36.5–37.5 °C during KMC; feeding well with adequate weight gain for 3 consecutive days.',
        'Mother/family confident with care including KMC; appropriate hand hygiene; aware of danger signs and where to seek help; connected to follow-up services.'] },
      { h: 'Discharge counselling (Box 15)', b: [
        'Newborn care: continue KMC at home up to 40 weeks corrected GA; feeding and iron; hygiene and cord care; supine sleep when not in KMC; responsive care; milestones; immunisations.',
        'Maternal care: hygiene, nutrition, rest, support, fertility and birth spacing, physical activity, pelvic floor.',
        'Follow-up appointments scheduled; danger signs in mother and newborn; emergency plan (numbers, nearest facility, transport).',
        'Home set-up: warm quiet room ≥25 °C, supportive chair/bed, front-opening clothes, family support for ≥8 h/day. Take the baby home in the KMC position.'] },
      { h: 'KMC at home', b: [
        'Thermal care: warm one room, avoid smoke; extra layer when not in SSC; no wet nappies; fan not directed at baby.',
        'Hygiene: nothing on the cord; nappy below stump; no bathing until the newborn keeps warm without KMC — wipe face, neck, armpits, groin.',
        'Night-time KMC: semi-reclined with secure binder; evidence (community-initiated KMC trial: mean 11.5 h/day, ~30% mortality reduction) supports benefits outweighing safe-sleep concerns. When not in KMC: supine, firm surface, no soft items.',
        'Practical problems: partitions for privacy, pillows against a wall, family help with chores, counselling on stigma and myths.'] },
      { h: 'Follow-up schedule (Table 6)', b: [
        'Follow closely until 40 weeks corrected GA or 2500 g; then every 2–4 weeks until 3 months corrected age; then every 3 months in the first year.',
        'Every visit: history and exam, growth (weight, length, HC on chart), KMC position and duration, breastfeeding, counselling, immunisations.',
        'Neurological screen at 40 weeks CGA; ROP and cranial ultrasound per protocol; hearing screen (AABR preferred) from 40 weeks CGA to 1 month.'] }
    ],
    videos: [16, 17],
    quiz: [
      { q: 'Which is a discharge readiness criterion?', o: ['Temperature 36.5–37.5 °C during KMC and adequate weight gain for 3 consecutive days', 'Weight ≥2500 g', 'Off KMC for 48 hours', 'Corrected GA ≥40 weeks'], a: 0, x: 'Earlier discharge with continued KMC is a feature of KMC.' },
      { q: 'KMC should continue at home up to a corrected gestational age of:', o: ['34 weeks', '37 weeks', '40 weeks', '52 weeks'], a: 2, x: 'Or until the newborn wriggles out.' },
      { q: 'After reaching 40 weeks CGA or 2500 g, follow-up visits are typically:', o: ['Stopped', 'Every 2–4 weeks until 3 months corrected age', 'Daily', 'Yearly'], a: 1, x: 'Then every 3 months in the first year.' },
      { q: 'When not in KMC at home, the baby should sleep:', o: ['Prone', 'Supine on a firm surface without soft items', 'On the side propped with pillows', 'Under heavy blankets in the parents’ bed'], a: 1, x: 'Safe sleep when not in SSC.' },
      { q: 'Adequate weight gain target for a preterm/LBW newborn:', o: ['5 g/kg/day', '15–20 g/kg/day', '40 g/kg/day', '50 g/kg/day'], a: 1, x: 'Approximately 15–20 g/kg/day.' }
    ]
  },
  {
    id: 'm10', title: 'Monitoring KMC quality and data', mins: 10,
    obj: ['Record KMC data accurately', 'Calculate KMC indicators', 'Use data for quality improvement'],
    sec: [
      { h: 'Recording', b: [
        'Record in a dedicated register at least daily, ideally every 6 hours: date/time (or age in hours) of KMC initiation, weight at initiation, hours in SSC, breast milk vs other feeds; temperature and daily weight are useful.',
        'Mothers can keep an hourly chart (Annex 4a); breaks >1 h are recorded as zero, not left blank. Health workers summarise 6-hourly (Annex 4b). The KMC Tracker in this app reproduces both formats.'] },
      { h: 'Indicators (Box 13)', b: [
        '% of preterm/LBW newborns who received KMC (8–24 h SSC/day + exclusive breastfeeding).',
        'Age at SSC initiation; SSC duration per day; SSC duration and EBF frequency in the 24 h before discharge.',
        'Reasons for not initiating KMC; % exclusively breastfed at discharge; age at first breast milk feed and first direct breastfeed.',
        'Analyse separately for newborns admitted to the newborn unit and those not admitted.'] },
      { h: 'ENAP coverage indicator (Box 14)', b: [
        'Numerator: newborns <2500 g placed in KMC position anywhere in the facility. Denominator: admitted newborns with birth weight <2500 g.',
        'Limitation: may count brief first-hour SSC as KMC — not the intended “prolonged” SSC. Use digital scales to avoid heaping at 2500 g.',
        'Use audits, dashboards and PDSA cycles to close gaps.'] }
    ],
    videos: [],
    quiz: [
      { q: 'Numerator of the ENAP KMC coverage indicator:', o: ['Newborns <2500 g placed in KMC position anywhere in the facility', 'All live births', 'Newborns with ≥8 h SSC on the day of discharge', 'Mothers counselled antenatally'], a: 0, x: 'Denominator: admitted newborns <2500 g.' },
      { q: 'A key limitation of the ENAP coverage indicator is that it:', o: ['May count brief first-hour SSC as KMC', 'Requires a computer', 'Excludes twins', 'Counts only outborn babies'], a: 0, x: 'This does not reflect prolonged SSC.' },
      { q: 'Ideally, KMC data are recorded:', o: ['Weekly', 'Every 6 hours', 'Monthly', 'Only at discharge'], a: 1, x: 'At least daily; ideally 6-hourly to avoid recall bias.' },
      { q: 'On the mother’s hourly chart, a break in KMC of more than one hour is recorded as:', o: ['Left blank', 'Zero', 'N/A', 'An estimate'], a: 1, x: 'Record zero rather than leaving the row blank.' },
      { q: 'Which is a Box 13 KMC indicator?', o: ['% preterm/LBW newborns exclusively breastfed at discharge', 'Number of incubators', 'Average maternal age', 'Number of doctors on duty'], a: 0, x: 'Plus SSC duration, age at initiation and others.' }
    ]
  }
];

/* Competency checklists (OSCE style). c:true = critical step */
const SKILLS = [
  { id: 's1', title: 'Placing a stable newborn in the KMC position', ref: 'Table 3', video: 7, steps: [
    { t: 'Performs hand hygiene and asks the mother to do the same', c: true },
    { t: 'Explains each step and its purpose to the mother / caregiver' },
    { t: 'Mother seated upright or semi-reclined, front-opening garment, no inner wear, binder ready' },
    { t: 'Newborn in cap and dry diaper; pulse oximeter attached if indicated' },
    { t: 'Moves newborn safely (supine or prone hold) supporting head, neck and jaw', c: true },
    { t: 'Places newborn prone, high between the breasts, head turned to one side', c: true },
    { t: 'Neck slightly extended — no flexion or hyperextension; airway clear', c: true },
    { t: 'Arms flexed; hips and knees flexed with hips partially abducted' },
    { t: 'Binder high under axillae, top edge below the ear, snug but not compressing, knots at the side', c: true },
    { t: 'Secures cables / tubes to garment or skin' },
    { t: 'KMC garment tied from below (cloth binder); blanket if cold' },
    { t: 'Checks newborn’s condition and mother’s comfort; teaches what to observe; mother can kiss the head' }
  ] },
  { id: 's2', title: 'Placing a newborn on CPAP in the KMC position', ref: 'Table 4', video: 8, steps: [
    { t: 'Ensures at least two health workers and checks resuscitation equipment is at hand', c: true },
    { t: 'Counsels the mother on the steps; hand hygiene by all', c: true },
    { t: 'Confirms newborn is calm and stable on current settings; cap, diaper, pulse oximeter' },
    { t: 'Positions mother semi-reclined close to equipment; tubing long enough' },
    { t: 'HW1 moves the newborn laterally with slow, controlled movements', c: true },
    { t: 'HW2 holds CPAP tubing to keep interface in place and watches SpO2', c: true },
    { t: 'Places newborn prone; mother’s hands over HW’s hands before withdrawal' },
    { t: 'Checks KMC position, airway and SpO2 after placement', c: true },
    { t: 'Secures binder and garment; cables run from the top with a tube binder' },
    { t: 'Tapes tubes/leads to garment or skin; covers if cold; stays until settled' },
    { t: 'Teaches mother what to watch, alarms and when to call for help' }
  ] },
  { id: 's3', title: 'Measuring axillary temperature in KMC', ref: 'Section 4.3.5', video: 9, steps: [
    { t: 'Keeps newborn in SSC and covered; loosens binder exposing one arm only', c: true },
    { t: 'Cleans thermometer' },
    { t: 'Places bulb high in the middle of the axilla with full skin contact', c: true },
    { t: 'Holds arm gently against chest for ≥3 min (mercury) or until beep (digital)', c: true },
    { t: 'Reads correctly, re-positions arm and re-secures binder' },
    { t: 'Records temperature and acts on values outside 36.5–37.5 °C (Box 7)', c: true }
  ] },
  { id: 's4', title: 'Supporting breastfeeding in the KMC position', ref: 'Box 11', video: 13, steps: [
    { t: 'Reassures the mother she can breastfeed and has enough milk' },
    { t: 'Teaches feeding cues (rooting, hand sucking, sucking noises)' },
    { t: 'Hand hygiene; loosens or removes binder keeping baby covered', c: true },
    { t: 'Ear–shoulder–hip aligned; nose opposite nipple; body close', c: true },
    { t: 'Brushes nipple across lips, waits for wide gape, brings baby to breast; C-hold if needed' },
    { t: 'Identifies 4 signs of good attachment', c: true },
    { t: 'Explains signs of effective feeding and breast compression during pauses' },
    { t: 'Returns newborn to KMC position, re-secures binder, hand hygiene' }
  ] },
  { id: 's5', title: 'Cup feeding expressed breast milk in KMC', ref: 'Section 4.3.8', video: 15, steps: [
    { t: 'Confirms prescribed volume and measures it into a clean cup', c: true },
    { t: 'Loosens binder; newborn semi-upright, maintaining SSC' },
    { t: 'Rests cup on lower lip touching outer upper lip; tips so milk reaches lips', c: true },
    { t: 'Lets newborn lap/sip at own pace — never pours milk into the mouth', c: true },
    { t: 'Recognises end of feed (stops lapping, closes mouth, no interest); ≤30 min' },
    { t: 'Returns newborn to KMC position, secures binder; records volume taken' }
  ] },
  { id: 's6', title: 'Counselling a mother on KMC (GALPAC)', ref: 'Box 5, Box 6', video: 6, steps: [
    { t: 'Greets, introduces self, learns names; open posture and eye contact' },
    { t: 'Asks open-ended questions', c: true },
    { t: 'Listens, paraphrases and reflects feelings', c: true },
    { t: 'Praises what the mother is doing well' },
    { t: 'Advises clearly: what KMC is, benefits, how, duration ≥8 h/day, breastfeeding 2–3 hourly', c: true },
    { t: 'Uses the parent counselling pictures / app in the family’s language' },
    { t: 'Confirms understanding (teach-back) and summarises next steps', c: true }
  ] },
  { id: 's7', title: 'Discharge counselling for KMC at home', ref: 'Box 15', video: 16, steps: [
    { t: 'Checks discharge readiness criteria', c: true },
    { t: 'Counsels continued KMC ≥8 h/day at home until ~40 weeks CGA / wriggling out', c: true },
    { t: 'Covers feeding, iron, hygiene, cord care, no bathing until thermoregulating' },
    { t: 'Explains safe sleep when not in KMC and safe night-time KMC' },
    { t: 'Reviews danger signs and emergency plan (numbers, nearest facility, transport)', c: true },
    { t: 'Covers maternal care (nutrition, rest, family planning, activity)' },
    { t: 'Schedules follow-up and gives written / app-based home record' },
    { t: 'Confirms understanding with the mother and additional caregivers' }
  ] }
];
