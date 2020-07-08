import {
    AuthInterface,
    UserInterface,
    FollowerInterface,
    UserModel,
} from "../util/model";

import { hashPassword, comparePassword, generateAndSignToken, Payload } from '../util/service/secureAuth';

import * as StoreAuth from "../store/auth";
import * as StoreUser from "../store/user";
import * as StoreFollower from '../store/follower'
import { User } from "../util/model/user";


const calculateAge = (dateOfBorn: Date) => {
    var diff_ms = Date.now() - dateOfBorn.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
};

export const register = async (auth: AuthInterface, user: UserInterface) => {
    try {
        user.age = calculateAge(user.dateOfBorn);
        await new UserModel(user).validate();

        if (!auth.email || !auth.password) {
            throw { code: 400, message: `You don't send any email or password` }
        }

        const alreadyExistsUser = (await StoreAuth.listAuth(null, {
            email: auth.email,
        })) as AuthInterface[];

        const userAdded = await StoreUser.addUser(user, {
            condition: !alreadyExistsUser[0],
            error: {
                code: 400,
                message: "User already exists with that credentials",
            },
        });

        auth.user = userAdded._id;

        await StoreAuth.addAuth({...auth, password: await hashPassword(auth.password)} as AuthInterface);

        return userAdded;
    } catch (error) {
        throw error;
    }
};

export const login = async (email: string, password: string) => {
    try {
        if (!email || !password) {
            throw {
                code: 400,
                message: 'You missing params something like email or password'
            }
        }

        const authWithCredentialExists = ((await StoreAuth.listAuth(null, { email })) as AuthInterface[])[0]

        if (!authWithCredentialExists) {
            throw { code: 401, message: 'Email or password incorrect' }
        }

        const passwordIsCorrect = await comparePassword(password, authWithCredentialExists.password);

        if (!passwordIsCorrect) {
            throw { code: 401, message: 'Email or password incorrect' }
        }

        return generateAndSignToken({ sub: authWithCredentialExists._id })
    } catch (error) {
        throw error;
    }
    
}

export const getProfile = async (payload: Payload) => {
    try {
        if (!payload) {
            throw {code: 500, message: 'The headers was not sent'}
        }
        
        const securedAuth = await StoreAuth.listAuth(payload.sub, null, [ 'user' ]) as AuthInterface;
        const follows = await StoreFollower.listFollowers(null, { follower: payload.sub }, ["userFollowed"]) as FollowerInterface[]
        const followers = await StoreFollower.listFollowers(null, { userFollowed: (securedAuth.user as unknown as UserInterface)._id }, ["userFollowed"]) as FollowerInterface[]
        

        if (!securedAuth) {
            throw { code: 401, message: 'You send an invalid data on the token' }
        }
        
        securedAuth.password = undefined;
        const profile = {
            user: {
                _id: securedAuth._id,
                email: securedAuth.email,
                createdAt: securedAuth.createdAt,
                userProfile: securedAuth.user,
            },
            follows,
            followers
        }

        return profile;

    } catch (error) {
        throw error
    }
}
