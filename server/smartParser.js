// server/smartParser.js - Smart Spec & Vision Text Parser for Label & Loom

export function parseSpecSheetText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  const text = rawText.replace(/\r\n/g, '\n');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const result = {
    title: '',
    kurtaFabric: '',
    bottomFabric: '',
    dupattaFabric: '',
    type: 'Kurta Set',
    kurtaType: 'Straight',
    neck: '',
    sleeve: '',
    bottomType: 'Palazzo',
    color: '',
    brandColor: '',
    secondaryColor: '',
    pattern: '',
    ornamentation: '',
    occasion: '',
    washCare: 'Hand Wash Only',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    detectedSize: '',
    rawExtracted: {}
  };

  // Helper regex searcher
  const findValue = (regexes) => {
    for (const re of regexes) {
      const match = text.match(re);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '';
  };

  // 1. Model Name / Title extraction
  const titleMatch = findValue([
    /(?:Model Name|Product Name)\s*[:\n]\s*([^\n\r]+)/i,
    /Beautiful\s+([^\n\r]+(?:Collection|Set|Kurta|Outfit))/i,
    /Elegant\s+([^\n\r]+(?:Outfit|Set|Kurta|Dress))/i,
    /Floral Grace\s+([^\n\r]+)/i
  ]);
  if (titleMatch) {
    result.title = titleMatch.replace(/Wholesale\s*Collection/i, 'Designer Collection').trim();
  } else {
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      if (lines[i].length > 15 && !lines[i].includes(':') && !lines[i].toLowerCase().includes('fabric care')) {
        result.title = lines[i].replace(/Wholesale\s*Collection/i, 'Designer Ensemble').trim();
        break;
      }
    }
  }

  // 2. Multi-column and single-column Fabric detection
  if (/Art Silk Silk/i.test(text)) {
    result.kurtaFabric = 'Art Silk';
    result.bottomFabric = 'Silk';
    result.dupattaFabric = 'Art Silk';
  } else if (/Georgette/i.test(text)) {
    result.kurtaFabric = 'Georgette';
    result.bottomFabric = 'Georgette';
    result.dupattaFabric = 'Georgette';
  } else if (/Khadi/i.test(text)) {
    result.kurtaFabric = 'Organic Khadi';
    result.bottomFabric = 'Khadi';
    result.dupattaFabric = /Cotton Silk/i.test(text) ? 'Cotton Silk' : 'Khadi';
  } else {
    result.kurtaFabric = findValue([/Kurta Fabric\s*[:\n]\s*([A-Za-z\s]+)/i, /Fabric\s*[:\n]\s*([A-Za-z\s]+)/i]);
    result.bottomFabric = findValue([/(?:Salwar Fabric|Bottom Fabric)\s*[:\n]\s*([A-Za-z\s]+)/i]);
    result.dupattaFabric = findValue([/Dupatta Fabric\s*[:\n]\s*([A-Za-z\s]+)/i]);
  }

  // 3. Kurta Type
  if (/Straight/i.test(text)) result.kurtaType = 'Straight';
  else if (/A-line/i.test(text)) result.kurtaType = 'A-line';
  else if (/Anarkali/i.test(text)) result.kurtaType = 'Anarkali';
  else if (/Alia/i.test(text)) result.kurtaType = 'Alia Cut';

  // 4. Neck
  if (/U\s*-\s*Neck/i.test(text)) result.neck = 'U - Neck';
  else if (/V\s*-\s*Neck|V\s*Neck/i.test(text)) result.neck = 'V - Neck';
  else if (/Round Neck/i.test(text)) result.neck = 'Round Neck';
  else if (/Sweetheart/i.test(text)) result.neck = 'Sweetheart Neck';
  else if (/Boat Neck/i.test(text)) result.neck = 'Boat Neck';

  // 5. Sleeve
  if (/Full Sleeve/i.test(text)) result.sleeve = 'Full Sleeve';
  else if (/3\/4th|3\s*\/\s*4/i.test(text)) result.sleeve = '3/4th Sleeve';
  else if (/Sleeveless/i.test(text)) result.sleeve = 'Sleeveless';

  // 6. Bottom Type
  if (/Palazzo|Plazo/i.test(text)) result.bottomType = 'Palazzo';
  else if (/Patiala/i.test(text)) result.bottomType = 'Patiala';
  else if (/Sharara/i.test(text)) result.bottomType = 'Sharara';
  else if (/Pant/i.test(text)) result.bottomType = 'Straight Pants';

  // 7. Color
  const brandColorMatch = text.match(/Brand Color\s*[:\n\s]*([A-Za-z\s]+)/i);
  if (brandColorMatch) {
    result.brandColor = brandColorMatch[1].trim();
  }
  if (/Berry Red|Berry/i.test(text)) {
    result.color = 'Berry Maroon';
    result.brandColor = 'Berry Red';
  } else if (/Wine/i.test(text)) {
    result.color = 'Deep Wine';
    result.brandColor = 'Wine Maroon';
  } else if (/Off White|White/i.test(text)) {
    result.color = 'Pearl Off-White';
    result.brandColor = 'Off White';
  } else if (/Emerald|Green/i.test(text)) {
    result.color = 'Emerald Green';
  } else if (/Maroon/i.test(text)) {
    result.color = 'Maroon';
  }

  // 8. Ornamentation / Work
  if (/Mirror Work|Real Mirror/i.test(text)) result.ornamentation = 'Real Mirror Work & Applique';
  else if (/Lace/i.test(text)) result.ornamentation = 'Delicate Lace Detailing';
  else if (/Gota Patti/i.test(text)) result.ornamentation = 'Gota Patti Work';
  else if (/Chikankari/i.test(text)) result.ornamentation = 'Chikankari Embroidery';
  else if (/Floral/i.test(text)) result.ornamentation = 'Hand-block Botanical Motif';

  // 9. Pattern
  if (/Floral/i.test(text)) result.pattern = 'Floral Print';
  else if (/Embellished/i.test(text)) result.pattern = 'Embellished';
  else if (/Abstract/i.test(text)) result.pattern = 'Abstract Subtle';

  // 10. Occasion
  if (/Festive & Party|Festive/i.test(text)) result.occasion = 'Festive, Sangeet & Celebrations';
  else if (/Wedding/i.test(text)) result.occasion = 'Wedding Receptions & Parties';
  else if (/Casual/i.test(text)) result.occasion = 'Casual Chic & Day Festivities';

  // 11. Wash Care
  if (/HAND WASH ONLY/i.test(text)) result.washCare = 'Hand Wash Only';
  else if (/Dry Clean/i.test(text)) result.washCare = 'Dry Clean Only';

  // 12. Size
  const sizeMatch = text.match(/Size\s*[:\n\s]*([A-Z0-9]+)/i);
  if (sizeMatch) {
    result.detectedSize = sizeMatch[1].trim().toUpperCase();
  }

  // Fallback title formatting
  if (!result.title) {
    const mainColor = result.brandColor || result.color || 'Aesthetic';
    const mainFabric = result.kurtaFabric || 'Luxury';
    const mainWork = (result.ornamentation && result.ornamentation.toLowerCase() !== 'none') ? result.ornamentation : 'Handcrafted';
    const mainBottom = result.bottomType || 'Palazzo';
    result.title = `${mainColor} ${mainWork} ${mainFabric} Kurta & ${mainBottom} Set`;
  }

  // Category determination
  const isWedding = 
    /wedding|chinon|mirror|party|festive/i.test(text) ||
    /mirror work|art silk|silk/i.test(result.ornamentation + ' ' + result.kurtaFabric);

  result.category = isWedding ? 'wedding' : 'viral-kurtis';
  result.aestheticDescription = generateAestheticDescription(result);

  return result;
}

