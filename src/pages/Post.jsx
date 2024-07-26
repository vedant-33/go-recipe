import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components/Index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import DOMPurify from 'dompurify';

function Post() {
    const [post, setPost] = useState(null);
    const {slug} = useParams();
    const navigate= useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData? post.userId === userData.$id :false;
    // post and userData have to be defined, new post userId and userId should match

    useEffect(() => {
        if (slug) {
            appwriteService.getRestaurant(slug).then((post) => {
                if(post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deleteRestaurant(post.$id).then((status) => {
            if(status){ //logged in
                appwriteService.deleteFile(post.image);
                navigate('/');
            }
        })
    }

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                    src={appwriteService.getFilePreview(post.image)}
                    alt={post.title}
                    className="rounded-xl"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to= {`/edit-post/${post.$id}`}>
                                <Button className="mr-3">Edit</Button>
                            </Link>
                            <Button onClick={deletePost}>Delete</Button>
                            </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">{parse(DOMPurify.sanitize(post.content))}</div> {/*remove html */}
            </Container>
        </div>
    ): null;

}
export default Post;
