from src.modules.todoList.infrastructure.entities.todo_entity import Todo
from sqlalchemy.orm import joinedload

class TodoRepository:
    def __init__(self, session):
        self.session = session

    def get_all(self):
        todos = self.session.query(Todo).options(joinedload(Todo.user)).order_by(Todo.order).all()
        return [
            {
                "id": t.id,
                "task": t.task,
                "description": t.description,
                "status": t.status,
                "order": t.order,
                "updated_at": t.updated_at,
                "user": {
                    "id": t.user.id,
                    "name": t.user.name,
                    "username": t.user.username,
                    "role": t.user._role,
                    "status": t.user.status,
                } if t.user else None,
            }
            for t in todos
        ]

    def get_by_id(self, id):
        return self.session.query(Todo).filter(Todo.id == id).first()

    def get_order_by_ids(self, ids):
        return self.session.query(Todo).filter(Todo.id.in_(ids)).all()

    def get_last_order(self):
        return self.session.query(Todo.order).order_by(Todo.order.desc()).first()

    def create(self, todo):
        self.session.add(todo)
        self.session.commit()
        return todo

    def update(self, todo):
        self.session.merge(todo)
        self.session.commit()
        return todo

    def delete(self, todo):
        self.session.delete(todo)
        self.session.commit()
        return todo
