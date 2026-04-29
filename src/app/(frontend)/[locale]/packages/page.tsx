import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/sections/ScrollReveal'

export const metadata: Metadata = {
  title: 'Packages — SmartCounter CCTV Analytics Pricing',
  description:
    'Choose the right SmartCounter package for your retail business. Basic, Add-On, or Premium people counting plans.',
}

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const dict = await getDictionary(locale as Locale)

  const packages = [
    {
      name: 'Basic',
      description: 'Essential people counting for single locations',
      badge: null,
      features: [
        'People counting (entries/exits)',
        'Real-time occupancy monitoring',
        'Basic heatmaps',
        'Daily traffic reports',
        'Single location dashboard',
        'Email support',
      ],
    },
    {
      name: 'Add-On',
      description: 'Advanced analytics for growing retail chains',
      badge: 'Best Offer',
      features: [
        'Everything in Basic, plus:',
        'Demographics (age & gender)',
        'Zone analytics (up to 10 zones)',
        'Queue management',
        'Conversion rate tracking',
        'Multi-location dashboards',
        'Priority email support',
      ],
    },
    {
      name: 'Premium',
      description: 'Complete solution for enterprise retail',
      badge: null,
      features: [
        'Everything in Basic + Add-On, plus:',
        'Unlimited zones',
        'Staff optimization insights',
        'Customer journey tracking',
        'Advanced heatmaps & traffic flow',
        'Scheduled PDF reports',
        'API access for integrations',
        'Dedicated account manager',
      ],
    },
  ]

  const comparisonFeatures = [
    { name: 'People Counting', basic: true, addOn: true, premium: true },
    { name: 'Occupancy Monitoring', basic: true, addOn: true, premium: true },
    { name: 'Basic Heatmaps', basic: true, addOn: true, premium: true },
    { name: 'Demographics', basic: false, addOn: true, premium: true },
    { name: 'Zone Analytics', basic: false, addOn: 'Up to 10', premium: 'Unlimited' },
    { name: 'Queue Management', basic: false, addOn: true, premium: true },
    { name: 'Conversion Rate Tracking', basic: false, addOn: true, premium: true },
    { name: 'Customer Journey', basic: false, addOn: false, premium: true },
    { name: 'Advanced Traffic Flow', basic: false, addOn: false, premium: true },
    { name: 'Scheduled Reports (PDF/CSV)', basic: false, addOn: false, premium: true },
    { name: 'API Access', basic: false, addOn: false, premium: true },
    { name: 'Multi-Location', basic: false, addOn: true, premium: true },
    { name: 'Email Support', basic: true, addOn: 'Priority', premium: 'Priority + Dedicated Manager' },
  ]

  const faqs = [
    {
      q: 'Do all packages include hardware and installation?',
      a: 'Yes. All SmartCounter packages include the CCTV AI hardware and professional on-site installation by our technical team.',
    },
    {
      q: 'Can I upgrade or downgrade my package later?',
      a: 'Absolutely. You can change your plan at any time during your subscription. Upgrades and downgrades take effect immediately.',
    },
    {
      q: 'Is there a long-term contract required?',
      a: 'We offer flexible month-to-month and annual subscription options. Annual plans include a 15% discount.',
    },
    {
      q: 'What if I need more zones than my package allows?',
      a: 'You can easily add additional zones for a small monthly fee. Contact our sales team for zone add-on pricing.',
    },
    {
      q: 'Do you offer enterprise custom packages?',
      a: 'Yes. For organizations with 50+ locations or specialized requirements, we create custom enterprise solutions. Contact us for details.',
    },
    {
      q: 'What support is included?',
      a: 'Basic includes email support (24-48hr response). Add-On and Premium include priority email support and live chat during business hours.',
    },
  ]

  return (
    <>
      {/* Header */}
      <section className="px-4 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <ScrollReveal>
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                {dict.packages.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="mx-auto max-w-2xl text-lg text-text-secondary">{dict.packages.subtitle}</p>
            </ScrollReveal>
          </div>

          {/* Package Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {packages.map((pkg, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="relative flex flex-col rounded-2xl border border-white/[0.06] bg-bg-card/60 p-8 backdrop-blur-xl transition-all duration-250 hover:-translate-y-1 hover:border-primary-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-sm font-semibold text-white">
                      {pkg.badge}
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    <p className="text-sm text-text-secondary">{pkg.description}</p>
                  </div>

                  <div className="mb-6 flex-1">
                    <p className="text-xs uppercase tracking-wider text-text-muted mb-4">Features Included:</p>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, j) => (
                        <li key={j} className={`flex items-start gap-2 text-sm ${feature.startsWith('Everything') ? 'font-semibold text-primary-400' : ''}`}>
                          {!feature.startsWith('Everything') && <Check size={16} className="mt-0.5 flex-shrink-0 text-primary-500" />}
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/${locale}/contact`}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all duration-250 hover:bg-primary-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  >
                    {dict.common.contactUs} <ArrowRight size={18} />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mb-16">
            <ScrollReveal>
              <h2 className="mb-8 text-3xl font-bold text-center">Feature Comparison</h2>
            </ScrollReveal>
            <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="p-4 text-left font-semibold">Feature</th>
                    <th className="p-4 text-center font-semibold">Basic</th>
                    <th className="p-4 text-center font-semibold">Add-On</th>
                    <th className="p-4 text-center font-semibold">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, i) => (
                    <tr key={i} className={i % 2 === 1 ? 'bg-bg-surface/30' : ''}>
                      <td className="p-4 text-left">{feature.name}</td>
                      <td className="p-4 text-center">
                        {feature.basic === true ? (
                          <Check size={18} className="mx-auto text-primary-500" />
                        ) : feature.basic === false ? (
                          <span className="text-text-muted">—</span>
                        ) : (
                          <span className="text-sm">{feature.basic}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {feature.addOn === true ? (
                          <Check size={18} className="mx-auto text-primary-500" />
                        ) : feature.addOn === false ? (
                          <span className="text-text-muted">—</span>
                        ) : (
                          <span className="text-sm">{feature.addOn}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {feature.premium === true ? (
                          <Check size={18} className="mx-auto text-primary-500" />
                        ) : feature.premium === false ? (
                          <span className="text-text-muted">—</span>
                        ) : (
                          <span className="text-sm">{feature.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <ScrollReveal>
              <h2 className="mb-8 text-3xl font-bold text-center">Package FAQ</h2>
            </ScrollReveal>
            <div className="grid gap-4 md:grid-cols-2">
              {faqs.map((faq, i) => (
                <ScrollReveal key={i} delay={i * 50}>
                  <div className="rounded-lg border border-white/[0.06] bg-bg-card/60 p-5 backdrop-blur-xl">
                    <h4 className="mb-2 font-semibold">{faq.q}</h4>
                    <p className="text-sm text-text-secondary">{faq.a}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Enterprise CTA */}
          <ScrollReveal>
            <div className="rounded-2xl border border-white/[0.06] bg-primary-500/10 p-8 text-center backdrop-blur-xl sm:p-12">
              <h3 className="mb-3 text-2xl font-bold">Need an Enterprise Solution?</h3>
              <p className="mb-6 text-text-secondary">
                For organizations with 50+ locations or specialized requirements, we create custom packages tailored to your needs.
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all duration-250 hover:bg-primary-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                Talk to Sales <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
