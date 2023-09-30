import { TarotCard } from "../interfaces/TarotCard";

/**
 * {@link} Adapted from: https://github.com/ekelen/tarot-api/blob/main/static/card_data.json.
 */
export const TarotCards: TarotCard[] = [
  {
    type: "major",
    name: "The Magician",
    value: 1,
    meaning:
      "Skill, diplomacy, address, subtlety; sickness, pain, loss, disaster, snares of enemies; self-confidence, will; the Querent, if male.",
    reversed: "Physician, Magus, mental disease, disgrace, disquiet.",
  },
  {
    type: "major",
    name: "The High Priestess",
    value: 2,
    meaning:
      "Secrets, mystery, the future as yet unrevealed; the woman who interests the Querent, if male; the Querent herself, if female; silence, tenacity; mystery, wisdom, science.",
    reversed: "Passion, moral or physical ardour, conceit, surface knowledge.",
  },
  {
    type: "major",
    name: "The Empress",
    value: 3,
    meaning:
      "Fruitfulness, action, initiative, length of days; the unknown, clandestine; also difficulty, doubt, ignorance.",
    reversed:
      "Light, truth, the unravelling of involved matters, public rejoicings; according to another reading, vacillation.",
  },
  {
    type: "major",
    name: "The Emperor",
    value: 4,
    meaning:
      "Stability, power, protection, realization; a great person; aid, reason, conviction; also authority and will.",
    reversed:
      "Benevolence, compassion, credit; also confusion to enemies, obstruction, immaturity.",
  },
  {
    type: "major",
    name: "The Hierophant",
    value: 5,
    meaning:
      "Marriage, alliance, captivity, servitude; by another account, mercy and goodness; inspiration; the man to whom the Querent has recourse.",
    reversed: "Society, good understanding, concord, overkindness, weakness.",
  },
  {
    type: "major",
    name: "The Lovers",
    value: 6,
    meaning: "Attraction, love, beauty, trials overcome.",
    reversed:
      "Failure, foolish designs. Another account speaks of marriage frustrated and contrarieties of all kinds.",
  },
  {
    type: "major",
    name: "The Chariot",
    value: 7,
    meaning:
      "Succour, providence also war, triumph, presumption, vengeance, trouble.",
    reversed: "Riot, quarrel, dispute, litigation, defeat.",
  },
  {
    type: "major",
    name: "Fortitude",
    value: 8,
    meaning:
      "Power, energy, action, courage, magnanimity; also complete success and honours.",
    reversed:
      "Despotism, abuse if power, weakness, discord, sometimes even disgrace.",
  },
  {
    type: "major",
    name: "The Hermit",
    value: 9,
    meaning:
      "Prudence, circumspection; also and especially treason, dissimulation, roguery, corruption.",
    reversed: "Concealment, disguise, policy, fear, unreasoned caution.",
  },
  {
    type: "major",
    name: "Wheel Of Fortune",
    value: 10,
    meaning: "Destiny, fortune, success, elevation, luck, felicity.",
    reversed: "Increase, abundance, superfluity.",
  },
  {
    type: "major",
    name: "Justice",
    value: 11,
    meaning:
      "Equity, rightness, probity, executive; triumph of the deserving side in law.",
    reversed:
      "Law in all its departments, legal complications, bigotry, bias, excessive severity.",
  },
  {
    type: "major",
    name: "The Hanged Man",
    value: 12,
    meaning:
      "Wisdom, circumspection, discernment, trials, sacrifice, intuition, divination, prophecy.",
    reversed: "Selfishness, the crowd, body politic.",
  },
  {
    type: "major",
    name: "Death",
    value: 13,
    meaning:
      "End, mortality, destruction, corruption also, for a man, the loss of a benefactor for a woman, many contrarieties; for a maid, failure of marriage projects.",
    reversed:
      "Inertia, sleep, lethargy, petrifaction, somnambulism; hope destroyed.",
  },
  {
    type: "major",
    name: "Temperance",
    value: 14,
    meaning: "Economy, moderation, frugality, management, accommodation.",
    reversed:
      "Things connected with churches, religions, sects, the priesthood, sometimes even the priest who will marry the Querent; also disunion, unfortunate combinations, competing interests.",
  },
  {
    type: "major",
    name: "The Devil",
    value: 15,
    meaning:
      "Ravage, violence, vehemence, extraordinary efforts, force, fatality; that which is predestined but is not for this reason evil.",
    reversed: "Evil fatality, weakness, pettiness, blindness.",
  },
  {
    type: "major",
    name: "The Tower",
    value: 16,
    meaning:
      "Misery, distress, indigence, adversity, calamity, disgrace, deception, ruin. It is a card in particular of unforeseen catastrophe.",
    reversed:
      "According to one account, the same in a lesser degree also oppression, imprisonment, tyranny.",
  },
  {
    type: "major",
    name: "The Star",
    value: 17,
    meaning:
      "Loss, theft, privation, abandonment; another reading says-hope and bright prospects,",
    reversed: "Arrogance, haughtiness, impotence.",
  },
  {
    type: "major",
    name: "The Moon",
    value: 18,
    meaning:
      "Hidden enemies, danger, calumny, darkness, terror, deception, occult forces, error.",
    reversed:
      "Instability, inconstancy, silence, lesser degrees of deception and error.",
  },
  {
    type: "major",
    name: "The Sun",
    value: 19,
    meaning: "Material happiness, fortunate marriage, contentment.",
    reversed: "The same in a lesser sense.",
  },
  {
    type: "major",
    name: "The Last Judgment",
    value: 20,
    meaning:
      "Change of position, renewal, outcome. Another account specifies total loss though lawsuit.",
    reversed:
      "Weakness, pusillanimity, simplicity; also deliberation, decision, sentence.",
  },
  {
    type: "major",
    name: "The Fool",
    value: 0,
    meaning:
      "Folly, mania, extravagance, intoxication, delirium, frenzy, bewrayment.",
    reversed:
      "Negligence, absence, distribution, carelessness, apathy, nullity, vanity.",
  },
  {
    type: "major",
    name: "The World",
    value: 21,
    meaning:
      "Assured success, recompense, voyage, route, emigration, flight, change of place.",
    reversed: "Inertia, fixity, stagnation, permanence.",
  },
  {
    name: "Page of Wands",
    value: 11,
    type: "minor",
    meaning:
      "Dark young man, faithful, a lover, an envoy, a postman. Beside a man, he will bear favourable testimony concerning him. A dangerous rival, if followed by the Page of Cups. Has the chief qualities of his suit. He may signify family intelligence.",
    reversed:
      "Anecdotes, announcements, evil news. Also indecision and the instability which accompanies it.",
  },
  {
    name: "Knight of Wands",
    value: 12,
    type: "minor",
    meaning:
      "Departure, absence, flight, emigration. A dark young man, friendly. Change of residence.",
    reversed: "Rupture, division, interruption, discord.",
  },
  {
    name: "Queen of Wands",
    value: 13,
    type: "minor",
    meaning:
      "A dark woman, countrywoman, friendly, chaste, loving, honourable. If the card beside her signifies a man, she is well disposed towards him; if a woman, she is interested in the Querent. Also, love of money, or a certain success in business.",
    reversed:
      "Good, economical, obliging, serviceable. Signifies also--but in certain positions and in the neighbourhood of other cards tending in such directions--opposition, jealousy, even deceit and infidelity.",
  },
  {
    name: "King of Wands",
    value: 14,
    type: "minor",
    meaning:
      "Dark man, friendly, countryman, generally married, honest and conscientious. The card always signifies honesty, and may mean news concerning an unexpected heritage to fall in before very long.",
    reversed: "Good, but severe; austere, yet tolerant.",
  },
  {
    name: "Ace of Wands",
    value: 1,
    type: "minor",
    meaning:
      "Creation, invention, enterprise, the powers which result in these; principle, beginning, source; birth, family, origin, and in a sense the virility which is behind them; the starting point of enterprises; according to another account, money, fortune, inheritance.",
    reversed:
      "Fall, decadence, ruin, perdition, to perish also a certain clouded joy.",
  },
  {
    name: "Two of Wands",
    value: 2,
    type: "minor",
    meaning:
      "Between the alternative readings there is no marriage possible; on the one hand, riches, fortune, magnificence; on the other, physical suffering, disease, chagrin, sadness, mortification. The design gives one suggestion; here is a lord overlooking his dominion and alternately contemplating a globe; it looks like the malady, the mortification, the sadness of Alexander amidst the grandeur of this world's wealth.",
    reversed: "Surprise, wonder, enchantment, emotion, trouble, fear.",
  },
  {
    name: "Three of Wands",
    value: 3,
    type: "minor",
    meaning:
      "He symbolizes established strength, enterprise, effort, trade, commerce, discovery; those are his ships, bearing his merchandise, which are sailing over the sea. The card also signifies able co-operation in business, as if the successful merchant prince were looking from his side towards yours with a view to help you.",
    reversed:
      "The end of troubles, suspension or cessation of adversity, toil and disappointment.",
  },
  {
    name: "Four of Wands",
    value: 4,
    type: "minor",
    meaning:
      "They are for once almost on the surface--country life, haven of refuge, a species of domestic harvest-home, repose, concord, harmony, prosperity, peace, and the perfected work of these.",
    reversed:
      "The meaning remains unaltered; it is prosperity, increase, felicity, beauty, embellishment.",
  },
  {
    name: "Five of Wands",
    value: 5,
    type: "minor",
    meaning:
      "Imitation, as, for example, sham fight, but also the strenuous competition and struggle of the search after riches and fortune. In this sense it connects with the battle of life. Hence some attributions say that it is a card of gold, gain, opulence.",
    reversed: "Litigation, disputes, trickery, contradiction.",
  },
  {
    name: "Six of Wands",
    value: 6,
    type: "minor",
    meaning:
      "The card has been so designed that it can cover several significations; on the surface, it is a victor triumphing, but it is also great news, such as might be carried in state by the King's courier; it is expectation crowned with its own desire, the crown of hope, and so forth.",
    reversed:
      "Apprehension, fear, as of a victorious enemy at the gate; treachery, disloyalty, as of gates being opened to the enemy; also indefinite delay.",
  },
  {
    name: "Seven of Wands",
    value: 7,
    type: "minor",
    meaning:
      "It is a card of valour, for, on the surface, six are attacking one, who has, however, the vantage position. On the intellectual plane, it signifies discussion, wordy strife; in business--negotiations, war of trade, barter, competition. It is further a card of success, for the combatant is on the top and his enemies may be unable to reach him.",
    reversed:
      "Perplexity, embarrassments, anxiety. It is also a caution against indecision.",
  },
  {
    name: "Eight of Wands",
    value: 8,
    type: "minor",
    meaning:
      "Activity in undertakings, the path of such activity, swiftness, as that of an express messenger; great haste, great hope, speed towards an end which promises assured felicity; generally, that which is on the move; also the arrows of love.",
    reversed:
      "Arrows of jealousy, internal dispute, stingings of conscience, quarrels; and domestic disputes for persons who are married.",
  },
  {
    name: "Nine of Wands",
    value: 9,
    type: "minor",
    meaning:
      "The card signifies strength in opposition. If attacked, the person will meet an onslaught boldly; and his build shews, that he may prove a formidable antagonist. With this main significance there are all its possible adjuncts--delay, suspension, adjournment.",
    reversed: "Obstacles, adversity, calamity.",
  },
  {
    name: "Ten of Wands",
    value: 10,
    type: "minor",
    meaning:
      "A card of many significances, and some of the readings cannot be harmonized. I set aside that which connects it with honour and good faith. The chief meaning is oppression simply, but it is also fortune, gain, any kind of success, and then it is the oppression of these things. It is also a card of false-seeming, disguise, perfidy. The place which the figure is approaching may suffer from the rods that he carries. Success is stultified if the Nine of Swords follows, and if it is a question of a lawsuit, there will be certain loss.",
    reversed: "Contrarieties, difficulties, intrigues, and their analogies.",
  },
  {
    name: "Page of Cups",
    value: 11,
    type: "minor",
    meaning:
      "Fair young man, one impelled to render service and with whom the Querent will be connected; a studious youth; news, message; application, reflection, meditation; also these things directed to business.",
    reversed: "Taste, inclination, attachment, seduction, deception, artifice.",
  },
  {
    name: "Knight of Cups",
    value: 12,
    type: "minor",
    meaning:
      "Arrival, approach--sometimes that of a messenger; advances, proposition, demeanour, invitation, incitement.",
    reversed: "Trickery, artifice, subtlety, swindling, duplicity, fraud.",
  },
  {
    name: "Queen of Cups",
    value: 13,
    type: "minor",
    meaning:
      "Good, fair woman; honest, devoted woman, who will do service to the Querent; loving intelligence, and hence the gift of vision; success, happiness, pleasure; also wisdom, virtue; a perfect spouse and a good mother.",
    reversed:
      "The accounts vary; good woman; otherwise, distinguished woman but one not to be trusted; perverse woman; vice, dishonour, depravity.",
  },
  {
    name: "King of Cups",
    value: 14,
    type: "minor",
    meaning:
      "Fair man, man of business, law, or divinity; responsible, disposed to oblige the Querent; also equity, art and science, including those who profess science, law and art; creative intelligence.",
    reversed:
      "Dishonest, double-dealing man; roguery, exaction, injustice, vice, scandal, pillage, considerable loss.",
  },
  {
    name: "Ace of Cups",
    value: 1,
    type: "minor",
    meaning:
      "House of the true heart, joy, content, abode, nourishment, abundance, fertility; Holy Table, felicity hereof.",
    reversed: "House of the false heart, mutation, instability, revolution.",
  },
  {
    name: "Two of Cups",
    value: 2,
    type: "minor",
    meaning:
      "Love, passion, friendship, affinity, union, concord, sympathy, the interrelation of the sexes, and--as a suggestion apart from all offices of divination--that desire which is not in Nature, but by which Nature is sanctified.",
    reversed: `Lust, cupidity, jealousy, wish, desire, but the card may also give, says W., "that desire which is not in nature, but by which nature is sanctified."`,
  },
  {
    name: "Three of Cups",
    value: 3,
    type: "minor",
    meaning:
      "The conclusion of any matter in plenty, perfection and merriment; happy issue, victory, fulfilment, solace, healing,",
    reversed:
      "Expedition, dispatch, achievement, end. It signifies also the side of excess in physical enjoyment, and the pleasures of the senses.",
  },
  {
    name: "Four of Cups",
    value: 4,
    type: "minor",
    meaning:
      "Weariness, disgust, aversion, imaginary vexations, as if the wine of this world had caused satiety only; another wine, as if a fairy gift, is now offered the wastrel, but he sees no consolation therein. This is also a card of blended pleasure.",
    reversed: "Novelty, presage, new instruction, new relations.",
  },
  {
    name: "Five of Cups",
    value: 5,
    type: "minor",
    meaning:
      "A dark, cloaked figure, looking sideways at three prone cups two others stand upright behind him; a bridge is in the background, leading to a small keep or holding. Divanatory Meanings: It is a card of loss, but something remains over; three have been taken, but two are left; it is a card of inheritance, patrimony, transmission, but not corresponding to expectations; with some interpreters it is a card of marriage, but not without bitterness or frustration.",
    reversed:
      "News, alliances, affinity, consanguinity, ancestry, return, false projects.",
  },
  {
    name: "Six of Cups",
    value: 6,
    type: "minor",
    meaning:
      "A card of the past and of memories, looking back, as--for example--on childhood; happiness, enjoyment, but coming rather from the past; things that have vanished. Another reading reverses this, giving new relations, new knowledge, new environment, and then the children are disporting in an unfamiliar precinct.",
    reversed: "The future, renewal, that which will come to pass presently.",
  },
  {
    name: "Seven of Cups",
    value: 7,
    type: "minor",
    meaning:
      "Fairy favours, images of reflection, sentiment, imagination, things seen in the glass of contemplation; some attainment in these degrees, but nothing permanent or substantial is suggested.",
    reversed: "Desire, will, determination, project.",
  },
  {
    name: "Eight of Cups",
    value: 8,
    type: "minor",
    meaning:
      "The card speaks for itself on the surface, but other readings are entirely antithetical--giving joy, mildness, timidity, honour, modesty. In practice, it is usually found that the card shews the decline of a matter, or that a matter which has been thought to be important is really of slight consequence--either for good or evil.",
    reversed: "Great joy, happiness, feasting.",
  },
  {
    name: "Nine of Cups",
    value: 9,
    type: "minor",
    meaning:
      "Concord, contentment, physical bien-être; also victory, success, advantage; satisfaction for the Querent or person for whom the consultation is made.",
    reversed:
      "Truth, loyalty, liberty; but the readings vary and include mistakes, imperfections, etc.",
  },
  {
    name: "Ten of Cups",
    value: 10,
    type: "minor",
    meaning:
      "Contentment, repose of the entire heart; the perfection of that state; also perfection of human love and friendship; if with several picture-cards, a person who is taking charge of the Querent's interests; also the town, village or country inhabited by the Querent.",
    reversed: "Repose of the false heart, indignation, violence.",
  },
  {
    name: "Page of Pentacles",
    value: 11,
    type: "minor",
    meaning:
      "Application, study, scholarship, reflection another reading says news, messages and the bringer thereof; also rule, management.",
    reversed:
      "Prodigality, dissipation, liberality, luxury; unfavourable news.",
  },
  {
    name: "Knight of Pentacles",
    value: 12,
    type: "minor",
    meaning:
      "Utility, serviceableness, interest, responsibility, rectitude-all on the normal and external plane.",
    reversed:
      "inertia, idleness, repose of that kind, stagnation; also placidity, discouragement, carelessness.",
  },
  {
    name: "Queen of Pentacles",
    value: 13,
    type: "minor",
    meaning: "Opulence, generosity, magnificence, security, liberty.",
    reversed: "Evil, suspicion, suspense, fear, mistrust.",
  },
  {
    name: "King of Pentacles",
    value: 14,
    type: "minor",
    meaning:
      "Valour, realizing intelligence, business and normal intellectual aptitude, sometimes mathematical gifts and attainments of this kind; success in these paths.",
    reversed: "Vice, weakness, ugliness, perversity, corruption, peril.",
  },
  {
    name: "Ace of Pentacles",
    value: 1,
    type: "minor",
    meaning:
      "Perfect contentment, felicity, ecstasy; also speedy intelligence; gold.",
    reversed:
      "The evil side of wealth, bad intelligence; also great riches. In any case it shews prosperity, comfortable material conditions, but whether these are of advantage to the possessor will depend on whether the card is reversed or not.",
  },
  {
    name: "Two of Pentacles",
    value: 2,
    type: "minor",
    meaning:
      "On the one hand it is represented as a card of gaiety, recreation and its connexions, which is the subject of the design; but it is read also as news and messages in writing, as obstacles, agitation, trouble, embroilment.",
    reversed:
      "Enforced gaiety, simulated enjoyment, literal sense, handwriting, composition, letters of exchange.",
  },
  {
    name: "Three of Pentacles",
    value: 3,
    type: "minor",
    meaning:
      "Métier, trade, skilled labour; usually, however, regarded as a card of nobility, aristocracy, renown, glory.",
    reversed:
      "Mediocrity, in work and otherwise, puerility, pettiness, weakness.",
  },
  {
    name: "Four of Pentacles",
    value: 4,
    type: "minor",
    meaning:
      "The surety of possessions, cleaving to that which one has, gift, legacy, inheritance.",
    reversed: "Suspense, delay, opposition.",
  },
  {
    name: "Five of Pentacles",
    value: 5,
    type: "minor",
    meaning:
      "The card foretells material trouble above all, whether in the form illustrated--that is, destitution--or otherwise. For some cartomancists, it is a card of love and lovers-wife, husband, friend, mistress; also concordance, affinities. These alternatives cannot be harmonized.",
    reversed: "Disorder, chaos, ruin, discord, profligacy.",
  },
  {
    name: "Six of Pentacles",
    value: 6,
    type: "minor",
    meaning:
      "Presents, gifts, gratification another account says attention, vigilance now is the accepted time, present prosperity, etc.",
    reversed: "Desire, cupidity, envy, jealousy, illusion.",
  },
  {
    name: "Seven of Pentacles",
    value: 7,
    type: "minor",
    meaning:
      "These are exceedingly contradictory; in the main, it is a card of money, business, barter; but one reading gives altercation, quarrels--and another innocence, ingenuity, purgation.",
    reversed:
      "Cause for anxiety regarding money which it may be proposed to lend.",
  },
  {
    name: "Eight of Pentacles",
    value: 8,
    type: "minor",
    meaning:
      "Work, employment, commission, craftsmanship, skill in craft and business, perhaps in the preparatory stage.",
    reversed:
      "Voided ambition, vanity, cupidity, exaction, usury. It may also signify the possession of skill, in the sense of the ingenious mind turned to cunning and intrigue.",
  },
  {
    name: "Nine of Pentacles",
    value: 9,
    type: "minor",
    meaning:
      "Prudence, safety, success, accomplishment, certitude, discernment.",
    reversed: "Roguery, deception, voided project, bad faith.",
  },
  {
    name: "Ten of Pentacles",
    value: 10,
    type: "minor",
    meaning:
      "Gain, riches; family matters, archives, extraction, the abode of a family.",
    reversed:
      "Chance, fatality, loss, robbery, games of hazard; sometimes gift, dowry, pension.",
  },
  {
    name: "Page of Swords",
    value: 11,
    type: "minor",
    meaning:
      "Authority, overseeing, secret service, vigilance, spying, examination, and the qualities thereto belonging.",
    reversed:
      "More evil side of these qualities; what is unforeseen, unprepared state; sickness is also intimated.",
  },
  {
    name: "Knight of Swords",
    value: 12,
    type: "minor",
    meaning:
      "Skill, bravery, capacity, defence, address, enmity, wrath, war, destruction, opposition, resistance, ruin. There is therefore a sense in which the card signifies death, but it carries this meaning only in its proximity to other cards of fatality.",
    reversed: "Imprudence, incapacity, extravagance.",
  },
  {
    name: "Queen of Swords",
    value: 13,
    type: "minor",
    meaning:
      "Widowhood, female sadness and embarrassment, absence, sterility, mourning, privation, separation.",
    reversed: "Malice, bigotry, artifice, prudery, bale, deceit.",
  },
  {
    name: "King of Swords",
    value: 14,
    type: "minor",
    meaning:
      "Whatsoever arises out of the idea of judgment and all its connexions-power, command, authority, militant intelligence, law, offices of the crown, and so forth.",
    reversed: "Cruelty, perversity, barbarity, perfidy, evil intention.",
  },
  {
    name: "Ace of Swords",
    value: 1,
    type: "minor",
    meaning:
      "Triumph, the excessive degree in everything, conquest, triumph of force. It is a card of great force, in love as well as in hatred. The crown may carry a much higher significance than comes usually within the sphere of fortune-telling.",
    reversed:
      "The same, but the results are disastrous; another account says--conception, childbirth, augmentation, multiplicity.",
  },
  {
    name: "Two of Swords",
    value: 2,
    type: "minor",
    meaning:
      "Conformity and the equipoise which it suggests, courage, friendship, concord in a state of arms; another reading gives tenderness, affection, intimacy. The suggestion of harmony and other favourable readings must be considered in a qualified manner, as Swords generally are not symbolical of beneficent forces in human affairs.",
    reversed: "Imposture, falsehood, duplicity, disloyalty.",
  },
  {
    name: "Three of Swords",
    value: 3,
    type: "minor",
    meaning:
      "Removal, absence, delay, division, rupture, dispersion, and all that the design signifies naturally, being too simple and obvious to call for specific enumeration.",
    reversed:
      "Mental alienation, error, loss, distraction, disorder, confusion.",
  },
  {
    name: "Four of Swords",
    value: 4,
    type: "minor",
    meaning:
      "Vigilance, retreat, solitude, hermit's repose, exile, tomb and coffin. It is these last that have suggested the design.",
    reversed:
      "Wise administration, circumspection, economy, avarice, precaution, testament.",
  },
  {
    name: "Five of Swords",
    value: 5,
    type: "minor",
    meaning:
      "Degradation, destruction, revocation, infamy, dishonour, loss, with the variants and analogues of these.",
    reversed: "The same; burial and obsequies.",
  },
  {
    name: "Six of Swords",
    value: 6,
    type: "minor",
    meaning: "Journey by water, route, way, envoy, commissionary, expedient.",
    reversed:
      "Declaration, confession, publicity; one account says that it is a proposal of love.",
  },
  {
    name: "Seven of Swords",
    value: 7,
    type: "minor",
    meaning:
      "Design, attempt, wish, hope, confidence; also quarrelling, a plan that may fail, annoyance. The design is uncertain in its import, because the significations are widely at variance with each other.",
    reversed: "Good advice, counsel, instruction, slander, babbling.",
  },
  {
    name: "Eight of Swords",
    value: 8,
    type: "minor",
    meaning:
      "Bad news, violent chagrin, crisis, censure, power in trammels, conflict, calumny; also sickness.",
    reversed:
      "Disquiet, difficulty, opposition, accident, treachery; what is unforeseen; fatality.",
  },
  {
    name: "Nine of Swords",
    value: 9,
    type: "minor",
    meaning:
      "Death, failure, miscarriage, delay, deception, disappointment, despair.",
    reversed: "Imprisonment, suspicion, doubt, reasonable fear, shame.",
  },
  {
    name: "Ten of Swords",
    value: 10,
    type: "minor",
    meaning:
      "Whatsoever is intimated by the design; also pain, affliction, tears, sadness, desolation. It is not especially a card of violent death.",
    reversed:
      "Advantage, profit, success, favour, but none of these are permanent; also power and authority.",
  },
];
