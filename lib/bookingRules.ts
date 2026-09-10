import type { LumeService } from '@/lib/lume'

// Who may take which consultation. Provider ids are LumèCRM membership ids
// (stable per staff member — visible in the CRM's staff settings URL).
export const PROVIDER_IDS = {
  lilian: 36, // Lilian A., Nurse Practitioner
  mariia: 45, // Mariia P., Technician
} as const

export interface InterestRule {
  id: string
  label: string
  /** Matched against CRM consultation service names — a dedicated service
      (e.g. "Injectable Consultation") is picked up automatically once created. */
  keywords: string[]
  providerIds: number[]
}

export const INTEREST_RULES: InterestRule[] = [
  { id: 'injectables',   label: 'Injectables',                  keywords: ['injectable'],                 providerIds: [PROVIDER_IDS.lilian] },
  { id: 'skin',          label: 'Skin Analysis',                keywords: ['skin'],                       providerIds: [PROVIDER_IDS.mariia, PROVIDER_IDS.lilian] },
  { id: 'laser',         label: 'Laser Hair Removal',           keywords: ['laser hair', 'hair removal'], providerIds: [PROVIDER_IDS.lilian] },
  { id: 'coolsculpting', label: 'Body Contouring (CoolSculpting)', keywords: ['coolsculpt'],              providerIds: [PROVIDER_IDS.lilian] },
  { id: 'emsculpt',      label: 'Muscle Toning (Emsculpt)',     keywords: ['emsculpt'],                   providerIds: [PROVIDER_IDS.lilian] },
  { id: 'other',         label: 'General',                      keywords: [],                             providerIds: [PROVIDER_IDS.lilian] },
]

export function getRule(id: string): InterestRule | undefined {
  return INTEREST_RULES.find(r => r.id === id)
}

export function resolveService(rule: InterestRule, services: LumeService[]): LumeService | null {
  for (const kw of rule.keywords) {
    const hit = services.find(s => s.name.toLowerCase().includes(kw))
    if (hit) return hit
  }
  return services.find(s => s.name.toLowerCase() === 'consultation') ?? services[0] ?? null
}
