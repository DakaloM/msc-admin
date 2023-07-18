import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  BrowserRouter,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Categories from "./pages/categories/Categories";
import Members from "./pages/members/Members";
import Slides from "./pages/slides/Slides";
import Users from "./pages/users/Users";
import Posts from "./pages/posts/Posts";
import Testimonies from "./pages/testimonies/Testimonies";
import Footer from "./components/footer/Footer";
import { useSelector } from "react-redux";
import EditPost from "./pages/posts/editPost/EditPost";
import EditSlide from "./pages/slides/editSlide/EditSlide";
import EditMember from "./pages/members/editMember/EditMember";
function App() {

  const currentUser = useSelector(state => state.user.currentUser);






  const Layout = () => {
    return (
      <div style={{display: "flex", width: "100%", gap: "30px", backgroundColor: "#FFFAFA"}}>
        <Sidebar />
        <div style={{display: "flex",flex: "4" , flexDirection: "column", width: "100%", gap: "20px",
        
      }}>
          <Navbar />
          <Outlet />
          <Footer />
        </div>
      </div>
    )
  }

  const ProtectedRoutes = ({children}) => {
    if(!currentUser  || currentUser === null) {
      return <Navigate to={"/login"}/>;
    } 
  
    if(currentUser.isAdmin === false){
      return <Navigate to={"/login?admin=false"}/>;
    }
    return children;
  }

  const router = createBrowserRouter([
    {path: '/login', element: <Login />},
    {path: '/register', element: <Register />},
    {
      path: '/', element :
        <ProtectedRoutes>
          <Layout />
        </ProtectedRoutes>,

        children : [
          {path: '/', element: <Home />},
          {path: '/categories', element: <Categories />},
          {path: '/members', element: <Members />},
          {path: '/editMember/:id', element: <EditMember />},
          {path: '/slides', element: <Slides />},
          // {path: '/editSlide/:id', element: <EditSlide />},
          {path: '/users', element: <Users />},
          {path: '/posts', element: <Posts />},
          {path: '/editPost/:id', element: <EditPost />},
          {path: '/testimonies', element: <Testimonies />},
        ]
    },
  ])

  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
