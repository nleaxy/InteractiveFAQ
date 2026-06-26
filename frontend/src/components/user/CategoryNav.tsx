import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useFaqStore } from "@/store/useFaqStore";

interface CategoryNavProps {
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryNav({ activeId, onSelect }: CategoryNavProps) {
  const currentProjectFaqs = useFaqStore((state) => state.currentProjectFaqs);

  const categories = useMemo(() => {
    const names = currentProjectFaqs.map((f) => f.category).filter(Boolean);
    return Array.from(new Set(names));
  }, [currentProjectFaqs]);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={activeId === null ? "default" : "outline"}
        onClick={() => onSelect(null)}
        className="rounded-full"
      >
        Все вопросы
      </Button>

      {categories.map((catName: string) => (
        <Button
          key={catName}
          variant={activeId === catName ? "default" : "outline"}
          onClick={() => onSelect(catName)}
          className="rounded-full"
        >
          {catName}
        </Button>
      ))}
    </div>
  );
}
