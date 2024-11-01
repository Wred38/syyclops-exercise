import { useEffect, useState } from "react";
import axios from "axios";


// App may look a bit plain since there there was no instructions to include header.


export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [person, setPerson] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    axios("https://dummyjson.com/users?limit=20")
      .then((response) => {
        setData(response.data);
        // setPerson(response.data.users[0]);
      })
      .catch((error) => {
        console.error("Error is", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return "Loading...";
  if (error) return "Error while loading data.";

  return (
    <>
      <SidebarToggleButton 
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      {showSidebar && <Backdrop setShowSidebar={() => setShowSidebar(false) }/>}

      <Sidebar data={data} setPerson={setPerson} showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <Main person={person} />
    </>
  );
}

function Sidebar({ data, setPerson, showSidebar, setShowSidebar }) {
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

function Main({ person }) {
  return (
    <div className="p-6 sm:ml-64">
      <div className="p-6 bg-syyclops-secondary border border-gray-200 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-syyclops-primary mb-4 border-b-2 border-syyclops-accent pb-2">
          User Data
        </h1>
        {person ? (
          <ul className="space-y-2">
            <li className="text-syyclops-primary"><strong>ID:</strong> {person.id}</li>
            <li className="text-syyclops-primary"><strong>First Name:</strong> {person.firstName}</li>
            <li className="text-syyclops-primary"><strong>Last Name:</strong> {person.lastName}</li>
            <li className="text-syyclops-primary"><strong>Age:</strong> {person.age}</li>
            <li className="text-syyclops-primary"><strong>Gender:</strong> {person.gender}</li>
            <li className="text-syyclops-primary"><strong>Email:</strong> {person.email}</li>
            <li className="text-syyclops-primary"><strong>Phone:</strong> {person.phone}</li>
          </ul>
        ) : (
          <p className="text-gray-400">No user selected</p>
        )}
      </div>
    </div>
  );
}

function SidebarToggleButton({ showSidebar, setShowSidebar }) {
  return(
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