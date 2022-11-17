import {IRoute} from "./types/IRoute";
import AdminPage from "./components/Pages/AdminPage";
/*import {ADMIN_ROUTE, GROUP_ADMIN_ROUTE, AUTH_ROUTE, USER_PAGE_ROUTE,
    MAIN_ROUTE, MESSAGES_ROUTE} from "./consts"*/
import routes from "./consts"
import * as React from "react";
import AuthPage from "./components/Pages/AuthPage";
import MainPage from "./components/Pages/MainPage";
import UserPage from "./components/Pages/UserPage";
import MessagesPage from "./components/Pages/MessagesPage";
import ChatRoomPage from "./components/Pages/ChatRoomPage";
import FriendsPage from "./components/Pages/FriendsPage";
import UserOptionsPage from "./components/Pages/UserOptionsPage";
import UserBlackListPage from "./components/Pages/UserBlackListPage";
import GroupsPage from "./components/Pages/GroupsPage";
import GroupPage from "./components/Pages/GroupPage";
import GroupBlackListPage from "./components/Pages/GroupBlackListPage";
import ImagesPage from "./components/Pages/ImagesPage";
import VideosPage from "./components/Pages/VideosPage";
import DocumentsPage from "./components/Pages/DocumentsPage";
import ArticlesPage from "./components/Pages/ArticlesPage";
import ArticlePage from "./components/Pages/ArticlePage";
import UserArticlesPage from "./components/Pages/UserArticlesPage";
import PostPage from "./components/Pages/PostPage";

export const AdminRoutes: IRoute[] = [
    {
        path: routes.ADMIN_ROUTE,
        component: <AdminPage/>
    }
]
export const NotAuthRoutes: IRoute[]=[
    {
        path: routes.AUTH_ROUTE,
        component: <AuthPage/>
    },
    {
        path: routes.USER_PAGE_ROUTE,
        component: <UserPage/>
    },
    {
        path: routes.GROUP_ROUTE,
        component: <GroupPage/>
    },
    {
        path: routes.IMAGES_PAGE_ROUTE,
        component: <ImagesPage/>
    },
    {
        path: routes.VIDEOS_PAGE_ROUTE,
        component: <VideosPage/>
    },
    {
        path: routes.DOCUMENTS_PAGE_ROUTE,
        component: <DocumentsPage/>
    },
    {
        path: routes.ARTICLE_ROUTE,
        component: <ArticlePage/>
    },
    {
        path: routes.ARTICLES_ROUTE,
        component: <ArticlesPage/>
    },
    {
        path: routes.POST_ROUTE,
        component: <PostPage/>
    },
    {
        path: routes.MAIN_ROUTE,
        component: <AuthPage/>
    }
]
export const PublicRoutes: IRoute[] = [
    {
        path: routes.AUTH_ROUTE,
        component: <AuthPage/>
    },
    {
        path: routes.MAIN_ROUTE,
        component: <MainPage/>
    },
    {
        path: routes.USER_PAGE_ROUTE,
        component: <UserPage/>
    },
    {
        path: routes.MESSAGES_ROUTE,
        component: <MessagesPage/>
    },
    {
        path: routes.CHAT_ROOM_ROUTE,
        component: <ChatRoomPage/>
    },
    {
        path: routes.FRIENDS_ROUTE,
        component: <FriendsPage/>
    },
    {
        path: routes.USER_OPTIONS_ROUTE,
        component: <UserOptionsPage/>
    },
    {
        path: routes.USER_BLACK_LIST_ROUTE,
        component: <UserBlackListPage/>
    },
    {
        path: routes.GROUPS_ROUTE,
        component: <GroupsPage/>
    },
    {
        path: routes.GROUP_ROUTE,
        component: <GroupPage/>
    },
    {
        path: routes.IMAGES_PAGE_ROUTE,
        component: <ImagesPage/>
    },
    {
        path: routes.VIDEOS_PAGE_ROUTE,
        component: <VideosPage/>
    },
    {
        path: routes.DOCUMENTS_PAGE_ROUTE,
        component: <DocumentsPage/>
    },
    {
        path: routes.GROUP_BLACK_LIST_ROUTE,
        component: <GroupBlackListPage/>
    },
    {
        path: routes.ARTICLE_ROUTE,
        component: <ArticlePage/>
    },
    {
        path: routes.ARTICLES_ROUTE,
        component: <ArticlesPage/>
    },
    {
        path: routes.USER_ARTICLES_ROUTE,
        component: <UserArticlesPage/>
    },
    {
        path: routes.POST_ROUTE,
        component: <PostPage/>
    }
]