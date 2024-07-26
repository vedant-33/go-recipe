import conf from '../conf'
import {Client, ID, Databases, Storage, Query} from 'appwrite'


export class Service{
    client=  new Client();
    databases;
    storage;

    constructor(){
        // console.log(conf.appwriteUrl, conf.appwriteProjectId);
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createRestaurant({title, slug, content, image,status, userId}){
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug,
                {
                    title,
                    content,
                    image,
                    status,
                    userId,
                }
            )
        } catch (error) {
            throw error;
        }
    }

    async updateRestaurant(slug, {title, content, image, status}){
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug,
                {
                    title,
                    content,
                    image,
                    status,
                }
            )
        } catch (error) {
            throw error;
        }
    }

    async deleteRestaurant(slug){
        try {
            return await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
        } catch (error) {
            console.log('error in deleteRestaurant(): ',error)
            return false;
        }
    }

    async getRestaurant(slug){
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
        } catch (error) {
            console.log('error in getRestaurant: ',error)
            return false;
        }
    }

    async getAllRestaurants(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId,
                 queries,
            )
        } catch (error) {
            console.log('error in getAllRestaurants: ',error)
            return false;
        }
    }

    async uploadFile(file){
        try {
            return await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file);
        } catch (error) {
            throw error;
        }
    }

    getFilePreview(fileId){
        // preview of restaurant in card
        return this.storage.getFilePreview(conf.appwriteBucketId, fileId);
    }

    async deleteFile(fileId){
        try {
            return await this.storage.deleteFile(conf.appwriteBucketId, fileId);
        } catch (error) {
            throw error;
        }
    }

    getFileForView(fileId){
        return this.storage.getFileView(conf.appwriteBucketId, fileId);
    }

}
const service = new Service()
export default service