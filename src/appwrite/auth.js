import conf from '../conf'
import {Client, Account, ID} from 'appwrite'

export class AuthService {
    client = new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}){
        try{
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if(userAccount) return this.login({email, password});
            else return userAccount;

        }
        catch(error){throw error;}
    }

    async login({email, password}){
        try {
            return await this.account.createEmailPasswordSession(email, password);

        } catch (error) {
            console.log("error in login(): ", error);   
        }
    }
    async logout(){
        //logout doesnt need arguments
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }
    async getCurrentUser(){
        // console.log(this.account)
        try {
            const user= await this.account.get();
            return user;
        } catch (error) {
            console.log("error in getCurrentUser(): ", error);
            throw error;
            return null;
        }
        // return null;
    }
}

const authService = new AuthService();
export default authService;