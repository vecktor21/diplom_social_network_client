import React, {useContext, useEffect, useState} from 'react';
import {IArticle} from "../../types/IArticle";
import ArticlesService from "../../services/ArticlesService";
import {NavLink, useLocation, useNavigate, useParams} from "react-router-dom";
import global from "../style/Global.module.css";
import LoadingComponent from '../UI/LoadingComponent';
import ErrorComponent from '../UI/ErrorComponent';
import {ReactComponent as Cross} from "../assets/cross-icon.svg";
import {ReactComponent as Heart} from "../assets/heart-icon.svg";
import style from '../style/Articles.module.css'
import parse from 'html-react-parser';
import TextEditor from "../UI/TextEditor";
import LikeService from "../../services/LikeService";
import {Context} from "../../index";
import PostService from "../../services/PostService";
import Modal from "../UI/Modal";
import FileUploadComponent from "../UI/FileUploadComponent";
import FileService from "../../services/FileService";
import {CommentService} from "../../services/CommentService";
import {IPostCommentCreateModel} from "../../types/IPostCommentCreateModel";
import {IArticleCommentCreateModel} from "../../types/IArticleCommentCreateModel";
import {log} from "util";
import consts from "../../consts";
import routes from "../../consts";

const ArticlePage = () => {
    const [article, setArticle] = useState({} as IArticle)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const params = useParams()
    const [isLiked, setIsLiked]=useState(false)
    const {userStore} = useContext(Context)
    const [isCommentReplyModalVisible, setIsCommentReplyModalVisible] = useState(false)
    const [isCommentFilesUploadModalVisible, setIsCommentFilesUploadModalVisible] = useState(false)
    const [filesToUpload, setFilesToUpload] = useState([] as File[])
    const [newComment, setNewComment] = useState({
        articleId: 0,
        message: '',
        userId: userStore?.user.userId,
        attachmentsId: [] as number[]
    } as IArticleCommentCreateModel)
    const navigate = useNavigate()

    useEffect(()=>{
        fetchArticles()
    },[])

    const fetchArticles = async ()=>{
        // @ts-ignore
        const response = await ArticlesService.GetArticle(params.articleId)
        try{
            setArticle(response.data)
            setIsLiked(LikeService.IsLiked(userStore?.user.userId, response.data.likes))
        }catch(e){
            console.log(e);
        }
        finally{
            setIsLoading(false)
        }

    }

    //обработка лайков
    const likeHandler = async ()=>{
        if(userStore?.isAuth){
            await LikeService.LikeArticle(userStore?.user.userId, isLiked, article.articleId)
            if(isLiked){
                alert("убрал лайк")
            }else{

                alert("лайкнул")
            }
            setIsLiked(!isLiked)
        }else{
            alert("вы не вошли")
        }
    }

    //ответ на сообщение
    const replyAction = async ()=>{
        setIsLoading(true)
        const formData = new FormData()
        filesToUpload.forEach(file=>{
            formData.append("files", file)
        })
        try{
            const fileResult = await FileService.UploadFiles(formData)
            // @ts-ignore
            newComment.userId = userStore?.user.userId
            newComment.articleId = article.articleId
            fileResult.data.forEach(data=>{
                newComment.attachmentsId.push(data.fileId)
            })
            console.log(newComment)
            await CommentService.CreateArticleComment(newComment)
            alert("комментарий успешно добавлен")
            setIsCommentReplyModalVisible(false)
        }
        catch(e){
            console.log(e)
            alert("ошибка создания поста")
        }
        finally {

            setIsLoading(false)
        }
    }

    //удаление статьи:
    const deleteHandler = async ()=>{
        if(window.confirm("вы уверены что хоите удалить эту статью?")){
            await ArticlesService.DeleteArticle(article.articleId)
            alert("статья удалена")
        }
    }
    return (
        <div className={global.pageContent}>
            {isLoading
                ?
                <div>
                    <LoadingComponent/>
                </div>
                :
                <div>
                    {isError
                        ?

                        <ErrorComponent/>
                        :
            
                        <div className={global.mainSection}>
                            {/*модальное окно комментария*/}
                            <Modal isVisible={isCommentReplyModalVisible} setIsVisible={setIsCommentReplyModalVisible}>
                                <label htmlFor="commentMessage">текст комментария</label>
                                <textarea
                                    id="commentMessage"
                                    value={newComment.message}
                                    onChange={e=>{setNewComment({...newComment, message:e.target.value})}}
                                ></textarea>
                                <button onClick={()=>setIsCommentFilesUploadModalVisible(true)}>добавить файлы во вложение</button>
                                <button onClick={()=>{replyAction()}}>добавить комментарий</button>
                            </Modal>

                            {/*модальное окно для загрузки файлов */}
                            <FileUploadComponent
                                isVisible={isCommentFilesUploadModalVisible}
                                setIsVisible={setIsCommentFilesUploadModalVisible}
                                files={filesToUpload}
                                setFiles={setFilesToUpload}
                                uploadHandler={()=>{setIsCommentFilesUploadModalVisible(false)}}
                            />
                            <div>
                                <div>
                                    статья: {article.title}
                                </div>
                                <div onClick={likeHandler}
                                     className={global.button}
                                >
                                    рейтинг: {article.rating} <Heart className={
                                        `${global.like} ${
                                        isLiked &&
                                        global.liked
                                        }`}/>
                                </div>
                                <div>
                                    ключевые слова:
                                    {article.articleKeyWords.map(w=>
                                            <div key={w.keyWordId} className={style.keyWordObject} title={w.keyWordRu}>
                                                 {w.keyWordRu}
                                            </div>
                                        )}
                                </div>
                                {
                                    article.author.userId == userStore?.user.userId ?
                                        <div>
                                            <button onClick={()=>{

                                                navigate(routes.ARTICLE_NAVIGATION_ROUTE+"/update/"+article.articleId)
                                            }}>
                                                изменить
                                            </button>
                                            <button onClick={()=>{
                                                navigate(`${consts.ARTICLE_NAVIGATION_ROUTE}/create-page/${params.articleId}`)
                                            }}>добавить страницу</button>
                                            <button onClick={deleteHandler}>удалить</button>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            <div>
                                Введение статьи:
                            </div>
                            <div className={style.articleTextBlock}>
                                {
                                    parse(article.introduction)
                                }
                            </div>
                            <div>
                                <div>страницы:</div>
                                <ul style={{listStyleType: "none"}}>
                                    {article.articlePages.map((page, index)=>
                                        <li key={page} style={{color: "blue", cursor: "pointer"}}
                                            onClick={()=>{
                                                navigate(`${consts.ARTICLE_NAVIGATION_ROUTE}/${article.articleId}/${page}`)
                                            }}
                                        >{index+1}</li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <div
                                    className={global.button}
                                    onClick={()=>{setIsCommentReplyModalVisible(true)}}
                                    style={{color: "blue"}}
                                >ответить</div>
                                {
                                    article.comments.length == 0
                                        ?
                                        <div>
                                            здесь еще нет комментариев
                                        </div>
                                        :
                                        article.comments.map(comment=>
                                            PostService.IterateComments(comment)
                                        )
                                }
                            </div>
                        </div>

                    }
                </div>
            }
        </div>
    );
};

export default ArticlePage;