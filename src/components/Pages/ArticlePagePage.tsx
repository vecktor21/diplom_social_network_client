import React, {useContext, useEffect, useState} from 'react';
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import {IArticlePage} from "../../types/IArticlePage";
import {ArticlePageService} from "../../services/ArticlePageService";
import {useNavigate, useParams} from "react-router-dom";
import parse from 'html-react-parser';
import style from "../style/Articles.module.css";
import Modal from "../UI/Modal";
import FileUploadComponent from "../UI/FileUploadComponent";
import {ReactComponent as Heart} from "../assets/heart-icon.svg";
import consts from "../../consts";
import PostService from "../../services/PostService";
import {IArticleCommentCreateModel} from "../../types/IArticleCommentCreateModel";
import ArticlesService from "../../services/ArticlesService";
import LikeService from "../../services/LikeService";
import FileService from "../../services/FileService";
import {CommentService} from "../../services/CommentService";
import {Context} from "../../index";
import {IArticlePageCommentCreateModel} from "../../types/IArticlePageCommentCreateModel";
import routes from "../../consts";
import PagesPaginationComponent from "../UI/PagesPaginationComponent";

const ArticlePagePage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [articlePage, setArticlePage] = useState({} as IArticlePage)
    const params = useParams()
    const {userStore} = useContext(Context)
    const [isLiked, setIsLiked] = useState(false)
    const [isCommentReplyModalVisible, setIsCommentReplyModalVisible] = useState(false)
    const [isCommentFilesUploadModalVisible, setIsCommentFilesUploadModalVisible] = useState(false)
    const [filesToUpload, setFilesToUpload] = useState([] as File[])
    const [newComment, setNewComment] = useState({
        articlePageId: 0,
        message: '',
        userId: userStore?.user.userId,
        attachmentsId: [] as number[]
    } as IArticlePageCommentCreateModel)
    const navigate = useNavigate()

    useEffect(()=>{
        fetchArticlePage()
    }, [])
    const fetchArticlePage = async ()=>{
        try{
            const res = await ArticlePageService.GetArticlePage(Number(params.articlePageId))
            res.data.articlePages = res.data.articlePages.sort()
            setArticlePage(res.data)

        }catch (e) {
            console.log(e)
            setIsError(true)
        }
        finally {
            setIsLoading(false)
        }
    }


    //обработка лайков
    const likeHandler = async ()=>{
        if(userStore?.isAuth){
            await LikeService.LikeArticlePage(userStore?.user.userId, isLiked, articlePage.articleId)
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
            newComment.articlePageId = articlePage.articleId
            fileResult.data.forEach(data=>{
                newComment.attachmentsId.push(data.fileId)
            })
            console.log(newComment)
            await CommentService.CreateArticlePageComment(newComment)
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
        if(window.confirm("вы уверены что хоите удалить эту страницу?")){
            await ArticlesService.DeleteArticle(articlePage.articleId)
            alert("страница удалена")
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
                                    статья: {" "}
                                    <span
                                        style={{cursor: "pointer", color: "blue", textDecoration: "underline"}}
                                        onClick={()=>{
                                            navigate(routes.ARTICLE_NAVIGATION_ROUTE+'/'+articlePage.articleId)
                                        }}>
                                        {articlePage.articleTitle}
                                    </span>
                                </div>
                                <div >
                                    дата публикации:
                                    {articlePage.publicationDate.getFullYear()}.
                                    {articlePage.publicationDate.getMonth()+1}.
                                    {articlePage.publicationDate.getDate()}
                                </div>
                                <div onClick={likeHandler}
                                     className={global.button}
                                >
                                    рейтинг: {articlePage.likes.length} <Heart className={
                                    `${global.like} ${
                                        isLiked &&
                                        global.liked
                                    }`}/>
                                </div>
                                {
                                    articlePage.authorId == userStore?.user.userId ?
                                        <div>
                                            <button onClick={()=>{
                                                navigate(routes.ARTICLE_NAVIGATION_ROUTE+"/update-page/"+articlePage.articleId+"/"+articlePage.articlePageId)
                                            }}>изменить</button>
                                            <button onClick={deleteHandler}>удалить</button>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            <div className={style.articleTextBlock}>
                                {
                                    parse(articlePage.text)
                                }
                            </div>
                            <div>
                                <div>страницы:</div>
                                <div className={global.paginationPages}>
                                    {articlePage.articlePages.map((page, index)=>
                                        <div key={index} style={{fontWeight: `${page==articlePage.articlePageId ? "bold": "normal"}`}}
                                            onClick={()=>{
                                                navigate(`${consts.ARTICLE_NAVIGATION_ROUTE}/${articlePage.articleId}/${page}`)
                                                window.location.reload();
                                            }}
                                        >{index+1}</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div
                                    className={global.button}
                                    onClick={()=>{setIsCommentReplyModalVisible(true)}}
                                    style={{color: "blue"}}
                                >ответить</div>
                                {
                                    articlePage.comments.length == 0
                                        ?
                                        <div>
                                            здесь еще нет комментариев
                                        </div>
                                        :
                                        articlePage.comments.map(comment=>
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

export default ArticlePagePage;
