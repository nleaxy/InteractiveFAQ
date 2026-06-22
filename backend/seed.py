from app.database.connection import engine, Base, SessionLocal
from app.models.user import User
from app.models.faq_project import FAQProject
from app.models.faq_item import FAQItem

ANALYST_DATA = {
  "businesses": [
    {
      "id": 1,
      "name": "StepStyle",
      "slug": "stepstyle",
      "categories": [
        {
          "name": "Оформление заказа",
          "faq": [
            {
              "question": "Как оформить заказ на сайте?",
              "answer": "Выберите понравившийся товар, укажите размер, добавьте его в корзину и перейдите к оформлению заказа. После заполнения контактных данных и выбора способа доставки подтвердите заказ.",
              "synonyms": ["как купить обувь", "как заказать кроссовки", "оформление покупки"]
            },
            {
              "question": "Можно ли изменить заказ после оформления?",
              "answer": "Да, вы можете изменить заказ до момента его передачи в службу доставки. Для этого свяжитесь с нашей службой поддержки.",
              "synonyms": ["исправить заказ", "отредактировать заказ", "изменить покупку"]
            },
            {
              "question": "Как отменить заказ?",
              "answer": "Отменить заказ можно через личный кабинет или обратившись в службу поддержки.",
              "synonyms": ["отказаться от заказа", "удалить заказ", "отменить покупку"]
            }
          ]
        },
        {
          "name": "Доставка",
          "faq": [
            {
              "question": "Сколько времени занимает доставка?",
              "answer": "Средний срок доставки составляет от 1 до 5 рабочих дней в зависимости от региона."
            },
            {
              "question": "Сколько стоит доставка?",
              "answer": "Стоимость доставки рассчитывается автоматически при оформлении заказа и зависит от региона доставки."
            },
            {
              "question": "Можно ли отследить заказ?",
              "answer": "Да, после отправки заказа вы получите трек-номер для отслеживания.",
              "synonyms": ["где моя посылка", "отследить доставку", "статус заказа"]
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "name": "AutoMatch",
      "slug": "automatch",
      "categories": [
        {
          "name": "Подбор автомобиля",
          "faq": [
            {
              "question": "Как работает подбор автомобиля?",
              "answer": "После заполнения заявки наш специалист анализирует ваши требования и подбирает подходящие варианты автомобилей.",
              "synonyms": ["помощь в выборе машины", "подбор авто", "найти автомобиль"]
            }
          ]
        },
        {
          "name": "Проверка автомобиля",
          "faq": [
            {
              "question": "Проверяете ли вы автомобиль перед покупкой?",
              "answer": "Да, мы проводим техническую и юридическую проверку автомобиля перед сделкой.",
              "synonyms": ["осмотр машины", "проверка авто", "диагностика автомобиля"]
            }
          ]
        }
      ]
    }
  ]
}

def init_and_seed_db():
    print("Инициализация базы данных PostgreSQL...")
    
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Создание администратора...")
        test_user = User(
            id=1,
            login="admin",
            password_hash="hashed_test_password_123"
        )
        db.add(test_user)
        db.commit()

        print("Наполнение базы проектами и статьями...")
        for b_data in ANALYST_DATA["businesses"]:
            project = FAQProject(
                id=b_data["id"],
                name=b_data["name"],
                slug=b_data["slug"],
                owner_id=test_user.id
            )
            db.add(project)
            db.flush()

            for c_data in b_data["categories"]:
                category_name = c_data["name"]

                for f_data in c_data["faq"]:
                    faq_item = FAQItem(
                        project_id=project.id,
                        category=category_name,
                        question=f_data["question"],
                        answer=f_data["answer"],
                        synonyms=f_data.get("synonyms", [])
                    )
                    db.add(faq_item)

        db.commit()
        print("База данных PostgreSQL успешно инициализирована и наполнена тестовыми данными")
        
    except Exception as e:
        print(f"Ошибка при работе с СУБД: {e}")
        db.rollback()
    finally:
        db.close()
        print("Процесс завершен.")

if __name__ == "__main__":
    init_and_seed_db()