import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Card, Container} from '../components/Index'
 

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        appwriteService.getAllRestaurants().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, []);
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <Card {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
        
    )
}

export default Home