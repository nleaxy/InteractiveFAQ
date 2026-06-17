import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFaqStore } from "@/store/useFaqStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FaqEditor() {
  const addFaq = useFaqStore((state) => state.addFaq);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    addFaq({
      id: Date.now().toString(),
      question,
      answer,
      categoryId: "1",
      synonyms: [],
      keywords: [],
    });

    setQuestion("");
    setAnswer("");
  };

  return (
    <Card className="w-[400px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Новый вопрос</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>
          <Button type="submit" className="w-full">
            Добавить в базу
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
