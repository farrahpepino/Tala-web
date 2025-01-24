import React, { Fragment, useState } from 'react';
import { Button, Disclosure, Menu, Transition } from '@headlessui/react';
import { HomeIcon, ChatBubbleLeftIcon, UserPlusIcon, BellIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import TalaLogo from '../assets/tala/tala-darkbg.png'; 
import { clearUserData } from '../utils/User/ClearUserData';
import { getUserData } from '../utils/User/GetUserData';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../utils/User/UserType';
import { handleReload } from '../utils/HandleReload';
import Loading from '../utils/loading';
import DefaultUserIcon from '../assets/tala/user.png';
import axios from 'axios';
import Notification from './Main/Notification';
const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftIcon },
  // { name: 'Requests', href: '/requests', icon: UserPlusIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const userData = getUserData();
  if (!userData) {
    handleReload();
  } else if (!user) {
    setUser(userData);
  }

  const handleLogout = () => {
    window.location.href = ('/login');
    clearUserData();
  };

  const handleSearch = async (searchQuery) => {
  if (!searchQuery) {
      setResults([]); }
    try {
      const response = await axios.get('https://tala-web-kohl.vercel.app/api/users/search', {
        params: { query: searchQuery },
    });
      console.log('Response:', response.data); 
      setResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      setResults([]);
    }
  };

  const handleResultClick = (userId) => {
    console.log(`Clicked on user with ID: ${userId}`); 
    if(userData.userId === userId){
    navigate(`/profile`);
    }
    else{
    navigate(`/external-profile/${userId}`);
    }
    setResults([]); 
  };

  if (!user) {
    return (
        <Loading/>
    );
  }

  return (
    <Disclosure as="nav" className="w-full fixed top-0 left-0 z-10 bg-[#0d0d0d]">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {isSearchOpen ? (
                  <button
                  className="absolute top-3 left-0 p-2 bg-transparent text-gray-400 hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 active:bg-gray-200 z-10"
                  onClick={() => setIsSearchOpen(false)}
                  >
                    <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                ) : (
                  <Disclosure.Button className="bg-transparent inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                )}
              </div>

              {/* Logo or Search Bar for small screens */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {!isSearchOpen ? (
                  <div className="flex flex-shrink-0 items-center">
                    <Button className="bg-transparent m-0 p-0" onClick={() => navigate('/home')}>
                    <img className="h-8 w-auto" src={TalaLogo} alt="Tala" />
                    </Button>
                  </div>
                ) : (
                  <form className="relative w-[65%] px-4 sm:hidden -ml-20 mr-5" onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
                  
<div className='w-full'>
  {!searchQuery ? (
    <MagnifyingGlassIcon 
      className="absolute left-9  top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-700" 
      aria-hidden="true" 
    />
    
  )
  : (
    <button 
      type="button"
      onClick={() => {setSearchQuery(''); 
                      setResults([]);}} 
 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-700 hover:text-gray-400 bg-transparent"
  aria-label="Clear search"
    >
          <XMarkIcon className="h-4 w-4" aria-hidden="true" />
    </button>
  )}
  
  <input
    type="text"
    className={`w-full pl-10 border border-dark bg-transparent  text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-highlight focus:border-transparent ${
      results.length > 0 ? 'rounded-md rounded-b-none' : 'rounded-md'
    }`}    placeholder="  Search"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  {results.length > 0 && (
    <ul className="absolute z-10 w-full max-w-lg bg-white border border-dark border-t-0 rounded-b-md shadow-lg max-h-60 overflow-y-auto">
      {results.map((user) => (
        <li
          key={user.userId || user._id}
          className="cursor-pointer text-left ml-3 hover:text-gray-500 hover:bg-gray-100 p-2 text-gray-700"
          onClick={() => {
            console.log(`Clicked on user with ID: ${user.userId || user._id}`);
            handleResultClick(user.userId || user._id)}}
        >
          {user.firstName} {user.lastName} 
        </li>
      ))}
    </ul>
  )}
  </div>
                </form>
                
                )}

               {/* Search Bar for Larger Screens */}
<form 
  className="hidden   sm:flex flex-1 items-center justify-center max-w-lg mx-auto relative" 
  onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}
>
<div className='w-full'>
{!searchQuery ? (
    <MagnifyingGlassIcon 
      className="absolute left-3 mr-2 top-1/2  transform -translate-y-1/2 h-4 w-4 text-gray-700" 
      aria-hidden="true" 
    />
  ): (
    <button 
      type="button"
      onClick={() =>  {setSearchQuery(''); 
      setResults([]);}} 
      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-700 hover:text-gray-400 bg-transparent"
      aria-label="Clear search"
    >
      <XMarkIcon className="h-4 w-4" aria-hidden="true" />
    </button>
  )}
  
  <input
    type="text"
    className={`w-full pl-10 border border-dark bg-transparent text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-highlight focus:border-transparent ${
      results.length > 0 ? 'rounded-md rounded-b-none' : 'rounded-md'
    }`}    placeholder="  Search"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  {results.length > 0 && (
    <ul className="absolute z-10 w-full max-w-lg bg-white  border border-dark  border-t-0 rounded-b-md shadow-lg max-h-60 overflow-y-auto">
      {results.map((user) => (
        <li
          key={user.userId || user._id}
          className="cursor-pointer text-left ml-3 hover:text-gray-500 hover:bg-gray-100 p-2 text-gray-700"
          onClick={() => handleResultClick(user.userId || user._id) }
        >
          {user.firstName} {user.lastName} 
        </li>
      ))}
    </ul>
  )}
  </div>
</form>


              

                {/* Navigation Links for Larger Screens */}
                <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      onClick={() => navigate(item.href)}
                      to={item.href}
                      className={classNames(
                        window.location.pathname === item.href
                          ? 'bg-custom-highlight text-white'
                          : 'text-gray-400 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium flex items-center'
                      )}
                    >
                      <item.icon className="h-6 w-6 mr-2" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Icons and User Menu */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {!isSearchOpen && (
                  <button
                    className="sm:hidden rounded-full bg-transparent p-1 mr-2 text-gray-400 hover:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                )}
                <div>

              
                <button
                  type="button"
                  onClick={toggleNotification}
                  className="rounded-full bg-transparent p-1 hover:text-white text-gray-400 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                {showNotification && <Notification />}

                </div>
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button style={{ background: 'transparent' }}>
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src= {DefaultUserIcon}
                        alt="user-avatar"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/profile');
                            }}
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-800' : '',
                              'block px-4 py-2 text-sm text-gray-700 hover:text-gray-500'
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-800' : '',
                                'block px-4 py-2 text-sm text-gray-700 hover:text-gray-500'
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-800' : '',
                                'block px-4 py-2 text-sm text-gray-700 hover:text-gray-500'
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
  
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      window.location.pathname === item.href
                        ? 'bg-custom-highlight text-white'
                        : 'text-gray-400 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    <item.icon className="h-6 w-6 mr-2" aria-hidden="true" />
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    );
  }
  