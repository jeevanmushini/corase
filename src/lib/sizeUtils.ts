
export const isNumericSize = (size: string): boolean => {
  return !isNaN(Number(size));
};

export const filterSizesByCategory = (sizes: string[], category: string = ""): string[] => {
  const cat = category.toLowerCase();
  const isBottom = cat.includes("bottom") || cat.includes("pant") || cat.includes("trouser");

  if (isBottom) {
    // Only show numeric sizes for pants/bottoms
    return sizes.filter(isNumericSize);
  } else {
    // Only show letter sizes for everything else (Tshirts, Hoodies, etc.)
    return sizes.filter(size => !isNumericSize(size));
  }
};

export const getAvailableSizesByCategory = (category: string = ""): string[] => {
  const cat = category.toLowerCase();
  if (cat.includes("bottom") || cat.includes("pant") || cat.includes("trouser")) {
    return ["28", "30", "32", "34", "36", "38"];
  }
  return ["XS", "S", "M", "L", "XL", "XXL"];
};
