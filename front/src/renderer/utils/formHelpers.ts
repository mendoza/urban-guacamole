export const removeNumbers = (text: string) => {
  return text.replace(/[0-9]/g, '');
};

export default { removeNumbers };
