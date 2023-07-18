import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import RememberMeOutlinedIcon from '@mui/icons-material/RememberMeOutlined';
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';

export const sidebarLinks = [
    {
        id: 1,
        title: "Dashboard",
        url: "/",
        icon: <DashboardOutlinedIcon className="sidebar-icon"/>,
    },
    {
        id: 2,
        title: "Posts",
        url: "/posts",
        icon: <AutoStoriesOutlinedIcon className="sidebar-icon"/>,
    },
    {
        id: 3,
        title: "Slides",
        url: "/slides",
        icon: <SlideshowOutlinedIcon className="sidebar-icon"/>,
    },
    {
        id: 4,
        title: "Users",
        url: "/users",
        icon: <PeopleAltOutlinedIcon className="sidebar-icon"/>,
    },
    {
        id: 5,
        title: "Categories",
        url: "/categories",
        icon: <FeedbackOutlinedIcon className="sidebar-icon"/>,
    },
    {
        id: 6,
        title: "Testimonies",
        url: "/testimonies",
        icon: <FormatQuoteOutlinedIcon className="sidebar-icon"/>,
    },
    {
        id: 7,
        title: "Staff",
        url: "/members",
        icon: <RememberMeOutlinedIcon className="sidebar-icon"/>,
    },
]