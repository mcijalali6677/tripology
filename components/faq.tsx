"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useI18n } from "@/lib/i18n/context"

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6"] as const

export function FAQ() {
  const { t } = useI18n()

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="mb-4 font-serif text-2xl font-bold sm:text-3xl">{t("faq.title")}</h2>
            <p className="text-muted-foreground">{t("faq.subtitle")}</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqKeys.map((key, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-start">{t(`faq.${key}`)}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{t(`faq.a${index + 1}`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
