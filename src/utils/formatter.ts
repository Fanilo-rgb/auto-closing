
export const formatNumber = (str: string, pattern: number[]) => {
  let result = "";
  let index = 0;

  for (const part of pattern) {
    result += str.slice(index, index + part);
    index += part;
    if (index < str.length) result += " ";
  }

  return result.trim();
}

export const formatNumberCard = (value: string) => {
  return value
    .replace(/\D/g, "") // que des chiffres
    .slice(0, 8) // max 8 chiffres
    .replace(/(\d{2})(?=\d)/g, "$1 ") // format xx xx xx xx
    .trim()
}

export const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .slice(0, 10) // max 10 chiffres
    .replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, "$1 $2 $3 $4")
    .trim()
}

export const formatCin = (value: string) => {
  return value
    .replace(/\D/g, "")
    .slice(0, 12) // max 12 chiffres
    .replace(/(\d{3})(?=\d)/g, "$1 ")
    .trim()
}