/**
* Canonical nutrient definitions with category, aliases, and default unit.
* This is the single source of truth for what the system recognizes.
*
* Categories:
*   energy, macronutrient, vitamin, mineral, fatty_acid, amino_acid,
*   herbal, mushroom, plant_extract, probiotic, enzyme, specialty
*/

export interface NutrientDef {
    standard_name: string;
    category: string;
    aliases: string[];
    default_unit: string;
}

export const NUTRIENT_DEFINITIONS: NutrientDef[] = [

    // =====================================================================
    // ENERGY
    // =====================================================================
    { standard_name: "energy", category: "energy", aliases: ["calories", "energy", "brennwert", "energie", "calorieën", "valeur énergétique"], default_unit: "kcal" },

    // =====================================================================
    // MACRONUTRIENTS
    // =====================================================================
    { standard_name: "total_fat", category: "macronutrient", aliases: ["total fat", "fat", "fett", "vetten", "matières grasses", "lipides"], default_unit: "g" },
    { standard_name: "saturated_fat", category: "macronutrient", aliases: ["saturated fat", "saturates", "gesättigte fettsäuren", "verzadigde vetzuren", "acides gras saturés"], default_unit: "g" },
    { standard_name: "trans_fat", category: "macronutrient", aliases: ["trans fat", "trans-fettsäuren", "transvetten", "acides gras trans"], default_unit: "g" },
    { standard_name: "monounsaturated_fat", category: "macronutrient", aliases: ["monounsaturated fat", "monounsaturates", "einfach ungesättigte fettsäuren"], default_unit: "g" },
    { standard_name: "polyunsaturated_fat", category: "macronutrient", aliases: ["polyunsaturated fat", "polyunsaturates", "mehrfach ungesättigte fettsäuren"], default_unit: "g" },
    { standard_name: "cholesterol", category: "macronutrient", aliases: ["cholesterol", "cholesterin"], default_unit: "mg" },
    { standard_name: "total_carbohydrate", category: "macronutrient", aliases: ["total carbohydrate", "carbohydrate", "carbs", "kohlenhydrate", "koolhydraten", "glucides"], default_unit: "g" },
    { standard_name: "dietary_fiber", category: "macronutrient", aliases: ["dietary fiber", "fibre", "fiber", "ballaststoffe", "vezels", "fibres alimentaires"], default_unit: "g" },
    { standard_name: "sugars", category: "macronutrient", aliases: ["total sugars", "sugars", "zucker", "suikers", "sucres"], default_unit: "g" },
    { standard_name: "added_sugars", category: "macronutrient", aliases: ["added sugars", "zugesetzter zucker"], default_unit: "g" },
    { standard_name: "sugar_alcohols", category: "macronutrient", aliases: ["sugar alcohols", "zuckeralkohole", "polyols"], default_unit: "g" },
    { standard_name: "protein", category: "macronutrient", aliases: ["protein", "eiweiß", "eiwitten", "protéines"], default_unit: "g" },
    { standard_name: "salt", category: "macronutrient", aliases: ["salt", "salz", "zout", "sel"], default_unit: "g" },

    // =====================================================================
    // VITAMINS
    // =====================================================================
    { standard_name: "vitamin_a", category: "vitamin", aliases: ["vitamin a", "retinol", "retinylpalmitat", "retinyl palmitate"], default_unit: "µg" },
    { standard_name: "vitamin_a_precursor", category: "vitamin", aliases: ["beta carotene", "beta-carotene", "beta-carotin"], default_unit: "µg" },
    { standard_name: "vitamin_c", category: "vitamin", aliases: ["vitamin c", "ascorbic acid", "ascorbinsäure", "calcium ascorbate", "sodium ascorbate"], default_unit: "mg" },
    { standard_name: "vitamin_d", category: "vitamin", aliases: ["vitamin d"], default_unit: "µg" },
    { standard_name: "vitamin_d3", category: "vitamin", aliases: ["vitamin d3", "cholecalciferol", "colecalciferol"], default_unit: "µg" },
    { standard_name: "vitamin_d2", category: "vitamin", aliases: ["vitamin d2", "ergocalciferol"], default_unit: "µg" },
    { standard_name: "vitamin_e", category: "vitamin", aliases: ["vitamin e", "d-alpha tocopherol", "d-alpha-tocopherol", "alpha tocopherol", "tocopherol", "tocopheryl acetate", "dl-alpha-tocopherol"], default_unit: "mg" },
    { standard_name: "vitamin_k", category: "vitamin", aliases: ["vitamin k"], default_unit: "µg" },
    { standard_name: "vitamin_k1", category: "vitamin", aliases: ["vitamin k1", "phylloquinone", "phytonadione"], default_unit: "µg" },
    { standard_name: "vitamin_k2", category: "vitamin", aliases: ["vitamin k2", "menaquinone", "menaquinone-7", "mk-7", "mk7"], default_unit: "µg" },
    { standard_name: "vitamin_b1", category: "vitamin", aliases: ["thiamine", "thiamin", "thiamine mononitrate", "thiamine hcl", "vitamin b1"], default_unit: "mg" },
    { standard_name: "vitamin_b2", category: "vitamin", aliases: ["riboflavin", "vitamin b2", "riboflavin-5-phosphate"], default_unit: "mg" },
    { standard_name: "vitamin_b3", category: "vitamin", aliases: ["niacin", "niacinamide", "nicotinamide", "nicotinic acid", "vitamin b3"], default_unit: "mg" },
    { standard_name: "vitamin_b5", category: "vitamin", aliases: ["pantothenic acid", "vitamin b5", "calcium pantothenate", "d-calcium pantothenate", "panthenol"], default_unit: "mg" },
    { standard_name: "vitamin_b6", category: "vitamin", aliases: ["vitamin b6", "pyridoxine", "pyridoxine hcl", "pyridoxal-5-phosphate", "p-5-p", "p5p"], default_unit: "mg" },
    { standard_name: "biotin", category: "vitamin", aliases: ["biotin", "vitamin b7", "vitamin h", "d-biotin"], default_unit: "µg" },
    { standard_name: "folate", category: "vitamin", aliases: ["folate", "folic acid", "vitamin b9", "folsäure", "methylfolate", "5-mthf", "l-methylfolate", "calcium l-methylfolate"], default_unit: "µg" },
    { standard_name: "vitamin_b12", category: "vitamin", aliases: ["vitamin b12", "methylcobalamin", "cyanocobalamin", "cobalamin", "hydroxocobalamin", "adenosylcobalamin"], default_unit: "µg" },
    { standard_name: "choline", category: "vitamin", aliases: ["choline", "choline bitartrate", "choline citrate", "cdp-choline", "citicoline", "alpha-gpc"], default_unit: "mg" },
    { standard_name: "inositol", category: "vitamin", aliases: ["inositol", "myo-inositol", "d-chiro-inositol"], default_unit: "mg" },
    { standard_name: "paba", category: "vitamin", aliases: ["paba", "para-aminobenzoic acid"], default_unit: "mg" },

    // =====================================================================
    // MINERALS
    // =====================================================================
    { standard_name: "sodium", category: "mineral", aliases: ["sodium", "natrium"], default_unit: "mg" },
    { standard_name: "calcium", category: "mineral", aliases: ["calcium", "kalzium"], default_unit: "mg" },
    { standard_name: "iron", category: "mineral", aliases: ["iron", "eisen", "ferrous", "iron bisglycinate", "ferrous fumarate", "ferrous sulfate"], default_unit: "mg" },
    { standard_name: "magnesium", category: "mineral", aliases: ["magnesium", "magnesium citrate", "magnesium glycinate", "magnesium bisglycinate", "magnesium oxide", "magnesium malate", "magnesium taurate", "magnesium l-threonate"], default_unit: "mg" },
    { standard_name: "phosphorus", category: "mineral", aliases: ["phosphorus", "phosphor"], default_unit: "mg" },
    { standard_name: "potassium", category: "mineral", aliases: ["potassium", "kalium"], default_unit: "mg" },
    { standard_name: "zinc", category: "mineral", aliases: ["zinc", "zink", "zinc picolinate", "zinc gluconate", "zinc citrate", "zinc bisglycinate", "zinc oxide"], default_unit: "mg" },
    { standard_name: "copper", category: "mineral", aliases: ["copper", "kupfer", "copper gluconate", "copper bisglycinate"], default_unit: "mg" },
    { standard_name: "manganese", category: "mineral", aliases: ["manganese", "mangan"], default_unit: "mg" },
    { standard_name: "selenium", category: "mineral", aliases: ["selenium", "selen", "selenomethionine", "sodium selenite", "selenium yeast"], default_unit: "µg" },
    { standard_name: "chromium", category: "mineral", aliases: ["chromium", "chrom", "chromium picolinate", "chromium polynicotinate"], default_unit: "µg" },
    { standard_name: "molybdenum", category: "mineral", aliases: ["molybdenum", "molybdän", "sodium molybdate"], default_unit: "µg" },
    { standard_name: "iodine", category: "mineral", aliases: ["iodine", "jod", "iodide", "potassium iodide", "kelp iodine"], default_unit: "µg" },
    { standard_name: "boron", category: "mineral", aliases: ["boron", "bor"], default_unit: "mg" },
    { standard_name: "silicon", category: "mineral", aliases: ["silicon", "silicium", "silica", "orthosilicic acid"], default_unit: "mg" },
    { standard_name: "vanadium", category: "mineral", aliases: ["vanadium", "vanadyl sulfate"], default_unit: "µg" },
    { standard_name: "strontium", category: "mineral", aliases: ["strontium"], default_unit: "mg" },
    { standard_name: "lithium", category: "mineral", aliases: ["lithium", "lithium orotate"], default_unit: "µg" },
    { standard_name: "chloride", category: "mineral", aliases: ["chloride", "chlorid"], default_unit: "mg" },
    { standard_name: "fluoride", category: "mineral", aliases: ["fluoride", "fluorid"], default_unit: "mg" },
    { standard_name: "sulfur", category: "mineral", aliases: ["sulfur", "sulphur", "schwefel"], default_unit: "mg" },

    // =====================================================================
    // FATTY ACIDS
    // =====================================================================
    { standard_name: "omega_3_total", category: "fatty_acid", aliases: ["total omega-3 fatty acids", "omega-3 fatty acids", "omega-3", "omega 3"], default_unit: "mg" },
    { standard_name: "epa", category: "fatty_acid", aliases: ["epa", "eicosapentaenoic acid"], default_unit: "mg" },
    { standard_name: "dha", category: "fatty_acid", aliases: ["dha", "docosahexaenoic acid"], default_unit: "mg" },
    { standard_name: "dpa", category: "fatty_acid", aliases: ["dpa", "docosapentaenoic acid"], default_unit: "mg" },
    { standard_name: "ala", category: "fatty_acid", aliases: ["ala", "alpha-linolenic acid", "alpha linolenic acid"], default_unit: "mg" },
    { standard_name: "omega_3_other", category: "fatty_acid", aliases: ["other omega-3s", "other omega-3 fatty acids"], default_unit: "mg" },
    { standard_name: "omega_6_total", category: "fatty_acid", aliases: ["omega-6 fatty acids", "omega-6", "omega 6"], default_unit: "mg" },
    { standard_name: "gla", category: "fatty_acid", aliases: ["gla", "gamma-linolenic acid", "gamma linolenic acid"], default_unit: "mg" },
    { standard_name: "linoleic_acid", category: "fatty_acid", aliases: ["linoleic acid", "la"], default_unit: "mg" },
    { standard_name: "cla", category: "fatty_acid", aliases: ["cla", "conjugated linoleic acid"], default_unit: "mg" },
    { standard_name: "omega_9", category: "fatty_acid", aliases: ["omega-9", "omega 9", "oleic acid"], default_unit: "mg" },
    { standard_name: "mct_oil", category: "fatty_acid", aliases: ["mct oil", "mct", "medium chain triglycerides", "medium-chain triglycerides"], default_unit: "g" },

    // =====================================================================
    // AMINO ACIDS
    // =====================================================================
    // Essential
    { standard_name: "l_leucine", category: "amino_acid", aliases: ["l-leucine", "l-leucin", "leucine", "leucin"], default_unit: "mg" },
    { standard_name: "l_isoleucine", category: "amino_acid", aliases: ["l-isoleucine", "l-isoleucin", "isoleucine", "isoleucin"], default_unit: "mg" },
    { standard_name: "l_valine", category: "amino_acid", aliases: ["l-valine", "l-valin", "valine", "valin"], default_unit: "mg" },
    { standard_name: "l_lysine", category: "amino_acid", aliases: ["l-lysine", "l-lysin", "lysine", "lysin"], default_unit: "mg" },
    { standard_name: "l_methionine", category: "amino_acid", aliases: ["l-methionine", "l-methionin", "methionine", "methionin"], default_unit: "mg" },
    { standard_name: "l_phenylalanine", category: "amino_acid", aliases: ["l-phenylalanine", "l-phenylalanin", "phenylalanine", "phenylalanin"], default_unit: "mg" },
    { standard_name: "l_threonine", category: "amino_acid", aliases: ["l-threonine", "l-threonin", "threonine", "threonin"], default_unit: "mg" },
    { standard_name: "l_tryptophan", category: "amino_acid", aliases: ["l-tryptophan", "tryptophan", "5-htp", "5-hydroxytryptophan"], default_unit: "mg" },
    { standard_name: "l_histidine", category: "amino_acid", aliases: ["l-histidine", "l-histidin", "histidine", "histidin"], default_unit: "mg" },
    // Conditionally essential / non-essential
    { standard_name: "l_glutamine", category: "amino_acid", aliases: ["l-glutamine", "l-glutamin", "glutamine", "glutamin"], default_unit: "g" },
    { standard_name: "l_arginine", category: "amino_acid", aliases: ["l-arginine", "l-arginin", "arginine", "arginin", "aakg", "l-arginine alpha-ketoglutarate"], default_unit: "mg" },
    { standard_name: "l_citrulline", category: "amino_acid", aliases: ["l-citrulline", "l-citrullin", "citrulline", "citrulline malate"], default_unit: "mg" },
    { standard_name: "l_tyrosine", category: "amino_acid", aliases: ["l-tyrosine", "l-tyrosin", "tyrosine", "n-acetyl l-tyrosine", "nalt"], default_unit: "mg" },
    { standard_name: "l_cysteine", category: "amino_acid", aliases: ["l-cysteine", "l-cystein", "cysteine", "nac", "n-acetyl cysteine", "n-acetyl-l-cysteine"], default_unit: "mg" },
    { standard_name: "l_cystine", category: "amino_acid", aliases: ["l-cystine", "l-cystin", "cystine", "cystin"], default_unit: "mg" },
    { standard_name: "l_glycine", category: "amino_acid", aliases: ["l-glycine", "glycine", "glycin"], default_unit: "mg" },
    { standard_name: "l_proline", category: "amino_acid", aliases: ["l-proline", "l-prolin", "proline", "prolin"], default_unit: "mg" },
    { standard_name: "l_serine", category: "amino_acid", aliases: ["l-serine", "l-serin", "serine", "serin", "phosphatidylserine"], default_unit: "mg" },
    { standard_name: "l_alanine", category: "amino_acid", aliases: ["l-alanine", "l-alanin", "alanine", "alanin", "beta-alanine", "beta alanine"], default_unit: "mg" },
    { standard_name: "l_glutamic_acid", category: "amino_acid", aliases: ["l-glutamic acid", "glutamic acid", "glutaminsäure"], default_unit: "mg" },
    { standard_name: "l_aspartic_acid", category: "amino_acid", aliases: ["l-aspartic acid", "aspartic acid", "asparaginsäure", "d-aspartic acid", "daa"], default_unit: "mg" },
    { standard_name: "taurine", category: "amino_acid", aliases: ["taurine", "taurin"], default_unit: "mg" },
    { standard_name: "l_carnitine", category: "amino_acid", aliases: ["l-carnitine", "l-carnitin", "carnitine", "acetyl-l-carnitine", "alcar", "l-carnitine tartrate", "l-carnitine l-tartrate"], default_unit: "mg" },
    { standard_name: "l_ornithine", category: "amino_acid", aliases: ["l-ornithine", "l-ornithin", "ornithine"], default_unit: "mg" },
    { standard_name: "l_theanine", category: "amino_acid", aliases: ["l-theanine", "theanine", "l-theanin"], default_unit: "mg" },
    { standard_name: "hydroxyproline", category: "amino_acid", aliases: ["hydroxyproline", "hydroxyprolin"], default_unit: "mg" },

    // =====================================================================
    // HERBAL / BOTANICAL
    // =====================================================================
    { standard_name: "ashwagandha", category: "herbal", aliases: ["ashwagandha", "withania somnifera", "ksm-66", "sensoril"], default_unit: "mg" },
    { standard_name: "bacopa_monnieri", category: "herbal", aliases: ["bacopa monnieri", "bacopa", "brahmi"], default_unit: "mg" },
    { standard_name: "ginkgo_biloba", category: "herbal", aliases: ["ginkgo biloba", "ginkgo"], default_unit: "mg" },
    { standard_name: "rhodiola_rosea", category: "herbal", aliases: ["rhodiola rosea", "rhodiola"], default_unit: "mg" },
    { standard_name: "rosemary_extract", category: "herbal", aliases: ["rosemary extract", "rosemary", "rosmarin"], default_unit: "mg" },
    { standard_name: "turmeric", category: "herbal", aliases: ["turmeric", "kurkuma", "curcumin", "turmeric extract", "curcuma longa"], default_unit: "mg" },
    { standard_name: "ginger", category: "herbal", aliases: ["ginger", "ingwer", "ginger extract", "zingiber officinale"], default_unit: "mg" },
    { standard_name: "guarana", category: "herbal", aliases: ["guarana", "paullinia cupana"], default_unit: "mg" },
    { standard_name: "elderberry", category: "herbal", aliases: ["elderberry", "holunder", "sambucus nigra", "elderberry extract"], default_unit: "mg" },
    { standard_name: "thyme", category: "herbal", aliases: ["thyme", "thymian", "thymus vulgaris"], default_unit: "mg" },
    { standard_name: "echinacea", category: "herbal", aliases: ["echinacea", "echinacea purpurea", "sonnenhut"], default_unit: "mg" },
    { standard_name: "valerian", category: "herbal", aliases: ["valerian", "valerian root", "baldrian", "valeriana officinalis"], default_unit: "mg" },
    { standard_name: "passionflower", category: "herbal", aliases: ["passionflower", "passion flower", "passiflora incarnata", "passionsblume"], default_unit: "mg" },
    { standard_name: "st_johns_wort", category: "herbal", aliases: ["st. john's wort", "st john's wort", "johanniskraut", "hypericum perforatum"], default_unit: "mg" },
    { standard_name: "milk_thistle", category: "herbal", aliases: ["milk thistle", "silymarin", "mariendistel", "silybum marianum"], default_unit: "mg" },
    { standard_name: "saw_palmetto", category: "herbal", aliases: ["saw palmetto", "sägepalme", "serenoa repens"], default_unit: "mg" },
    { standard_name: "tribulus", category: "herbal", aliases: ["tribulus", "tribulus terrestris"], default_unit: "mg" },
    { standard_name: "fenugreek", category: "herbal", aliases: ["fenugreek", "bockshornklee", "trigonella foenum-graecum"], default_unit: "mg" },
    { standard_name: "ginseng", category: "herbal", aliases: ["ginseng", "panax ginseng", "korean ginseng", "red ginseng", "ginseng extract"], default_unit: "mg" },
    { standard_name: "siberian_ginseng", category: "herbal", aliases: ["siberian ginseng", "eleuthero", "eleutherococcus senticosus"], default_unit: "mg" },
    { standard_name: "maca", category: "herbal", aliases: ["maca", "maca root", "lepidium meyenii", "maca-wurzel"], default_unit: "mg" },
    { standard_name: "tongkat_ali", category: "herbal", aliases: ["tongkat ali", "eurycoma longifolia", "longjack"], default_unit: "mg" },
    { standard_name: "horny_goat_weed", category: "herbal", aliases: ["horny goat weed", "epimedium", "icariin"], default_unit: "mg" },
    { standard_name: "black_pepper_extract", category: "herbal", aliases: ["black pepper extract", "bioperine", "piperine", "schwarzer pfeffer"], default_unit: "mg" },
    { standard_name: "green_tea_extract", category: "herbal", aliases: ["green tea extract", "grüntee-extrakt", "egcg", "epigallocatechin gallate", "camellia sinensis"], default_unit: "mg" },
    { standard_name: "grape_seed_extract", category: "herbal", aliases: ["grape seed extract", "traubenkernextrakt", "opc", "oligomeric proanthocyanidins"], default_unit: "mg" },
    { standard_name: "pine_bark_extract", category: "herbal", aliases: ["pine bark extract", "pycnogenol", "pinienrindenextrakt"], default_unit: "mg" },
    { standard_name: "olive_leaf_extract", category: "herbal", aliases: ["olive leaf extract", "olivenblattextrakt", "oleuropein"], default_unit: "mg" },
    { standard_name: "garlic", category: "herbal", aliases: ["garlic", "garlic extract", "knoblauch", "allicin", "aged garlic extract"], default_unit: "mg" },
    { standard_name: "astragalus", category: "herbal", aliases: ["astragalus", "astragalus membranaceus", "tragant"], default_unit: "mg" },
    { standard_name: "boswellia", category: "herbal", aliases: ["boswellia", "boswellia serrata", "boswellic acid", "frankincense", "weihrauch"], default_unit: "mg" },
    { standard_name: "cat_claw", category: "herbal", aliases: ["cat's claw", "uncaria tomentosa", "katzenkralle"], default_unit: "mg" },
    { standard_name: "devil_claw", category: "herbal", aliases: ["devil's claw", "harpagophytum", "teufelskralle"], default_unit: "mg" },
    { standard_name: "licorice_root", category: "herbal", aliases: ["licorice root", "liquorice", "süßholzwurzel", "glycyrrhiza glabra"], default_unit: "mg" },
    { standard_name: "nettle", category: "herbal", aliases: ["nettle", "stinging nettle", "brennnessel", "urtica dioica"], default_unit: "mg" },
    { standard_name: "dandelion", category: "herbal", aliases: ["dandelion", "löwenzahn", "taraxacum officinale"], default_unit: "mg" },
    { standard_name: "gotu_kola", category: "herbal", aliases: ["gotu kola", "centella asiatica"], default_unit: "mg" },
    { standard_name: "berberine", category: "herbal", aliases: ["berberine", "berberin", "berberine hcl"], default_unit: "mg" },
    { standard_name: "quercetin", category: "herbal", aliases: ["quercetin", "quercetin dihydrate"], default_unit: "mg" },
    { standard_name: "resveratrol", category: "herbal", aliases: ["resveratrol", "trans-resveratrol"], default_unit: "mg" },
    { standard_name: "lutein", category: "herbal", aliases: ["lutein", "floraglo lutein"], default_unit: "mg" },
    { standard_name: "zeaxanthin", category: "herbal", aliases: ["zeaxanthin"], default_unit: "mg" },
    { standard_name: "lycopene", category: "herbal", aliases: ["lycopene", "lycopin"], default_unit: "mg" },
    { standard_name: "astaxanthin", category: "herbal", aliases: ["astaxanthin"], default_unit: "mg" },
    { standard_name: "caffeine", category: "herbal", aliases: ["caffeine", "koffein", "caffeine anhydrous"], default_unit: "mg" },

    // =====================================================================
    // MUSHROOMS
    // =====================================================================
    { standard_name: "lions_mane", category: "mushroom", aliases: ["lion's mane", "lions mane", "hericium erinaceus", "löwenmähne", "igelstachelbart"], default_unit: "mg" },
    { standard_name: "shiitake", category: "mushroom", aliases: ["shiitake mushroom", "shiitake", "lentinula edodes"], default_unit: "mg" },
    { standard_name: "maitake", category: "mushroom", aliases: ["maitake mushroom", "maitake", "grifola frondosa"], default_unit: "mg" },
    { standard_name: "reishi", category: "mushroom", aliases: ["reishi", "ganoderma", "ganoderma lucidum", "lingzhi"], default_unit: "mg" },
    { standard_name: "cordyceps", category: "mushroom", aliases: ["cordyceps", "cordyceps sinensis", "cordyceps militaris"], default_unit: "mg" },
    { standard_name: "chaga", category: "mushroom", aliases: ["chaga", "chaga mushroom", "inonotus obliquus"], default_unit: "mg" },
    { standard_name: "turkey_tail", category: "mushroom", aliases: ["turkey tail", "trametes versicolor", "coriolus versicolor"], default_unit: "mg" },
    { standard_name: "agaricus", category: "mushroom", aliases: ["agaricus blazei", "agaricus", "agaricus mushroom"], default_unit: "mg" },
    { standard_name: "tremella", category: "mushroom", aliases: ["tremella", "tremella fuciformis", "snow fungus"], default_unit: "mg" },

    // =====================================================================
    // PLANT EXTRACTS / GREENS
    // =====================================================================
    { standard_name: "wheat_grass", category: "plant_extract", aliases: ["wheat grass", "wheatgrass", "weizengras"], default_unit: "mg" },
    { standard_name: "barley_grass", category: "plant_extract", aliases: ["barley grass", "gerstengras"], default_unit: "mg" },
    { standard_name: "alfalfa", category: "plant_extract", aliases: ["alfalfa", "luzerne"], default_unit: "mg" },
    { standard_name: "spirulina", category: "plant_extract", aliases: ["spirulina", "spirulina platensis"], default_unit: "mg" },
    { standard_name: "chlorella", category: "plant_extract", aliases: ["chlorella", "chlorella vulgaris", "broken cell wall chlorella"], default_unit: "mg" },
    { standard_name: "matcha", category: "plant_extract", aliases: ["matcha", "matcha green tea"], default_unit: "mg" },
    { standard_name: "moringa", category: "plant_extract", aliases: ["moringa", "moringa oleifera"], default_unit: "mg" },
    { standard_name: "tart_cherry", category: "plant_extract", aliases: ["tart cherry", "montmorency cherry", "sauerkirsche"], default_unit: "mg" },
    { standard_name: "chicory_root", category: "plant_extract", aliases: ["chicory root", "zichorie"], default_unit: "mg" },
    { standard_name: "inulin", category: "plant_extract", aliases: ["inulin"], default_unit: "g" },
    { standard_name: "artichoke", category: "plant_extract", aliases: ["artichoke", "artischocke", "artichoke extract", "cynarin"], default_unit: "mg" },
    { standard_name: "acai", category: "plant_extract", aliases: ["acai", "acai berry", "acai extract"], default_unit: "mg" },
    { standard_name: "goji_berry", category: "plant_extract", aliases: ["goji berry", "goji", "lycium barbarum", "wolfberry"], default_unit: "mg" },
    { standard_name: "cranberry", category: "plant_extract", aliases: ["cranberry", "cranberry extract", "preiselbeere"], default_unit: "mg" },
    { standard_name: "blueberry", category: "plant_extract", aliases: ["blueberry", "blueberry extract", "bilberry", "heidelbeere"], default_unit: "mg" },
    { standard_name: "pomegranate", category: "plant_extract", aliases: ["pomegranate", "pomegranate extract", "granatapfel"], default_unit: "mg" },
    { standard_name: "aloe_vera", category: "plant_extract", aliases: ["aloe vera", "aloe vera extract"], default_unit: "mg" },
    { standard_name: "psyllium_husk", category: "plant_extract", aliases: ["psyllium husk", "psyllium", "flohsamenschalen"], default_unit: "g" },
    { standard_name: "flaxseed", category: "plant_extract", aliases: ["flaxseed", "flax seed", "linseed", "leinsamen"], default_unit: "mg" },
    { standard_name: "chia_seed", category: "plant_extract", aliases: ["chia seed", "chia seeds", "chiasamen"], default_unit: "mg" },
    { standard_name: "hemp_seed", category: "plant_extract", aliases: ["hemp seed", "hemp seeds", "hanfsamen"], default_unit: "mg" },
    { standard_name: "bee_pollen", category: "plant_extract", aliases: ["bee pollen", "blütenpollen"], default_unit: "mg" },
    { standard_name: "royal_jelly", category: "plant_extract", aliases: ["royal jelly", "gelée royale"], default_unit: "mg" },
    { standard_name: "propolis", category: "plant_extract", aliases: ["propolis"], default_unit: "mg" },
    { standard_name: "kelp", category: "plant_extract", aliases: ["kelp", "sea kelp", "seetang"], default_unit: "mg" },
    { standard_name: "fucus", category: "plant_extract", aliases: ["fucus", "fucus vesiculosus", "bladderwrack", "blasentang"], default_unit: "mg" },

    // =====================================================================
    // PROBIOTICS
    // =====================================================================
    { standard_name: "lactobacillus_acidophilus", category: "probiotic", aliases: ["lactobacillus acidophilus", "l. acidophilus"], default_unit: "CFU" },
    { standard_name: "lactobacillus_rhamnosus", category: "probiotic", aliases: ["lactobacillus rhamnosus", "l. rhamnosus", "lgg"], default_unit: "CFU" },
    { standard_name: "lactobacillus_plantarum", category: "probiotic", aliases: ["lactobacillus plantarum", "l. plantarum"], default_unit: "CFU" },
    { standard_name: "lactobacillus_reuteri", category: "probiotic", aliases: ["lactobacillus reuteri", "l. reuteri"], default_unit: "CFU" },
    { standard_name: "lactobacillus_casei", category: "probiotic", aliases: ["lactobacillus casei", "l. casei"], default_unit: "CFU" },
    { standard_name: "bifidobacterium_longum", category: "probiotic", aliases: ["bifidobacterium longum", "b. longum"], default_unit: "CFU" },
    { standard_name: "bifidobacterium_lactis", category: "probiotic", aliases: ["bifidobacterium lactis", "b. lactis", "bifidobacterium animalis"], default_unit: "CFU" },
    { standard_name: "bifidobacterium_breve", category: "probiotic", aliases: ["bifidobacterium breve", "b. breve"], default_unit: "CFU" },
    { standard_name: "saccharomyces_boulardii", category: "probiotic", aliases: ["saccharomyces boulardii", "s. boulardii"], default_unit: "CFU" },
    { standard_name: "probiotic_blend", category: "probiotic", aliases: ["probiotic blend", "probiotic culture", "probiotische kulturen", "live cultures"], default_unit: "CFU" },

    // =====================================================================
    // ENZYMES
    // =====================================================================
    { standard_name: "bromelain", category: "enzyme", aliases: ["bromelain"], default_unit: "mg" },
    { standard_name: "papain", category: "enzyme", aliases: ["papain"], default_unit: "mg" },
    { standard_name: "lipase", category: "enzyme", aliases: ["lipase"], default_unit: "mg" },
    { standard_name: "protease", category: "enzyme", aliases: ["protease"], default_unit: "mg" },
    { standard_name: "amylase", category: "enzyme", aliases: ["amylase"], default_unit: "mg" },
    { standard_name: "lactase", category: "enzyme", aliases: ["lactase"], default_unit: "mg" },
    { standard_name: "cellulase", category: "enzyme", aliases: ["cellulase"], default_unit: "mg" },
    { standard_name: "digestive_enzyme_blend", category: "enzyme", aliases: ["digestive enzyme blend", "digestive enzymes", "verdauungsenzyme"], default_unit: "mg" },
    { standard_name: "nattokinase", category: "enzyme", aliases: ["nattokinase"], default_unit: "FU" },
    { standard_name: "serrapeptase", category: "enzyme", aliases: ["serrapeptase", "serratiopeptidase"], default_unit: "SPU" },

    // =====================================================================
    // SPECIALTY / SPORTS NUTRITION
    // =====================================================================
    { standard_name: "collagen_hydrolysate", category: "specialty", aliases: ["collagen hydrolysate", "kollagenhydrolysat", "collagen peptides", "collagen", "hydrolyzed collagen", "kollagenpeptide"], default_unit: "g" },
    { standard_name: "collagen_type_i", category: "specialty", aliases: ["collagen type i", "type i collagen", "collagen type 1", "type 1 collagen"], default_unit: "g" },
    { standard_name: "collagen_type_ii", category: "specialty", aliases: ["collagen type ii", "type ii collagen", "collagen type 2", "type 2 collagen", "uc-ii"], default_unit: "mg" },
    { standard_name: "collagen_type_iii", category: "specialty", aliases: ["collagen type iii", "type iii collagen", "collagen type 3", "type 3 collagen"], default_unit: "g" },
    { standard_name: "tendoforte", category: "specialty", aliases: ["tendoforte"], default_unit: "g" },
    { standard_name: "fortigel", category: "specialty", aliases: ["fortigel"], default_unit: "g" },
    { standard_name: "verisol", category: "specialty", aliases: ["verisol"], default_unit: "g" },
    { standard_name: "creatine_monohydrate", category: "specialty", aliases: ["creatine monohydrate", "creatin monohydrat", "creatine", "creatin", "creapure"], default_unit: "g" },
    { standard_name: "creatine_hcl", category: "specialty", aliases: ["creatine hcl", "creatine hydrochloride"], default_unit: "g" },
    { standard_name: "hmb", category: "specialty", aliases: ["hmb", "beta-hydroxy beta-methylbutyrate", "calcium hmb"], default_unit: "g" },
    { standard_name: "coenzyme_q10", category: "specialty", aliases: ["coenzyme q10", "coq10", "ubiquinone", "ubiquinol", "q10"], default_unit: "mg" },
    { standard_name: "alpha_lipoic_acid", category: "specialty", aliases: ["alpha lipoic acid", "ala", "r-lipoic acid", "alpha-liponsäure", "r-ala"], default_unit: "mg" },
    { standard_name: "glucosamine", category: "specialty", aliases: ["glucosamine", "glucosamin", "glucosamine sulfate", "glucosamine hcl"], default_unit: "mg" },
    { standard_name: "chondroitin", category: "specialty", aliases: ["chondroitin", "chondroitin sulfate", "chondroitinsulfat"], default_unit: "mg" },
    { standard_name: "msm", category: "specialty", aliases: ["msm", "methylsulfonylmethane", "methylsulfonylmethan"], default_unit: "mg" },
    { standard_name: "hyaluronic_acid", category: "specialty", aliases: ["hyaluronic acid", "hyaluronsäure", "sodium hyaluronate"], default_unit: "mg" },
    { standard_name: "whey_protein", category: "specialty", aliases: ["whey protein", "whey protein isolate", "whey protein concentrate", "molkenprotein"], default_unit: "g" },
    { standard_name: "casein_protein", category: "specialty", aliases: ["casein protein", "casein", "micellar casein", "kasein"], default_unit: "g" },
    { standard_name: "pea_protein", category: "specialty", aliases: ["pea protein", "erbsenprotein"], default_unit: "g" },
    { standard_name: "soy_protein", category: "specialty", aliases: ["soy protein", "soy protein isolate", "sojaprotein"], default_unit: "g" },
    { standard_name: "rice_protein", category: "specialty", aliases: ["rice protein", "reisprotein"], default_unit: "g" },
    { standard_name: "hemp_protein", category: "specialty", aliases: ["hemp protein", "hanfprotein"], default_unit: "g" },
    { standard_name: "melatonin", category: "specialty", aliases: ["melatonin"], default_unit: "mg" },
    { standard_name: "dmae", category: "specialty", aliases: ["dmae", "dimethylaminoethanol"], default_unit: "mg" },
    { standard_name: "sam_e", category: "specialty", aliases: ["sam-e", "s-adenosyl methionine", "s-adenosylmethionin"], default_unit: "mg" },
    { standard_name: "dhea", category: "specialty", aliases: ["dhea", "dehydroepiandrosterone"], default_unit: "mg" },
    { standard_name: "pregnenolone", category: "specialty", aliases: ["pregnenolone", "pregnenolon"], default_unit: "mg" },
    { standard_name: "pqq", category: "specialty", aliases: ["pqq", "pyrroloquinoline quinone"], default_unit: "mg" },
    { standard_name: "nad", category: "specialty", aliases: ["nad+", "nad", "nicotinamide adenine dinucleotide", "nmn", "nicotinamide mononucleotide", "nr", "nicotinamide riboside"], default_unit: "mg" },
    { standard_name: "d_ribose", category: "specialty", aliases: ["d-ribose", "ribose"], default_unit: "g" },
    { standard_name: "beta_glucan", category: "specialty", aliases: ["beta glucan", "beta-glucan", "beta-glucane", "1,3/1,6 beta glucan"], default_unit: "mg" },
    { standard_name: "colostrum", category: "specialty", aliases: ["colostrum", "bovine colostrum", "kolostrum"], default_unit: "mg" },
    { standard_name: "dim", category: "specialty", aliases: ["dim", "diindolylmethane", "3,3'-diindolylmethane"], default_unit: "mg" },
    { standard_name: "indole_3_carbinol", category: "specialty", aliases: ["indole-3-carbinol", "i3c"], default_unit: "mg" },
];

