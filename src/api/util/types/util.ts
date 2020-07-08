import { UserInterface, FollowerInterface, TweetInterface, AuthInterface } from '../../util/model';
import { Model } from 'mongoose';


export type Commands = 'LOGIN' | 'REGISTER' | 'ADD_TWEET' | 'DELETE_TWEET' | 'EDIT_TWEET' | 'VIEW_TWEETS' | 'FOLLOW' | 'UNFOLLOW' | 'PROFILE';
export type Collections = UserInterface | FollowerInterface | TweetInterface | AuthInterface