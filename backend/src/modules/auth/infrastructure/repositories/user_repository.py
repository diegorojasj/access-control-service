from src.modules.auth.infrastructure.entities.user_entity import User

class UserRepository:
    def __init__(self, session):
        self.session = session

    def get_all(self):
        return self.session.query(User).all()

    def get_by_name(self, name):
        return self.session.query(User).filter(User.name == name).first()

    def create(self, user):
        self.session.add(user)
        self.session.commit()
        return user

    def update(self, user):
        self.session.merge(user)
        self.session.commit()
        return user

    def delete(self, user):
        self.session.delete(user)
        self.session.commit()
        return user