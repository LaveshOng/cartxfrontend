export const formatPrice = price => {
  // Round to 2 decimal places first
  const roundedPrice = Math.round(price * 100) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(roundedPrice);
};
