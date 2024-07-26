import React, {useCallback, useEffect} from "react";
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import appwriteService from '../appwrite/config'
import {Button, Input, TextEditor} from './Index'

function PostForm({post}) {
    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate= useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        if(post){
            const file = data.image[0]? await appwriteService.uploadFile(data.image[0]) : null;
            if(file){
                appwriteService.deleteFile(post.image);
            }

            const dbPost = await appwriteService.updateRestaurant(post.$id, {
                ...data, 
                image: file ? file.$id : post.image,
            });

            if(dbPost){
                navigate(`/post/${dbPost.$id}`);
            }
        }
            else{
                const file= await appwriteService.uploadFile(data.image[0]);

                if(file){
                    const fileId = file.$id;
                    data.image = fileId;
                    const dbPost = await appwriteService.createRestaurant({...data, userId: userData.$id});

                    if(dbPost){
                        navigate(`/post/${dbPost.$id}`);
                    }
                }
            }
        }

    const slugTransform = useCallback((value) => {
        if(value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, {name}) => {
            if(name ==='title'){
                setValue('slug', slugTransform(value.title), {shouldValidate:true});
            }
        })
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);
    
    return (
        <form onSubmit={handleSubmit(submit)} 
        className="flex flex-wrap">
            <div className="w-2/3 px-2">
            <Input
                label="Title :"
                placeholder="Title"
                {...register("title", { required: true })}
                className="mb-4"
            />
            <Input
                label="Slug :"
                placeholder="Slug"
                {...register("slug", { required: true })}
                onInput={(e) => {
                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                }}
                className="mb-4"
            />
            <TextEditor 
            label='Content: '
            name='content'
            control={control}
            defaultValue={getValues('content')}
            />
            </div>
            <div className="w-1/3 px-2">
            <Input
                className="mb-4"
                label="Image :"
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("image", { required: !post })}
            />
            {post && post.image && (
                <div className="w-full mb-4">
                    <img
                    src={appwriteService.getFilePreview(post.image)}
                    alt={post.title}
                    />
                </div>
            )}
            <Button type="submit" className="w-full">
                {post ? "Update" : "Submit"}
            </Button>

            </div>
        </form>
    )

}
export default PostForm;