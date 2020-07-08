import * as StoreFollower from '../store/follower';
import * as StoreUser from '../store/user';
import { Payload } from '../util/service/secureAuth';
import { FollowerInterface, UserInterface } from '../util/model';

export const follow = async (payload: Payload, toFollowId: string) => {
    try {
        const userToFollowExists = (await StoreUser.listUsers(
            toFollowId
        )) as UserInterface;
        if (!userToFollowExists) {
            throw {
                code: 404,
                message: 'The user that you wants to follow not exists',
            };
        }

        const alreadyFollowThatUser = ((await StoreFollower.listFollowers(
            null,
            { follower: payload.sub, userFollowed: toFollowId }
        )) as FollowerInterface[])[0];

        if (alreadyFollowThatUser) {
            throw { code: 400, message: 'You already follow that user' };
        }

        return await StoreFollower.addFollower({
            follower: payload.sub,
            userFollowed: toFollowId,
        } as FollowerInterface);
    } catch (error) {
        throw error;
    }
};

export const unfollow = async (payload: Payload, toUnfollowId: string) => {
    try {
        const userToUnfollowExists = (await StoreUser.listUsers(
            toUnfollowId
        )) as UserInterface;
        if (!userToUnfollowExists) {
            throw {
                code: 404,
                message: 'The user that you wants to follow not exists',
            };
        }

        const userNoFollowYet = (await StoreFollower.listFollowers(null, {
            follower: payload.sub,
            userFollowed: toUnfollowId,
        }) as FollowerInterface[])[0];

        if (!userNoFollowYet) {
            throw { code: 400, message: 'You dont follow that user' };
        }

        return await StoreFollower.deleteFollower({
            follower: payload.sub,
            userFollowed: toUnfollowId,
        });
    } catch (error) {
        throw error;
    }
};
