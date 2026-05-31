import { PRODUCT_CARD_STATS } from "../configs/productCard.config";

export interface ProductCardMetrics {
  discount: number;
  oldPrice: number;
  rating: string;
  reviews: number;
  stockCount: number;
}

export function getProductCardMetrics(
  productId: number,
  price: number,
): ProductCardMetrics {
  return {
    discount: getDiscountPercent(productId),
    oldPrice: getOldPrice(productId, price),
    rating: getRating(productId),
    reviews: getReviewCount(productId),
    stockCount: getStockCount(productId),
  };
}

function getDiscountPercent(productId: number): number {
  return (
    PRODUCT_CARD_STATS.BASE_DISCOUNT_PERCENT +
    (productId % PRODUCT_CARD_STATS.DISCOUNT_BUCKETS) *
      PRODUCT_CARD_STATS.DISCOUNT_STEP_PERCENT
  );
}

function getOldPrice(productId: number, price: number): number {
  const discount = getDiscountPercent(productId);
  const multiplier =
    PRODUCT_CARD_STATS.FULL_PRICE_MULTIPLIER +
    discount / PRODUCT_CARD_STATS.PERCENT_DIVISOR;

  return Math.round(price * multiplier);
}

function getRating(productId: number): string {
  const rating =
    PRODUCT_CARD_STATS.BASE_RATING +
    (productId % PRODUCT_CARD_STATS.RATING_BUCKETS) *
      PRODUCT_CARD_STATS.RATING_STEP;

  return rating.toFixed(PRODUCT_CARD_STATS.RATING_DECIMALS);
}

function getReviewCount(productId: number): number {
  return (
    PRODUCT_CARD_STATS.BASE_REVIEW_COUNT +
    productId * PRODUCT_CARD_STATS.REVIEW_STEP
  );
}

function getStockCount(productId: number): number {
  return (
    PRODUCT_CARD_STATS.BASE_STOCK_COUNT +
    (productId % PRODUCT_CARD_STATS.STOCK_BUCKETS) *
      PRODUCT_CARD_STATS.STOCK_STEP
  );
}
