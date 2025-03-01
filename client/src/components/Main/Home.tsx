import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../utils/User/GetUserData';
import { User } from '../../utils/User/UserType';
import NavBar from '../NavBar';
import AddPost from '../Posts/AddPost';
import HomePosts from '../Posts/HomePosts';
import Loading from '../../utils/loading';
import { handleReload } from '../../utils/HandleReload';
import Footer from '../Footer';

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      handleReload();
    } else {
      setUser(userData);
    }
  }, []);
  console.log('User:', user);
  if (!user) {
    return (
      <Loading />
    );
  }



  return (
    <div className="min-h-screen mx-auto">
    <NavBar />
    <main className="flex flex-grow justify-center w-full px-4">

      {/* <div className="w-full sm:w-[280px] md:w-[480px] lg:w-[660px] xl:w-[900px] p-6 md:p-10 shadow-lg rounded-lg mx-auto"> */}
      <div className="mt-4 mx-auto w-full max-w-4xl">

        <AddPost />
        <HomePosts userId={user?._id}/>
      </div>
    </main>
      <Footer/>
      </div>
  );
};

export default Home;
