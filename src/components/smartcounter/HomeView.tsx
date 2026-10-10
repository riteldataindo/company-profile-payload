import React from 'react'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { whatsappHref, type CompanyContact } from '@/lib/profile/contact'
import type { Locale, LocalText } from './i18n'
import { route, sharedCopy, text } from './i18n'
import { ButtonLink, SmartLink } from './Primitives'
import {
  faqCopy,
  finalCopy,
  heroCopy,
  scenesCopy,
  stepsCopy,
  type Availability,
} from './landing/copy'
import { ContactLinks } from './landing/ContactLinks'
import { HeroSimulation } from './landing/HeroSimulation'
import { ProductScreens } from './landing/ProductScreens'

type SceneKind = 'retail' | 'mall'

function WhatsAppButton({
  locale,
  contact,
  className = '',
}: {
  locale: Locale
  contact: CompanyContact
  className?: string
}) {
  return (
    <ButtonLink
      href={whatsappHref(contact, text(locale, heroCopy.whatsappMessage))}
      variant="secondary"
      className={className}
      external
      icon={<MessageCircle aria-hidden="true" size={18} />}
    >
      {text(locale, heroCopy.whatsapp)}
    </ButtonLink>
  )
}

function Hero({ locale, contact }: { locale: Locale; contact: CompanyContact }) {
  return (
    <section className="lp-hero" aria-labelledby="lp-hero-title">
      <div className="container lp-hero__layout">
        <div className="lp-hero__copy">
          <h1 id="lp-hero-title" className="lp-hero__title">
            <span>{text(locale, heroCopy.titleA)}</span> <span>{text(locale, heroCopy.titleB)}</span>
          </h1>
          <p className="lp-hero__lead">{text(locale, heroCopy.lead)}</p>
          <div className="lp-hero__actions">
            <ButtonLink href={route(locale, '/demo')}>{text(locale, sharedCopy.seeInAction)}</ButtonLink>
            <WhatsAppButton locale={locale} contact={contact} />
          </div>
          <p className="lp-hero__support">{text(locale, heroCopy.support)}</p>
        </div>
        <div className="lp-hero__stage">
          <span className="lp-hero__plane" aria-hidden="true" />
          <HeroSimulation locale={locale} />
        </div>
      </div>
    </section>
  )
}

type Mark = { label: LocalText; tone: 'signal' | 'dwell' | 'flow' | 'muted'; left: string; top: string }

const sceneMarks: Record<SceneKind, Mark[]> = {
  retail: [
    { label: scenesCopy.retail.marks.entry, tone: 'signal', left: '13%', top: '86.5%' },
    { label: scenesCopy.retail.marks.zone, tone: 'dwell', left: '35%', top: '57.5%' },
    { label: scenesCopy.retail.marks.path, tone: 'flow', left: '25%', top: '39%' },
  ],
  mall: [
    { label: scenesCopy.mall.marks.corridor, tone: 'dwell', left: '39%', top: '86%' },
    { label: scenesCopy.mall.marks.internal, tone: 'flow', left: '70.5%', top: '64%' },
    { label: scenesCopy.mall.marks.floor, tone: 'muted', left: '3%', top: '31%' },
  ],
}

function SceneMarks({ kind }: { kind: SceneKind }) {
  return (
    <svg className="lp-marks" viewBox="0 0 1248 832" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {kind === 'retail' ? (
        <>
          <path className="lp-marks__zone" d="M436 536 L826 536 L858 690 L404 690 Z" />
          <path className="lp-marks__path" d="M640 832 C626 760 520 716 452 640 S360 470 430 380" />
          <path className="lp-marks__line" d="M160 790 L1096 790" />
        </>
      ) : (
        <>
          <path className="lp-marks__zone" d="M458 832 L972 832 L790 430 L636 430 Z" />
          <path className="lp-marks__line lp-marks__line--flow" d="M584 560 L866 560" />
          <path className="lp-marks__path lp-marks__path--muted" d="M0 318 L612 244" />
        </>
      )}
    </svg>
  )
}

function AvailabilityTag({ locale, value }: { locale: Locale; value: Availability }) {
  return <span className={`lp-tag lp-tag--${value}`}>{text(locale, scenesCopy.availability[value])}</span>
}

