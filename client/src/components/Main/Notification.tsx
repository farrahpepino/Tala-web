import React from 'react';

const Notification = () => {
  return (
    <div className="relative font-[sans-serif] w-max mx-auto">
      <div
        id="dropdownMenu"
        className="absolute block -right-10 shadow-lg bg-white py-4 z-[1000] min-w-full rounded-lg w-[35vh] sm-[70vh] max-h-[500px] overflow-auto mt-2"
      >
        <div className="flex items-center justify-between px-4 mb-4">
          <p className="text-xs text-black cursor-pointer hover:underline">Clear all</p>
          <p className="text-xs text-black cursor-pointer hover:underline">Mark all as read</p>
        </div>

        <ul className="divide-y">
          <li className="p-4 flex items-center hover:bg-gray-50 cursor-pointer">
            <img
              src="https://readymadeui.com/profile_2.webp"
              className="w-12 h-12 rounded-full shrink-0"
              alt="User"
            />
            <div className="ml-6">
              <h3 className="text-sm text-[#333] font-semibold">You have a new message from Yin</h3>
              <p className="text-xs text-gray-500 mt-2">
                Hello there, check this new item from the motion school.
              </p>
              <p className="text-xs text-black leading-3 mt-2">10 minutes ago</p>
            </div>
          </li>
          {/* Add more list items as needed */}
        </ul>
        {/* <p className="text-xs px-4 mt-6 mb-4 inline-block text-blue-600 cursor-pointer">
          View all Notifications
        </p> */}
      </div>
    </div>
  );
};

export default Notification;