/**
* Canonical unit definitions with aliases.
*/
export interface UnitDef {
    name: string;
    aliases: string[];
}

export const UNIT_DEFINITIONS: UnitDef[] = [
    // Weight
    { name: "mg", aliases: ["milligrams", "milligram"] },
    { name: "g", aliases: ["grams", "gram"] },
    { name: "µg", aliases: ["micrograms", "microgram", "mcg", "μg"] },
    // Energy
    { name: "IU", aliases: ["iu"] },
    { name: "kJ", aliases: ["kj"] },
    { name: "kcal", aliases: ["kcal"] },
    // Volume
    { name: "ml", aliases: ["milliliters", "milliliter", "millilitres", "millilitre"] },
    { name: "l", aliases: ["liters", "liter", "litres", "litre"] },
    { name: "fl oz", aliases: ["fluid ounce", "fluid ounces"] },
    // Serving units
    { name: "capsule", aliases: ["capsules", "kapseln", "kapsel", "caps"] },
    { name: "tablet", aliases: ["tablets", "tabletten", "tablette", "tabs"] },
    { name: "scoop", aliases: ["scoops"] },
    { name: "softgel", aliases: ["softgels"] },
    { name: "drop", aliases: ["drops", "tropfen"] },
    { name: "piece", aliases: ["pieces", "stück", "stk"] },
    { name: "sachet", aliases: ["sachets", "beutel"] },
    // Probiotic / Enzyme units
    { name: "CFU", aliases: ["cfu", "colony forming units", "billion cfu"] },
    { name: "FU", aliases: ["fu", "fibrinolytic units"] },
    { name: "SPU", aliases: ["spu", "serratiopeptidase units"] },
];
