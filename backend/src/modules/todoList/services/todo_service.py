from src.core.context import get_current_user_id
from src.modules.todoList.infrastructure.types.todo_types import updateOrder_requestType
from src.modules.todoList.infrastructure.repositories.todo_repository import TodoRepository
from fastapi import HTTPException
from src.modules.todoList.infrastructure.types.todo_types import onlyId_requestType
from src.modules.todoList.infrastructure.types.todo_types import update_requestType
from src.modules.todoList.infrastructure.types.todo_types import create_requestType
from src.modules.todoList.infrastructure.entities.todo_entity import Todo
from src.modules.userManagement.infrastructure.repositories.user_repository import UserRepository
from src.core.database import Session

class TodoService:
    def list(self):
        with Session() as session:
            todoRepository = TodoRepository(session)
            todoList = todoRepository.get_all()
            return todoList

    async def create(self, request):
        json_data = await request.json()
        data = create_requestType(**json_data)
        with Session() as session:
            todoRepository = TodoRepository(session)
            last_order = todoRepository.get_last_order()
            userRepository = UserRepository(session)
            user_id = get_current_user_id()
            user = userRepository.get_by_id(user_id)
            
            todo = Todo(
                task=data.task,
                description=data.description,
                _user=user.id,
                order=last_order[0] + 1 if last_order else 0
            )
            todoRepository.create(todo)
            return {"message": "Task created successfully"}

    async def update(self, request):
        json_data = await request.json()
        data = update_requestType(**json_data)
        with Session() as session:
            todoRepository = TodoRepository(session)
            todo = todoRepository.get_by_id(data.id)
            if todo is None:
                raise HTTPException(status_code=404, detail="Task not found")
            todo.task = data.task
            todo.description = data.description
            todoRepository.update(todo)
            return {"message": "Task updated successfully"}

    async def update_order(self, request):
        json_data = await request.json()
        data = updateOrder_requestType(**json_data)
        order_map = {int(k): v for k, v in data.list.items()}
        with Session() as session:
            todoRepository = TodoRepository(session)
            tasks = todoRepository.get_order_by_ids(order_map.keys())
            for task in tasks:
                task.order = order_map[task.id]
                todoRepository.update(task)
            return {"message": "Task order updated successfully"}
                
                

    async def status_change(self, request):
        json_data = await request.json()
        data = onlyId_requestType(**json_data)
        with Session() as session:
            todoRepository = TodoRepository(session)
            todo = todoRepository.get_by_id(data.id)
            if todo is None:
                raise HTTPException(status_code=404, detail="Task not found")
            todo.status = 0 if todo.status == 1 else 1
            todoRepository.update(todo)
            return {"message": "Task status changed successfully"}

    async def delete(self, request):
        json_data = await request.json()
        data = onlyId_requestType(**json_data)
        with Session() as session:
            todoRepository = TodoRepository(session)
            todo = todoRepository.get_by_id(data.id)
            if todo is None:
                raise HTTPException(status_code=404, detail="Task not found")
            todoRepository.delete(todo)
            return {"message": "Task deleted successfully"}