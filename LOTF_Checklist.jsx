import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Search, ChevronDown, ChevronRight, Eye, EyeOff,
  Download, Upload, AlertTriangle, AlertOctagon,
  CheckCircle2, Circle, RotateCcw, X, Trophy,
  Info, Map as MapIcon, ListChecks, Sparkles, Filter, ExternalLink
} from "lucide-react";

// ===========================================================================
// DATA
// ===========================================================================
// Playthrough areas. Each item: [id, text, badge, spoiler?, paths?]
// badge: 0=none, 1=STOP, 2=MISSABLE
// spoiler: 1=major spoiler. paths: ["radiance"|"inferno"|"umbral", ...]
const AREAS = [{"slug":"Defiled_Sepulchre","title":"Defiled Sepulchre","items":[["1_1","Obtain Forsworn",0],["1_2","Obtain a Saintly Quintessence",0]]},{"slug":"Abandoned_Redcopse","title":"Abandoned Redcopse","items":[["2_1","Activate the Vestige of Ranik",0],["2_2","Defeat Holy Bulwark Otto",0,1],["2_3","Fight the Lightreaper (Do NOT kill him here if you wish to complete Andreas, Kukajin, or Paladin Isaac's quests)",1],["2_4","Obtain the Flayed Skin for Isaac's quest",2],["2_5","Activate the Vestige of Hannelore",0],["2_6","Talk to the Iron Wayfarer next to the Vestige",0],["2_7","Soulflay the Abandoned Woman's Stigma",0],["2_8","Obtain the Broken Sword",0],["2_9","Obtain the Hallowed Condemnation",0],["2_10","Obtain the Pilgrim Garb and the Pilgrim Skirt",0],["2_11","Activate the Vestige of Marco the Axe",0],["2_12","Obtain the Raw Mangler Axe",0],["2_13","Obtain the Umbral Eye of Betrayed Eliard",0],["2_14","Soulflay the Choking Man's Stigma",0],["2_15","Obtain the Mineowner's Ring",0],["2_16","Obtain the Pilgrim Hood and Pilgrim Bandages",0],["2_17","Talk to the the Iron Wayfarer again by the exit to receive a Vestige Seed",1]]},{"slug":"Skyrest_Bridge","title":"Skyrest Bridge","items":[["3_1","Obtain the Rusty Cutter",0],["3_2","Defeat Pieta, She of Blessed Renewal",0,1],["3_3","Soulflay Pieta's Stigma",0],["3_4","Obtain the Remembrance of Pieta, She of Blessed Renewal",0],["3_5","Obtain Sanctify",0],["3_6","Activate the Vestige of Ethryg",0],["3_7","Talk to Exacter Dunmire",0],["3_8","Obtain the Dark Crusader's Challenge [Gesture]",0],["3_9","Talk to Pieta",0],["3_10","Talk to Molhu in Umbral",0],["3_11","Obtain the Putrid Mother's Embrace [Gesture]",0],["3_12","Talk to Stomund, Captain of the Fidelis",0],["3_13","Talk to Eustace",0],["3_14","Talk to Nathaniel",0],["3_15","Obtain Aura of Tenacity",0],["3_15_2","Talk to the Forlorn Hound near Skyrest Bridge entrance (start of Rescue the Hound quest)",0],["3_15_3","Buy the Forlorn Hound Bell from the Hound to call him in Umbral",0],["3_16","Talk to Andreas of Ebb",0]]},{"slug":"Pilgrims_Perch","title":"Pilgrims Perch","items":[["4_1","Talk to Thehk-Ihir",0],["4_2","Obtain the Stick",0],["4_3","Obtain the Reject's Blade",0],["4_4","Obtain the Pale Eye Shield",0],["4_5","Obtain the Bloody Hatchet",0],["4_6","Soulflay the Pilgrim's Stigma",0],["4_7","Activate the Vestige of Chabui",0],["4_8","Obtain the Bell Staff",0],["4_9","Soulflay the Follower of Adyr's Stigma",0],["4_10","Obtain the Faithful Bludgeon",0],["4_11","Obtain the Crimson Rector Sword",0],["4_12","Obtain the Skyrest Bridge Key",0],["4_13","Obtain the Crimson Rector Shield",0],["4_14","Obtain the Descrier Guide Set",0],["4_15","Obtain the Princess' Sting",0],["4_16","Talk to the Tortured Prisoner",0],["4_17","Soulflay the King's Stigma",0],["4_18","Obtain the Searing Accusation for the Tortured Prisoner",1],["4_19","Give the Searing Accusation to the Tortured Prisoner",1],["4_20","Obtain the Tortured Prisoner's Head Cage",0],["4_21","Obtain the Broken Bucket and Condemned Set",0],["4_22","Talk to the Unnamed Red Coat (Damarose the Marked)",0],["4_23","Obtain the Bloody Aspergillum for Dunmire",0],["4_24","Defeat Scourged Sister Delyth",0,1],["4_25","Obtain the Scourged Sister Flail and Scourged Sister Garb",0],["4_26","Obtain a Saintly Quintessence",0],["4_27","Obtain the Hallowed Bow",0],["4_28","Obtain the Plain Shield",0],["4_29","Obtain the Defaced Ring",0],["4_30","Obtain the Hallowed Praise",0],["4_31","Obtain the Perdam Falchion",0],["4_32","Obtain the Thorned Crimson Rector Sword",0],["4_33","Activate the Vestige of Blind Agatha",0],["4_34","Talk to the Unnamed Man in the Bellroom (Byron)",0],["4_35","Obtain the Umbral Eye of Rosamund",0],["4_36","Obtain the Antique Hallowed Sentinel Set",0],["4_37","Obtain the Hallowed Sentinel Scripture for Dunmire",0],["4_38","Obtain the Cleric's Benediction",0],["4_39","Obtain the Bowl of Revelations for Molhu",0],["4_40","Soulflay the Caged Stigma",0],["4_41","Obtain the Partisan Crossbow",0],["4_42","Obtain the Book of Sin for Dunmire",0],["4_43","Obtain the Prison Cell Key and free Gerlinde",1],["4_44","Obtain the Orian Preacher Set",0],["4_45","Obtain the Defiance Ring",0],["4_46","Talk to Damarose the Marked before the boss",1],["4_47","Defeat Gentle Gaverus, Mistress of Hounds",0,1],["4_48","Talk to Damarose again after the boss",2]]},{"slug":"Forsaken_Fen","title":"Forsaken Fen","items":[["5_1","Activate the Vestige of Olleren",0],["5_2","Give the Bloody Aspergillum, the Book of Sin, and the Hallowed Sentinel Scripture to Dunmire",0],["5_3","Give the Bowl of Revelations to Molhu",0],["5_4","Talk to Gerlinde",0],["5_5","Talk to Thehk-Ihir next to the Vestige",0],["5_6","Defeat the Congregator of Flesh",0,1],["5_7","Soulflay the Congregator's Stigma",0],["5_8","Obtain the Remembrance of the Congregator of Flesh",0],["5_9","Activate the Vestige of Valade",0],["5_10","Talk to Byron",0],["5_11","Obtain the Angel's Axe",0],["5_12","Obtain the Cursewyrm Ring",0],["5_13","Obtain the Shuja Harmony Hoop",0],["5_14","Obtain Resh-Mesah's Sword",0],["5_15","Soulflay the Lampbearer's Stigma",0],["5_16","Help the Petrified Woman (Kukajin) by using any radiant healing spell or holy throwable item that cleanses status effects",1],["5_17","Obtain the Pendant of Induration",0],["5_18","Obtain Wilmarc's Catalyst",0],["5_19","Obtain a Saintly Quintessence",0],["5_20","Talk to the Iron Wayfarer",0],["5_21","Obtain the Verdure Ring",0],["5_22","Obtain Vanguard Barros' Rosary for Dunmire",0],["5_23","Defeat the Mendacious Visage",0,1],["5_24","Obtain the Umbral Eye of the Pale Butcher",0],["5_25","Obtain the Pale Butcher's Blade",0],["5_26","Obtain the Pyric Cultist Staff",0],["5_27","Obtain the Angel of the Void Set",0],["5_28","Summon Kukajin for the boss fight",0],["5_29","Defeat the Hushed Saint",0,1],["5_30","Soulflay the Hushed Saint's Stigma",0],["5_31","Obtain the Remembrance of the Hushed Saint",0],["5_32","RADIANCE ENDING: Cleanse the Beacon",2,0,["radiance"]],["5_33","Soulflay the Stigma of a Little Friend",0],["5_34","Talk to Thehk-Ihir next to the Vestige",0],["5_35","Activate the Vestige of the Pale Butcher",0],["5_36","Talk to Dunmire",0],["5_37","Pay Kukajin's invoice",1],["5_38","Obtain the Panoptic Ring",0],["5_39","Obtain the Pendant of Burden",0]]},{"slug":"Fitzroys_Gorge","title":"Fitzroys Gorge","items":[["6_1","Obtain Piercing Light",0],["6_2","Defeat Crimson Rector Percival",0,1],["6_3","Obtain Bloodlust",0],["6_4","Talk to Damarose at the cliff edge (if she's not here, that's ok)",2],["6_5","Soulflay the Fallen Victim's Stigma",0],["6_6","Obtain the Ring of Radiant Preeminence",0],["6_7","Obtain Fitzroy's Sword",2],["6_8","Talk to Drustan",2],["6_9","Obtain the Cracked Rune Tablet for Gerlinde",0],["6_10","Obtain the Hallowed Knight Shield",0],["6_11","Defeat the Ruiner",0,1],["6_12","Obtain the Ruiner Shield and Ruiner Boots",0],["6_13","Obtain the Nohuta Ritual Hammer",0],["6_14","Activate the Vestige of Betrayed Eliard",0],["6_15","Give items to Dunmire",0],["6_16","Give the Cracked Rune Tablet to Gerlinde",0],["6_17","Talk to Damarose at the Shrine of Adyr",0],["6_18","Obtain the Crimson Ritual Fervour [Gesture]",0],["6_19","Obtain the Orian Preacher Hammer",0],["6_20","Obtain the Umbral Eye of Hooded Antuli",0],["6_21","Obtain Fitzroy's Set",0],["6_22","Soulflay the Stigma of a Tower Battle",0],["6_23","Optional: Fight the Lightreaper (Do NOT kill him here if you wish to complete Andreas, Kukajin, or Paladin Isaac's quests)",0],["6_24","Obtain a Saintly Quintessence",0],["6_25","Obtain the Ring of Night's Fire",0],["6_26","Obtain the Taxidermist's Hammer",0]]},{"slug":"Lower_Calrath","title":"Lower Calrath","items":[["7_1","Soulflay the Stigma of Isaac Kneeling",2],["7_2","Obtain the Wooden Dark Crusader Cross",0],["7_3","Activate the Vestige of Sebastian",0],["7_4","Obtain the Heavenly Vial",0],["7_5","Defeat the Infernal Enchantress",0,1],["7_6","Obtain the Infernal Enchantress Flail & Infernal Enchantress Helm",0],["7_7","Obtain the Infernal Enchantress Flesh for Damarose",0],["7_8","Obtain the Magma Ring",0],["7_9","Obtain the Pyric Cultist Flail",0],["7_10","Obtain the Grievous Ring",0],["7_11","Obtain the Poisoning Knife",0],["7_12","Obtain Rosamund's Sword",0],["7_13","Obtain the Cinder Arrows",0],["7_14","Obtain the Bow of the Convert",0],["7_15","Talk to the Iron Wayfarer",0],["7_16","Soulflay Elianne's Stigma",0],["7_17","Obtain the Odd Stone",0],["7_18","Obtain the Defiled Infantry Bow",0],["7_19","Activate the Vestige of Lydia the Numb Witch",0],["7_20","Give the Infernal Enchantress Flesh to Damarose",1],["7_21","Talk to Drustan and give him Unripe Berries",1],["7_22","Obtain Wheezing [Gesture]",0],["7_23","Obtain the Prole Set",0],["7_24","Obtain the Sword of Skin and Tooth",0],["7_25","Obtain the Scale-Breaker",0],["7_26","Soulflay the Miner's Stigma",0],["7_27","Obtain Adyr's Mark Ring",0],["7_28","Obtain an Antediluvian Chisel",0],["7_29","Obtain Tassara's Axe",0],["7_30","Obtain the Serrated Staff",0],["7_31","Obtain the Purifying Balm",0],["7_32","Obtain Ravager Gregory's Rosary for Dunmire",0],["7_33","Obtain the Split Crossbow",0],["7_34","Obtain Lava Burst",0],["7_35","Obtain a Saintly Quintessence",0],["7_36","Obtain the Fallen Lord's Sword",0],["7_37","Obtain the Ring of Nourishment",0]]},{"slug":"Upper_Calrath_A","title":"Upper Calrath A","items":[["8_1","Summon Kukajin for the boss fight",0],["8_2","Defeat the Spurned Progeny",0,1],["8_3","Obtain the Giant Eyeball for the Tortured Prisoner",0],["8_4","Obtain the Spurned Progeny Flesh for Damarose",0],["8_5","Soulflay the Spurned Progeny's Stigma",0],["8_6","Obtain the Remembrance of a Spurned Progeny",0],["8_7","Activate the Vestige of Doln",0],["8_8","Give Vanguard Barros' Rosary and Ravager Gregory's Rosary to Dunmire",0],["8_9","Pay Kukajin's invoice",1],["8_10","Give the Giant Eyeball to the Tortured Prisoner",0],["8_11","Give the Spurned Progeny Flesh to Damarose",0],["8_12","Obtain the Scornful Effigy",0],["8_13","Obtain the Old Mournstead Large Sword",0],["8_14","Obtain the Crushing Gaze",0],["8_15","Obtain the Pendant of Parting",0],["8_16","Obtain Pledge to Adyr [Gesture]",0],["8_17","Obtain a Saintly Quintessence",0],["8_18","Obtain the Old Mournstead Sword",0],["8_19","Obtain the Lump Hammer",0],["8_20","Obtain Adyr's Authority",0],["8_21","Soulflay the Leader's Stigma",0],["8_22","Obtain the Chipped Rune Tablet for Gerlinde",0],["8_23","Obtain the Overseer Set",0],["8_24","Obtain the Umbral Tome for Dunmire",0]]},{"slug":"Sunless_Skein","title":"Sunless Skein","items":[["9_1","Activate the Vestige of Hooded Antuli",0],["9_2","Give items to Dunmire",0],["9_3","Give the Chipped Rune Tablet to Gerlinde",0],["9_4","Soulflay the Stigma of a Falling Man",0],["9_5","Obtain the Devoted Chopper",0],["9_6","Obtain the Ring of the First of the Beasts",0],["9_7","Obtain Edict's Aim",0],["9_8","Obtain the Pointed Stick",0],["9_9","Obtain the Fulvirano Shield",0],["9_10","Obtain the Shield of Whispers",0],["9_11","Soulflay the Stigma of a Miner",0],["9_12","Obtain the Miner's Pendant",0],["9_13","Obtain the Mask of Wrath",0],["9_14","Activate the Vestige of Katrin",0],["9_15","Talk to Byron",0],["9_16","Obtain the Ring of Bones",0],["9_17","Obtain the Sovereign Protector Set",0],["9_18","Obtain a Saintly Quintessence",0],["9_19","Obtain Berinon's Ring",0],["9_20","Obtain the Sunless Skein Key",0]]},{"slug":"Cistern","title":"Cistern","items":[["10_1","Obtain the Nohuta Effigy",0],["10_2","Obtain the Adyr-Worshipper's Saw for Damarose",0],["10_3","Soulflay the Preacher's Stigma",0],["10_4","Obtain the Nohuta Polearm",0],["10_5","Defeat the Bringer of Silence, Bringer of Nullity, and Bringer of Stillness",0,1],["10_6","Obtain Marco's Axe",0],["10_7","Defeat the Skinstealer",0,1],["10_8","Obtain the Drainage Control Key",1],["10_9","Do NOT take the elevator after the Skinstealer until you have informed Byron of Winterberry if you wish to complete his quest. Instead, activate the Drainage Control Lever and continue into the Revelation Depths",1]]},{"slug":"Revelation_Depths","title":"Revelation Depths","items":[["11_1","Obtain the Shovel-Head",0],["11_2","Obtain the Old Mournstead Pike",0],["11_3","Obtain the Miner's Desperation",0],["11_4","Obtain the Umbral Eye of Dieter",0],["11_5","Obtain the Chipped Spear",0],["11_6","Obtain a Saintly Quintessence",0],["11_7","Obtain the Enhanced Snake Oil Grenade",0],["11_8","Obtain the Nimble Ring",0],["11_9","Obtain the Pendant of Atrophy",0],["11_10","Find Winterberry",0],["11_11","Tell Byron about Winterberry",1],["11_12","Obtain Justice",0],["11_13","Obtain Lost Berescu's Catalyst",0],["11_14","Obtain the Enhanced Short Javelin",0],["11_15","Obtain the Marksman Crossbow",0],["11_16","Obtain Death's Finger",0],["11_17","Obtain the Exacter Dagger",0],["11_18","Activate the Vestige of Lost Berescu",0],["11_19","Give the Adyr-Worshipper's Saw to Damarose",0],["11_20","Summon Kukajin for the boss fight",0],["11_21","Defeat Harrower Dervla, the Pledge Knight and the Unbroken Promise",0,1],["11_22","Obtain the Dark Crusader's Call for Dunmire",0],["11_23","Soulflay the Unbroken Promise Stigma",0],["11_24","Obtain the Remembrance of the Unbroken Promise",0]]},{"slug":"Upper_Calrath_B","title":"Upper Calrath B","items":[["12_1","NOW you can take the elevator after the Skinstealer",0],["12_2","Activate the Vestige of the Forgotten Guardian",0],["12_3","Pay Kukajin's invoice",1],["12_4","Give the Dark Crusader's Call and the Umbral Tome to Dunmire",0],["12_5","Obtain the Blacksmith's Pride",0],["12_6","Obtain Queen Verena II's Ring",0],["12_7","Soulflay the Imprisoned Stigma",0],["12_8","RADIANCE ENDING: Cleanse the Beacon",2,0,["radiance"]],["12_9","Soulflay the Fighter's Stigma",0],["12_10","Soulflay the Stigma of a Robbery",0],["12_11","Obtain the Calrath Guardsman Set",0],["12_12","Obtain the Noblewoman Set (required for the Tortured Prisoner's quest)",1],["12_13","Soulflay the Stigma of an Alley Fight",0],["12_14","Talk to the Iron Wayfarer next to the Stigma",0],["12_15","Soulflay the Bargainer's Stigma",0],["12_16","Obtain the Melted Dark Crusader Sword",0],["12_17","Obtain the Moth Ring",0],["12_18","Soulflay the Stigma of the Rune of Adyr (beyond the Umbral gate)",0],["12_19","Talk to the Iron Wayfarer again next to the Stigma (you might need to rest to get him to show up beyond the Umbral gate)",0],["12_20","Obtain the Fief Key at Skyrest",0],["12_21","Talk to Byron and Winterberry at Skyrest",0],["12_22","Equip the Noblewoman Set and talk to the Tortured Prisoner in the Spurned Progeny arena",2]]},{"slug":"Fief_of_the_Chill_Curse","title":"Fief of the Chill Curse","items":[["13_1","Use Fief Key to open the Bell Door by the Vestige of Marco the Axe",0],["13_2","Obtain Splitting Axe",0],["13_3","Defeat Kinrangr Guardian Folard Boss",0,1],["13_4","Obtain an Antediluvian Chisel",0],["13_5","Activate the Vestige of Svornil",0],["13_6","Soulflay the Stigma of Isaac Kneeling",2],["13_7","Soulflay Yorke's Stigma",0],["13_8","Defeat Griefbound Rowena",0,1],["13_9","Obtain a Saintly Quintessence",0],["13_10","Obtain Udirangr Shaman Bow",0],["13_11","Obtain Sunken Beseecher",0],["13_12","Obtain Kinrangr Rebel's Hammer",0],["13_13","Obtain Halting Gesture",0],["13_14","Talk to Drustan and light the fire",1],["13_15","Obtain Pestilent Blade",0],["13_16","Obtain Glacier Ring",0],["13_17","Obtain Ancestor's Sword",0],["13_18","Obtain Putrid Child Sword",0],["13_19","Obtain Putrid Polearm",0],["13_20","Obtain Bow of the Mutilated",0],["13_21","Soulflay the Healer's Stigma",0],["13_22","Obtain J'deyl Set",0],["13_23","Activate the Vestige of Loash",0],["13_24","Talk to Thehk-Ihir",0],["13_25","Summon Kukajin for the boss fight",0],["13_26","Defeat the Hollow Crow",0,1],["13_27","Soulflay the Hollow Crow's Stigma",0],["13_28","Obtain the Remembrance of the Hollow Crow",0],["13_29","RADIANCE ENDING: Cleanse the Beacon",2,0,["radiance"]],["13_30","Obtain Kinrangr Leader's Axe",0],["13_31","Optional: Fight the Lightreaper (Do NOT kill him here if you wish to complete Andreas, Kukajin, or Paladin Isaac's quests)",0],["13_32","Obtain Yorke's Ring",0],["13_33","Obtain the Beast Axe",0],["13_34","Obtain a Saintly Quintessence",0],["13_35","Soulflay the Dying Man's Stigma",0],["13_36","Pay Kukajin's invoice",1],["13_37","Talk to Andreas",0],["13_38","Soulflay the Stigma of Andreas of Ebb",2],["13_39","Obtain Andreas of Ebb's Book of Lineage and return it to him",1]]},{"slug":"Pilgrims_Perch_Belled_Rise","title":"Pilgrims Perch Belled Rise","items":[["14_1","Obtain the Pilgrim's Perch Key",0],["14_2","Obtain Devotion's Might",0],["14_3","Obtain the Brawn Ring",0],["14_4","Obtain the Hammer of Holy Agony",0],["14_5","Obtain the Umbral Eye of Iorelo the Cursed Knight",0],["14_6","Obtain Bloody Glory",0],["14_7","Defeat the Sacred Resonance of Tenacity",0,1],["14_8","Complete the Path of Devotion before continuing past the Secred Resonance of Tenacity boss fight (just for convenience)",0],["14_9","Obtain Bloodletter",0],["14_10","Obtain the Slinger's Ring",0],["14_11","Obtain the Cleric's Benediction",0],["14_12","Obtain the Hallowed Sentinel Scripture for Dunmire (if missed before)",0]]},{"slug":"Path_of_Devotion","title":"Path of Devotion","items":[["15_1","Activate the Vestige of Dieter",0],["15_2","Talk to Thehk-Ihir",0],["15_3","Obtain the Dark Crusader's Convalescence",1],["15_4","Obtain the Anvil Hammer",0],["15_5","Soulflay Isaac's Stigma",0],["15_6","Obtain Diminishing Missile",0],["15_7","Obtain a Saintly Quintessence",0],["15_8","Obtain the Hungering Knot",0],["15_9","Soulflay the Paladin's Stigma",2],["15_10","Defeat the Paladin's Burden",0,1],["15_11","Obtain the Umbral-Tinged Flayed Skin",0],["15_12","Obtain the Umbral Eye of Loash",0],["15_13","Obtain the Pureblade Mace and Pureblade Shield",0]]},{"slug":"Manse_of_the_Hallowed_Brothers","title":"Manse of the Hallowed Brothers","items":[["16_1","Activate the Vestige of Ferrers the Charred",0],["16_2","Return to where you got the Flayed Skin in Defiled Sepulcher and interact with the Umbral door to get the Paladin set",0],["16_3","Talk to the Iron Wayfarer",0],["16_4","Obtain the Cursed Set",0],["16_5","Obtain the Lucent Sword Ring",0],["16_6","Obtain the Manse Kitchen Key",0],["16_7","Activate the Vestige of Brother Jeremiah",0],["16_8","Talk to Thehk-Ihir",0],["16_9","Obtain Duty's Chime",0],["16_10","Soulflay the Stigma of a Meeting",0],["16_11","Obtain an Antediluvian Chisel",0],["16_12","Obtain the Trinity Shield",0],["16_13","Soulflay the Rector's Stigma",0],["16_14","Obtain the Damaged Standard for Stomund",1],["16_15","Soulflay the Sentinel's Stigma",0],["16_16","Soulflay Byron's Stigma",0],["16_17","Defeat the Abiding Defenders",0,1],["16_18","Obtain the Flail of Wisdom",0],["16_19","Obtain the Ring of Shelter",0],["16_20","Obtain Abbot Vernoff's Key",0],["16_21","Obtain a Saintly Quintessence",0],["16_22","Soulflay the Stigma of Pieta's Lady",2]]},{"slug":"Tower_of_Penance","title":"Tower of Penance","items":[["17_1","Defeat Blessed Carrion Knight Sanisho",0,1],["17_2","Obtain the Braided Ring",0],["17_3","Obtain Jeffrey's Dagger",0],["17_4","Soulflay the Prisoner's Stigma",0],["17_5","Obtain the Perception Wisp for Dunmire",0],["17_6","Obtain the final Rune Tablet for Gerlinde",0],["17_7","Obtain Infernal Guardian",0],["17_8","Obtain the Bramble Ring",0],["17_9","Obtain Pious",0],["17_10","Obtain the Assassin's Bow",0],["17_11","Obtain a Saintly Quintessence",0],["17_12","Soulflay the Tortured Lovers' Stigma",0],["17_13","Summon Kukajin for the boss fight",0],["17_14","Defeat Tancred, Master of Castigations & Reinhold the Immured",0,1],["17_15","Soulflay the Stigma of Tacred",0],["17_16","Obtain the Remembrance of Tancred, Master of Castigations & Reinhold the Immured",0],["17_17","Obtain Tancred's Key",0],["17_18","Obtain the Radiant Purifier Set",0],["17_19","RADIANCE ENDING: Cleanse the Beacon",2,0,["radiance"]],["17_20","Pay Kukajin's invoice",1],["17_21","Turn in the final Rune Tablet: Give the final Rune Tablet to Sparky to release him for the achievement and make Gerlinde leave",1],["17_21_2","Give the final Rune Tablet to Gerlinde to kill Sparky and upgrade Gerlinde's shop",0],["17_22","UMBRAL ENDING: Buy the Scouring Clump from Molhu",0],["17_23","Buy everything from Dunmire before giving him the Perception Wisp",1],["17_24","Give the Perception Wisp to Dunmire (buy anything you want from him first as he will leave after this)",0],["17_25","Talk to Dunmire at the Sunless Skein",0],["17_26","UMBRAL ENDING: Use the Scouring Clump at the alter at the end of the Revelation Depths to access the Mother's Lull",0],["17_27","Talk to Dunmire inside the Mother\u2019s Lull",0],["17_28","UMBRAL ENDING: Get Damarose's Seedpod from the NPC in Mother\u2019s Lull and use it on Damarose (NOTE: this will kill her)",0]]},{"slug":"Abbey_of_the_Hallowed_Sisters","title":"Abbey of the Hallowed Sisters","items":[["18_1","Talk to Stomund on the path from the Manse to the Abbey",0],["18_2","Soulflay the Stigma of the Hallowed Sentinels",0],["18_3","Defeat Abbess Ursula",0,1],["18_4","Obtain the Abbess Staff",0],["18_5","Obtain the Weeping Abbess Mitre",0],["18_6","Obtain the Enhanced Accusing Spirit",0],["18_7","Activate the Vestige of Rosamund",0],["18_8","Talk to Thehk-Ihir",0],["18_9","Soulflay the Stigma of the Reborn",0],["18_10","Obtain the Hallowed Sentinel Prayer [Gesture]",0],["18_11","Obtain the Putrid Child Set",0],["18_12","Talk to Stomund upstairs",0],["18_13","Obtain the Heretical Sentinel's Hammer",0],["18_14","Obtain the Unbridled Focus",0],["18_15","Obtain Consecrate",0],["18_16","Obtain The Toll",0],["18_17","Obtain the Enhanced Poison Javelin",0],["18_18","Obtain the Multi-Shot Crossbow",0],["18_19","Obtain the Impious Nohuta's Ring",0],["18_20","Obtain the Umbral Eye of Blind Agatha",0],["18_21","Get the Tattered Banner from one of the non-boss Abbess",1],["18_22","Give Stomund the Damaged Standard and the Tattered Banner",1],["18_23","Defeat the Rapturous Huntress of the Dusk (the Iron Wayfarer will join the fight if you've been following his questline, and he'll steal the Rune of Adyr. Otherwise, you'll get it after the boss fight.)",0,1],["18_24","Obtain the Sanctified Huntress Spear",0],["18_25","Obtain the Rapturous Huntress Helm",0],["18_26","Obtain a Saintly Quintessence",0],["18_27","Obtain Lacerating Weapon",0],["18_28","Obtain the Shield of Piercing Light",0],["18_29","Soulflay the Stigma of Pieta's Request",2]]},{"slug":"The_Empyrean","title":"The Empyrean","items":[["19_1","Obtain Saint Salonor's Ring",0],["19_2","Activate the Vestige of Iorelo the Cursed Knight",0],["19_3","Soulflay the Prayer's Stigma",2],["19_4","Find Stomund\u2019s impaled body and get his gear",2],["19_4_2","Iselle (Inside the Cleric's Mind): Enter Judge Cleric's Mind via the body at the Empyrean beacon, complete the dungeon for rewards",0],["19_5","Obtain the Enhanced Banner Javelin of Assault",0],["19_6","Obtain the Bountiful Ring",0],["19_7","Obtain the Umbral Eye of Doln",0],["19_8","Soulflay the Stigma of the Judge's Protection",0],["19_9","Find Thehk-Ihir's body and get his gear after opening the church gates",0],["19_10","Obtain the Shield of the Moonlit Emissary",0],["19_11","Obtain the Putrid Child Catalyst",0],["19_12","Obtain a Saintly Quintessence",0],["19_13","Obtain the Empyrean Church Key",0],["19_14","Obtain the Lucent Sword Shield",0],["19_15","Obtain the Thorned Chalice",0],["19_16","Summon Kukajin for the boss fight",0],["19_17","Defeat Judge Cleric, the Radiant Sentinel",0,1],["19_18","Soulflay Judge Cleric's Stigma",0],["19_19","Obtain the Remembrance of Judge Cleric, the Radiant Sentinel",0],["19_20","RADIANCE ENDING: Cleanse the Beacon",2,0,["radiance"]],["19_21","Obtain the Enhanced Holy Grenade",0],["19_22","Pay Kukajin's invoice",1]]},{"slug":"Path_to_Bramis_Castle","title":"Path to Bramis Castle","items":[["20_1","Soulflay the Stigma of a Battle near the Skyrest Bridge shortcut to Upper Calrath",0],["20_2","Summon help for the boss fight: Summon Andreas for the boss fight to continue his quest (it seems you can summon him and die to the boss and still progress his quest)",2],["20_2_2","Summon Paladin Isaac's for the boss fight to complete his quest",2],["20_2_3","Summon Kukajin for the boss fight to continue her quest",2],["20_3","Defeat the Lightreaper",0,1],["20_4","Obtain the Lightreaper Flesh for Damarose",0],["20_5","Obtain the Lightreaper's Umbral Parasite",0],["20_6","Soulflay the Lightreaper's Stigma",0],["20_7","Obtain the Remembrance of the Lightreaper",0],["20_8","Defeat Andreas of Ebb in the alley after the boss fight",0,1],["20_9","Obtain Andreas of Ebb's Sword, Andreas of Ebb's Book of Lineage, Andreas of Ebb's Ring, & Andreas of Ebb's Sleeves",0],["20_10","Defeat the Iron Wayfarer in front of the gates to Bramis Castle",0,1],["20_10_2","Find Drustan in the derelict tower along the Path to Bramis Castle (3rd of 3 meetings, complete the Brothers of Mournstead quest)",2],["20_11","Obtain the Rune of Adyr",0],["20_12","UMBRAL ENDING: DO NOT OPEN THE CASTLE GATE WITH THE NORMAL RUNE",1],["20_13","UMBRAL ENDING: Use the Lightreaper\u2019s Umbral Parasite on the column next to Molhu",0],["20_14","UMBRAL ENDING: Get Gerlinde's Seedpod from the NPC in Mother\u2019s Lull and use it on Gerlinde (NOTE: this will kill her)",0],["20_15","UMBRAL ENDING: Give the Rune of Adyr to the NPC in Mother's Lull to get the Withered Rune of Adyr and Melchior's Seedpod",0],["20_16","Give the Infernal Enchantress Flesh, the Spurned Progeny Flesh, and the Lightreaper Flesh to Damarose (if she's still alive)",0],["20_17","Pay Kukajin's invoice (if you summoned her for the Lightreaper boss fight)",1]]},{"slug":"Bramis_Castle","title":"Bramis Castle","items":[["21_1","Get the Executioner's Axe",0],["21_2","Continue Damarose's quest: Talk to Damarose at the entrance and buy everything",0],["21_2_2","OR Defeat Damarose the Marked (if you've been cleansing the beacons)",0,1],["21_3","Obtain a Saintly Quintessence",0],["21_4","Soulflay Bramis' Stigma",0],["21_5","Obtain Sellsword",0],["21_6","Soulflay Drustan's Stigma",0],["21_7","Obtain Drustan's Set",0],["21_8","Obtain Infernal Slash",0],["21_9","Soulflay the Stigma of Escape",0],["21_10","Obtain Charred Letter",1],["21_11","Obtain Grinning Axe",0],["21_12","Obtain Lord Axe",0],["21_13","Obtain Ring of Infernal Devotion",0],["21_14","Activate the Vestige of the Bloody Pilgrim",1],["21_15","Give the Charred Letter to the Tortured Prisoner (be sure to do this BEFORE killing the Sundered Monarch to make her move to Bramis Castle)",2],["21_16","Buy everythng from the Tortured Prisoner",1],["21_17","Obtain Paladin's Pendant",0],["21_18","Obtain the Eviscerating Spear",0],["21_19","Obtain Lord Set",0],["21_20","Obtain the Royal Key",0],["21_21","Obtain a Saintly Quintessence",0],["21_22","Soulflay the Stigma of Bramis and Fitzroy",0],["21_23","Obtain the Pendant of Infernal Oblation",0],["21_24","Obtain a Saintly Quintessence",0],["21_25","Obtain the Grace of Adyr Set",0],["21_26","Obtain the Swaddling Cloth",1],["21_27","Give the Swaddling Cloth to the Tortured Prisoner before killing the Sundered Monarch (WARNING: this is located quite close to the boss and must be delivered before killing the boss)",2],["21_28","Obtain Lord Mask",0],["21_29","Obtain Bartholomew's Hammer",0],["21_30","Obtain Umbral Eye of Lydia the Numb Witch",0],["21_31","Summon Kukajin for the boss fight",0],["21_32","Defeat the Sundered Monarch",0,1],["21_33","Soulflay the Stigma of the Sundered Monarch",0],["21_34","Obtain the Remembrance of the Sundered Monarch",0],["21_35","Get Damarose\u2019s stuff at the throne room",0],["21_36","Soulflay Melchior's Stigma to complete Drustan's quest",0],["21_37","Talk to the Tortured Prisoner at the boss arena after",0],["21_38","Get the Tortured Prisoner's stuff next to the Vestige of the Bloody Pilgrim (where she was before)",0],["21_39","Pay Kukajin's invoice",1],["21_40","Get Kukajin\u2019s stuff from where she was in Skyrest to complete her quest",0]]},{"slug":"Radiance_Ending","title":"Radiance Ending","items":[["22_1","Interact with the Effigy of Adyr after the Sundered Monarch to enter the Rhogar realm",0],["22_2","Confront and defeat Adyr, the Bereft Exile to trigger the ending",0,1]],"ending":"radiance"},{"slug":"Inferno_Ending","title":"Inferno Ending","items":[["23_1","You need to have NOT cleansed any of the beacons yet in order to get this ending",0],["23_2","Interact with the Effigy of Adyr after the Sundered Monarch to get the Empowered Rune of Adyr",0],["23_3","Use the Empowered Rune of Adyr on all 5 beacons: Forsaken Fen",0],["23_3_2","Upper Calrath",0],["23_3_3","Fief of the Chill Curse",0],["23_3_4","Tower of Penance",0],["23_3_5","The Empyrean",0],["23_4","Interact with the body of the Judge Cleric by the Empyrean beacon and choose to enter her mind",0],["23_5","Use the Empowered Rune of Adyr on Iselle to trigger the ending",0]],"ending":"inferno"},{"slug":"Umbral_Ending","title":"Umbral Ending","items":[["24_1","Use Melchior\u2019s Seedpod on the body after the Sundered Monarch fight",0],["24_2","Use the withered rune on the Iron Wayfarer in the Umbral in Fief",0],["24_3","Use Harkin's Umbral Parasite on the column next to Molhu",0],["24_4","Talk to Molhu",0],["24_5","Talk to Pieta and Soulflay her (NOTE: this will kill her and trigger a boss fight)",1,1],["24_6","Defeat Elianne the Starved",0,1],["24_7","Obtain Elianne's Umbral Parasite",0],["24_8","Soulflay the Stigma of Elianne the Starved",0],["24_9","Obtain the Remembrance of Elianne the Starved",0],["24_10","Use Elianne's Umbral Parasite on the column next to Molhu",0],["24_11","Speak with Molhu (select Do Nothing to buy his stuff first)",0],["24_12","Pull yourself with Soulflay along the way inside the Mother's Lull and reach the end to trigger the ending",0]],"ending":"umbral"},{"slug":"Preparing_for_NG_Plus","title":"Preparing for NG Plus","items":[["25_1","Soulflay the Lightreaper Stigmas that appeared after defeating him (in each of the arenas where you can have an optional encounter with him): In the Defiled Sepulchre, where you first encountered him",0,1],["25_1_2","In Lower Calrath, before the Vestige of Sebastian",0],["25_1_3","In the Fief of the Chill Curse, after the Hollow Crow's boss room",0],["25_2","RADIANCE ENDING: Soulflay Adyr's Stigma at the Shrine of Adyr",0],["25_3","Buy all of the Remembrance items from Molhu (especially for the Remembrance of Adyr and the Remembrance of Elianne the Starved since the Remembrances don't carry over to NG+)",0]]}];

