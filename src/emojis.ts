const emojis = {
  bullet: "<:bullet:1007341922479771648>",
  loading: "<a:loading:857273691124400159>",
  blank: "<:blank:1002523614345703424>",
  mark: "<:mark:1137785360005468322>",
  silver_mark: "<:silver_mark:986634284355969026>",
  xp: "<:xp:987750164481597480>",
  floor: "<:staircase:1137785361850957995>",
  plus: "<:plus:987810098183303208>",
  health: "<:health:1137785046804213870>",
  error: "<:error:1093637241215144006>",
  i_cursor: "<:i_cursor:1096550891533905972>",
  info: "<:info:1203301428844822579>",
  question_mark: "<:question_mark:1204075149511360542>",
  magic: "<:magic:1137753181431009404>",
  gold_arrow: "<:gold_arrow:1138473885457715230>",
  green_arrow: "<:green_arrow:1138476227653533706>",
  green_side_arrow: "<:green_side_arrow:1138477150362669086>",
  gold_side_arrow: "<:side_arrow_gold:1201151365381107732>",
  side_arrow: "<:side_arrow:1138477540302921780>",
  red_x: "<:x_:1138786810584125440>",
  star: "<:star:1138789465675026472>",
  eye_dropper: "<:eye_dropper:1198309178737954876>",
  coalition: "<a:coalition:1198916667384799264>",
  line: "<:line:1138480015739211927>",
  buff: "<:Buff:1204094385869037568>",
  debuff: "<:Debuff:1204094388318502952>",
  weapons: {
    axe: "<:axe:1137354627361280081>",
    sword: "<:sword:1137355113648902144>",
    spear: "<:spear:1137356308077613056>",
    bow: "<:bow:1137358810730733638>",
    unarmed: "<:unarmed:1137363270945226832>",
    amplifier: "<:amplifier:1137757793873580083>",
    hammer: "<:hammer:1137757795429658664>",
    shield: "<:shield:1137757799829487706>",
    staff: "<:staff:1137757802488668170>",
    halberd: "<:halberd:1201860524011425822>",
  },
  traits: {
    strength: "<:strength:1137785050176430301>",
    vitality: "<:vitality:1137785051996770455>",
    arcane: "<:arcane:1137785038495293500>",
    defense: "<:defence:1137785039871021056>",
  },
  stats: {
    health: "<:health:1137785046804213870>",
    maxHP: "<:HP:1138615553947340840>",
    ATK: "<:ATK:1138615548423454853>",
    MAG: "<:MAG:1138615557411852469>",
    SPC: "<:Special:1203299542506676235>",
    RES: "<:RES:1138615608741744821>",
    MAG_RES: "<:MAG_RES:1138615555432120320>",
    SPC_RES: "<:SpecialResistance:1203294301967360071>",
    SPD: "<:SPD:1138616650074165318>",
    CR: "<:CR:1138615551741141092>",
    CD: "<:CD:1138615550449299476>",
    AR: "<:AR:1138615546552799332>",
    AD: "<:AD:1138615541326688406>",
    AGR: "<:AGR:1138615545223200768>",
  },
  damage: {
    fire: "<:fire_damage:988863829146468352>",
    water: "<:water_damage:988862206651301898>",
    air: "<:air_damage:988870803963666482>",
    earth: "<:earth_damage:988870754085003365>",
    void: "<:void_damage:988923541799989288>",
    light: "<:light_damage:988923540571033640>",
    bludgeoning: "<:bludgeoning_damage:988918961313828864>",
    piercing: "<:piercing_damage:988918962559524974>",
    slashing: "<:slashing_damage:988918963595542589>",
  },
  activities: {
    mining: "⛏️",
    fishing: "🐟",
    woodcutting: "🌲",
  },
  bars: {
    red: {
      left: "<:red_left:1135151848223940638>",
      middle: "<:red_middle:1135151850572763166>",
      right: "<:red_right:1135151851990429737>",
    },
    green: {
      left: "<:green_left:1135151839801790526>",
      middle: "<:green_middle:1135151843027197952>",
      right: "<:green_right:1135151845266964541>",
    },
    empty: {
      left: "<:empty_left:1135151830989541437>",
      middle: "<:empty_middle:1135151834605039707>",
      right: "<:empty_right:1135151836475687054>",
    },
    orange: {
      left: "<:orange_left:1135157691845726279>",
      middle: "<:orange_middle:1135157693364060272>",
      right: "<:orange_right:1135157695314403381>",
    },
    white: {
      left: "<:white_left:1135159498814804040>",
      middle: "<:white_middle:1135159501755002921>",
      right: "<:white_right:1135159502962970625>",
    },
  },
  items: {
    map: "🗺️",
    recipe: "📜",
    fabric: "<:fabric:1137774158793670748>",
    goblin_skin: "<:goblin_skin:1137775905062785084>",
    apple: "<:apple:1137785903281082469>",
    grey_shard: "<:grey_shard:1137785904463880222>",
    potion: "<:potion:1137785907328590067>",
    rock: "<:rock:1137785910080053348>",
    slimeball: "<:slimeball:1137785911619362857>",
    stick: "<:stick:1137785914190483467>",
    sword_handle: "<:sword_handle:1137785916136628244>",
    leather: "<:leather:1202205924299915314>",
    frog_tongue: "<:frog_tongue:1202205927315611698>",
  },
  enemies: {
    sentient_rock: "<:sentient_rock:1203553772119531540>",
    green_frog: "<:green_frog:1203553773394591815>",
    milky_frog: "<:milky_frog:1203553775848136714>",
    evil_frog: "<:evil_frog:1203553777160949831>",
    the_rock: "<:the_rock:1203553779803488356>",
    placeholder: "<:placeholder:1203553780658995262>",
    wet_slime: "<:wet_slime:1203553783209140264>",
    small_slime: "<:small_slime:1203553784324694069>",
    hungry_goblin: "<:hungry_goblin:1203553786149343232>",
    hobgoblin: "<:hobgoblin:1203553788078587904>",
    brown_frog: "<:brown_frog:1203553790284791838>",
    baby_goblin: "<:baby_goblin:1203553793275465728>",
    burning_slime: "<:burning_slime:1203553837634420856>",
    big_slime: "<:big_slime:1203553839748489256>",
  },
};
export default emojis;
