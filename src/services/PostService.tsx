import {IPost} from "../types/IPost";
import {IAuthorInfo} from "../types/IAuthorInfo";
import {IComment} from "../types/IComment";
import React, {ReactNode} from "react";
import CommentComponent from "../components/CommentComponent";

export default class PostService{
    static GetPost(postId: number) : IPost {
        return {
            postId: postId,
            title: "title",
            text: "text",
            postType: "user",
            publicationDate: new Date("2022-10-27"),
            author: {
                name: "Some Author",
                img: "https://via.placeholder.com/300x200",
                authorId: 21
            },
            likes: [
                /*{
                    LikeId: 0,
                    LikedUserId: 11,
                    ObjectId: 0
                },*/
                {
                    likeId: 1,
                    likedUserId: 2,
                    objectId: 0
                },
                {
                    likeId: 2,
                    likedUserId: 3,
                    objectId: 0
                }
            ],
            postAttachments: [
                {
                    attachmentId: 0,
                    fileLink: "https://via.placeholder.com/300x200",
                    fileType: "Image"
                }
            ],
            comments: [
                {
                    commentId: 0,
                    userId: 1,
                    userName: "Denis",
                    profileImage: "https://via.placeholder.com/150x200",
                    message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab atque deleniti dicta doloremque explicabo harum id ipsam itaque, nihil nostrum odit sequi velit. Ex, explicabo maiores nobis numquam odit vitae.",
                    objectId: 0,
                    objectName: "post",
                    isReply: false,
                    attachment: {
                        attachmentId: 10,
                        fileLink: "https://via.placeholder.com/150x200",
                        fileType: "Image"
                    },
                    likes: [
                        {
                            likeId: 312,
                            likedUserId: 412,
                            objectId: 0
                        },
                        {
                            likeId: 41,
                            likedUserId: 31,
                            objectId: 0
                        },
                        {
                            likeId: 2,
                            likedUserId: 51324,
                            objectId: 0
                        }

                    ],
                    replies: [
                        {
                            commentId: 312,
                            userId: 412,
                            userName: "kirill",
                            profileImage: "https://via.placeholder.com/150x200",
                            message: "reply message",
                            objectId: 0,
                            objectName: "Denis",
                            isReply: true,
                            attachment: {
                                attachmentId: 10,
                                fileLink: "https://via.placeholder.com/150x200",
                                fileType: "Image"
                            },
                            likes: [
                                {
                                    likeId: 514,
                                    likedUserId: 534,
                                    objectId: 312
                                },
                                {
                                    likeId: 12435,
                                    likedUserId: 5432,
                                    objectId: 312
                                },
                                {
                                    likeId: 2312,
                                    likedUserId: 5324,
                                    objectId: 312
                                }

                            ],
                            replies: [
                                {
                                    commentId: 312,
                                    userId: 4758,
                                    userName: "Vadim",
                                    profileImage: "https://via.placeholder.com/150x200",
                                    message: "reply message",
                                    objectId: 312,
                                    objectName: "Kirill",
                                    isReply: true,
                                    attachment: {
                                        attachmentId: 10,
                                        fileLink: "https://via.placeholder.com/150x200",
                                        fileType: "Image"
                                    },
                                    likes: [
                                        {
                                            likeId: 514,
                                            likedUserId: 534,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 12435,
                                            likedUserId: 5432,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 2312,
                                            likedUserId: 5324,
                                            objectId: 312
                                        }

                                    ],
                                    replies: []
                                },
                                {
                                    commentId: 4142,
                                    userId: 5432,
                                    userName: "Grigory",
                                    profileImage: "https://via.placeholder.com/150x200",
                                    message: "another reply message",
                                    objectId: 312,
                                    objectName: "Kirill",
                                    isReply: true,
                                    attachment: {
                                        attachmentId: 10,
                                        fileLink: "https://via.placeholder.com/150x200",
                                        fileType: "Image"
                                    },
                                    likes: [
                                        {
                                            likeId: 514,
                                            likedUserId: 534,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 12435,
                                            likedUserId: 5432,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 2312,
                                            likedUserId: 5324,
                                            objectId: 312
                                        }

                                    ],
                                    replies: []
                                }
                            ]
                        },
                        {
                            commentId: 4142,
                            userId: 5432,
                            userName: "some user",
                            profileImage: "https://via.placeholder.com/150x200",
                            message: "another reply message",
                            objectId: 0,
                            objectName: "Denis",
                            isReply: true,
                            attachment: {
                                attachmentId: 10,
                                fileLink: "https://via.placeholder.com/150x200",
                                fileType: "Image"
                            },
                            likes: [
                                {
                                    likeId: 514,
                                    likedUserId: 534,
                                    objectId: 312
                                },
                                {
                                    likeId: 12435,
                                    likedUserId: 5432,
                                    objectId: 312
                                },
                                {
                                    likeId: 2312,
                                    likedUserId: 5324,
                                    objectId: 312
                                }

                            ],
                            replies: []
                        }
                    ]
                },
                {
                    commentId: 2,
                    userId: 1,
                    userName: "some user",
                    profileImage: "https://via.placeholder.com/150x200",
                    message: "message",
                    objectId: 0,
                    objectName: "post",
                    isReply: false,
                    attachment: {
                        attachmentId: 10,
                        fileLink: "https://via.placeholder.com/150x200",
                        fileType: "Image"
                    },
                    likes: [
                        {
                            likeId: 312,
                            likedUserId: 412,
                            objectId: 0
                        },
                        {
                            likeId: 41,
                            likedUserId: 31,
                            objectId: 0
                        },
                        {
                            likeId: 2,
                            likedUserId: 51324,
                            objectId: 0
                        }

                    ],
                    replies: [
                        {
                            commentId: 4124123,
                            userId: 412,
                            userName: "some user",
                            profileImage: "https://via.placeholder.com/150x200",
                            message: "reply message",
                            objectId: 2,
                            objectName: "Артем",
                            isReply: true,
                            attachment: {
                                attachmentId: 10,
                                fileLink: "https://via.placeholder.com/150x200",
                                fileType: "Image"
                            },
                            likes: [
                                {
                                    likeId: 514,
                                    likedUserId: 534,
                                    objectId: 312
                                },
                                {
                                    likeId: 12435,
                                    likedUserId: 5432,
                                    objectId: 312
                                },
                                {
                                    likeId: 2312,
                                    likedUserId: 5324,
                                    objectId: 312
                                }

                            ],
                            replies: [
                                {
                                    commentId: 43214254354,
                                    userId: 412,
                                    userName: "some user",
                                    profileImage: "https://via.placeholder.com/150x200",
                                    message: "reply message",
                                    objectId: 4124123,
                                    objectName: "Вадим",
                                    isReply: true,
                                    attachment: {
                                        attachmentId: 10,
                                        fileLink: "https://via.placeholder.com/150x200",
                                        fileType: "Image"
                                    },
                                    likes: [
                                        {
                                            likeId: 514,
                                            likedUserId: 534,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 12435,
                                            likedUserId: 5432,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 2312,
                                            likedUserId: 5324,
                                            objectId: 312
                                        }

                                    ],
                                    replies: []
                                },
                                {
                                    commentId: 546576536443,
                                    userId: 5432,
                                    userName: "some user",
                                    profileImage: "https://via.placeholder.com/150x200",
                                    message: "another reply message",
                                    objectId: 4124123,
                                    objectName: "Николай",
                                    isReply: true,
                                    attachment: {
                                        attachmentId: 10,
                                        fileLink: "https://via.placeholder.com/150x200",
                                        fileType: "Image"
                                    },
                                    likes: [
                                        {
                                            likeId: 514,
                                            likedUserId: 534,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 12435,
                                            likedUserId: 5432,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 2312,
                                            likedUserId: 5324,
                                            objectId: 312
                                        }

                                    ],
                                    replies: []
                                }
                            ]
                        },
                        {
                            commentId: 6755467543643,
                            userId: 5432,
                            userName: "some user",
                            profileImage: "https://via.placeholder.com/150x200",
                            message: "another reply message",
                            objectId: 2,
                            objectName: "Жмых",
                            isReply: true,
                            attachment: {
                                attachmentId: 10,
                                fileLink: "https://via.placeholder.com/150x200",
                                fileType: "Image"
                            },
                            likes: [
                                {
                                    likeId: 514,
                                    likedUserId: 534,
                                    objectId: 312
                                },
                                {
                                    likeId: 12435,
                                    likedUserId: 5432,
                                    objectId: 312
                                },
                                {
                                    likeId: 2312,
                                    likedUserId: 5324,
                                    objectId: 312
                                }

                            ],
                            replies: []
                        }
                    ]
                },
                {
                    commentId: 3,
                    userId: 1,
                    userName: "some user",
                    profileImage: "https://via.placeholder.com/150x200",
                    message: "message",
                    objectId: 0,
                    objectName: "post",
                    isReply: false,
                    attachment: {
                        attachmentId: 10,
                        fileLink: "https://via.placeholder.com/150x200",
                        fileType: "Image"
                    },
                    likes: [
                        {
                            likeId: 312,
                            likedUserId: 412,
                            objectId: 0
                        },
                        {
                            likeId: 41,
                            likedUserId: 31,
                            objectId: 0
                        },
                        {
                            likeId: 2,
                            likedUserId: 51324,
                            objectId: 0
                        }

                    ],
                    replies: [
                        {
                            commentId: 54345435325234547657435,
                            userId: 412,
                            userName: "some user",
                            profileImage: "https://via.placeholder.com/150x200",
                            message: "reply message",
                            objectId: 3,
                            objectName: "Артурчик",
                            isReply: true,
                            attachment: {
                                attachmentId: 10,
                                fileLink: "https://via.placeholder.com/150x200",
                                fileType: "Image"
                            },
                            likes: [
                                {
                                    likeId: 514,
                                    likedUserId: 534,
                                    objectId: 312
                                },
                                {
                                    likeId: 12435,
                                    likedUserId: 5432,
                                    objectId: 312
                                },
                                {
                                    likeId: 2312,
                                    likedUserId: 5324,
                                    objectId: 312
                                }

                            ],
                            replies: [
                                {
                                    commentId: 76563754643645,
                                    userId: 412,
                                    userName: "some user",
                                    profileImage: "https://via.placeholder.com/150x200",
                                    message: "reply message",
                                    objectId: 54345435325234547657435,
                                    objectName: "Влад",
                                    isReply: true,
                                    attachment: {
                                        attachmentId: 10,
                                        fileLink: "https://via.placeholder.com/150x200",
                                        fileType: "Image"
                                    },
                                    likes: [
                                        {
                                            likeId: 514,
                                            likedUserId: 534,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 12435,
                                            likedUserId: 5432,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 2312,
                                            likedUserId: 5324,
                                            objectId: 312
                                        }

                                    ],
                                    replies: []
                                },
                                {
                                    commentId: 765564533,
                                    userId: 5432,
                                    userName: "some user",
                                    profileImage: "https://via.placeholder.com/150x200",
                                    message: "another reply message",
                                    objectId: 54345435325234547657435,
                                    objectName: "Николай",
                                    isReply: true,
                                    attachment: {
                                        attachmentId: 10,
                                        fileLink: "https://via.placeholder.com/150x200",
                                        fileType: "Image"
                                    },
                                    likes: [
                                        {
                                            likeId: 514,
                                            likedUserId: 534,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 12435,
                                            likedUserId: 5432,
                                            objectId: 312
                                        },
                                        {
                                            likeId: 2312,
                                            likedUserId: 5324,
                                            objectId: 312
                                        }

                                    ],
                                    replies: []
                                }
                            ]
                        },
                        {
                            commentId: 534643232521,
                            userId: 5432,
                            userName: "some user",
                            profileImage: "https://via.placeholder.com/150x200",
                            message: "another reply message",
                            objectId: 3,
                            objectName: "Нур султан",
                            isReply: true,
                            attachment: {
                                attachmentId: 10,
                                fileLink: "https://via.placeholder.com/150x200",
                                fileType: "Image"
                            },
                            likes: [
                                {
                                    likeId: 514,
                                    likedUserId: 534,
                                    objectId: 312
                                },
                                {
                                    likeId: 12435,
                                    likedUserId: 5432,
                                    objectId: 312
                                },
                                {
                                    likeId: 2312,
                                    likedUserId: 5324,
                                    objectId: 312
                                }

                            ],
                            replies: []
                        }
                    ]
                }
            ]
        }
    }

    static IterateComments(comment: IComment) : ReactNode {
        if(comment.replies.length == 0){
            return <CommentComponent key={comment.commentId} comment={comment}/>
        }
        for(let i = 0; i < comment.replies.length; i++){
            return (
                <div key={comment.commentId}>
                    <CommentComponent comment={comment}/>
            {PostService.IterateComments(comment.replies[i])}
            </div>
        )
        }
    }

}