export function generateAestheticDescription(spec) {
  const parts = [];
  const title = spec.title || 'Exquisite Indian Ethnic Ensemble';
  const color = spec.brandColor || spec.color || 'Regal Hue';
  const kurtaFab = spec.kurtaFabric || 'Premium Fabric';
  const bottomFab = spec.bottomFabric || 'Matching Silk Blend';
  const dupattaFab = spec.dupattaFabric || 'Airy Coordinating Drape';
  const bottomType = spec.bottomType || 'Palazzo';
  const work = spec.ornamentation && spec.ornamentation.toLowerCase() !== 'none' 
    ? `${spec.ornamentation} detailing` 
    : 'graceful minimalist tailoring';

  parts.push(`Step into timeless grace with the **${title}** from the exclusive Label & Loom atelier.`);
  parts.push(`Designed in an evocative shade of **${color}**, this 3-piece ready-to-wear set features a meticulously tailored kurta fashioned from rich **${kurtaFab}**, paired effortlessly with a relaxed **${bottomType}** in **${bottomFab}** and an ethereal **${dupattaFab}** dupatta.`);

  if (spec.neck || spec.sleeve) {
    parts.push(`**Silhouette & Details**: Cut with a flattering **${spec.neck || 'neckline'}** and tailored **${spec.sleeve || 'sleeves'}**, elevated with ${work} and fine border trims.`);
  }

  if (spec.occasion) {
    parts.push(`**Ideal Occasion**: ${spec.occasion}. Perfect for intimate celebrations, cocktail evenings, sangeet ceremonies, or high-aesthetic festive gatherings.`);
  }

  if (spec.washCare) {
    parts.push(`**Wash Care**: ${spec.washCare}.`);
  }

  return parts.join('\n\n');
}

export function isLikelySpecScreenshot(textFound) {
  if (!textFound) return false;
  const keywords = ['salwar', 'kurta', 'fabric', 'neck', 'sleeve', 'bottom type', 'ornamentation', 'wholesale', 'brand color', 'wash only', 'details'];
  const matches = keywords.filter(k => textFound.toLowerCase().includes(k));
  return matches.length >= 2;
}
