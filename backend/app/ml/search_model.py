import torch
from sentence_transformers import SentenceTransformer, util

class FAQSynonymizer:
    def __init__(self, model_name='sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'):
        # при первом запуске эта строчка сама скачает модель (+-420 МБ)
        print("загрузка модели (займет какое-то время)...")
        self.model = SentenceTransformer(model_name)
        self.faq_questions = []
        self.faq_embeddings = None

    def update_database(self, questions: list):
        # загружает эталонные вопросы и переводит их в векторы
        self.faq_questions = questions
        if questions:
            self.faq_embeddings = self.model.encode(questions, convert_to_tensor=True)
            print(f"база FAQ успешно обновлена. загружено вопросов: {len(questions)}")
        else:
            self.faq_embeddings = None

    def find_closest_faq(self, user_query: str, threshold: float = 0.5):
        # ищет похожий вопрос
        # если сходство ниже threshold - считает запрос мусором
        if not self.faq_questions or self.faq_embeddings is None:
            return None, 0.0

        # векторизуем запрос пользователя
        query_embedding = self.model.encode(user_query, convert_to_tensor=True)

        # считаем косинусное сходство со всей базой
        cos_scores = util.cos_sim(query_embedding, self.faq_embeddings)[0]

        # находим самый похожий вариант
        top_results = torch.topk(cos_scores, k=1)
        best_score = top_results.values[0].item()
        best_idx = top_results.indices[0].item()

        # проверка порога уверенности
        if best_score >= threshold:
            return self.faq_questions[best_idx], best_score
        else:
            return None, best_score


# тестирование
if __name__ == "__main__":
    synonymizer = FAQSynonymizer()

    # примеры вопросов: умная структура данных: один айди/ответ -> много вариантов вопросов
    faq_dataset = [
        {
            "main_question": "Как восстановить пароль от личного кабинета?",
            "alternatives": [
                "восстановление доступа к лк", 
                "забыл пасс от акка", 
                "не могу войти в аккаунт пароль"
            ]
        },
        {
            "main_question": "Как связаться с технической поддержкой проекта?",
            "alternatives": [
                "контакты саппорта", 
                "куда писать если все сломалось хелп", 
                "написать в службу поддержки"
            ]
        },
        {
            "main_question": "Где найти токен и API-документацию для интеграции?",
            "alternatives": [
                "где взять ключ апи", 
                "api token documentation", 
                "настройка интеграции по api"
            ]
        }
    ]

    # плоский список для модели (собираем ВСЕ возможные формулировки)
    flatten_questions = []
    # карта для обратного поиска: какой синоним к какому каноничному вопросу относится
    question_mapping = {}

    for item in faq_dataset:
        main = item["main_question"]
        all_variants = [main] + item["alternatives"]  # добавляем и главный вопрос, и все его альтернативы
        for variant in all_variants:
            flatten_questions.append(variant)
            question_mapping[variant] = main

    # обучаем базу на расширенном списке
    synonymizer.update_database(flatten_questions)

    # примеры запросов от пользователя
    test_queries = [
        "куда писать если все сломалось? хелп",
        "где взять ключ апи?",
        "как вернуть товар в магазин надлежащего качества",  # Ловушка
        "какая сегодня погода в Москве"  # Мусор
    ]


    print("\nТЕСТ МОДЕЛИ")

    for query in test_queries:
        matched, score = synonymizer.find_closest_faq(query, threshold=0.50)
        print(f"пользователь пишет: '{query}'")

        if matched:
            real_question = question_mapping[matched]  # находим главный вопрос по совпавшему синониму
            print(f"найдено совпадение с синонимом: '{matched}'")
            print(f"выдаем статью: '{real_question}' (Сходство: {score:.4f})")

        else:
            print(f"запрос отклонен (Мусор или не по теме) (Сходство: {score:.4f})")

        print("-" * 60)