// Checklist categories. Each item: [id, text, flags?]
// flags bitmask: 1=missable, 2=patch-2.5+ added
const CHECKLISTS = [{"id":"Weapons","title":"Weapons","items":[["1_1","Axe of the Flayed",0,"Axe+of+the+Flayed"],["1_2","Beast Axe",0,"Beast+Axe"],["1_3","Blackfeather Ranger Axe",0,"Blackfeather+Ranger+Axe"],["1_4","Byron's Shovel",0,"Byron's+Shovel"],["1_5","Fungus-Encrusted Pickaxe",0,"Fungus-Encrusted+Pickaxe"],["1_6","Grinning Axe",0,"Grinning+Axe"],["1_7","Kinrangr Leader's Axe",0,"Kinrangr+Leader's+Axe"],["1_8","Pickaxe",0,"Pickaxe"],["1_9","Purger Axe",0,"Purger+Axe"],["1_10","Raw Mangler Axe",0,"Raw+Mangler+Axe"],["1_11","Skinstealer Cleaver",0,"Skinstealer+Cleaver"],["1_12","Splitting Axe",0,"Splitting+Axe"],["1_13","Wooden Cross",0,"Wooden+Cross"],["1_14","Assassin's Bow",0,"Assassin's+Bow"],["1_15","Blackfeather Ranger Bow",0,"Blackfeather+Ranger+Bow"],["1_16","Bow of the Convert",0,"Bow+of+the+Convert"],["1_17","Bow of the Mutilated",0,"Bow+of+the+Mutilated"],["1_18","Defiled Infantry Bow",0,"Defiled+Infantry+Bow"],["1_19","Fungal Bowman Bow",0,"Fungal+Bowman+Bow"],["1_20","Hallowed Bow",0,"Hallowed+Bow"],["1_21","Kinrangr Hunter Bow",0,"Kinrangr+Hunter+Bow"],["1_22","Sin-Piercer Bow",0,"Sin-Piercer+Bow"],["1_23","Udirangr Shaman Bow",0,"Udirangr+Shaman+Bow"],["1_24","Abbess Chalice",0,"Abbess+Chalice"],["1_25","Agony's Light",0,"Agony's+Light"],["1_26","Charm of Fortune's Sight",0,"Charm+of+Fortune's+Sight"],["1_27","Exacter Scripture",0,"Exacter+Scripture"],["1_28","Hungering Knot",0,"Hungering+Knot"],["1_29","Lord Catalyst",0,"Lord+Catalyst"],["1_30","Lost Berescu's Catalyst",0,"Lost+Berescu's+Catalyst"],["1_31","Miranda's Touch",0,"Miranda's+Touch"],["1_32","Nohuta Effigy",0,"Nohuta+Effigy"],["1_33","Orian Preacher Catalyst",0,"Orian+Preacher+Catalyst"],["1_34","Putrid Child Catalyst",0,"Putrid+Child+Catalyst"],["1_35","Pyric Cultist Catalyst",0,"Pyric+Cultist+Catalyst"],["1_36","Queen Sophesia's Catalyst",0,"Queen+Sophesia's+Catalyst"],["1_37","Radiant Purifier Catalyst",0,"Radiant+Purifier+Catalyst"],["1_38","Rhogar Heart",0,"Rhogar+Heart"],["1_39","Searing Accusation",0,"Searing+Accusation"],["1_40","Sunken Beseecher",0,"Sunken+Beseecher"],["1_41","Wilmarc's Catalyst",0,"Wilmarc's+Catalyst"],["1_42","Death's Finger",0,"Death's+Finger"],["1_43","Edict's Aim",0,"Edict's+Aim"],["1_44","Harrower Dervla's Crossbow",0,"Harrower+Dervla's+Crossbow"],["1_45","Marksman Crossbow",0,"Marksman+Crossbow"],["1_46","Multi-Shot Crossbow",0,"Multi-Shot+Crossbow"],["1_47","Partisan Crossbow",0,"Partisan+Crossbow"],["1_48","Split Crossbow",0,"Split+Crossbow"],["1_49","Trapper Crossbow",0,"Trapper+Crossbow"],["1_50","Broken Sword",0,"Broken+Sword"],["1_51","Exacter Dagger",0,"Exacter+Dagger"],["1_52","Exiled Stalker Dagger",0,"Exiled+Stalker+Dagger"],["1_53","Fungal Bowman Dagger",0,"Fungal+Bowman+Dagger"],["1_54","Jeffrey's Dagger",0,"Jeffrey's+Dagger"],["1_55","Kinrangr Hunter Dagger",0,"Kinrangr+Hunter+Dagger"],["1_56","Left-hand Lightreaper Dagger",0,"Left-hand+Lightreaper+Dagger"],["1_57","Right-hand Lightreaper Dagger",0,"Right-hand+Lightreaper+Dagger"],["1_58","Neophyte Dagger",0,"Neophyte+Dagger"],["1_59","Skinstealer Knife",0,"Skinstealer+Knife"],["1_60","Bloodletter",0,"Bloodletter"],["1_61","Broken Bucket",0,"Broken+Bucket"],["1_62","Empowering Claw",0,"Empowering+Claw"],["1_63","Final Whisper",0,"Final+Whisper"],["1_64","Fist of Insight",0,"Fist+of+Insight"],["1_65","Lord's Bite",0,"Lord's+Bite"],["1_66","Reject's Blade",0,"Reject's+Blade"],["1_67","Shovel-Head",0,"Shovel-Head"],["1_68","Talon",0,"Talon"],["1_69","Horned Skull",2,"Horned+Skull"],["1_217","Gilded Bucket",2,"Gilded+Bucket"],["1_70","Blacksmith's Pride",0,"Blacksmith's+Pride"],["1_71","Flail of Holy Agony",0,"Flail+of+Holy+Agony"],["1_72","Flail of Wisdom",0,"Flail+of+Wisdom"],["1_73","Infernal Enchantress Flail",0,"Infernal+Enchantress+Flail"],["1_74","Partisan Flail",0,"Partisan+Flail"],["1_75","Pyric Cultist Flail",0,"Pyric+Cultist+Flail"],["1_76","Scourged Sister Flail",0,"Scourged+Sister+Flail"],["1_77","Stomund's Flail",0,"Stomund's+Flail"],["1_78","Flickering Flail",0,"Flickering+Flail"],["1_79","Angel's Axe",0,"Angel's+Axe"],["1_80","Damarose's Cleaver",0,"Damarose's+Cleaver"],["1_81","Executioner's Axe",0,"Executioner's+Axe"],["1_82","Kinrangr Guardian Axe",0,"Kinrangr+Guardian+Axe"],["1_83","Lord Axe",0,"Lord+Axe"],["1_84","Marco's Axe",0,"Marco's+Axe"],["1_85","Ruiner Axe",0,"Ruiner+Axe"],["1_86","Tassara's Axe",0,"Tassara's+Axe"],["1_87","The Toll",0,"The+Toll"],["1_88","Tundra Axe",0,"Tundra+Axe"],["1_89","Anvil Hammer",0,"Anvil+Hammer"],["1_90","Crushing Gaze",0,"Crushing+Gaze"],["1_91","Devotion's Might",0,"Devotion's+Might"],["1_92","Faithful Bludgeon",0,"Faithful+Bludgeon"],["1_93","Holy Bulwark Mace",0,"Holy+Bulwark+Mace"],["1_94","Nohuta Ritual Hammer",0,"Nohuta+Ritual+Hammer"],["1_95","Queen's Head Hammer",0,"Queen's+Head+Hammer"],["1_96","Righteous Pulveriser",0,"Righteous+Pulveriser"],["1_97","Sacred Resonance Hammer",0,"Sacred+Resonance+Hammer"],["1_98","Scale-Breaker",0,"Scale-Breaker"],["1_99","Taxidermist's Hammer",0,"Taxidermist's+Hammer"],["1_100","The Iron Wayfarer's Hammer",0,"The+Iron+Wayfarer's+Hammer"],["1_101","Ancestor's Sword",0,"Ancestor's+Sword"],["1_102","Bloody Glory",0,"Bloody+Glory"],["1_103","Ebonlight Abiding Defender Sword",0,"Ebonlight+Abiding+Defender+Sword"],["1_104","Fallen Lord's Sword",0,"Fallen+Lord's+Sword"],["1_105","Harrower Dervla's Sword",0,"Harrower+Dervla's+Sword"],["1_106","Justice",0,"Justice"],["1_107","Luminous Abiding Defender Sword",0,"Luminous+Abiding+Defender+Sword"],["1_108","Pale Butcher's Blade",0,"Pale+Butcher's+Blade"],["1_109","Ravager Gregory's Sword",0,"Ravager+Gregory's+Sword"],["1_110","Resh-Mesah's Sword",0,"Resh-Mesah's+Sword"],["1_111","Sword of Skin and Tooth",0,"Sword+of+Skin+and+Tooth"],["1_112","Sword of the Flayed",0,"Sword+of+the+Flayed"],["1_113","Crimson Rector Sword",0,"Crimson+Rector+Sword"],["1_114","Fitzroy's Sword",0,"Fitzroy's+Sword"],["1_115","Judge Cleric's Corrupted Sword",0,"Judge+Cleric's+Corrupted+Sword"],["1_116","Judge Cleric's Radiant Sword",0,"Judge+Cleric's+Radiant+Sword"],["1_117","Old Mournstead Large Sword",0,"Old+Mournstead+Large+Sword"],["1_118","Paladin Isaac's Sword",0,"Paladin+Isaac's+Sword"],["1_119","Proselyte Sword",0,"Proselyte+Sword"],["1_120","Rosamund's Sword",0,"Rosamund's+Sword"],["1_121","The Red Hand",0,"The+Red+Hand"],["1_122","Thorned Crimson Rector Sword",0,"Thorned+Crimson+Rector+Sword"],["1_123","Udirangr Warwolf Sword",0,"Udirangr+Warwolf+Sword"],["1_124","Vanguard Barros' Sword",0,"Vanguard+Barros'+Sword"],["1_125","Avowed Mace",0,"Avowed+Mace"],["1_126","Bartholomew's Hammer",0,"Bartholomew's+Hammer"],["1_127","Drustan's Hammer",0,"Drustan's+Hammer"],["1_128","Exacter Dunmire's Cane",0,"Exacter+Dunmire's+Cane"],["1_129","Gerlinde's Hammer",0,"Gerlinde's+Hammer"],["1_130","Hammer of Holy Agony",0,"Hammer+of+Holy+Agony"],["1_131","Heretical Sentinel's Hammer",0,"Heretical+Sentinel's+Hammer"],["1_132","Kinrangr Rebel's Hammer",0,"Kinrangr+Rebel's+Hammer"],["1_133","Orian Preacher Hammer",0,"Orian+Preacher+Hammer"],["1_134","Precision Hammer",0,"Precision+Hammer"],["1_135","Pureblade Mace",0,"Pureblade+Mace"],["1_136","Stick",0,"Stick"],["1_137","Punishment",2,"Punishment"],["1_138","Judgement",2,"Judgement"],["1_139","Abbess Staff",0,"Abbess+Staff"],["1_140","Carrion Knight Staff",0,"Carrion+Knight+Staff"],["1_141","Conflagrant Seer Staff",0,"Conflagrant+Seer+Staff"],["1_142","Duty's Chime",0,"Duty's+Chime"],["1_143","Hushed Saint's Halberd",0,"Hushed+Saint's+Halberd"],["1_144","Nohuta Polearm",0,"Nohuta+Polearm"],["1_145","Old Mournstead Pike",0,"Old+Mournstead+Pike"],["1_146","Overseer's Halberd",0,"Overseer's+Halberd"],["1_147","Putrid Polearm",0,"Putrid+Polearm"],["1_148","Pyric Cultist Staff",0,"Pyric+Cultist+Staff"],["1_149","Radiant Purifier Polearm",0,"Radiant+Purifier+Polearm"],["1_150","Rhogar's Reach",0,"Rhogar's+Reach"],["1_151","Serrated Staff",0,"Serrated+Staff"],["1_152","Tancred's Mancatcher",0,"Tancred's+Mancatcher"],["1_153","Andreas of Ebb's Sword",0,"Andreas+of+Ebb's+Sword"],["1_154","Bloodlust",0,"Bloodlust"],["1_155","Left-hand Bringer of Stillness Sword",0,"Left-hand+Bringer+of+Stillness+Sword"],["1_156","Right-hand Bringer of Stillness Sword",0,"Right-hand+Bringer+of+Stillness+Sword"],["1_157","Devoted Chopper",0,"Devoted+Chopper"],["1_158","Elianne the Starved's Sword",0,"Elianne+the+Starved's+Sword"],["1_159","Hallowed Condemnation",0,"Hallowed+Condemnation"],["1_160","Hallowed Knight Sword",0,"Hallowed+Knight+Sword"],["1_161","Hallowed Praise",0,"Hallowed+Praise"],["1_162","Kukajin's Sword",0,"Kukajin's+Sword"],["1_163","Melted Dark Crusader Sword",0,"Melted+Dark+Crusader+Sword"],["1_164","Old Mournstead Sword",0,"Old+Mournstead+Sword"],["1_165","Perdam Falchion",0,"Perdam+Falchion"],["1_166","Pieta's Sword",0,"Pieta's+Sword"],["1_167","Putrid Child Sword",0,"Putrid+Child+Sword"],["1_168","Left-hand Lightreaper Sword",0,"Left-hand+Lightreaper+Sword"],["1_169","Right-hand Lightreaper Sword",0,"Right-hand+Lightreaper+Sword"],["1_170","Rusty Cutter",0,"Rusty+Cutter"],["1_171","Sin-Piercer Sword",0,"Sin-Piercer+Sword"],["1_172","Bell Staff",0,"Bell+Staff"],["1_173","Chipped Spear",0,"Chipped+Spear"],["1_174","Eviscerating Spear",0,"Eviscerating+Spear"],["1_175","Judge Cleric's Spear",0,"Judge+Cleric's+Spear"],["1_176","Lightreaper's Spear",0,"Lightreaper's+Spear"],["1_177","Mournstead Infantry Spear",0,"Mournstead+Infantry+Spear"],["1_178","Old Mournstead Spear",0,"Old+Mournstead+Spear"],["1_179","Pointed Stick",0,"Pointed+Stick"],["1_180","Saint Latimer's Relic Spear",0,"Saint+Latimer's+Relic+Spear"],["1_181","Sanctified Huntress Spear",0,"Sanctified+Huntress+Spear"],["1_182","Shuja Warrior Spear",0,"Shuja+Warrior+Spear"],["1_183","Skinstealer Spear",0,"Skinstealer+Spear"],["1_184","Veil-Piercer",0,"Veil-Piercer"],["1_185","Blackfeather Ranger Shield",0,"Blackfeather+Ranger+Shield"],["1_186","Boar's Head Shield",0,"Boar's+Head+Shield"],["1_187","Envenomed Sheild",0,"Envenomed+Shield"],["1_188","Lightreaper's Shield",0,"Lightreaper's+Shield"],["1_189","Mournstead Infantry Shield",0,"Mournstead+Infantry+Shield"],["1_190","Orian Preacher Shield",0,"Orian+Preacher+Shield"],["1_191","Pureblade Shield",0,"Pureblade+Shield"],["1_192","Sanctified Huntress Shield",0,"Sanctified+Huntress+Shield"],["1_193","Shield of Thunder",0,"Shield+of+Thunder"],["1_194","Skinstealer Shield",0,"Skinstealer+Shield"],["1_195","Crimson Rector Shield",0,"Crimson+Rector+Shield"],["1_196","Hallowed Knight Shield",0,"Hallowed+Knight+Shield"],["1_197","Lucent Sword Shield",0,"Lucent+Sword+Shield"],["1_198","Pale Eye Shield",0,"Pale+Eye+Shield"],["1_199","Partisan Shield",0,"Partisan+Shield"],["1_200","Plain Shield",0,"Plain+Shield"],["1_201","Shield of the First of the Beasts",0,"Shield+of+the+First+of+the+Beasts"],["1_202","Trinity Shield",0,"Trinity+Shield"],["1_203","Shield of the Moonlit Emissary",0,"Shield+of+the+Moonlit+Emissary"],["1_204","Stomund's Shield",0,"Stomund's+Shield"],["1_205","Angel's Aegis",0,"Angel's+Aegis"],["1_206","Church of Orian Radiance Greatshield",0,"Church+of+Orian+Radiance+Greatshield"],["1_207","Fulvirano Shield",0,"Fulvirano+Shield"],["1_208","Garish Display",0,"Garish+Display"],["1_209","Heavy Memento",0,"Heavy+Memento"],["1_210","Miner's Desperation",0,"Miner's+Desperation"],["1_211","Ravager Greatshield",0,"Ravager+Greatshield"],["1_212","Ruiner Shield",0,"Ruiner+Shield"],["1_213","Shield of the Hushed Saint",0,"Shield+of+the+Hushed+Saint"],["1_214","Shield of Whispers",0,"Shield+of+Whispers"],["1_215","Tancred's Shield",0,"Tancred's+Shield"],["1_216","Shield of Piercing Light",0,"Shield+of+Piercing+Light"]]},{"id":"Armor","title":"Armor","items":[["2_1","Abbess Mitre",0,"Abbess+Mitre"],["2_2","Abiding Defender Helm",0,"Abiding+Defender+Helm"],["2_3","Abiding Defender Masked Helm",0,"Abiding+Defender+Masked+Helm"],["2_4","Angel of the Void Mask",0,"Angel+of+the+Void+Mask"],["2_5","Antique Hallowed Sentinel Helm",0,"Antique+Hallowed+Sentinel+Helm"],["2_6","Ardent Penitent Head Cage",0,"Ardent+Penitent+Head+Cage"],["2_7","Avowed Helm",0,"Avowed+Helm"],["2_8","Blackfeather Ranger Hat",0,"Blackfeather+Ranger+Hat"],["2_9","Blessed Carrion Knight Helm",0,"Blessed+Carrion+Knight+Helm"],["2_10","Bucketlord Helm",2,"Bucketlord+Helm"],["2_11","Byron's Cap",0,"Byron's+Cap"],["2_12","Calrath Guardsman Helm",0,"Calrath+Guardsman+Helm"],["2_13","Carrion Knight Helm",0,"Carrion+Knight+Helm"],["2_14","Condemned Head Cage",0,"Condemned+Head+Cage"],["2_15","Conflagrant Seer Helm",0,"Conflagrant+Seer+Helm"],["2_16","Corrupted Cleric's Crown",0,"Corrupted+Cleric's+Crown"],["2_17","Corrupted Penitent Mask",0,"Corrupted+Penitent+Mask"],["2_18","Corrupted Pilgrim Hood",0,"Corrupted+Pilgrim+Hood"],["2_19","Crimson Rector Helm",0,"Crimson+Rector+Helm"],["2_20","Crown of Flowers",0,"Crown+of+Flowers"],["2_21","Crown of Nails",0,"Crown+of+Nails"],["2_22","Cursed Helm",0,"Cursed+Helm"],["2_23","Damarose's Mask",0,"Damarose's+Mask"],["2_24","Descrier Guide Mask",0,"Descrier+Guide+Mask"],["2_25","Despair's Countenance",0,"Despair's+Countenance"],["2_26","Disgorged Viscera",0,"Disgorged+Viscera"],["2_27","Drustan's Helm",0,"Drustan's+Helm"],["2_28","Enslaved Miner Collar",0,"Enslaved+Miner+Collar"],["2_29","Exacter Hat",0,"Exacter+Hat"],["2_30","Exiled Stalker Headscarf",0,"Exiled+Stalker+Headscarf"],["2_31","Face of Elianne",0,"Face+of+Elianne"],["2_32","Failed Pilgrim's Hood",0,"Failed+Pilgrim's+Hood"],["2_33","Faithless Mask",0,"Faithless+Mask"],["2_34","Fitzroy's Helm",0,"Fitzroy's+Helm"],["2_35","Fungal Bowman Collar",0,"Fungal+Bowman+Collar"],["2_36","General Engstrom's Helm",2,"General+Engstrom's+Helm"],["2_37","Grace of Adyr Mask",0,"Grace+of+Adyr+Mask"],["2_38","Grace of Adyr Scalp",0,"Grace+of+Adyr+Scalp"],["2_39","Hallowed Knight Helm",0,"Hallowed+Knight+Helm"],["2_40","Harrower Helm",0,"Harrower+Helm"],["2_41","Herald of the Maw Mask",2,"Herald+of+the+Maw+Mask"],["2_42","Holy Bulwark Helm",0,"Holy+Bulwark+Helm"],["2_43","Illuminator Aubrey's Helm",2,"Illuminator+Aubrey's+Helm"],["2_44","Infernal Enchantress Helm",0,"Infernal+Enchantress+Helm"],["2_45","J'deyl Skull Helm",0,"J'deyl+Skull+Helm"],["2_46","Judge Cleric's Crown",0,"Judge+Cleric's+Crown"],["2_47","Kinrangr Guardian Helm",0,"Kinrangr+Guardian+Helm"],["2_48","Kinrangr Hunter Helm",0,"Kinrangr+Hunter+Helm"],["2_49","Knight of Adyr Helm",0,"Knight+of+Adyr+Helm"],["2_50","Lightreaper's Helm",0,"Lightreaper's+Helm"],["2_51","Lord Mask",0,"Lord+Mask"],["2_52","Marksman Helm",0,"Marksman+Helm"],["2_53","Mask of the Drowned",0,"Mask+of+the+Drowned"],["2_54","Mask of Wrath",0,"Mask+of+Wrath"],["2_55","Melted Crown",0,"Melted+Crown"],["2_56","Mournstead Infantry Helm",0,"Mournstead+Infantry+Helm"],["2_57","Neophyte Hood",0,"Neophyte+Hood"],["2_58","Noblewoman Headwear",0,"Noblewoman+Headwear"],["2_59","Orian Preacher Hat",0,"Orian+Preacher+Hat"],["2_60","Overseer Mask",0,"Overseer+Mask"],["2_61","Paladin Helm",0,"Paladin+Helm"],["2_62","Partisan Hood",0,"Partisan+Hood"],["2_63","Pieta's Helm",0,"Pieta's+Helm"],["2_64","Pilgrim Hood",0,"Pilgrim+Hood"],["2_65","Prole Hat",0,"Prole+Hat"],["2_66","Pureblade Helm",0,"Pureblade+Helm"],["2_67","Purger Helm",0,"Purger+Helm"],["2_68","Putrid Child Mask",0,"Putrid+Child+Mask"],["2_69","Pyric Cultist Hood",0,"Pyric+Cultist+Hood"],["2_70","Radiant Purifier Hat",0,"Radiant+Purifier+Hat"],["2_71","Rapturous Huntress Helm",0,"Rapturous+Huntress+Helm"],["2_72","Ravager Helm",0,"Ravager+Helm"],["2_73","Root Clump",0,"Root+Clump"],["2_74","Ruiner Helm",0,"Ruiner+Helm"],["2_75","Sacred Resonance Bell",0,"Sacred+Resonance+Bell"],["2_76","Scourged Sister Helm",0,"Scourged+Sister+Helm"],["2_77","Shuja Strider Mask",0,"Shuja+Strider+Mask"],["2_78","Shuja Warrior Mask",0,"Shuja+Warrior+Mask"],["2_79","Sin-Piercer Helm",0,"Sin-Piercer+Helm"],["2_80","Skinstealer Helm",0,"Skinstealer+Helm"],["2_81","Skull",0,"Skull"],["2_82","Sovereign Protector Helm",0,"Sovereign+Protector+Helm"],["2_83","Stillness Hood",0,"Stillness+Hood"],["2_84","Stomund's Helm",0,"Stomund's+Helm"],["2_85","Tancred's Helm",0,"Tancred's+Helm"],["2_86","The Iron Wayfarer's Hood",0,"The+Iron+Wayfarer's+Hood"],["2_87","Thorned Penitent Mask",0,"Thorned+Penitent+Mask"],["2_88","Tortured Prisoner's Head Cage",0,"Tortured+Prisoner's+Head+Cage"],["2_89","Trapper Cap",0,"Trapper+Cap"],["2_90","Udirangr Warwolf Hood",0,"Udirangr+Warwolf+Hood"],["2_91","Vanguard Helm",0,"Vanguard+Helm"],["2_92","Weeping Abbess Mitre",0,"Weeping+Abbess+Mitre"],["2_93","Pumpskin Mask",2,"Pumpskin+Mask"],["2_94","Abbess Garb",0,"Abbess+Garb"],["2_95","Abiding Defender Armour",0,"Abiding+Defender+Armour"],["2_96","Accursed Wretch Cloak",0,"Accursed+Wretch+Cloak"],["2_97","Andreas of Ebb's Armour",0,"Andreas+of+Ebb's+Armour"],["2_98","Angel of the Void Armour",0,"Angel+of+the+Void+Armour"],["2_99","Antique Hallowed Sentinel Armour",0,"Antique+Hallowed+Sentinel+Armour"],["2_100","Ardent Penitent Torso Chains",0,"Ardent+Penitent+Torso+Chains"],["2_101","Avowed Armour",0,"Avowed+Armour"],["2_102","Blackfeather Ranger Armour",0,"Blackfeather+Ranger+Armour"],["2_103","Blessed Carrion Knight Armour",0,"Blessed+Carrion+Knight+Armour"],["2_104","Byron's Garb",0,"Byron's+Garb"],["2_105","Calrath Guardsman Armour",0,"Calrath+Guardsman+Armour"],["2_106","Carrion Knight Armour",0,"Carrion+Knight+Armour"],["2_107","Condemned Garb",0,"Condemned+Garb"],["2_108","Conflagrant Seer Robes",0,"Conflagrant+Seer+Robes"],["2_109","Corrupted Cleric's Armour",0,"Corrupted+Cleric's+Armour"],["2_110","Corrupted Penitent Cape",0,"Corrupted+Penitent+Cape"],["2_111","Corrupted Pilgrim Belled Cape",0,"Corrupted+Pilgrim+Belled+Cape"],["2_112","Corrupted Pilgrim Cape",0,"Corrupted+Pilgrim+Cape"],["2_113","Corrupted Pilgrim Testimony Cape",0,"Corrupted+Pilgrim+Testimony+Cape"],["2_114","Crimson Rector Armour",0,"Crimson+Rector+Armour"],["2_115","Cursed Armour",0,"Cursed+Armour"],["2_116","Damarose's Garb",0,"Damarose's+Garb"],["2_117","Descrier Guide Garb",0,"Descrier+Guide+Garb"],["2_118","Despair's Cocoon",0,"Despair's+Cocoon"],["2_119","Dress of the Drowned",0,"Dress+of+the+Drowned"],["2_120","Drustan's Garb",0,"Drustan's+Garb"],["2_121","Elianne the Starved's Armour",0,"Elianne+the+Starved's+Armour"],["2_122","Enslaved Miner Chain",0,"Enslaved+Miner+Chain"],["2_123","Exacter Robes",0,"Exacter+Robes"],["2_124","Exiled Stalker Garb",0,"Exiled+Stalker+Garb"],["2_125","Failed Pilgrim's Garb",0,"Failed+Pilgrim's+Garb"],["2_126","Faithless Armour",0,"Faithless+Armour"],["2_127","Fetid Sacrifice Armour",0,"Fetid+Sacrifice+Armour"],["2_128","Fitzroy's Armour",0,"Fitzroy's+Armour"],["2_129","General Engstrom's Armour",2,"General+Engstrom's+Armour"],["2_130","Grace of Adyr Loincloth",0,"Grace+of+Adyr+Loincloth"],["2_131","Griefbound Dress",0,"Griefbound+Dress"],["2_132","Hallowed Knight Armour",0,"Hallowed+Knight+Armour"],["2_133","Harrower Armour",0,"Harrower+Armour"],["2_134","Herald of the Maw Armour",2,"Herald+of+the+Maw+Armour"],["2_135","Holy Bulwark Armour",0,"Holy+Bulwark+Armour"],["2_136","Hushed Saint's Armour",0,"Hushed+Saint's+Armour"],["2_137","Illuminator Aubrey's Armour",2,"Illuminator+Aubrey's+Armour"],["2_138","Infernal Enchantress Armour",0,"Infernal+Enchantress+Armour"],["2_139","Iselle's Garb",0,"Iselle's+Garb"],["2_140","J'deyl Bone Armour",0,"J'deyl+Bone+Armour"],["2_141","Judge Cleric's Armour",0,"Judge+Cleric's+Armour"],["2_142","Kinrangr Guardian Armour",0,"Kinrangr+Guardian+Armour"],["2_143","Kinrangr Hunter Armour",0,"Kinrangr+Hunter+Armour"],["2_144","Knight of Adyr Armour",0,"Knight+of+Adyr+Armour"],["2_145","Kukajin's Armour",0,"Kukajin's+Armour"],["2_146","Lightreaper's Armour",0,"Lightreaper's+Armour"],["2_147","Lord Armour",0,"Lord+Armour"],["2_148","Marksman Armour",0,"Marksman+Armour"],["2_149","Mournstead Infantry Armour",0,"Mournstead+Infantry+Armour"],["2_150","Neophyte Garb",0,"Neophyte+Garb"],["2_151","Noblewoman Dress",0,"Noblewoman+Dress"],["2_152","Orian Preacher Garb",0,"Orian+Preacher+Garb"],["2_153","Overseer Garb",0,"Overseer+Garb"],["2_154","Paladin Armour",0,"Paladin+Armour"],["2_155","Partisan Armour",0,"Partisan+Armour"],["2_156","Penitent Garb",0,"Penitent+Garb"],["2_157","Pieta's Armour",0,"Pieta's+Armour"],["2_158","Pilgrim Garb",0,"Pilgrim+Garb"],["2_159","Prole Garb",0,"Prole+Garb"],["2_160","Proselyte Garb",0,"Proselyte+Garb"],["2_161","Pureblade Armour",0,"Pureblade+Armour"],["2_162","Purger Armour",0,"Purger+Armour"],["2_163","Putrid Child Robes",0,"Putrid+Child+Robes"],["2_164","Pyric Cultist Garb",0,"Pyric+Cultist+Garb"],["2_165","Radiant Purifier Robes",0,"Radiant+Purifier+Robes"],["2_166","Rapturous Huntress Armour",0,"Rapturous+Huntress+Armour"],["2_167","Ravager Armour",0,"Ravager+Armour"],["2_168","Raw Mangler Cape",0,"Raw+Mangler+Cape"],["2_169","Ruiner Armour",0,"Ruiner+Armour"],["2_170","Sacred Resonance Garb",0,"Sacred+Resonance+Garb"],["2_171","Scourged Sister Garb",0,"Scourged+Sister+Garb"],["2_172","Shuja Strider Garb",0,"Shuja+Strider+Garb"],["2_173","Sin-Piercer Armour",0,"Sin-Piercer+Armour"],["2_174","Skinstealer Armour",0,"Skinstealer+Armour"],["2_175","Sovereign Protector Armour",0,"Sovereign+Protector+Armour"],["2_176","Stillness Robes",0,"Stillness+Robes"],["2_177","Stomund's Armour",0,"Stomund's+Armour"],["2_178","Tancred's Armour",0,"Tancred's+Armour"],["2_179","The Iron Wayfarer's Armour",0,"The+Iron+Wayfarer's+Armour"],["2_180","Torso Bones",0,"Torso+Bones"],["2_181","Torso Fungus",0,"Torso+Fungus"],["2_182","Tortured Prisoner's Dress",0,"Tortured+Prisoner's+Dress"],["2_183","Trapper Garb",0,"Trapper+Garb"],["2_184","Udirangr Warwolf Armour",0,"Udirangr+Warwolf+Armour"],["2_185","Vanguard Armour",0,"Vanguard+Armour"],["2_186","Abbess Wrappings",0,"Abbess+Wrappings"],["2_187","Abiding Defender Gauntlets",0,"Abiding+Defender+Gauntlets"],["2_188","Andreas of Ebb's Sleeves",0,"Andreas+of+Ebb's+Sleeves"],["2_189","Angel of the Void Gloves",0,"Angel+of+the+Void+Gloves"],["2_190","Antique Hallowed Sentinel Sleeves",0,"Antique+Hallowed+Sentinel+Sleeves"],["2_191","Ardent Penitent Arm Chains",0,"Ardent+Penitent+Arm+Chains"],["2_192","Arm Bones",0,"Arm+Bones"],["2_193","Arm Fungus",0,"Arm+Fungus"],["2_194","Avowed Gloves",0,"Avowed+Gloves"],["2_195","Blackfeather Ranger Gloves",0,"Blackfeather+Ranger+Gloves"],["2_196","Byron's Wrappings",0,"Byron's+Wrappings"],["2_197","Calrath Guardsman Gauntlets",0,"Calrath+Guardsman+Gauntlets"],["2_198","Carrion Knight Wrappings",0,"Carrion+Knight+Wrappings"],["2_199","Condemned Manacles",0,"Condemned+Manacles"],["2_200","Conflagrant Seer Sleeves",0,"Conflagrant+Seer+Sleeves"],["2_201","Corrupted Cleric's Wrappings",0,"Corrupted+Cleric's+Wrappings"],["2_202","Corrupted Penitent Bandages",0,"Corrupted+Penitent+Bandages"],["2_203","Corrupted Pilgrim Bandages",0,"Corrupted+Pilgrim+Bandages"],["2_204","Crimson Rector Gauntlets",0,"Crimson+Rector+Gauntlets"],["2_205","Cursed Gauntlets",0,"Cursed+Gauntlets"],["2_206","Damarose's Bracers",0,"Damarose's+Bracers"],["2_207","Descrier Guide Wrappings",0,"Descrier+Guide+Wrappings"],["2_208","Despair's Grasp",0,"Despair's+Grasp"],["2_209","Drustan's Glove",0,"Drustan's+Glove"],["2_210","Elianne the Starved's Sleeves",0,"Elianne+the+Starved's+Sleeves"],["2_211","Enslaved Miner Shackle",0,"Enslaved+Miner+Shackle"],["2_212","Exacter Sleeves",0,"Exacter+Sleeves"],["2_213","Exiled Stalker Wrappings",0,"Exiled+Stalker+Wrappings"],["2_214","Failed Pilgrim's Gloves",0,"Failed+Pilgrim's+Gloves"],["2_215","Faithless Gauntlets",0,"Faithless+Gauntlets"],["2_216","Fetid Sacrifice Sleeves",0,"Fetid+Sacrifice+Sleeves"],["2_217","Fitzroy's Gauntlets",0,"Fitzroy's+Gauntlets"],["2_218","General Engstrom's Gauntlets",2,"General+Engstrom's+Gauntlets"],["2_219","Hallowed Knight Gauntlets",0,"Hallowed+Knight+Gauntlets"],["2_220","Harrower Gauntlets",0,"Harrower+Gauntlets"],["2_221","Herald of the Maw Gauntlets",2,"Herald+of+the+Maw+Gauntlets"],["2_222","Holy Bulwark Gauntlets",0,"Holy+Bulwark+Gauntlets"],["2_223","Hushed Saint's Gauntlets",0,"Hushed+Saint's+Gauntlets"],["2_224","Illuminator Aubrey's Gauntlets",2,"Illuminator+Aubrey's+Gauntlets"],["2_225","Iselle's Bandages",0,"Iselle's+Bandages"],["2_226","J'deyl Bone Gloves",0,"J'deyl+Bone+Gloves"],["2_227","Judge Cleric's Gauntlets",0,"Judge+Cleric's+Gauntlets"],["2_228","Kinrangr Guardian Gauntlets",0,"Kinrangr+Guardian+Gauntlets"],["2_229","Kinrangr Hunter Gauntlets",0,"Kinrangr+Hunter+Gauntlets"],["2_230","Knight of Adyr Gauntlets",0,"Knight+of+Adyr+Gauntlets"],["2_231","Kukajin's Gloves",0,"Kukajin's+Gloves"],["2_232","Lightreaper's Gauntlets",0,"Lightreaper's+Gauntlets"],["2_233","Lord Gauntlets",0,"Lord+Gauntlets"],["2_234","Marksman Gloves",0,"Marksman+Gloves"],["2_235","Martyr's Shackles",0,"Martyr's+Shackles"],["2_236","Mournstead Infantry Gloves",0,"Mournstead+Infantry+Gloves"],["2_237","Neophyte Gloves",0,"Neophyte+Gloves"],["2_238","Noblewoman Sleeves",0,"Noblewoman+Sleeves"],["2_239","Orian Preacher Wrappings",0,"Orian+Preacher+Wrappings"],["2_240","Overseer Gloves",0,"Overseer+Gloves"],["2_241","Paladin Gauntlets",0,"Paladin+Gauntlets"],["2_242","Partisan Gauntlets",0,"Partisan+Gauntlets"],["2_243","Penitent Shackles",0,"Penitent+Shackles"],["2_244","Pieta's Sleeves",0,"Pieta's+Sleeves"],["2_245","Pilgrim Bandages",0,"Pilgrim+Bandages"],["2_246","Prole Wrappings",0,"Prole+Wrappings"],["2_247","Proselyte Gauntlets",0,"Proselyte+Gauntlets"],["2_248","Pureblade Gloves",0,"Pureblade+Gloves"],["2_249","Purger Gauntlets",0,"Purger+Gauntlets"],["2_250","Putrid Child Arm Wrappings",0,"Putrid+Child+Arm+Wrappings"],["2_251","Pyric Cultist Gloves",0,"Pyric+Cultist+Gloves"],["2_252","Radiant Purifier Gauntlets",0,"Radiant+Purifier+Gauntlets"],["2_253","Rapturous Huntress Sleeves",0,"Rapturous+Huntress+Sleeves"],["2_254","Ravager Gauntlets",0,"Ravager+Gauntlets"],["2_255","Raw Mangler Sleeves",0,"Raw+Mangler+Sleeves"],["2_256","Ruiner Sleeves",0,"Ruiner+Sleeves"],["2_257","Sacred Resonance Gauntlets",0,"Sacred+Resonance+Gauntlets"],["2_258","Scourged Sister Arm Wrappings",0,"Scourged+Sister+Arm+Wrappings"],["2_259","Shuja Strider Arm Wrappings",0,"Shuja+Strider+Arm+Wrappings"],["2_260","Shuja Warrior Arm Wrappings",0,"Shuja+Warrior+Arm+Wrappings"],["2_261","Sin-Piercer Sleeves",0,"Sin-Piercer+Sleeves"],["2_262","Skinstealer Sleeves",0,"Skinstealer+Sleeves"],["2_263","Sovereign Protector Gauntlets",0,"Sovereign+Protector+Gauntlets"],["2_264","Stomund's Gauntlets",0,"Stomund's+Gauntlets"],["2_265","Tancred's Gauntlets",0,"Tancred's+Gauntlets"],["2_266","The Iron Wayfarer's Gauntlet",0,"The+Iron+Wayfarer's+Gauntlet"],["2_267","Tortured Prisoner's Shackles",0,"Tortured+Prisoner's+Shackles"],["2_268","Udirangr Warwolf Sleeves",0,"Udirangr+Warwolf+Sleeves"],["2_269","Vanguard Gauntlets",0,"Vanguard+Gauntlets"],["2_270","Abbess Skirt",0,"Abbess+Skirt"],["2_271","Abiding Defender Leg Wrappings",0,"Abiding+Defender+Leg+Wrappings"],["2_272","Accursed Wretch Trousers",0,"Accursed+Wretch+Trousers"],["2_273","Andreas of Ebb's Leggings",0,"Andreas+of+Ebb's+Leggings"],["2_274","Angel of the Void Trousers",0,"Angel+of+the+Void+Trousers"],["2_275","Ardent Penitent Loincloth",0,"Ardent+Penitent+Loincloth"],["2_276","Avowed Trousers",0,"Avowed+Trousers"],["2_277","Blackfeather Ranger Trousers",0,"Blackfeather+Ranger+Trousers"],["2_278","Bucketlord Shoes",2,"Bucketlord+Shoes"],["2_279","Byron's Trousers",0,"Byron's+Trousers"],["2_280","Calrath Guardsman Trousers",0,"Calrath+Guardsman+Trousers"],["2_281","Carrion Knight Skirt",0,"Carrion+Knight+Skirt"],["2_282","Condemned Fetters",0,"Condemned+Fetters"],["2_283","Conflagrant Seer Skirt",0,"Conflagrant+Seer+Skirt"],["2_284","Corrupted Cleric's Skirt",0,"Corrupted+Cleric's+Skirt"],["2_285","Corrupted Penitent Loincloth",0,"Corrupted+Penitent+Loincloth"],["2_286","Corrupted Pilgrim Trousers",0,"Corrupted+Pilgrim+Trousers"],["2_287","Crimson Rector Leggings",0,"Crimson+Rector+Leggings"],["2_288","Cursed Leggings",0,"Cursed+Leggings"],["2_289","Damarose's Trousers",0,"Damarose's+Trousers"],["2_290","Descrier Guide Leggings",0,"Descrier+Guide+Leggings"],["2_291","Despair's Burden",0,"Despair's+Burden"],["2_292","Drustan's Leggings",0,"Drustan's+Leggings"],["2_293","Elianne the Starved's Leggings",0,"Elianne+the+Starved's+Leggings"],["2_294","Enslaved Miner Trousers",0,"Enslaved+Miner+Trousers"],["2_295","Exacter Skirt",0,"Exacter+Skirt"],["2_296","Exiled Stalker Trousers",0,"Exiled+Stalker+Trousers"],["2_297","Failed Pilgrim's Leggings",0,"Failed+Pilgrim's+Leggings"],["2_298","Faithless Trousers",0,"Faithless+Trousers"],["2_299","Fetid Sacrifice Boots",0,"Fetid+Sacrifice+Boots"],["2_300","Fitzroy's Leggings",0,"Fitzroy's+Leggings"],["2_301","Fungal Bowman Trousers",0,"Fungal+Bowman+Trousers"],["2_302","General Engstrom's Leggings",2,"General+Engstrom's+Leggings"],["2_303","Hallowed Knight Leggings",0,"Hallowed+Knight+Leggings"],["2_304","Harrower Leggings",0,"Harrower+Leggings"],["2_305","Herald of the Maw Leggings",2,"Herald+of+the+Maw+Leggings"],["2_306","Holy Bulwark Trousers",0,"Holy+Bulwark+Trousers"],["2_307","Hushed Saint's Trousers",0,"Hushed+Saint's+Trousers"],["2_308","Illuminator Aubrey's Leggings",2,"Illuminator+Aubrey's+Leggings"],["2_309","Infernal Enchantress Skirt",0,"Infernal+Enchantress+Skirt"],["2_310","Iselle's Skirt",0,"Iselle's+Skirt"],["2_311","J'deyl Trousers",0,"J'deyl+Trousers"],["2_312","Judge Cleric's Leggings",0,"Judge+Cleric's+Leggings"],["2_313","Kinrangr Guardian Trousers",0,"Kinrangr+Guardian+Trousers"],["2_314","Kinrangr Hunter Trousers",0,"Kinrangr+Hunter+Trousers"],["2_315","Knight of Adyr Trousers",0,"Knight+of+Adyr+Trousers"],["2_316","Kukajin's Leggings",0,"Kukajin's+Leggings"],["2_317","Leg Bones",0,"Leg+Bones"],["2_318","Lightreaper's Leggings",0,"Lightreaper's+Leggings"],["2_319","Lord Leggings",0,"Lord+Leggings"],["2_320","Marksman Trousers",0,"Marksman+Trousers"],["2_321","Mournstead Infantry Leggings",0,"Mournstead+Infantry+Leggings"],["2_322","Neophyte Trousers",0,"Neophyte+Trousers"],["2_323","Noblewoman Leggings",0,"Noblewoman+Leggings"],["2_324","Orian Preacher Skirt",0,"Orian+Preacher+Skirt"],["2_325","Overseer Trousers",0,"Overseer+Trousers"],["2_326","Paladin Leggings",0,"Paladin+Leggings"],["2_327","Partisan Leggings",0,"Partisan+Leggings"],["2_328","Penitent Trousers",0,"Penitent+Trousers"],["2_329","Pieta's Leggings",0,"Pieta's+Leggings"],["2_330","Pilgrim Skirt",0,"Pilgrim+Skirt"],["2_331","Prole Trousers",0,"Prole+Trousers"],["2_332","Proselyte Legging",0,"Proselyte+Legging"],["2_333","Pureblade Trousers",0,"Pureblade+Trousers"],["2_334","Purger Leggings",0,"Purger+Leggings"],["2_335","Putrid Child Leg Wrappings",0,"Putrid+Child+Leg+Wrappings"],["2_336","Pyric Cultist Leggings",0,"Pyric+Cultist+Leggings"],["2_337","Radiant Purifier Trousers",0,"Radiant+Purifier+Trousers"],["2_338","Rapturous Huntress Trousers",0,"Rapturous+Huntress+Trousers"],["2_339","Ravager Leggings",0,"Ravager+Leggings"],["2_340","Raw Mangler Trousers",0,"Raw+Mangler+Trousers"],["2_341","Ruiner Boots",0,"Ruiner+Boots"],["2_342","Sacred Resonance Leggings",0,"Sacred+Resonance+Leggings"],["2_343","Scourged Sister Leg Wrappings",0,"Scourged+Sister+Leg+Wrappings"],["2_344","Shuja Strider Leg Wrappings",0,"Shuja+Strider+Leg+Wrappings"],["2_345","Shuja Warrior Leg Wrappings",0,"Shuja+Warrior+Leg+Wrappings"],["2_346","Sin-Piercer Boots",0,"Sin-Piercer+Boots"],["2_347","Skinstealer Leggings",0,"Skinstealer+Leggings"],["2_348","Sovereign Protector Leggings",0,"Sovereign+Protector+Leggings"],["2_349","Stomund's Leggings",0,"Stomund's+Leggings"],["2_350","Tancred's Leggings",0,"Tancred's+Leggings"],["2_351","The Iron Wayfarer's Trousers",0,"The+Iron+Wayfarer's+Trousers"],["2_352","Tortured Prisoner's Skirt",0,"Tortured+Prisoner's+Skirt"],["2_353","Udirangr Warwolf Trousers",0,"Udirangr+Warwolf+Trousers"],["2_354","Vanguard Leggings",0,"Vanguard+Leggings"],["2_355","Veteran of the Veil Helm",2,"Veteran+of+the+Veil+Helm"],["2_356","Veteran of the Veil Armor",2,"Veteran+of+the+Veil+Armor"],["2_357","Veteran of the Veil Gauntlets",2,"Veteran+of+the+Veil+Gauntlets"],["2_358","Veteran of the Veil Leggings",2,"Veteran+of+the+Veil+Leggings"]]},{"id":"Rings","title":"Rings","items":[["15_1","Adyr's Mark Ring",0,"Adyr's+Mark+Ring"],["15_2","Adyrqamar Ring",0,"Adyrqamar+Ring"],["15_3","Anchorite's Ring",0,"Anchorite's+Ring"],["15_4","Andreas of Ebb's Ring",0,"Andreas+of+Ebb's+Ring"],["15_5","Barrage Root",0,"Barrage+Root"],["15_6","Berinon's Ring",0,"Berinon's+Ring"],["15_7","Blackfeather Ranger Ring",0,"Blackfeather+Ranger+Ring"],["15_8","Bloodbane Ring",0,"Bloodbane+Ring"],["15_9","Bountiful Ring",0,"Bountiful+Ring"],["15_10","Braided Ring",0,"Braided+Ring"],["15_11","Bramble Ring",0,"Bramble+Ring"],["15_12","Brawn Ring",0,"Brawn+Ring"],["15_13","Charred Root",0,"Charred+Root"],["15_14","Cleric's Benediction",0,"Cleric's+Benediction"],["15_15","Crossbowman's Ring",0,"Crossbowman's+Ring"],["15_16","Cursewyrm Ring",0,"Cursewyrm+Ring"],["15_17","Dark Crusader's Convalescence",0,"Dark+Crusader's+Convalescence"],["15_18","Defaced Ring",0,"Defaced+Ring"],["15_19","Defiance Ring",0,"Defiance+Ring"],["15_21","Envenomed Ring",0,"Envenomed+Ring"],["15_20","Exacter Dunmire's Ring",0,"Dunmire's+Ring"],["15_22","Executioner's Ring",0,"Executioner's+Ring"],["15_23","Glacier Ring",0,"Glacier+Ring"],["15_24","Grayson's Ring",0,"Grayson's+Ring"],["15_25","Grievous Ring",0,"Grievous+Ring"],["15_26","Holy Blood Ring",0,"Holy+Blood+Ring"],["15_27","Impious Nohuta's Ring",0,"Impious+Nohuta's+Ring"],["15_28","Lucent Sword Ring",0,"Lucent+Sword+Ring"],["15_29","Magma Ring",0,"Magma+Ring"],["15_30","Manastone Ring",0,"Manastone+Ring"],["15_31","Melchior's Ring",0,"Melchior's+Ring"],["15_32","Mineowner's Ring",0,"Mineowner's+Ring"],["15_33","Moth Ring",0,"Moth+Ring"],["15_34","Mother's Watch",0,"Mother's+Watch"],["15_35","Nimble Ring",0,"Nimble+Ring"],["15_36","Orian Sorcerer's Ring",0,"Orian+Sorcerer's+Ring"],["15_37","Panoptic Ring",0,"Panoptic+Ring"],["15_38","Poacher's Ring",0,"Poacher's+Ring"],["15_39","Puissance Root",0,"Puissance+Root"],["15_40","Queen Sophesia's Ring",0,"Queen+Sophesia's+Ring"],["15_41","Queen Verena II's Ring",0,"Queen+Verena+II's+Ring"],["15_42","Ring of Bones",0,"Ring+of+Bones"],["15_43","Ring of Brilliant Protection",0,"Ring+of+Brilliant+Protection"],["15_44","Ring of Duty",0,"Ring+of+Duty"],["15_45","Ring of Eternal Faith",0,"Ring+of+Eternal+Faith"],["15_46","Ring of Gnawing",0,"Ring+of+Gnawing"],["15_47","Ring of Infernal Devotion",0,"Ring+of+Infernal+Devotion"],["15_48","Ring of Night's Fire",0,"Ring+of+Night's+Fire"],["15_49","Ring of Nourishment",0,"Ring+of+Nourishment"],["15_50","Ring of Radiant Preeminence",0,"Ring+of+Radiant+Preeminence"],["15_51","Ring of Sanguine Might",0,"Ring+of+Sanguine+Might"],["15_52","Ring of Shelter",0,"Ring+of+Shelter"],["15_53","Ring of the First of the Beasts",0,"Ring+of+the+First+of+the+Beasts"],["15_54","Royal Council Ring",0,"Royal+Council+Ring"],["15_55","Saint Salonor's Ring",0,"Saint+Salonor's+Ring"],["15_56","Slinger's Ring",0,"Slinger's+Ring"],["15_57","Smouldering Ring",0,"Smouldering+Ring"],["15_58","Sovereign Protector's Ring",0,"Sovereign+Protector's+Ring"],["15_59","Unblinking Root",0,"Unblinking+Root"],["15_60","Verdure Ring",0,"Verdure+Ring"],["15_61","Vessel Root",0,"Vessel+Root"],["15_62","Wildfire Ring",0,"Wildfire+Ring"],["15_63","Yorke's Ring",0,"Yorke's+Ring"]]},{"id":"Pendants","title":"Pendants","items":[["3_1","Cavalry Pendant",0,"Cavalry+Pendant"],["3_2","Empyrean Pendant",0,"Empyrean+Pendant"],["3_3","Faceless Carving",0,"Faceless+Carving"],["3_4","Hallowed Triptych",0,"Hallowed+Triptych"],["3_5","Hysteria Pendant",0,"Hysteria+Pendant"],["3_6","Inner Serpent Pendant",0,"Inner+Serpent+Pendant"],["3_7","Miner's Pendant",0,"Miner's+Pendant"],["3_8","Paladin's Pendant",0,"Paladin's+Pendant"],["3_9","Pendant of Atrophy",0,"Pendant+of+Atrophy"],["3_10","Pendant of Burden",0,"Pendant+of+Burden"],["3_11","Pendant of Induration",0,"Pendant+of+Induration"],["3_12","Pendant of Infernal Oblation",0,"Pendant+of+Infernal+Oblation"],["3_13","Pendant of Parting",0,"Pendant+of+Parting"],["3_14","Pendant of the Blood Sun",0,"Pendant+of+the+Blood+Sun"],["3_15","Princess' Sting",0,"Princess'+Sting"],["3_16","Relic of Perpetuation",0,"Relic+of+Perpetuation"],["3_17","Rhogar's Delight",0,"Rhogar's+Delight"],["3_18","Scornful Effigy",0,"Scornful+Effigy"],["3_19","Shrunken Skull Pendant",0,"Shrunken+Skull+Pendant"],["3_20","Shuja Harmony Hoop",0,"Shuja+Harmony+Hoop"],["3_21","Unbridled Focus",0,"Unbridled+Focus"],["3_22","Warrior's Claw",0,"Warrior's+Claw"]]},{"id":"Spells","title":"Spells","items":[["4_1","Aura of Tenacity",0,"Aura+of+Tenacity"],["4_2","Barbed Aura",0,"Barbed+Aura"],["4_3","Blessed Reflections",0,"Blessed+Reflections"],["4_4","Briar Storm",0,"Briar+Storm"],["4_5","Cleansing Spring",0,"Cleansing+Spring"],["4_6","Consecrate",0,"Consecrate"],["4_7","Divine Arms",0,"Divine+Arms"],["4_8","Healing Radiance",0,"Healing+Radiance"],["4_9","Healing Sigil",0,"Healing+Sigil"],["4_10","Invigorating Aura",0,"Invigorating+Aura"],["4_11","Lacerating Weapon",0,"Lacerating+Weapon"],["4_13","Lucent Beam",0,"Lucent+Beam"],["4_14","Orius' Judgement",0,"Orius'+Judgement"],["4_15","Piercing Light",0,"Piercing+Light"],["4_16","Radiant Flare",0,"Radiant+Flare"],["4_17","Radiant Guardian",0,"Radiant+Guardian"],["4_18","Radiant Orb",0,"Radiant+Orb"],["4_19","Radiant Slash",0,"Radiant+Slash"],["4_20","Radiant Weapon",0,"Radiant+Weapon"],["4_21","Sanctify",0,"Sanctify"],["4_12","Lambent Feint",2,"Lambent+Feint"],["4_22","Smiting Shield",2,"Smiting+Shield"],["4_23","The Tolling",2,"The+Tolling"],["4_24","Vortex of Torment",2,"Vortex+of+Torment"],["4_25","Adyr's Authority",0,"Adyr's+Authority"],["4_26","Adyr's Endurance",0,"Adyr's+Endurance"],["4_27","Adyr's Hardiness",0,"Adyr's+Hardiness"],["4_28","Adyr's Rage",0,"Adyr's+Rage"],["4_29","Adyr's Vengeance",0,"Adyr's+Vengeance"],["4_31","Cataclysm",0,"Cataclysm"],["4_32","Conflagration",0,"Conflagration"],["4_33","Flame Funnel",0,"Flame+Funnel"],["4_35","Infernal Decree",0,"Infernal+Decree"],["4_36","Infernal Eruption",0,"Infernal+Eruption"],["4_37","Infernal Guardian",0,"Infernal+Guardian"],["4_38","Infernal Hounds",0,"Infernal+Hounds"],["4_39","Infernal Orb",0,"Infernal+Orb"],["4_40","Infernal Slash",0,"Infernal+Slash"],["4_41","Infernal Weapon",0,"Infernal+Weapon"],["4_42","Lava Burst",0,"Lava+Burst"],["4_43","Magma Surge",0,"Magma+Surge"],["4_44","Pyroclastic Stone",0,"Pyroclastic+Stone"],["4_47","Seismic Slam",0,"Seismic+Slam"],["4_48","Severing Blades",0,"Severing+Blades"],["4_30","Blistering Salvo",2,"Blistering+Salvo"],["4_34","Incinerating Blast",2,"Incinerating+Blast"],["4_45","Rising Fire",2,"Rising+Fire"],["4_46","Seared Soul",2,"Seared+Soul"],["4_49","Barrage of Echoes",0,"Barrage+of+Echoes"],["4_50","Blood Harvest",0,"Blood+Harvest"],["4_51","Diminishing Missile",0,"Diminishing+Missile"],["4_52","Flesh Tide",0,"Flesh+Tide"],["4_53","Graveyard Fog",0,"Graveyard+Fog"],["4_54","Grieving Gaze",0,"Grieving+Gaze"],["4_56","Latimer's Javelin",0,"Latimer's+Javelin"],["4_57","Lingering Despair",0,"Lingering+Despair"],["4_58","Martyrdom",0,"Martyrdom"],["4_59","Misery Missile",0,"Misery+Missile"],["4_60","Painful Echo",0,"Painful+Echo"],["4_62","Pestilent Blade",0,"Pestilent+Blade"],["4_63","Poison Weapon",0,"Poison+Weapon"],["4_65","Putrefaction",0,"Putrefaction"],["4_67","Umbral Agony",0,"Umbral+Agony"],["4_68","Umbral Guardian",0,"Umbral+Guardian"],["4_69","Umbral Orb",0,"Umbral+Orb"],["4_70","Umbral Slash",0,"Umbral+Slash"],["4_71","Umbral Weapon",0,"Umbral+Weapon"],["4_55","Hibernal Cleave",2,"Hibernal+Cleave"],["4_61","Pallid Bile",2,"Pallid+Bile"],["4_64","Puncturing Hail",2,"Puncturing+Hail"],["4_66","Septic Heave",2,"Septic+Heave"]]},{"id":"Ammunitions","title":"Ammunitions","items":[["5_1","Cinder Arrows",0,"Cinder+Arrows"],["5_2","Frost Arrows",0,"Frost+Arrows"],["5_3","Oak Arrows",0,"Oak+Arrows"],["5_4","Poison Arrows",0,"Poison+Arrows"],["5_5","Precision Arrows",0,"Precision+Arrows"],["5_6","Pulsing Arrows",0,"Pulsing+Arrows"],["5_7","Radiant Arrows",0,"Radiant+Arrows"],["5_8","Weighted Arrows",0,"Weighted+Arrows"],["5_9","Wither Arrows",0,"Wither+Arrows"],["5_10","Basic Bolts",0,"Basic+Bolts"],["5_11","Cinder Bolts",0,"Cinder+Bolts"],["5_12","Explosive Bolts",0,"Explosive+Bolts"],["5_13","Radiant Bolts",0,"Radiant+Bolts"],["5_14","Rived Bolts",0,"Rived+Bolts"],["5_15","Twisted Bolts",0,"Twisted+Bolts"],["5_16","Weighted Bolts",0,"Weighted+Bolts"],["5_17","Wither Bolts",0,"Wither+Bolts"],["5_18","Banner Javelin of Assault",0,"Banner+Javelin+of+Assault"],["5_19","Banner Javelin of Protection",0,"Banner+Javelin+of+Protection"],["5_20","Corrupted Banner Javelin",0,"Corrupted+Banner+Javelin"],["5_21","Enhanced Banner Javelin of Assault",0,"Enhanced+Banner+Javelin+of+Assault"],["5_22","Enhanced Banner Javelin of Protection",0,"Enhanced+Banner+Javelin+of+Protection"],["5_23","Accusing Spirit",0,"Accusing+Spirit"],["5_24","Bloody Hatchet",0,"Bloody+Hatchet"],["5_25","Bursting Grub",2,"Bursting+Grub"],["5_26","Cursed Dart",0,"Cursed+Dart"],["5_27","Cursed Effigy",0,"Cursed+Effigy"],["5_28","Empyrean Grenade",0,"Empyrean+Grenade"],["5_29","Enhanced Accusing Spirit",0,"Enhanced+Accusing+Spirit"],["5_30","Enhanced Bloody Hatchet",0,"Enhanced+Bloody+Hatchet"],["5_31","Enhanced Cursed Dart",0,"Enhanced+Cursed+Dart"],["5_32","Enhanced Cursed Effigy",0,"Enhanced+Cursed+Effigy"],["5_64","Enhanced Empyrean Grenade",0,"Enhanced+Empyrean+Grenade"],["5_33","Enhanced Fire Grenade",0,"Enhanced+Fire+Grenade"],["5_34","Enhanced Forceburst Parchment",0,"Enhanced+Forceburst+Parchment"],["5_35","Enhanced Forsaken Grenade",0,"Enhanced+Forsaken+Grenade"],["5_36","Enhanced Grenade",0,"Enhanced+Grenade"],["5_37","Enhanced Holy Grenade",0,"Enhanced+Holy+Grenade"],["5_38","Enhanced Lacerating Knife",0,"Enhanced+Lacerating+Knife"],["5_39","Enhanced Lump Hammer",0,"Enhanced+Lump+Hammer"],["5_40","Enhanced Poison Javelin",0,"Enhanced+Poison+Javelin"],["5_41","Enhanced Poisoning Knife",0,"Enhanced+Poisoning+Knife"],["5_42","Enhanced Radiantburst Parchment",0,"Enhanced+Radiantburst+Parchment"],["5_43","Enhanced Rhogar Oil Flask",0,"Enhanced+Rhogar+Oil+Flask"],["5_44","Enhanced Short Javelin",0,"Enhanced+Short+Javelin"],["5_45","Enhanced Snake Oil Grenade",0,"Enhanced+Snake+Oil+Grenade"],["5_46","Enhanced Umbral Burrower",0,"Enhanced+Umbral+Burrower"],["5_47","Explosive Snare",2,"Explosive+Snare"],["5_48","Fire Grenade",0,"Fire+Grenade"],["5_49","Forceburst Parchment",0,"Forceburst+Parchment"],["5_50","Forsaken Grenade",0,"Forsaken+Grenade"],["5_51","Grenade",0,"Grenade"],["5_52","Holy Grenade",0,"Holy+Grenade"],["5_53","Imbruing Chalice",2,"Imbruing+Chalice"],["5_54","Lacerating Knife",0,"Lacerating+Knife"],["5_55","Lump Hammer",0,"Lump+Hammer"],["5_56","Poison Javelin",0,"Poison+Javelin"],["5_57","Poisoning Knife",0,"Poisoning+Knife"],["5_58","Radiantburst Parchment",0,"Radiantburst+Parchment"],["5_59","Rhogar Oil Flask",0,"Rhogar+Oil+Flask"],["5_60","Short Javelin",0,"Short+Javelin"],["5_61","Snake Oil Grenade",0,"Snake+Oil+Grenade"],["5_62","Throwing Rock",0,"Throwing+Rock"],["5_63","Umbral Burrower",0,"Umbral+Burrower"],["5_65","Snowball (NEW)",2],["5_66","Blood Vomit",2,"Blood+Vomit"],["5_67","Explosive Mines",2,"Explosive+Mines"],["5_68","Frost Worms",2,"Frost+Worms"]]},{"id":"Umbral_Eyes","title":"Umbral Eyes","items":[["6_1","Umbral Eye of Betrayed Eliard",0,"Umbral+Eye+of+Betrayed+Eliard"],["6_2","Umbral Eye of Blind Agatha",0,"Umbral+Eye+of+Blind+Agatha"],["6_3","Umbral Eye of Dieter",0,"Umbral+Eye+of+Dieter"],["6_4","Umbral Eye of Doln",0,"Umbral+Eye+of+Doln"],["6_5","Umbral Eye of Ethryg",0,"Umbral+Eye+of+Ethryg"],["6_6","Umbral Eye of Hooded Antuli",0,"Umbral+Eye+of+Hooded+Antuli"],["6_7","Umbral Eye of Iorelo the Cursed Knight",0,"Umbral+Eye+of+Iorelo+the+Cursed+Knight"],["6_8","Umbral Eye of Loash",0,"Umbral+Eye+of+Loash"],["6_9","Umbral Eye of Lost Berescu",0,"Umbral+Eye+of+Lost+Berescu"],["6_10","Umbral Eye of Lydia the Numb Witch",0,"Umbral+Eye+of+Lydia+the+Numb+Witch"],["6_11","Umbral Eye of Marco the Axe",0,"Umbral+Eye+of+Marco+the+Axe"],["6_12","Umbral Eye of Olleren",0,"Umbral+Eye+of+Olleren"],["6_13","Umbral Eye of Rosamund",0,"Umbral+Eye+of+Rosamund"],["6_14","Umbral Eye of the Bloody Pilgrim",0,"Umbral+Eye+of+the+Bloody+Pilgrim"],["6_15","Umbral Eye of the Pale Butcher",0,"Umbral+Eye+of+the+Pale+Butcher"]]},{"id":"Bosses","title":"Bosses","items":[["7_1","Pieta, She of Blessed Renewal",0,"Pieta,+She+of+Blessed+Renewal"],["7_2","The Congregator of Flesh",0,"The+Congregator+of+Flesh"],["7_3","The Hushed Saint",0,"The+Hushed+Saint"],["7_4","Spurned Progeny",0,"Spurned+Progeny"],["7_5","The Hollow Crow",0,"The+Hollow+Crow"],["7_6","Harrower Dervla, the Pledged Knight",0,"Harrower+Dervla+the+Pledged+Knight"],["7_7","The Unbroken Promise",0,"The+Unbroken+Promise"],["7_8","Tancred, Master of Castigations",0,"Tancred+Master+of+Castigations"],["7_9","Reinhold the Immured",0,"Reinhold+the+Immured"],["7_10","Judge Cleric, the Radiant Sentinel",0,"Judge+Cleric+the+Radiant+Sentinel"],["7_11","The Lightreaper",0,"The+Lightreaper"],["7_12","The Sundered Monarch",0,"The+Sundered+Monarch"],["7_13","Adyr, the Bereft Exile",0,"Adyr,+the+Bereft+Exile"],["7_14","Elianne the Starved",0,"Elianne+the+Starved"],["7_15","Holy Bulwark Otto",0,"Holy+Bulwark+Otto"],["7_16","Scourged Sister Delyth",0,"Scourged+Sister+Delyth"],["7_17","Gentle Gaverus, Mistress of Hounds",0,"Gentle+Gaverus,+Mistress+of+Hounds"],["7_18","The Sacred Resonance of Tenacity",0,"The+Sacred+Resonance+of+Tenacity"],["7_19","Mendacious Visage",0,"Mendacious+Visage"],["7_20","Crimson Rector Percival",0,"Crimson+Rector+Percival"],["7_21","Ruiner",0,"Ruiner"],["7_22","Infernal Enchantress",0,"Infernal+Enchantress"],["7_23","Skinstealer",0,"Skinstealer"],["7_24","Bringer of Stillness",0,"Bringer+of+Stillness+(Boss)"],["7_25","Bringer of Silence",0,"Bringer+of+Silence"],["7_26","Bringer of Nullity",0,"Bringer+of+Nullity"],["7_27","Kinrangr Guardian Folard",0,"Kinrangr+Guardian+Folard"],["7_28","Griefbound Rowena",0,"Griefbound+Rowena"],["7_29","Paladin's Burden",0,"Paladin's+Burden"],["7_30","Abiding Defenders",0,"Abiding+Defenders"],["7_31","Blessed Carrion Knight Sanisho",0,"Blessed+Carrion+Knight+Sanisho"],["7_32","Abbess Ursula",0,"Abbess+Ursula"],["7_33","Rapturous Huntress of the Dusk",0,"Rapturous+Huntress+of+the+Dusk"],["7_34","Andreas of Ebb (Boss)",0,"Andreas+of+Ebb+(Boss)"],["7_35","The Iron Wayfarer (Boss)",0,"The+Iron+Wayfarer+(Boss)"],["7_36","Damarose the Marked (Boss)",0,"Damarose+the+Marked+(Boss)"],["7_37","Kukajin (Boss)",0,"Kukajin+(Boss)"],["7_38","Tortured Prisoner (Boss)",0,"Tortured+Prisoner+(Boss)"],["7_39","Spirit of the Bleak Season",2,"Spirit+of+the+Bleak+Season"],["7_40","General Engstrom",2,"General+Engstrom"]]},{"id":"Questlist","title":"Quests","items":[["8_1","Expose the Hallowed Sentinels",0,"Expose+the+Hallowed+Sentinels"],["8_2","Find the Thief",0,"Find+the+Thief"],["8_3","Free the Tortured Prisoner",0,"Free+the+Tortured+Prisoner"],["8_4","Guide to Umbral Realm",0,"Guide+to+Umbral+Realm"],["8_5","His Final Stand",0,"His+Final+Stand"],["8_6","Inside the Cleric's Mind",0,"Inside+the+Cleric's+Mind"],["8_7","Kukajin of The Envenomed",0,"Kukajin+of+The+Envenomed"],["8_8","Molhu in Umbral Realm",0,"Molhu+in+Umbral+Realm"],["8_9","Recover the Scattered Tablets",0,"Recover+the+Scattered+Tablets"],["8_10","Rescue the Hound",0,"Rescue+the+Hound"],["8_11","Save the Blacksmith",0,"Save+the+Blacksmith"],["8_12","Save the Petrified Woman",0,"Save+the+Petrified+Woman"],["8_13","The Dark Crusader Mission",0,"The+Dark+Crusader+Mission"],["8_14","The Man Who Seeks The Lamp",0,"The+Man+Who+Seeks+The+Lamp"],["8_15","The Missing Pendant",0,"The+Missing+Pendant"],["8_16","The Paladin's Request",0,"The+Paladin's+Request"],["8_17","The Rejected Pilgrim",0,"The+Rejected+Pilgrim"],["8_18","The Umbral Realm Guide",0,"The+Umbral+Realm+Guide"],["8_19","Pumpkin Patch Event",0,"Pumpkin+Patch+Event"],["8_20","The Way of the Bucket",0,"The+Way+of+the+Bucket"],["8_21","General Engstrom's Set",0,"General+Engstrom's+Set"],["8_22","Illuminator Aubrey's Set",0,"Illuminator+Aubrey's+Set"],["8_23","Herald of the Maw Set",0,"Herald+of+the+Maw+Set"],["8_24","Mirror of Distortion",0,"Mirror+of+Distortion"]]},{"id":"Gestures","title":"Gestures","items":[["9_1","Agreeing",0,"Agreeing"],["9_2","Beckoning",0,"Beckoning"],["9_3","Bemoaning",0,"Bemoaning"],["9_4","Calrath Noble's Bow",0,"Calrath+Noble's+Bow"],["9_5","Celebration",0,"Celebration"],["9_6","Common Orian Prayer",0,"Common+Orian+Prayer"],["9_7","Crimson Ritual Fervour",0,"Crimson+Ritual+Fervour"],["9_8","Dark Crusader's Challenge",0,"Dark+Crusader's+Challenge"],["9_9","Disagreeing",0,"Disagreeing"],["9_10","Greeting",0,"Greeting"],["9_11","Hallowed Sentinel Prayer",0,"Hallowed+Sentinel+Prayer"],["9_12","Halting",0,"Halting"],["9_13","Laughter",0,"Laughter"],["9_14","Orian Vow of Protection",0,"Orian+Vow+of+Protection"],["9_15","Pledge to Adyr",0,"Pledge+to+Adyr"],["9_16","Pointing Downward",0,"Pointing+Downward"],["9_17","Pointing Forward",0,"Pointing+Forward"],["9_18","Pointing Upward",0,"Pointing+Upward"],["9_19","Putrid Mothers' Embrace",0,"Putrid+Mothers'+Embrace"],["9_20","Surrender",0,"Surrender"],["9_21","Wheezing",0,"Wheezing"],["9_22","Bucketlord's Salute",2,"Bucketlord's+Salute"]]},{"id":"Stigmas","title":"Stigmas","items":[["10_1","Stigma of the Lightreaper Vs Iorelo the Cursed Knight",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=0s"],["10_2","Abandoned Woman's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=29s"],["10_3","Choking Man's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=49s"],["10_4","Pieta's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=80s"],["10_5","Pilgrim's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=113s"],["10_6","Follower of Adyr's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=127s"],["10_7","King's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=235s"],["10_8","Caged Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=343s"],["10_9","Congregator's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=389s"],["10_10","Lampbearer's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=418s"],["10_11","Hushed Saint's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=501s"],["10_12","Stigma of a Little Friend",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=535s"],["10_13","Fallen Victim's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=551s"],["10_14","Stigma of a Tower Battle",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=608s"],["10_15","Stigma in the Graves",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=705s"],["10_57","Stigma of Isaac Kneeling (1)",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2629s"],["10_16","Elianne's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=774s"],["10_17","Miner's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=809s"],["10_18","Spurned Progeny's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=860s"],["10_19","Leader's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=883s"],["10_20","Fallen Victim's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=940s"],["10_21","Stigma of a Miner",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1001s"],["10_22","Preacher's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1044s"],["10_23","Unbroken Promise Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1114s"],["10_25","Imprisoned Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1193s"],["10_26","Fighter's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1242s"],["10_27","Stigma of a Robbery",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1252s"],["10_28","Stigma of an Alley Fight",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1271s"],["10_29","Bargainer's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1286s"],["10_30","Stigma of the Rune of Adyr",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1316s"],["10_31","Stigma of Isaac Kneeling (2)",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1357s"],["10_32","Yorke's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1372s"],["10_33","Healer's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1433s"],["10_34","Stigma of the Hollow Crow",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1492s"],["10_35","Dying Man's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1511s"],["10_36","Stigma of a Fierce Combat",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1569s"],["10_37","Isaac's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1616s"],["10_58","The Paladin's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2654s"],["10_38","Stigma of a Meeting",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1644s"],["10_39","Rector's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1683s"],["10_40","Sentinel's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1723s"],["10_41","Byron's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1747s"],["10_42","Stigma of Pieta's Lady",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1797s"],["10_43","Prisoner's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1860s"],["10_44","Tortured Lovers' Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1981s"],["10_45","Stigma of the Tancred, Master of Castigation",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2112s"],["10_46","Stigma of the Hallowed Sentinels",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2151s"],["10_47","Stigma of the Reborn",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2188s"],["10_48","Stigma of Pieta's Request",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2230s"],["10_49","Prayer's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2260s"],["10_50","Stigma of the Judge's Protection",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2277s"],["10_51","Judge Cleric's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2321s"],["10_59","Stigma of a Battle",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2705s"],["10_24","Lightreaper's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=1153s"],["10_52","Bramis' Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2374s"],["10_60","Drustan's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2757s"],["10_53","Stigma of Escape",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2418s"],["10_54","Stigma of Bramis and Fitzroy",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2468s"],["10_55","Stigma of the Sundered Monarch",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2539s"],["10_56","Stigma of Andreas of Ebb",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2565s"],["10_61","Melchior's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2781s"],["10_62","Adyr's Stigma",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2809s"],["10_63","Stigma of Elianne the Starved",0,"https://www.youtube.com/watch?v=zhwjeB_nwMk&amp;t=2830s"]]},{"id":"Remembrances","title":"Remembrances","items":[["11_1","Remembrance of Pieta She of Blessed Renewal",0,"Remembrance+of+Pieta+She+of+Blessed+Renewal"],["11_2","Remembrance of the Congregator of Flesh",0,"Remembrance+of+the+Congregator+of+Flesh"],["11_3","Remembrance of the Hushed Saint",0,"Remembrance+of+the+Hushed+Saint"],["11_4","Remembrance of a Spurned Progeny",0,"Remembrance+of+a+Spurned+Progeny"],["11_5","Remembrance of the Hollow Crow",0,"Remembrance+of+the+Hollow+Crow"],["11_6","Remembrance of the Unbroken Promise",0,"Remembrance+of+the+Unbroken+Promise"],["11_7","Remembrance of Tancred Master of Castigations and Reinhold the Immured",0,"Remembrance+of+Tancred+Master+of+Castigations+and+Reinhold+the+Immured"],["11_8","Remembrance of Judge Cleric the Radiant Sentinel",0,"Remembrance+of+Judge+Cleric+the+Radiant+Sentinel"],["11_9","Remembrance of the Lightreaper",0,"Remembrance+of+the+Lightreaper"],["11_10","Remembrance of the Sundered Monarch",0,"Remembrance+of+the+Sundered+Monarch"],["11_11","Remembrance of Adyr the Bereft Exile",0,"Remembrance+of+Adyr+the+Bereft+Exile"],["11_12","Remembrance of Elianne the Starved",0,"Remembrance+of+Elianne+the+Starved"]]},{"id":"Tincts","title":"Tincts","items":[["12_1","Ancient",0,"Ancient"],["12_2","Argent Hero",0,"Argent+Hero"],["12_3","Ashen",0,"Ashen"],["12_4","Blood Duke",0,"Blood+Duke"],["12_5","Bonelord",0,"Bonelord"],["12_6","Butcher",0,"Butcher"],["12_7","Castigated",0,"Castigated"],["12_8","Charred Lord",0,"Charred+Lord"],["12_9","Chosen",0,"Chosen"],["12_10","Commander",0,"Commander"],["12_11","Contempt",0,"Contempt"],["12_12","Dark Oath",0,"Dark+Oath"],["12_13","Dawnblade",0,"Dawnblade"],["12_14","Devastator",0,"Devastator"],["12_15","Errant",0,"Errant"],["12_16","Exalted",0,"Exalted"],["12_17","Exclusive Bronze Tinct",0,"Exclusive+Bronze+Tinct"],["12_18","Exclusive Gold Tinct",0,"Exclusive+Gold+Tinct"],["12_19","Exclusive Silver Tinct",0,"Exclusive+Silver+Tinct"],["12_20","Exemplar",0,"Exemplar"],["12_21","Familiar",0,"Familiar"],["12_22","Flesh-Tearer",0,"Flesh-Tearer"],["12_23","Forsworn",0,"Forsworn"],["12_24","Guardian",0,"Guardian"],["12_25","Hand-Collector",0,"Hand-Collector"],["12_26","Harbinger",0,"Harbinger"],["12_27","Hungering Shadow",0,"Hungering+Shadow"],["12_28","Icegrip",0,"Icegrip"],["12_29","Justiciar",0,"Justiciar"],["12_30","Lawless",0,"Lawless"],["12_31","Layman",0,"Layman"],["12_32","Livid Hatred",0,"Livid+Hatred"],["12_33","Malice",0,"Malice"],["12_34","Martyr",0,"Martyr"],["12_35","Nohuta",0,"Nohuta"],["12_36","Oathbreaker",0,"Oathbreaker"],["12_37","Paragon",0,"Paragon"],["12_38","Pious",0,"Pious"],["12_39","Pridebound",0,"Pridebound"],["12_40","Rotting Glory",0,"Rotting+Glory"],["12_51","Sellsword",0,"Sellsword"],["12_52","Stalker",0,"Stalker"],["12_41","Starved",0,"Starved"],["12_42","Steam Community - Full Black Tinct",0,"Steam+Community+-+Full+Black+Tinct"],["12_43","Steam Community - Full White Tinct",0,"Steam+Community+-+Full+White+Tinct"],["12_44","Steam Community - Umbral Blue Tinct",0,"Steam+Community+-+Umbral+Blue+Tinct"],["12_45","Sufferer",0,"Sufferer"],["12_46","Supplicant",0,"Supplicant"],["12_47","The Relinquished",0,"The+Relinquished"],["12_48","Venator",0,"Venator"],["12_49","Eerie",0,"Eerie"],["12_50","Warlord",0,"Warlord"]]},{"id":"Runes","title":"Runes","items":[["13_1","Akus",0,"Akus"],["13_2","Atarux",0,"Atarux"],["13_3","Dimexus",0,"Dimexus"],["13_4","Hix",0,"Hix"],["13_5","Nhelaq",0,"Nhelaq"],["13_6","Ornx",0,"Ornx"],["13_7","Pertiax",0,"Pertiax"],["13_8","Qalus",0,"Qalus"],["13_9","Vaus",0,"Vaus"],["13_10","Velox",0,"Velox"],["13_11","Vixys",0,"Vixys"],["13_12","Anarkos",0,"Anarkos"],["13_13","Balago",0,"Balago"],["13_14","Berlam",0,"Berlam"],["13_15","Cybyno",0,"Cybyno"],["13_16","Dhalwe",0,"Dhalwe"],["13_17","Mhorem",0,"Mhorem"],["13_18","Shon",0,"Shon"],["13_19","Tianarx",0,"Tianarx"],["13_20","Trelos",0,"Trelos"],["13_21","Tumul",0,"Tumul"],["13_22","Crafter's Essence",0,"Crafter's+Essence"],["13_23","Devoth",0,"Devoth"],["13_24","Mhakev",0,"Mhakev"],["13_25","Nartun",0,"Nartun"],["13_26","Olandi",0,"Olandi"],["13_27","Orimon",0,"Orimon"],["13_28","Satus",0,"Satus"],["13_29","Aelstrix",0,"Aelstrix"],["13_30","Ativ",0,"Ativ"],["13_31","Gravix",0,"Gravix"],["13_32","Halsan",0,"Halsan"],["13_33","Hilvit",0,"Hilvit"],["13_34","Ixon",0,"Ixon"],["13_35","Oritix",0,"Oritix"],["13_36","Relox",0,"Relox"],["13_37","Ruq",0,"Ruq"],["13_38","Scaeve",0,"Scaeve"],["13_39","Xiax",0,"Xiax"]]},{"id":"Locations","title":"Locations","items":[["14_1","Defiled Sepulchre",0,"Defiled+Sepulchre"],["14_2","Abandoned Redcopse",0,"Abandoned+Redcopse"],["14_3","Skyrest Bridge",0,"Skyrest+Bridge"],["14_4","Pilgrim's Perch",0,"Pilgrim's+Perch"],["14_5","Forsaken Fen",0,"Forsaken+Fen"],["14_6","Fitzroy's Gorge",0,"Fitzroy's+Gorge"],["14_7","Lower Calrath",0,"Lower+Calrath"],["14_8","Upper Calrath",0,"Upper+Calrath"],["14_9","Sunless Skein",0,"Sunless+Skein"],["14_10","Cistern",0,"Cistern"],["14_11","Fief of the Chill Curse",0,"Fief+of+the+Chill+Curse"],["14_12","Revelation Depths",0,"Revelation+Depths"],["14_13","Path of Devotion",0,"Path+of+Devotion"],["14_14","Manse of the Hallowed Brothers",0,"Manse+of+the+Hallowed+Brothers"],["14_15","Tower of Penance",0,"Tower+of+Penance"],["14_16","Abbey of the Hallowed Sisters",0,"Abbey+of+the+Hallowed+Sisters"],["14_17","The Empyrean",0,"The+Empyrean"],["14_18","Bramis Castle",0,"Bramis+Castle"],["14_19","Mother's Lull",0,"Mother's+Lull"]]}];

const CHECKLIST_ICONS = {
  Weapons: "swords", Armor: "shield", Rings: "circle-dot",
  Pendants: "gem", Spells: "sparkles", Ammunitions: "package",
  Umbral_Eyes: "eye", Bosses: "skull", Questlist: "scroll",
  Gestures: "hand", Stigmas: "flame", Remembrances: "bookmark",
  Tincts: "flask-conical", Runes: "pentagon", Locations: "map-pin"
};

const ENDINGS = {
  inferno: {
    label: "Inferno (Adyr)",
    short: "Inferno",
    accent: "bg-red-700/40 border-red-600/60 text-red-200",
    pill: "bg-gradient-to-r from-red-700 to-orange-600 text-zinc-950",
    desc: "Defile beacons (do NOT cleanse), follow Damarose, place Adyr Rune in Bramis pedestal."
  },
  radiance: {
    label: "Radiance",
    short: "Radiance",
    accent: "bg-amber-500/30 border-amber-400/60 text-amber-100",
    pill: "bg-gradient-to-r from-amber-300 to-yellow-200 text-zinc-950",
    desc: "Cleanse all 5 beacons with Sanctify before each Beacon boss. Defeat all Sentinels."
  },
  umbral: {
    label: "Umbral",
    short: "Umbral",
    accent: "bg-fuchsia-700/30 border-fuchsia-500/50 text-fuchsia-200",
    pill: "bg-gradient-to-r from-violet-700 to-fuchsia-700 text-zinc-100",
    desc: "Get all 4 Umbral Parasites: Harkyn, Pieta, then Skyrest pillar slots. Beat Elianne the Starved."
  }
};

const RUN_DEFAULTS = {
  run1: { label: "First Run", ending: "inferno" },
  run2: { label: "Second Run", ending: "radiance" },
  run3: { label: "Third Run", ending: "umbral" }
};

const STORAGE_KEY = "lotf-checklist-2026-v2";
const SCHEMA_VERSION = 2;

// ===========================================================================
// STORAGE
// ===========================================================================
async function storeGet(key) {
  try {
    if (typeof window !== "undefined" && window.storage && window.storage.get) {
      const r = await window.storage.get(key);
      return r && r.value ? r.value : null;
    }
  } catch (e) {}
  try {
    if (typeof localStorage !== "undefined") return localStorage.getItem(key);
  } catch (e) {}
  return null;
}

async function storeSet(key, value) {
  try {
    if (typeof window !== "undefined" && window.storage && window.storage.set) {
      await window.storage.set(key, value);
      return true;
    }
  } catch (e) {}
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
      return true;
    }
  } catch (e) {}
  return false;
}

function makeRun(label, ending) {
  return { label, ending, checked: {}, revealed: {}, checklistChecked: {} };
}

function makeDefaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    activeTab: "playthrough",
    activeRun: "run1",
    runs: {
      run1: makeRun(RUN_DEFAULTS.run1.label, RUN_DEFAULTS.run1.ending),
      run2: makeRun(RUN_DEFAULTS.run2.label, RUN_DEFAULTS.run2.ending),
      run3: makeRun(RUN_DEFAULTS.run3.label, RUN_DEFAULTS.run3.ending)
    },
    spoilerMode: true,
    badgeFilter: "all",
    search: "",
    collapsed: {},
    checklistCollapsed: {},
    showHelp: false
  };
}

