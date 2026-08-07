// Smart Image Resolver for Products with Clean White Backgrounds

export function getProductWhiteBgImage(productName: string, category?: string): string {
  if (!productName) {
    return "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80";
  }

  // Normalize name by removing accents and converting to lowercase
  const name = productName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const cat = (category || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // 1. Specific Fruit & Vegetable Mappings (Isolated on Studio White Backgrounds)

  // Plátano / Guineo / Banano
  if (name.includes("platano") || name.includes("banana") || name.includes("guineo")) {
    return "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80";
  }

  // Fresa / Fresas
  if (name.includes("fresa") || name.includes("strawberry")) {
    return "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80";
  }

  // Papa / Papas / Potato
  if (name.includes("papa") || name.includes("patata") || name.includes("potato")) {
    return "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80";
  }

  // Limón / Limes
  if (name.includes("limon") || name.includes("lime") || name.includes("citrico")) {
    return "https://images.unsplash.com/photo-1534531141161-e41d133a8ad0?auto=format&fit=crop&w=600&q=80";
  }

  // Manzana / Apples
  if (name.includes("manzana") || name.includes("apple") || name.includes("fuji") || name.includes("gala")) {
    return "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80";
  }

  // Aguacate / Avocado / Guacamole
  if (name.includes("aguacate") || name.includes("avocado") || name.includes("hass")) {
    return "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80";
  }

  // Piña / Pineapple
  if (name.includes("pina") || name.includes("pineapple")) {
    return "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80";
  }

  // Jícama
  if (name.includes("jicama")) {
    return "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80";
  }

  // Jitomate / Tomate / Tomato
  if (name.includes("jitomate") || name.includes("tomate") || name.includes("tomato") || name.includes("saladette")) {
    return "https://images.unsplash.com/photo-1546470427-023a9d997d91?auto=format&fit=crop&w=600&q=80";
  }

  // Cebolla / Onion
  if (name.includes("cebolla") || name.includes("onion") || name.includes("cebollin")) {
    return "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=600&q=80";
  }

  // Zanahoria / Carrot
  if (name.includes("zanahoria") || name.includes("carrot")) {
    return "https://images.unsplash.com/photo-1598170845058-12e2f38d41e7?auto=format&fit=crop&w=600&q=80";
  }

  // Papaya
  if (name.includes("papaya") || name.includes("maradol")) {
    return "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80";
  }

  // Mango / Mangos
  if (name.includes("mango") || name.includes("ataulfo") || name.includes("kent")) {
    return "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80";
  }

  // Naranja / Orange / Mandarina / Toronja
  if (name.includes("naranja") || name.includes("orange") || name.includes("mandarina") || name.includes("toronja")) {
    return "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80";
  }

  // Sandía / Watermelon
  if (name.includes("sandia") || name.includes("watermelon")) {
    return "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80";
  }

  // Melón / Cantaloupe
  if (name.includes("melon") || name.includes("cantaloupe")) {
    return "https://images.unsplash.com/photo-1591271300850-22d6784e0a7f?auto=format&fit=crop&w=600&q=80";
  }

  // Uva / Uvas / Grapes
  if (name.includes("uva") || name.includes("grapes")) {
    return "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80";
  }

  // Pera / Pear
  if (name.includes("pera") || name.includes("pear")) {
    return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80";
  }

  // Cilantro
  if (name.includes("cilantro")) {
    return "https://images.unsplash.com/photo-1588879460418-72127a6f235b?auto=format&fit=crop&w=600&q=80";
  }

  // Perejil / Parsley
  if (name.includes("perejil") || name.includes("parsley")) {
    return "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80";
  }

  // Albahaca / Basil
  if (name.includes("albahaca") || name.includes("basil")) {
    return "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80";
  }

  // Chile / Jalapeño / Serrano / Poblano / Habanero
  if (name.includes("chile") || name.includes("jalapeno") || name.includes("serrano") || name.includes("poblano") || name.includes("habanero")) {
    return "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80";
  }

  // Ajo / Garlic
  if (name.includes("ajo") || name.includes("garlic")) {
    return "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80";
  }

  // Brócoli / Broccoli
  if (name.includes("brocoli") || name.includes("broccoli")) {
    return "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80";
  }

  // Pepino / Cucumber
  if (name.includes("pepino") || name.includes("cucumber")) {
    return "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80";
  }

  // Lechuga / Lettuce
  if (name.includes("lechuga") || name.includes("lettuce")) {
    return "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80";
  }

  // Espinaca / Spinach
  if (name.includes("espinaca") || name.includes("spinach")) {
    return "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80";
  }

  // Pimiento / Bell Pepper
  if (name.includes("pimiento") || name.includes("bell pepper") || name.includes("morron")) {
    return "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80";
  }

  // Champiñón / Mushroom
  if (name.includes("champinon") || name.includes("hongo") || name.includes("mushroom")) {
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
  }

  // Nopal / Cactus
  if (name.includes("nopal") || name.includes("cactus")) {
    return "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80";
  }

  // Durazno / Peach / Ciruela / Plum
  if (name.includes("durazno") || name.includes("peach") || name.includes("ciruela")) {
    return "https://images.unsplash.com/photo-1595158730398-639a5840bdbe?auto=format&fit=crop&w=600&q=80";
  }

  // Kiwi
  if (name.includes("kiwi")) {
    return "https://images.unsplash.com/photo-1585059819681-75f85014d8d5?auto=format&fit=crop&w=600&q=80";
  }

  // Zarzamora / Frambuesa / Arándano / Berries
  if (name.includes("zarzamora") || name.includes("frambuesa") || name.includes("arandano") || name.includes("berry")) {
    return "https://images.unsplash.com/photo-1568584711271-6c929fb49b60?auto=format&fit=crop&w=600&q=80";
  }

  // Elote / Maíz / Corn
  if (name.includes("elote") || name.includes("maiz") || name.includes("corn")) {
    return "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80";
  }

  // Secos / Nuez / Almendra / Cacahuate / Especias
  if (cat.includes("seco") || name.includes("nuez") || name.includes("almendra") || name.includes("cacahuate")) {
    return "https://images.unsplash.com/photo-1508061253366-f7da158b6d96?auto=format&fit=crop&w=600&q=80";
  }

  // 2. Category Fallbacks with Clean Studio Produce Shots
  if (cat.includes("fruta")) {
    return "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80";
  }
  if (cat.includes("verdura")) {
    return "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80";
  }
  if (cat.includes("hierba") || cat.includes("aromati")) {
    return "https://images.unsplash.com/photo-1588879460418-72127a6f235b?auto=format&fit=crop&w=600&q=80";
  }

  // Ultimate Default
  return "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80";
}
