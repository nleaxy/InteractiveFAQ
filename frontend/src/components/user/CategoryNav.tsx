import { Button } from "@/components/ui/button";
import { useFaqStore } from "@/store/useFaqStore";

interface CategoryNavProps {
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryNav({ activeId, onSelect }: CategoryNavProps) {
  const { categories } = useFaqStore();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={activeId === null ? "default" : "outline"}
        onClick={() => onSelect(null)}
        className="rounded-full"
      >
        Все вопросы
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={activeId === cat.id ? "default" : "outline"}
          onClick={() => onSelect(cat.id)}
          className="rounded-full"
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}
