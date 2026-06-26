import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/types/faq";

interface FaqAccordionProps {
  items: FAQ[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400">
        Ничего не найдено. Попробуйте изменить запрос.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {items.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={String(faq.id)}
          className="bg-white border rounded-xl px-4 shadow-sm"
        >
          <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-slate-600 leading-relaxed pb-4">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
