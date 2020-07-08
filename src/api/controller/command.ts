import { RequestCommand } from '../util/interfaces/responseCommand';
import {
    AuthInterface,
    UserInterface,
    TweetInterface,
    FollowerInterface,
} from '../util/model';
import { Response } from 'express';

import * as AuthController from '../controller/auth';
import * as TweetController from '../controller/tweet';
import * as FollowerController from '../controller/follower';
import * as response from '../../network/response';
import { Payload } from '../util/service/secureAuth';

const validateParams = (params: string[], neededParams: string[]) => {
    if (params.length > neededParams.length) {
        const extraParams = params.reduce(
            (previousValue, currentValue, currentIndex): string => {
                console.log(currentIndex);
                if (!(currentIndex < neededParams.length)) {
                    if (previousValue) {
                        return `${previousValue} "${currentValue.concat('"')}`;
                    }
                    return `"${currentValue}"`;
                }
                return null;
            },
            ''
        );
        return {
            code: 400,
            message: `You send ${extraParams} like extra params remove them.`,
        };
    } else if (params.length < neededParams.length) {
        return {
            code: 400,
            message: `You missing parameters something like, ${neededParams.join(
                ', '
            )}`,
        };
    }
};

const registerCommand = async (params: string[]) => {
    const paramsNotValid = validateParams(params, [
        'email',
        'password',
        'name',
        'lastname',
        'dateOfBorn',
    ]);
    if (!paramsNotValid) {
        let [email, password, name, lastname, dateOfBorn] = params;

        return await AuthController.register(
            { email, password } as AuthInterface,
            {
                name,
                lastname,
                dateOfBorn: new Date(dateOfBorn),
            } as UserInterface
        );
    }
    throw paramsNotValid;
};

const loginCommand = async (params: string[]) => {
    const paramsNotValid = validateParams(params, ['email', 'password']);

    if (!paramsNotValid) {
        let [email, password] = params;

        return await AuthController.login(email, password);
    }

    throw paramsNotValid;
};

const profileCommand = async (payload: Payload) =>
    await AuthController.getProfile(payload);

const addTweetCommand = async (payload: Payload, params: string[]) => {
    const paramsNotValid = validateParams(params, ['content']);

    if (!paramsNotValid) {
        let [content] = params;

        return await TweetController.addTweet(payload, {
            content,
        } as TweetInterface);
    }

    throw paramsNotValid;
};

const viewTweetsCommand = async (payload: Payload, params: string[]) => {
    const paramsNotValid = validateParams(params, ['tweetId']);

    if (!paramsNotValid || params.length <= 1) {
        let [tweetId] = params;

        if (tweetId) {
            return (await TweetController.listTweets(
                payload,
                tweetId
            )) as TweetInterface;
        }
        return (await TweetController.listTweets(payload)) as TweetInterface[];
    }

    throw paramsNotValid;
};

const editTweetCommand = async (payload: Payload, params: string[]) => {
    const paramsNotValid = validateParams(params, ['tweetId', 'content']);

    if (!paramsNotValid) {
        let [tweetId, content] = params;

        return (await TweetController.updateTweet(
            payload,
            { content },
            tweetId
        )) as TweetInterface;
    }

    throw paramsNotValid;
};

const deleteTweetCommand = async (payload: Payload, params: string[]) => {
    const paramsNotValid = validateParams(params, ['tweetId']);

    if (!paramsNotValid) {
        let [tweetId] = params;

        return (await TweetController.deleteTweet(
            payload,
            tweetId
        )) as TweetInterface;
    }

    throw paramsNotValid;
};

const followCommand = async (payload: Payload, params: string[]) => {
    const paramsNotValid = validateParams(params, ['toFollowId']);

    if (!paramsNotValid) {
        let [toFollowId] = params;

        return (await FollowerController.follow(
            payload,
            toFollowId
        )) as FollowerInterface;
    }

    throw paramsNotValid;
};

const unfollowCommand = async (payload: Payload, params: string[]) => {
    const paramsNotValid = validateParams(params, ['toUnfollowId']);

    if (!paramsNotValid) {
        let [toUnfollowId] = params;

        return (await FollowerController.unfollow(
            payload,
            toUnfollowId
        )) as FollowerInterface;
    }

    throw paramsNotValid;
};

export const commandController = async (req: RequestCommand, res: Response) => {
    try {
        switch (req.commandName) {
            case 'REGISTER':
                const userAdded = await registerCommand(req.commandParams);
                response.success(res, {
                    code: 200,
                    data: userAdded,
                    message: 'Succesfuly added',
                });
                break;

            case 'LOGIN':
                const token = await loginCommand(req.commandParams);
                response.success(res, {
                    code: 200,
                    data: token,
                    message: 'Token succesfuly generate',
                });
                break;

            case 'PROFILE':
                const profile = await profileCommand(req.payload);
                response.success(res, {
                    code: 200,
                    data: profile,
                    message: `Here's the profile`,
                });
                break;

            case 'ADD_TWEET':
                const tweetAdded = await addTweetCommand(
                    req.payload,
                    req.commandParams
                );
                response.success(res, {
                    code: 200,
                    data: tweetAdded,
                    message: `Tweet added succesfuly`,
                });
                break;

            case 'VIEW_TWEETS':
                const tweetOrTweetsFinded = await viewTweetsCommand(
                    req.payload,
                    req.commandParams
                );
                response.success(res, {
                    code: 200,
                    data: tweetOrTweetsFinded,
                    message: `These tweets were finded`,
                });
                break;

            case 'EDIT_TWEET':
                const editedTweet = await editTweetCommand(
                    req.payload,
                    req.commandParams
                );
                response.success(res, {
                    code: 200,
                    data: editedTweet,
                    message: `These tweets were finded`,
                });
                break;

            case 'DELETE_TWEET':
                const deletedTweet = await deleteTweetCommand(
                    req.payload,
                    req.commandParams
                );
                response.success(res, {
                    code: 200,
                    data: deletedTweet,
                    message: `These tweets were finded`,
                });
                break;

            case 'FOLLOW':
                const follow = await followCommand(
                    req.payload,
                    req.commandParams
                );
                response.success(res, {
                    code: 200,
                    data: follow,
                    message: `You succesfuly follow the user`,
                });
                break;

            case 'UNFOLLOW':
                const unfollow = await unfollowCommand(
                    req.payload,
                    req.commandParams
                );
                response.success(res, {
                    code: 200,
                    data: unfollow,
                    message: `You succesfuly unfollow the user`,
                });
                break;

            default:
                throw {
                    code: 404,
                    message: `Command ${req.commandName} not found`,
                };
        }
    } catch (error) {
        console.error(error);
        response.error(res, {
            code: error.code || 500,
            message: error.message,
        });
    }
};
