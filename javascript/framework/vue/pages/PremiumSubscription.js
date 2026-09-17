// javascript/framework/vue/pages/PremiumSubscription.js
import { usePlanStore } from '../stores/plan.js'

export default {
  name: 'PremiumSubscription',

  // Exposed to the template as `planStore` — the Monthly/Yearly buttons,
  // price period, billing description, and yearly-savings message all
  // read/write through it directly. Handoff Notes: "When switching to
  // Yearly, JS should update the active billing button, billing
  // description, price period (/month → /year), and show the yearly
  // savings message."
  setup() {
    const planStore = usePlanStore()
    return { planStore }
  }
}