function SceneRow({ locale, kind }: { locale: Locale; kind: SceneKind }) {
  const data = scenesCopy[kind]
  return (
    <article className={`lp-scene lp-scene--${kind}`} aria-labelledby={`lp-scene-${kind}`}>
      <figure className="lp-scene__media">
        <Image
          src={kind === 'retail' ? '/editorial/retail-path-zones-v4.webp' : '/editorial/mall-flow-zones-v4.webp'}
          alt={text(locale, data.alt)}
          width={1248}
          height={832}
          sizes="(min-width: 1280px) 700px, (min-width: 900px) 56vw, 100vw"
        />
        <SceneMarks kind={kind} />
        {sceneMarks[kind].map((mark) => (
          <span
            key={mark.label.en}
            className={`lp-scene__mark lp-scene__mark--${mark.tone}`}
            style={{ left: mark.left, top: mark.top }}
            aria-hidden="true"
          >
            {text(locale, mark.label)}
          </span>
        ))}
        <figcaption className="lp-scene__note">{text(locale, scenesCopy.photoNote)}</figcaption>
      </figure>
      <div className="lp-scene__body">
        <h3 id={`lp-scene-${kind}`}>{text(locale, data.title)}</h3>
        <p className="lp-scene__intro">{text(locale, data.intro)}</p>
        <ul className="lp-directory">
          {data.questions.map((item) => (
            <li key={item.question.en}>
              <div>
                <strong>{text(locale, item.question)}</strong>
                <span>{text(locale, item.answer)}</span>
              </div>
              <AvailabilityTag locale={locale} value={item.availability} />
            </li>
          ))}
        </ul>
        <SmartLink className="lp-link" href={route(locale, `/solutions/${kind}`)}>{text(locale, data.link)}</SmartLink>
      </div>
    </article>
  )
}

function Scenes({ locale }: { locale: Locale }) {
  return (
    <section className="lp-section" aria-labelledby="lp-scenes-title">
      <div className="container">
        <header className="lp-heading lp-heading--split">
          <h2 id="lp-scenes-title">{text(locale, scenesCopy.title)}</h2>
          <div>
            <p>{text(locale, scenesCopy.lead)}</p>
            <p className="lp-heading__note">{text(locale, scenesCopy.legend)}</p>
          </div>
        </header>
        <div className="lp-scenes">
          <SceneRow locale={locale} kind="retail" />
          <SceneRow locale={locale} kind="mall" />
        </div>
      </div>
    </section>
  )
}

function Steps({ locale }: { locale: Locale }) {
  return (
    <section className="lp-section lp-section--tint" aria-labelledby="lp-steps-title">
      <div className="container">
        <header className="lp-heading lp-heading--split">
          <h2 id="lp-steps-title">{text(locale, stepsCopy.title)}</h2>
          <p>{text(locale, stepsCopy.lead)}</p>
        </header>
        <ol className="lp-route">
          {stepsCopy.steps.map((step, index) => (
            <li key={step.title.en}>
              <span className="lp-route__stop" aria-hidden="true">{index + 1}</span>
              <h3>{text(locale, step.title)}</h3>
              <p>{text(locale, step.body)}</p>
            </li>
          ))}
        </ol>
        <div className="lp-route__foot">
          <p>{text(locale, stepsCopy.note)}</p>
          <div className="lp-route__links">
            <SmartLink className="lp-link" href={route(locale, '/validation')}>{text(locale, stepsCopy.validationLink)}</SmartLink>
            <SmartLink className="lp-link" href={route(locale, '/deployment')}>{text(locale, stepsCopy.deploymentLink)}</SmartLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function Faq({ locale, contact }: { locale: Locale; contact: CompanyContact }) {
  return (
    <section className="lp-section" aria-labelledby="lp-faq-title">
      <div className="container lp-faq">
        <div className="lp-faq__intro">
          <h2 id="lp-faq-title">{text(locale, faqCopy.title)}</h2>
          <p>{text(locale, faqCopy.lead)}</p>
          <ContactLinks locale={locale} contact={contact} />
        </div>
        <div className="lp-faq__list">
          {faqCopy.items.map((item) => (
            <details key={item.question.en} className="lp-faq__item">
              <summary>
                <span>{text(locale, item.question)}</span>
                <span className="lp-faq__icon" aria-hidden="true" />
              </summary>
              <div className="lp-faq__answer"><p>{text(locale, item.answer)}</p></div>
            </details>
          ))}
          <SmartLink className="lp-link" href={route(locale, '/faq')}>{text(locale, faqCopy.all)}</SmartLink>
        </div>
      </div>
    </section>
  )
}

function FinalCta({ locale, contact }: { locale: Locale; contact: CompanyContact }) {
  return (
    <section className="lp-cta" aria-labelledby="lp-cta-title">
      <div className="container lp-cta__inner">
        <div className="lp-cta__copy">
          <h2 id="lp-cta-title">{text(locale, finalCopy.title)}</h2>
          <p>{text(locale, finalCopy.body)}</p>
        </div>
        <div className="lp-cta__actions">
          <ButtonLink href={route(locale, '/demo')} className="button--inverse">{text(locale, sharedCopy.seeInAction)}</ButtonLink>
          <WhatsAppButton locale={locale} contact={contact} className="button--ghost-light" />
        </div>
      </div>
    </section>
  )
}

export function HomeView({ locale, contact }: { locale: Locale; contact: CompanyContact }) {
  return (
    <div className="lp">
      <Hero locale={locale} contact={contact} />
      <ProductScreens locale={locale} />
      <Scenes locale={locale} />
      <Steps locale={locale} />
      <Faq locale={locale} contact={contact} />
      <FinalCta locale={locale} contact={contact} />
    </div>
  )
}
