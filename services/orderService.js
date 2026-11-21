function calculateTotals(items) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }

  return items.reduce((total, item) => {
    const price = Number(item.price);
    const qty = Number(item.qty);

    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(qty) || qty < 0) {
      throw new Error(`Invalid price or quantity for item: ${JSON.stringify(item)}`);
    }

    return total + price * qty;
  }, 0);
}

function applyDiscount(total, discountPercent) {
  const numericTotal = Number(total);
  const numericDiscount = Number(discountPercent);

  if (!Number.isFinite(numericTotal) || numericTotal < 0) {
    throw new Error('Total must be a finite non-negative number');
  }
  if (!Number.isFinite(numericDiscount) || numericDiscount < 0 || numericDiscount > 100) {
    throw new Error('Discount percent must be between 0 and 100');
  }

  return numericTotal - (numericTotal * numericDiscount) / 100;
}

module.exports = { calculateTotals, applyDiscount };
