// GOOD PATTERN: pure functions, no side effects, easy to unit test.
// GOOD PATTERN: validates that price and qty are finite, positive
// numbers before using them, preventing NaN propagation.
function calculateTotals(items) {
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
  return total - (total * discountPercent) / 100;
}

module.exports = { calculateTotals, applyDiscount };
