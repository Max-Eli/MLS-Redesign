/**
 * Service prices — managed here in code, no WordPress dependency.
 * To update a price, edit this file and push to GitHub.
 *
 * Format: { [wp-slug]: { price: string, salePrice?: string, duration?: string, badge?: string } }
 */

export interface ServicePrice {
  price: string
  salePrice?: string
  duration?: string
  badge?: string
}

export const servicePrices: Record<string, ServicePrice> = {
  // ── Laser Hair Removal ────────────────────────────────────────────────────
  'botox-1-unit':                                      { price: '13',    duration: 'Per unit' },
  'full-face-botox':                                   { price: '495',   duration: '20–30 min' },
  'full-body-7-parts-6-sessions':                      { price: '2499',  duration: '6 sessions' },
  'full-body-head-to-toe-6-sessions':                  { price: '2999',  duration: '6 sessions' },
  'full-body-7-parts-unlimited-sessions':              { price: '8000',  duration: 'Unlimited' },
  'full-body-head-to-toe-unlimited-sessions':          { price: '12000', duration: 'Unlimited' },
  'full-body-7-parts':                                 { price: '',      duration: 'Call for pricing' },
  'full-body-head-to-toe':                             { price: '',      duration: 'Call for pricing' },
  'large-area-6-sessions':                             { price: '599',   duration: '6 sessions' },
  'large-area-unlimited-sessions':                     { price: '2000',  duration: 'Unlimited' },
  'medium-area-6-sessions':                            { price: '499',   duration: '6 sessions' },
  'medium-area-unlimited-sessions':                    { price: '1500',  duration: 'Unlimited' },
  'full-legs-1-session':                               { price: '599',   duration: '1 session' },
  'full-leg-feet-brazilian-6-sessions':                { price: '849',   duration: '6 sessions' },
  'full-legs-feetbikini-line-6-sessions':              { price: '777',   duration: '6 sessions' },
  'lower-leg-knee-down-feet':                          { price: '249',   duration: '1 session' },
  'lower-legs-1-session':                              { price: '249',   duration: '1 session' },
  'upper-leg-bikini-line-6-sessions':                  { price: '438',   duration: '6 sessions' },
  'full-arms-1-session':                               { price: '499',   duration: '1 session' },
  'half-arms-1-session':                               { price: '249',   duration: '1 session' },
  'full-back-1-session':                               { price: '599',   duration: '1 session' },
  'half-back-1-session':                               { price: '249',   duration: '1 session' },
  'full-face-1-session':                               { price: '249',   duration: '1 session' },
  'underarms-1-session':                               { price: '189',   duration: '1 session' },
  'bikini-line-1-session':                             { price: '189',   duration: '1 session' },
  'brazilian-1-session':                               { price: '249',   duration: '1 session' },
  'buttocks-1-session':                                { price: '249',   duration: '1 session' },
  'chest-1-session':                                   { price: '249',   duration: '1 session' },
  'belly-1-session':                                   { price: '189',   duration: '1 session' },
  'belly-ext-1-session':                               { price: '189',   duration: '1 session' },
  'full-stomach-1-session':                            { price: '249',   duration: '1 session' },
  'neck-back-or-front-1-session':                      { price: '149',   duration: '1 session' },
  'lip-upper-lower-1-session':                         { price: '149',   duration: '1 session' },
  'forehead-1-session':                                { price: '149',   duration: '1 session' },
  'jawline-1-session':                                 { price: '149',   duration: '1 session' },
  'sideburns-1-session':                               { price: '149',   duration: '1 session' },
  'scalp-1-session':                                   { price: '149',   duration: '1 session' },
  'hairline-1-session':                                { price: '149',   duration: '1 session' },
  'eyebrow-center-1-session':                          { price: '149',   duration: '1 session' },
  'nose-1-session':                                    { price: '149',   duration: '1 session' },
  'ears-1-session':                                    { price: '149',   duration: '1 session' },
  'feet-1-session':                                    { price: '149',   duration: '1 session' },
  'toes-1-session':                                    { price: '149',   duration: '1 session' },
  'fingers-1-session':                                 { price: '149',   duration: '1 session' },
  'hands-1-session':                                   { price: '149',   duration: '1 session' },
  'knees-1-session':                                   { price: '189',   duration: '1 session' },
  'happy-trail-1-session':                             { price: '189',   duration: '1 session' },
  'areola-1-session':                                  { price: '149',   duration: '1 session' },

  // ── Laser Treatments ──────────────────────────────────────────────────────
  'laser-genesis-1-session':                           { price: '199',   duration: '30 min' },
  'laser-genesis-3-sessions':                          { price: '599',   duration: '3 sessions' },
  'laser-genesis-facial-6-sessions':                   { price: '1199',  duration: '6 sessions' },
  'laser-skin-tightening-1-session':                   { price: '199',   duration: '45 min' },
  'sun-spot-age-spot-removal-1-session':               { price: '250',   duration: '1 session' },
  'sun-spot-age-spot-freckles-removal-3-sessions':     { price: '450',   duration: '3 sessions' },

  // ── Body Contouring ───────────────────────────────────────────────────────
  'coolsculpting-large-area-1-session':                { price: '1499',  duration: '35 min/area' },
  'coolsculpting-small-area-1-session':                { price: '799',   duration: '35 min/area' },
  'coolsculpting-mini-double-chin-1-session':          { price: '999',   duration: '45 min' },
  'emsculpt-4-session':                                { price: '2000',  duration: '4 sessions', badge: 'Best Value' },
  'emsculpt':                                          { price: '749',   duration: '1 session' },
  'endosphere-therapy-12-sessions':                    { price: '1549',  duration: '12 sessions', badge: 'Best Value' },
  'endosphere-therapy':                                { price: '549',   salePrice: '549', duration: '1 session' },
  'lpg-endermologie':                                  { price: '1194',  duration: '6 sessions' },
  'lpg-endermologie-one-session':                      { price: '1194',  duration: '1 session' },

  // ── Injectables ───────────────────────────────────────────────────────────
  '1-syringe-of-juvederm-ultra-plus':                  { price: '649',   duration: '30–45 min' },
  '1-syringe-of-juvederm-volbella':                    { price: '699',   duration: '30–45 min' },
  '1-syringe-of-juvederm-voluma':                      { price: '699',   duration: '30–45 min' },
  'lip-enhancements-1-session':                        { price: '649',   duration: '30–45 min' },
  'under-eye-fillers-1-session':                       { price: '699',   duration: '30–45 min' },
  'radiesse-dermal-filler-1-syringe':                  { price: '649',   duration: '30 min' },
  'radiesse-non-surgical-butt-lift-8-syringes':        { price: '3992',  duration: '60 min' },
  'kybella-per-vial':                                  { price: '499',   duration: 'Per vial' },
  'kybella':                                           { price: '499',   duration: 'Per vial' },
  'pdo-thread-lift-full-face':                         { price: '',      duration: 'Call for pricing' },
  'pdo-thread-lift-single-area':                       { price: '',      duration: 'Call for pricing' },
  'prp-facelift':                                      { price: '599',   duration: '60 min' },

  // ── Skin Care ─────────────────────────────────────────────────────────────
  'hydrafacial-1-session':                             { price: '249',   duration: '30–45 min' },
  'hydrafacial-3-sessions':                            { price: '597',   duration: '3 sessions' },
  'hydrafacial-6-sessions':                            { price: '1194',  duration: '6 sessions', badge: 'Best Value' },
  'microneedling-1-session':                           { price: '299',   duration: '60 min' },
  'microneedling-3-sessions':                          { price: '749',   duration: '3 sessions' },
  'prp-microneedling-1-session':                       { price: '449',   duration: '75 min' },
  'prp-microneedling-3-sessions':                      { price: '999',   duration: '3 sessions' },
  'rf-microneedling-1-session':                        { price: '549',   duration: '60 min' },
  'rf-microneedling-3-sessions':                       { price: '1499',  duration: '3 sessions' },
  'jetpeel':                                           { price: '299',   duration: '45 min' },
  'prx-t33-red-carpet-peel':                           { price: '',      duration: '45 min' },
  'prx-t33-red-carpet-peel-4-sessions':                { price: '',      duration: '4 sessions' },

  // ── Epicutis Skin Care Products ───────────────────────────────────────────
  'epicutis-arctigenin-brightening-treatment':         { price: '175' },
  'epicutis-arctigenin-brightening-treatment-2':       { price: '175' },
  'epicutis-cleansing-essentials-set':                 { price: '105' },
  'epicutis-cleansing-essentials-set-2':               { price: '105' },
  'epicutis-hyvia-creme':                              { price: '195' },
  'epicutis-hyvia-creme-2':                            { price: '195' },
  'epicutis-lipid-body-treatment':                     { price: '225' },
  'epicutis-lipid-body-treatment-2':                   { price: '225' },
  'epicutis-lipid-recovery-mask':                      { price: '125' },
  'epicutis-lipid-recovery-mask-2':                    { price: '125' },
  'epicutis-lipid-serum':                              { price: '250' },
  'epicutis-luxury-skin-care-set':                     { price: '395', badge: 'Best Value' },
  'epicutis-luxury-skin-care-set-2':                   { price: '395', badge: 'Best Value' },
  'epicutis-oil-cleanser':                             { price: '85' },

  // ── Wellness & IV Therapy ─────────────────────────────────────────────────
  'iv-therapy':                                        { price: '149',   duration: '30–45 min' },
  'iv-therapy-vitamin-infusion-one-cocktail':          { price: '149',   duration: '30–45 min' },
  'nad-iv-therapy-non-members':                        { price: '',      duration: 'Call for pricing' },
  'prp-for-hair-growth-hair-loss-hair-restoration-3-procedures': { price: '1200', duration: '3 procedures', badge: 'Best Value' },
  'prp-for-hair-restoration-1-procedure':              { price: '549',   duration: '1 procedure' },
  'prp-hair-restoration-1-procedure':                  { price: '549',   duration: '1 procedure' },
  'semaglutide-weight-loss-injection':                 { price: '499',   duration: 'Per injection' },

  // ── Memberships ───────────────────────────────────────────────────────────
  'full-body-membership':                              { price: '389',   duration: 'Monthly', badge: 'Membership' },
  'large-area-membership':                             { price: '109',   duration: 'Monthly', badge: 'Membership' },
  'medium-area-membership':                            { price: '89',    duration: 'Monthly', badge: 'Membership' },

  // ── Gift Cards ────────────────────────────────────────────────────────────
  'gift-card-50':                                      { price: '50' },
  'gift-card-100':                                     { price: '100' },
  'gift-card-150':                                     { price: '150' },
  'gift-card-200':                                     { price: '200' },
  'gift-card-250':                                     { price: '250' },
  'gift-card-300':                                     { price: '300' },
  'gift-card-500':                                     { price: '500' },
  'gift-card-1000':                                    { price: '1000' },
}
