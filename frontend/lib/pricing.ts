/** Must stay in sync with `backend/controllers/orderController.js` */
export const FREE_SHIPPING_THRESHOLD_NGN = 100000
export const SHIPPING_FLAT_NGN = 5000

export function getShippingCostNgn(itemsSubtotal: number): number {
  return itemsSubtotal > FREE_SHIPPING_THRESHOLD_NGN ? 0 : SHIPPING_FLAT_NGN
}
