from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Union
from .users import get_users
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
users = get_users()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"]
)

class User(BaseModel):
    firstName: str
    lastName: str
    age: int
    gender: str
    email: str
    phone: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/users")
def get_users_list():
    return {"users": users}

@app.put("/users/{user_id}")
def update_user(user_id: int, user: User):
    for the_user in users:
        if the_user["id"] == user_id:
            the_user.update(user.dict())
            return the_user
    raise HTTPException(status_code=404, detail="User not found")