from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}


def test_get_users_list():
    response = client.get("/users")
    assert response.status_code == 200
    assert response.json() == {
        "users": [
            {
                "id": 1,
                "firstName": "John Doe",
                "lastName": "Doe",
                "age": 30,
                "gender": "male",
                "email": "john@doe.com",
                "phone": "123-456-7890",
            },
            {
              "id": 2,
              "firstName": "Jane Doe",
              "lastName": "Doe",
              "age": 30,
              "gender": "female",
              "email": "jan@doe.com",
              "phone": "123-456-7890",
            },
            {
                "id": 3,
                "firstName": "Alice",
                "lastName": "Doe",
                "age": 30,
                "gender": "female",
                "email": "alice@doe.com",
                "phone": "123-456-7890",
            },
            {
                "id": 4,
                "firstName": "Bob",
                "lastName": "Doe",
                "age": 30,
                "gender": "male",
                "email": "bob@doe.com",
                "phone": "123-456-7890",
            },
            {
                "id": 5,
                "firstName": "Charlie",
                "lastName": "Doe",
                "age": 30,
                "gender": "male",
                "email": "charlie@doe.com",
                "phone": "123-456-7890",
            }
        ]
    }


test_user = {
    "firstName": "Updated",
    "lastName": "User",
    "age": 35,
    "gender": "male",
    "email": "updateduser@example.com",
    "phone": "555-1234"
}

def test_update_user_success():
    user_id = 1
    response = client.put(f"/users/{user_id}", json=test_user)
    assert response.status_code == 200
    updated_user = response.json()
    
    assert updated_user["firstName"] == test_user["firstName"]
    assert updated_user["lastName"] == test_user["lastName"]
    assert updated_user["age"] == test_user["age"]
    assert updated_user["gender"] == test_user["gender"]
    assert updated_user["email"] == test_user["email"]
    assert updated_user["phone"] == test_user["phone"]


def test_update_user_not_found():
    user_id = -1
    response = client.put(f"/users/{user_id}", json=test_user)
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}
