import { useEffect, useState } from "react";
import axios from "axios";


// App may look a bit plain since there there was no instructions to include header.
// I left out loading and error page for simplicitys sake


// CHOOSE where to get the user data from:

// const url = "https://dummyjson.com/users"
const url = "http://127.0.0.1:8000/users"

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [person, setPerson] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    // axios("https://dummyjson.com/users?limit=20")
    axios(`${url}?limit=20`)
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        console.error("Error is", error)
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSave = () => {
    if (person) {
      const updatedData = {
        id: person.id,
        firstName: document.getElementsByName("firstName")[0].value,
        lastName: document.getElementsByName("lastName")[0].value,
        age: document.getElementsByName("age")[0].value,
        gender: document.getElementsByName("gender")[0].value,
        email: document.getElementsByName("email")[0].value,
        phone: document.getElementsByName("phone")[0].value,
      };

      updateUser(person.id, updatedData)
      setIsEditable(false)
    }
  }

  const updateUser = (userId, updatedUserData) => {
    axios
      // .put(`https://dummyjson.com/users/${userId}`, updatedUserData)
      .put(`${url}/${userId}`, updatedUserData)
      .then((response) => {
        const updatedUser = response.data
        setData((prevData) => ({
          ...prevData,
          users: prevData.users.map((user) =>
            user.id === userId ? updatedUser : user
          ),
        }))
        setPerson(updatedUser)
        console.log("User updated successfully:", updatedUser)
      })
      .catch((error) => {
        console.error("Error updating user:", error)
        setError(error)
      })
  }

  if (loading) return "Loading...";
  if (error) return "Error while loading data.";

  return (
    <>
      <SidebarToggleButton 
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      {showSidebar && <Backdrop setShowSidebar={() => setShowSidebar(false) }/>}

      <Sidebar data={data} setPerson={setPerson} showSidebar={showSidebar} setShowSidebar={setShowSidebar} setIsEditable={setIsEditable} />
      <Main person={person} isEditable={isEditable} setIsEditable={setIsEditable} handleSave={handleSave} />
    </>
  );
}



function Sidebar({ data, setPerson, showSidebar, setShowSidebar, setIsEditable }) {
  return (
    <aside
      id="default-sidebar"
      className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 bg-syyclops-secondary`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4 text-syyclops-primary border-b border-syyclops-accent">Syycl<span className="text-syyclops-accent">o</span>ps users</h1>
        <ul className="space-y-2 font-medium">
          {data?.users.map((user) => (
            <li key={user.id}>
              <button
                onClick={() => {
                  setPerson(user)
                  setShowSidebar(false)
                  setIsEditable(false)
                }}
                className="flex items-center p-2 text-syyclops-primary rounded-lg hover:bg-gray-700 group"
              >
                <svg className="flex-shrink-0 w-5 h-5 text-gray-400 transition duration-75 group-hover:text-syyclops-accent" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"/>
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  {user.firstName} {user.lastName} [{user.id}]
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}



function Main({ person, isEditable, setIsEditable, handleSave }) {
  return (
    <div className="p-6 sm:ml-64">
      <div className="p-6 bg-syyclops-secondary border border-gray-200 rounded-lg shadow-md">
        <div className="flex justify-between mb-4 border-b-2 border-syyclops-accent pb-2 pr-4">
          <h1 className="text-2xl font-bold text-syyclops-primary ">
            User Data
          </h1>
          {person && <button onClick={() => setIsEditable(!isEditable)} className="border border-syyclops-accent rounded-md p-1 pl-2 pr-2 text-syyclops-primary">edit</button>}
        </div>
        {person ? (
          <ul className="space-y-2">
            <UserData label="ID" data={person.id} isEditable={false} />
            <UserData label="First Name" data={person.firstName} isEditable={isEditable} name="firstName" />
            <UserData label="Last Name" data={person.lastName} isEditable={isEditable} name="lastName" />
            <UserData label="Age" data={person.age} isEditable={isEditable} name="age" type="number" />
            <UserData label="Gender" data={person.gender} isEditable={isEditable} name="gender" />
            <UserData label="Email" data={person.email} isEditable={isEditable} name="email" />
            <UserData label="Phone" data={person.phone} isEditable={isEditable} name="phone" />
          </ul>
        ) : (
          <p className="text-gray-400">No user selected</p>
        )}
        {isEditable && (
          <button onClick={handleSave} className="mt-4 p-1 pl-2 pr-2 border rounded-md border-syyclops-accent text-syyclops-primary">
            save
          </button>
        )}
      </div>
    </div>
  );
}



function UserData({ label, data, isEditable, name, type="text" }) {
  if (isEditable) {
    return (
      <>
        <label className="text-syyclops-primary"><strong>{label}: </strong></label>
        <input type={type} name={name} defaultValue={data || ''} className="pl-1 border rounded-md border-syyclops-accent bg-transparent text-syyclops-primary"/><br />
      </>
    )
  }
  return <li className="text-syyclops-primary"><strong>{label}:</strong> {data}</li>
}



function SidebarToggleButton({ showSidebar, setShowSidebar }) {
  return (
    <button
      onClick={() => setShowSidebar(!showSidebar)}
      aria-controls="default-sidebar"
      type="button"
      className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-syyclops-accent border-solid border-2 border-syyclops-accent rounded-lg sm:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 "
    >
      <span className="sr-only">Open sidebar</span>
      <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        ></path>
      </svg>
    </button>
  )
  
}



function Backdrop({ setShowSidebar }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-30"
      onClick={setShowSidebar}
    ></div>
  )
}