// ===========================================================================
// SHARED COMPONENTS
// ===========================================================================
function Badge({ kind }) {
  if (kind === 1) {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-amber-700/30 border border-amber-500/50 text-amber-200 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 select-none whitespace-nowrap">
        <AlertTriangle className="w-3 h-3" />Stop
      </span>
    );
  }
  if (kind === 2) {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-red-900/40 border border-red-500/50 text-red-200 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 select-none whitespace-nowrap">
        <AlertOctagon className="w-3 h-3" />Missable
      </span>
    );
  }
  return null;
}

function PathBadge({ paths }) {
  if (!paths || !paths.length) return null;
  return (
    <>
      {paths.map(p => {
        const meta = ENDINGS[p];
        if (!meta) return null;
        return (
          <span key={p} className={`text-[9px] uppercase font-bold tracking-wider ${meta.pill} px-1.5 py-0.5 rounded whitespace-nowrap`}>
            {meta.short}
          </span>
        );
      })}
    </>
  );
}

function HighlightedText({ text, query }) {
  if (!query) return <>{text}</>;
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-amber-400/30 text-amber-100 rounded-sm px-0.5">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

// ===========================================================================
// PLAYTHROUGH ITEM ROW
// ===========================================================================
function PlaythroughItem({ item, checked, revealed, spoilerMode, search, onToggleCheck, onReveal }) {
  const [id, text, badge, spoiler, paths] = item;
  const isSpoiler = spoiler === 1;
  const hide = spoilerMode && isSpoiler && !revealed;

  return (
    <li className={`group flex gap-2 items-start py-1.5 px-2 rounded transition-colors ${
      checked ? "bg-emerald-950/30" : "hover:bg-zinc-800/40"
    } ${badge === 1 ? "border-l-2 border-amber-500/60" : badge === 2 ? "border-l-2 border-red-500/60" : ""}`}>
      <button
        onClick={() => onToggleCheck(id)}
        className="mt-0.5 flex-shrink-0 text-zinc-500 hover:text-emerald-400 transition-colors"
        aria-label={checked ? "Mark as incomplete" : "Mark as complete"}
      >
        {checked ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {badge > 0 && <Badge kind={badge} />}
          <PathBadge paths={paths} />
          {hide ? (
            <button
              onClick={() => onReveal(id)}
              className="text-sm italic text-zinc-500 hover:text-amber-300 transition-colors text-left"
            >
              [ Spoiler — click to reveal ]
            </button>
          ) : (
            <span className={`text-sm leading-snug ${checked ? "line-through text-zinc-500" : "text-zinc-200"}`}>
              <HighlightedText text={text} query={search} />
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

// ===========================================================================
// PLAYTHROUGH AREA CARD
// ===========================================================================
function PlaythroughArea({ area, items, runState, spoilerMode, search, collapsed, onToggleCollapse, onToggleCheck, onReveal }) {
  const total = items.length;
  const done = items.filter(it => runState.checked[it[0]]).length;
  const remainStops = items.filter(it => it[2] === 1 && !runState.checked[it[0]]).length;
  const remainMiss = items.filter(it => it[2] === 2 && !runState.checked[it[0]]).length;
  const pct = total ? (done / total) * 100 : 0;
  const isComplete = total > 0 && done === total;
  const endingMeta = area.ending ? ENDINGS[area.ending] : null;

  return (
    <section className={`rounded-lg overflow-hidden border ${endingMeta ? "border-zinc-700" : "border-zinc-800"} bg-zinc-900/60`}>
      <button
        onClick={() => onToggleCollapse(area.slug)}
        className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 hover:bg-zinc-800/40 transition-colors text-left"
      >
        {collapsed
          ? <ChevronRight className="w-4 h-4 flex-shrink-0 text-zinc-500" />
          : <ChevronDown className="w-4 h-4 flex-shrink-0 text-zinc-500" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-semibold text-sm sm:text-base ${endingMeta ? "text-amber-100" : "text-zinc-100"}`}>
              {area.title}
            </h3>
            {endingMeta && (
              <span className={`text-[10px] uppercase tracking-wider ${endingMeta.pill} font-bold px-2 py-0.5 rounded`}>
                {endingMeta.short} ending
              </span>
            )}
            {remainStops > 0 && (
              <span className="text-[10px] text-amber-300 bg-amber-700/20 border border-amber-600/40 px-1.5 py-0.5 rounded font-medium">
                {remainStops} stop
              </span>
            )}
            {remainMiss > 0 && (
              <span className="text-[10px] text-red-300 bg-red-900/30 border border-red-600/40 px-1.5 py-0.5 rounded font-medium">
                {remainMiss} missable
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 flex-shrink-0">
          <span className={isComplete ? "text-emerald-400 font-semibold" : ""}>
            {done}/{total}
          </span>
          <div className="w-12 sm:w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full ${isComplete ? "bg-emerald-500" : "bg-amber-500"} transition-all`} style={{ width: pct + "%" }} />
          </div>
        </div>
      </button>
      {!collapsed && items.length > 0 && (
        <ul className="px-2 py-1 border-t border-zinc-800">
          {items.map(item => (
            <PlaythroughItem
              key={item[0]}
              item={item}
              checked={!!runState.checked[item[0]]}
              revealed={!!runState.revealed[item[0]]}
              spoilerMode={spoilerMode}
              search={search}
              onToggleCheck={onToggleCheck}
              onReveal={onReveal}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

// ===========================================================================
// CHECKLIST ITEM ROW
// ===========================================================================
function ChecklistItem({ item, checked, search, onToggle }) {
  const [id, text] = item;
  const flags = item[2] || 0;
  const urlSlug = item[3];
  const isMissable = flags & 1;
  const isPatch = flags & 2;
  const wikiUrl = urlSlug
    ? (urlSlug.startsWith("http") ? urlSlug : "https://thelordsofthefallen.wiki.fextralife.com/" + urlSlug)
    : null;

  return (
    <li className={`flex gap-2 items-start py-1 px-2 rounded transition-colors ${
      checked ? "bg-emerald-950/30" : "hover:bg-zinc-800/40"
    }`}>
      <button
        onClick={() => onToggle(id)}
        className="mt-0.5 flex-shrink-0 text-zinc-500 hover:text-emerald-400 transition-colors"
        aria-label={checked ? "Mark as not collected" : "Mark as collected"}
      >
        {checked ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
      </button>
      <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
        {wikiUrl ? (
          <a
            href={wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm leading-snug inline-flex items-center gap-1 group/link ${
              checked ? "line-through text-zinc-500 hover:text-zinc-400" : "text-zinc-200 hover:text-amber-300"
            }`}
            title={`Open ${text} on Fextralife wiki`}
            onClick={(e) => e.stopPropagation()}
          >
            <HighlightedText text={text} query={search} />
            <ExternalLink className="w-3 h-3 opacity-30 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
          </a>
        ) : (
          <span className={`text-sm leading-snug ${checked ? "line-through text-zinc-500" : "text-zinc-200"}`}>
            <HighlightedText text={text} query={search} />
          </span>
        )}
        {isMissable ? (
          <span className="text-[9px] uppercase tracking-wider bg-red-900/40 border border-red-500/50 text-red-200 px-1.5 py-0.5 rounded font-bold">
            Missable
          </span>
        ) : null}
        {isPatch ? (
          <span className="text-[9px] uppercase tracking-wider bg-violet-700/30 border border-violet-500/40 text-violet-200 px-1.5 py-0.5 rounded font-bold">
            New
          </span>
        ) : null}
      </div>
    </li>
  );
}

// ===========================================================================
// CHECKLIST CATEGORY CARD
// ===========================================================================
function ChecklistCategory({ category, items, checkedMap, search, collapsed, onToggleCollapse, onToggleItem }) {
  const total = items.length;
  const done = items.filter(it => checkedMap[it[0]]).length;
  const pct = total ? (done / total) * 100 : 0;
  const isComplete = total > 0 && done === total;

  return (
    <section className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/60">
      <button
        onClick={() => onToggleCollapse(category.id)}
        className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 hover:bg-zinc-800/40 transition-colors text-left"
      >
        {collapsed
          ? <ChevronRight className="w-4 h-4 flex-shrink-0 text-zinc-500" />
          : <ChevronDown className="w-4 h-4 flex-shrink-0 text-zinc-500" />}
        <h3 className="font-semibold text-zinc-100 flex-1 text-sm sm:text-base">{category.title}</h3>
        <div className="flex items-center gap-2 text-xs text-zinc-400 flex-shrink-0">
          <span className={isComplete ? "text-emerald-400 font-semibold" : ""}>
            {done}/{total}
          </span>
          <div className="w-12 sm:w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full ${isComplete ? "bg-emerald-500" : "bg-violet-500"} transition-all`} style={{ width: pct + "%" }} />
          </div>
        </div>
      </button>
      {!collapsed && items.length > 0 && (
        <ul className="px-2 py-1 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-x-2">
          {items.map(item => (
            <ChecklistItem
              key={item[0]}
              item={item}
              checked={!!checkedMap[item[0]]}
              search={search}
              onToggle={onToggleItem}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

// ===========================================================================
// HELP PANEL
// ===========================================================================
function HelpPanel({ onClose }) {
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900/80 p-4 mb-4 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-200" aria-label="Close help">
        <X className="w-4 h-4" />
      </button>
      <h2 className="font-semibold text-zinc-100 mb-2 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-400" />
        How this works
      </h2>
      <ul className="space-y-1.5 text-xs text-zinc-300 leading-relaxed list-disc list-inside marker:text-zinc-600">
        <li><span className="text-amber-300 font-bold">⚠ STOP</span> — must do this before progressing further or a quest fails.</li>
        <li><span className="text-red-300 font-bold">MISSABLE</span> — irreversibly lost if skipped at this point.</li>
        <li>Items tagged with an ending pill (Inferno / Radiance / Umbral) only appear when that run is selected.</li>
        <li>The three endings require separate playthroughs — you cannot get all three in one run.</li>
        <li><span className="font-medium text-zinc-100">Spoilers hidden</span> blurs major boss-kill items behind a click. Toggle off if you don't mind seeing names.</li>
        <li><span className="font-medium text-zinc-100">Playthrough tab</span> tracks per-run quest progress — switch runs at the top.</li>
        <li><span className="font-medium text-zinc-100">Checklists tab</span> tracks 1,085 collectibles (weapons, armor, spells, runes, gestures, stigmas, bosses, locations, etc.) shared across all runs.</li>
        <li><span className="font-medium text-zinc-100">Export</span> downloads everything as JSON. Send the file to your friend; they import it to start from your state.</li>
        <li>Progress saves automatically.</li>
      </ul>
      <p className="text-[11px] text-zinc-500 mt-3">
        Sources: Fextralife wiki Walkthrough, Quests, Game Progress Route, and Patch Notes pages. Verified against the Patch 2.5 (Dec 2025) final update — Veteran Mode, Veteran of the Veil set, Three Spirits weapons, Season of Revelry ammo all included.
      </p>
    </div>
  );
}

// ===========================================================================
// MAIN APP
// ===========================================================================
export default function App() {
  const [state, setState] = useState(makeDefaultState);
  const [loaded, setLoaded] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await storeGet(STORAGE_KEY);
      if (mounted && stored) {
        try {
          const parsed = JSON.parse(stored);
          const def = makeDefaultState();
          // Migrate from v1 if needed
          const runs = {};
          for (const k of Object.keys(def.runs)) {
            const inc = (parsed.runs && parsed.runs[k]) || {};
            runs[k] = { ...def.runs[k], ...inc, checklistChecked: inc.checklistChecked || {} };
          }
          setState({ ...def, ...parsed, runs });
        } catch (e) {}
      }
      if (mounted) setLoaded(true);
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (loaded) storeSet(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  const activeRun = state.runs[state.activeRun] || state.runs.run1;
  const activeEnding = activeRun.ending;

  // ---- Playthrough filtering ----
  const ptVisible = useMemo(() => {
    return AREAS.filter(area => !area.ending || area.ending === activeEnding).map(area => {
      // Filter items by path scope too (item-level paths)
      const items = area.items.filter(it => {
        const itemPaths = it[4];
        if (itemPaths && itemPaths.length && !itemPaths.includes(activeEnding)) return false;
        return true;
      });
      return { ...area, items };
    });
  }, [activeEnding]);

  const ptFiltered = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    return ptVisible.map(area => {
      let items = area.items;
      if (state.badgeFilter === "stop") items = items.filter(i => i[2] === 1);
      else if (state.badgeFilter === "missable") items = items.filter(i => i[2] === 2);
      else if (state.badgeFilter === "critical-open") {
        items = items.filter(i => (i[2] === 1 || i[2] === 2) && !activeRun.checked[i[0]]);
      }
      if (q) items = items.filter(i => i[1].toLowerCase().includes(q));
      return { ...area, items };
    }).filter(a => a.items.length > 0);
  }, [ptVisible, state.search, state.badgeFilter, activeRun.checked]);

  const ptStats = useMemo(() => {
    let total = 0, done = 0, miss = 0, missDone = 0, stop = 0, stopDone = 0;
    for (const area of ptVisible) {
      for (const item of area.items) {
        total++;
        const c = !!activeRun.checked[item[0]];
        if (c) done++;
        if (item[2] === 1) { stop++; if (c) stopDone++; }
        if (item[2] === 2) { miss++; if (c) missDone++; }
      }
    }
    return { total, done, miss, missDone, stop, stopDone };
  }, [ptVisible, activeRun.checked]);

  // ---- Checklist filtering ----
  const clFiltered = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    return CHECKLISTS.map(cat => {
      let items = cat.items;
      if (q) items = items.filter(i => i[1].toLowerCase().includes(q));
      if (state.badgeFilter === "missable") items = items.filter(i => (i[2] || 0) & 1);
      else if (state.badgeFilter === "critical-open") {
        items = items.filter(i => ((i[2] || 0) & 1) && !activeRun.checklistChecked[i[0]]);
      }
      return { ...cat, items };
    }).filter(c => c.items.length > 0);
  }, [state.search, state.badgeFilter, activeRun.checklistChecked]);

  const clStats = useMemo(() => {
    let total = 0, done = 0;
    for (const cat of CHECKLISTS) {
      for (const item of cat.items) {
        total++;
        if (activeRun.checklistChecked[item[0]]) done++;
      }
    }
    return { total, done };
  }, [activeRun.checklistChecked]);

  // ---- Handlers ----
  const updateRun = useCallback((runId, updater) => {
    setState(s => ({
      ...s,
      runs: { ...s.runs, [runId]: typeof updater === "function" ? updater(s.runs[runId]) : updater }
    }));
  }, []);

  const togglePtCheck = useCallback((id) => {
    updateRun(state.activeRun, r => ({ ...r, checked: { ...r.checked, [id]: !r.checked[id] } }));
  }, [state.activeRun, updateRun]);

  const reveal = useCallback((id) => {
    updateRun(state.activeRun, r => ({ ...r, revealed: { ...r.revealed, [id]: true } }));
  }, [state.activeRun, updateRun]);

  const toggleClCheck = useCallback((id) => {
    updateRun(state.activeRun, r => ({
      ...r,
      checklistChecked: { ...r.checklistChecked, [id]: !r.checklistChecked[id] }
    }));
  }, [state.activeRun, updateRun]);

  const togglePtCollapse = useCallback((slug) => {
    setState(s => ({ ...s, collapsed: { ...s.collapsed, [slug]: !s.collapsed[slug] } }));
  }, []);

  const toggleClCollapse = useCallback((id) => {
    setState(s => ({ ...s, checklistCollapsed: { ...s.checklistCollapsed, [id]: !s.checklistCollapsed[id] } }));
  }, []);

  const collapseAll = () => {
    if (state.activeTab === "playthrough") {
      const all = {};
      for (const a of AREAS) all[a.slug] = true;
      setState(s => ({ ...s, collapsed: all }));
    } else {
      const all = {};
      for (const c of CHECKLISTS) all[c.id] = true;
      setState(s => ({ ...s, checklistCollapsed: all }));
    }
  };
  const expandAll = () => {
    if (state.activeTab === "playthrough") setState(s => ({ ...s, collapsed: {} }));
    else setState(s => ({ ...s, checklistCollapsed: {} }));
  };

  const exportJson = () => {
    try {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lotf-checklist-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      try {
        navigator.clipboard.writeText(JSON.stringify(state, null, 2));
        alert("Download blocked — checklist JSON copied to clipboard instead.");
      } catch (e2) {
        alert("Export failed.");
      }
    }
  };

  const onImport = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const def = makeDefaultState();
        const runs = {};
        for (const k of Object.keys(def.runs)) {
          const inc = (parsed.runs && parsed.runs[k]) || {};
          runs[k] = { ...def.runs[k], ...inc, checklistChecked: inc.checklistChecked || {} };
        }
        setState({ ...def, ...parsed, runs });
      } catch (err) {
        alert("Could not read that file. Make sure it is a valid checklist JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const resetCurrentTab = () => {
    const tabName = state.activeTab === "playthrough" ? "playthrough progress" : "collectibles";
    if (typeof window !== "undefined" && !window.confirm(`Reset ${tabName} for "${activeRun.label}"? This cannot be undone.`)) return;
    if (state.activeTab === "playthrough") {
      updateRun(state.activeRun, r => ({ ...r, checked: {}, revealed: {} }));
    } else {
      updateRun(state.activeRun, r => ({ ...r, checklistChecked: {} }));
    }
  };

  const renameRun = () => {
    const next = typeof window !== "undefined" ? window.prompt("Run name:", activeRun.label) : null;
    if (next && next.trim()) updateRun(state.activeRun, r => ({ ...r, label: next.trim() }));
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-500 flex items-center justify-center">
        <div className="text-sm">Loading checklist…</div>
      </div>
    );
  }

  // ---- Render ----
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 flex items-center justify-center shadow-lg flex-shrink-0">
                <Trophy className="w-4 h-4 text-zinc-900" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-zinc-100 text-base sm:text-lg leading-tight truncate">Lords of the Fallen</h1>
                <p className="text-[11px] text-zinc-500 leading-tight">Completionist Checklist · Patch 2.5 · 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setState(s => ({ ...s, showHelp: !s.showHelp }))}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium border bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200"
                title="How this works"
              >
                <Info className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Help</span>
              </button>
              <button
                onClick={() => setState(s => ({ ...s, spoilerMode: !s.spoilerMode }))}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium border transition-colors ${
                  state.spoilerMode
                    ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    : "bg-amber-900/40 border-amber-600/50 text-amber-200 hover:bg-amber-900/60"
                }`}
                title="Toggle spoiler mode"
              >
                {state.spoilerMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{state.spoilerMode ? "Spoilers hidden" : "Spoilers shown"}</span>
              </button>
              <button onClick={exportJson} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs font-medium" title="Export progress as JSON">
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs font-medium cursor-pointer" title="Import progress from JSON file">
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Import</span>
                <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={onImport} />
              </label>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-3 flex gap-1 border-b border-zinc-800 -mb-px">
            <button
              onClick={() => setState(s => ({ ...s, activeTab: "playthrough" }))}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                state.activeTab === "playthrough"
                  ? "border-amber-500 text-amber-200"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <MapIcon className="w-4 h-4" />Playthrough
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{ptStats.done}/{ptStats.total}</span>
            </button>
            <button
              onClick={() => setState(s => ({ ...s, activeTab: "checklists" }))}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                state.activeTab === "checklists"
                  ? "border-violet-500 text-violet-200"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ListChecks className="w-4 h-4" />Collectibles
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{clStats.done}/{clStats.total}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 pt-4">
        {state.showHelp && <HelpPanel onClose={() => setState(s => ({ ...s, showHelp: false }))} />}

        {/* Run selector */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {Object.keys(state.runs).map(id => {
            const run = state.runs[id];
            const ending = ENDINGS[run.ending];
            const ptCount = Object.values(run.checked || {}).filter(Boolean).length;
            const clCount = Object.values(run.checklistChecked || {}).filter(Boolean).length;
            const isActive = state.activeRun === id;
            return (
              <button
                key={id}
                onClick={() => setState(s => ({ ...s, activeRun: id }))}
                className={`p-2 sm:p-3 rounded-lg border text-left transition-all ${
                  isActive
                    ? "bg-zinc-800 border-amber-600/60 ring-1 ring-amber-600/30"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1 gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">{id.replace("run", "Run ")}</span>
                  <span className={`text-[9px] uppercase font-bold tracking-wider ${ending.pill} px-1.5 py-0.5 rounded whitespace-nowrap`}>
                    {ending.short}
                  </span>
                </div>
                <div className="font-semibold text-sm truncate">{run.label}</div>
                <div className="text-[11px] text-zinc-500">
                  <span className="text-emerald-400">{ptCount}</span> quests · <span className="text-violet-400">{clCount}</span> items
                </div>
              </button>
            );
          })}
        </div>

        {/* Active-run controls */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={renameRun} className="text-[11px] px-2 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded">
              Rename
            </button>
            <select
              value={activeRun.ending}
              onChange={(e) => updateRun(state.activeRun, r => ({ ...r, ending: e.target.value }))}
              className="text-[11px] px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-200 focus:border-amber-600/50 focus:outline-none"
              title="Change ending path for this run"
            >
              {Object.keys(ENDINGS).map(k => (
                <option key={k} value={k}>{ENDINGS[k].label}</option>
              ))}
            </select>
            <button onClick={expandAll} className="text-[11px] px-2 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded">
              Expand
            </button>
            <button onClick={collapseAll} className="text-[11px] px-2 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded">
              Collapse
            </button>
            <button onClick={resetCurrentTab} className="flex items-center gap-1 text-[11px] px-2 py-1 bg-zinc-800 hover:bg-red-900/40 border border-zinc-700 hover:border-red-700/50 rounded">
              <RotateCcw className="w-3 h-3" />Reset
            </button>
          </div>

          {state.activeTab === "playthrough" && (
            <div className="flex items-center gap-3 text-[11px] sm:text-xs">
              <span className="text-zinc-400">
                <span className="text-emerald-400 font-semibold">{ptStats.done}</span>
                <span className="text-zinc-500"> / {ptStats.total}</span>
              </span>
              <span className="text-amber-300">
                <AlertTriangle className="w-3 h-3 inline -mt-0.5 mr-0.5" />{ptStats.stopDone}/{ptStats.stop}
              </span>
              <span className="text-red-300">
                <AlertOctagon className="w-3 h-3 inline -mt-0.5 mr-0.5" />{ptStats.missDone}/{ptStats.miss}
              </span>
            </div>
          )}
          {state.activeTab === "checklists" && (
            <div className="flex items-center gap-3 text-[11px] sm:text-xs">
              <span className="text-zinc-400">
                <span className="text-violet-400 font-semibold">{clStats.done}</span>
                <span className="text-zinc-500"> / {clStats.total}</span>
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
          {state.activeTab === "playthrough" ? (
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
              style={{ width: (ptStats.total ? (ptStats.done / ptStats.total) * 100 : 0) + "%" }}
            />
          ) : (
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-300"
              style={{ width: (clStats.total ? (clStats.done / clStats.total) * 100 : 0) + "%" }}
            />
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder={state.activeTab === "playthrough" ? "Search quests, NPCs, bosses..." : "Search weapons, armor, spells..."}
              value={state.search}
              onChange={(e) => setState(s => ({ ...s, search: e.target.value }))}
              className="w-full pl-9 pr-8 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded focus:border-amber-600/50 focus:outline-none placeholder:text-zinc-600"
            />
            {state.search && (
              <button
                onClick={() => setState(s => ({ ...s, search: "" }))}
                className="absolute right-2 top-2 text-zinc-500 hover:text-zinc-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={state.badgeFilter}
            onChange={(e) => setState(s => ({ ...s, badgeFilter: e.target.value }))}
            className="text-sm px-3 py-2 bg-zinc-900 border border-zinc-800 rounded focus:border-amber-600/50 focus:outline-none"
          >
            <option value="all">All items</option>
            {state.activeTab === "playthrough" && <option value="stop">Stop only</option>}
            <option value="missable">Missable only</option>
            <option value="critical-open">Open critical only</option>
          </select>
        </div>
      </div>

      {/* Tab content */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 pb-12 space-y-2">
        {state.activeTab === "playthrough" && (
          <>
            {ptFiltered.map(area => (
              <PlaythroughArea
                key={area.slug}
                area={area}
                items={area.items}
                runState={activeRun}
                spoilerMode={state.spoilerMode}
                search={state.search}
                collapsed={!!state.collapsed[area.slug]}
                onToggleCollapse={togglePtCollapse}
                onToggleCheck={togglePtCheck}
                onReveal={reveal}
              />
            ))}
            {ptFiltered.length === 0 && (
              <div className="text-center py-12 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-lg">
                No items match your filters. Try clearing the search or changing the badge filter.
              </div>
            )}
          </>
        )}

        {state.activeTab === "checklists" && (
          <>
            {clFiltered.map(cat => (
              <ChecklistCategory
                key={cat.id}
                category={cat}
                items={cat.items}
                checkedMap={activeRun.checklistChecked}
                search={state.search}
                collapsed={!!state.checklistCollapsed[cat.id]}
                onToggleCollapse={toggleClCollapse}
                onToggleItem={toggleClCheck}
              />
            ))}
            {clFiltered.length === 0 && (
              <div className="text-center py-12 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-lg">
                No collectibles match your filters.
              </div>
            )}
          </>
        )}

        <footer className="pt-8 pb-4 text-[11px] text-zinc-600 text-center space-y-1">
          {state.activeTab === "playthrough" ? (
            <p>{ptStats.total} quest items · {ptStats.stop} stops · {ptStats.miss} missable · 3 endings · 25 areas</p>
          ) : (
            <p>{clStats.total} collectibles across {CHECKLISTS.length} categories — items, weapons, armor, spells, runes, gestures, stigmas, bosses, locations</p>
          )}
          <p>Sourced from Fextralife wiki Walkthrough, Quests, Game Progress Route. Verified against Patch 2.5 (Dec 2025) — final major update.</p>
        </footer>
      </main>
    </div>
  );
}
