import { updateRankMathMeta } from './publish.mjs'

const postId = 834
const seoDescription = "Learn why fast-growing B2B SaaS companies lose enterprise contracts during procurement review due to VPAT and WCAG compliance gaps, and how to pass reviews."
const seoTitle = "3 Reasons SaaS Vendors Fail Enterprise Accessibility Procurement | A11y Pros"
const focusKeyword = "enterprise accessibility procurement"

console.log(`Updating SEO meta for Post #${postId}...`)
updateRankMathMeta(postId, { seoDescription, seoTitle, focusKeyword })
  .then(() => console.log('Successfully updated Rank Math Pro meta description!'))
  .catch(err => console.error('Error updating SEO meta:', err))
