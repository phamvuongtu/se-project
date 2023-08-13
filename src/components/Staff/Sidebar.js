import React from "react";

function Sidebar() {
  return (
    <div className="flex flex-col bg-neutral-900 w-60 h-screen font-sans">

      <aside className="bg-white h-screen border-r border-gray-300">
        <div className="px-6 py-6 text-2xl font-semibold flex items-center justify-center gap-2 mb-2">
          <img
            src="https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/294429033_466041908859354_6964179608400976606_n.png?_nc_cat=104&cb=99be929b-59f725be&ccb=1-7&_nc_sid=be3454&_nc_ohc=OCEyNd7uzpgAX9l4Oft&_nc_ht=scontent.fhan19-1.fna&oh=00_AfCZYJZSzDHcfrin_zRhgdHC0vTbg3IJrtq7hcB1o79WOQ&oe=64DDE271"
            alt="Logo"
            className="w-20"
          />
          <h2>YoTea</h2>
        </div>

        {/* Menu */}
        <div className="text-sm text-[#575663] px-5 font-normal">
          <a
            href="/"
            className="flex items-center gap-1 px-5 py-2 relative before:absolute before:top-0 before:left-0 before:w-1 before:h-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span>Dashboard</span>
          </a>


          <a
            href="/order"
            className="flex items-center gap-1 px-5 py-2 relative before:absolute before:top-0 before:left-0 before:w-1 before:h-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm1-4H5m0 0L3 4m0 0h5.501M3 4l-.792-3H1m11 3h6m-3 3V1"
              />
            </svg>
            <span>Orders</span>
          </a>

          <a
            href="/customer"
            className="flex items-center gap-1 px-5 py-2 relative before:absolute before:top-0 before:left-0 before:w-1 before:h-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.333 6.764a3 3 0 1 1 3.141-5.023M2.5 16H1v-2a4 4 0 0 1 4-4m7.379-8.121a3 3 0 1 1 2.976 5M15 10a4 4 0 0 1 4 4v2h-1.761M13 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-4 6h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"
              />
            </svg>
            <span>Customer</span>
          </a>
        </div>

        <p className="text-sm text-[#575663] px-5 font-normal mt-6">
          
          <a
            href="/login"
            className="flex items-center gap-1 px-5 py-2 relative before:absolute before:top-0 before:left-0 before:w-1 before:h-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            <span>Logout</span>
          </a>
        </p>
      </aside>
    </div>
  );
}

export default Sidebar;
