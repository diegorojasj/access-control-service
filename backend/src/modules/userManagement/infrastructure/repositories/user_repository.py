from src.modules.auth.infrastructure.entities.user_entity import User

class UserRepository:
    def __init__(self, session):
        self.session = session

    def get_all(self):
        rows = self.session.query(User.id, User.name, User.username, User._role.label("role")).all()
        return [row._asdict() for row in rows]

    def get_by_name(self, name):
        return self.session.query(User.id, User.name, User.username, User._role.label("role")).filter(User.name == name).first()

    def create(self, user):
        self.session.add(user)
        self.session.commit()
        return user

    def update(self, user):
        self.session.merge(user)
        self.session.commit()
        return user

    def get_by_id(self, id):
        return self.session.query(User).filter(User.id == id).first()

    def delete(self, user):
        self.session.delete(user)
        self.session.commit()
        return user