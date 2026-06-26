import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFaqStore } from "@/store/useFaqStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function FaqEditor() {
  const { addFaq, activeProject } = useFaqStore();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("Общее");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeProject) {
      toast.error("Проект не выбран");
      return;
    }

    if (!question || !answer || !category) {
      toast.warning("Заполните все поля");
      return;
    }

    try {
      await addFaq(activeProject.id, {
        question,
        answer,
        category,
        synonyms: [],
      });

      toast.success("Вопрос добавлен");
      setQuestion("");
      setAnswer("");
    } catch (error) {
      toast.error("Ошибка при добавлении");
    }
  };

  return (
    <Card className="w-full max-w-[400px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Новый вопрос</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <Input
              id="category"
              placeholder="Например: Доставка"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="question">Вопрос</Label>
            <Input
              id="question"
              placeholder="Введите текст вопроса"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Ответ</Label>
            <Textarea
              id="answer"
              placeholder="Введите текст ответа"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#2051FF] hover:bg-blue-700"
          >
            Добавить в базу
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
