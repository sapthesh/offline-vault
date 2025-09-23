/**
 * Determines whether to use black or white text based on the brightness of a background hex color.
 * @param hexcolor The hex color string (e.g., "#RRGGBB").
 * @returns "#000000" for black or "#FFFFFF" for white.
 */
export const getContrastYIQ = (hexcolor: string): string => {
  if (hexcolor.startsWith('#')) {
    hexcolor = hexcolor.substring(1);
  }
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
};
