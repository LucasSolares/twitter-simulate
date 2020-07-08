import { FollowerModel, FollowerInterface } from "../util/model";
import { Validation } from "../util/interfaces/validation";
import {
    DocumentQuery,
    MongooseFilterQuery,
    MongooseUpdateQuery,
} from "mongoose";

export const addFollower = async (
    toFollow: FollowerInterface,
    validation: Validation = {
        condition: true,
        error: { code: 500, message: "Internal Server Error" },
    }
) => {
    try {
        if (!validation.condition) {
            throw validation.error;
        }
        return new FollowerModel(toFollow).save();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const listFollowers = async (
    followerId?: string,
    specialQuery: MongooseFilterQuery<FollowerInterface> = {},
    toPopulates?: string[]
) => {
    try {
        let queryToExecute: DocumentQuery<
            FollowerInterface[] | FollowerInterface,
            FollowerInterface
        >;

        if (followerId) {
            queryToExecute = FollowerModel.findOne({ _id: followerId });
        } else {
            queryToExecute = FollowerModel.find(specialQuery);
        }
        if (toPopulates) {
            for (const toPopulate of toPopulates) {
                queryToExecute = queryToExecute.populate(toPopulate);
            }
        }

        return await queryToExecute.exec();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const updateFollowers = async (
    followerToUpdate: MongooseUpdateQuery<FollowerInterface>,
    followerId?: string,
    query?: MongooseFilterQuery<FollowerInterface>
) => {
    try {
        let queryToExecute: DocumentQuery<
            FollowerInterface[] | FollowerInterface,
            FollowerInterface
        >;
        if (!followerId && !query) {
            throw { code: 400, message: `You don't send an userId or query` };
        }

        if (followerId) {
            queryToExecute = FollowerModel.findByIdAndUpdate(
                followerId,
                followerToUpdate,
                { new: true }
            );
        } else {
            queryToExecute = FollowerModel.updateMany(query, followerToUpdate);
        }
        return await queryToExecute.exec();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const deleteFollower = async (
    queryWithId?: MongooseFilterQuery<FollowerInterface>,
    query?: MongooseFilterQuery<FollowerInterface>
) => {
    try {
        let queryToExecute: DocumentQuery<FollowerInterface, FollowerInterface>;
        if (!queryWithId && !query) {
            throw { code: 400, message: `You don't send an userId or query` };
        }

        if (queryWithId) {
            queryToExecute = FollowerModel.findOneAndDelete(queryWithId);
        } else {
            return await FollowerModel.deleteMany(query);
        }

        return await queryToExecute.exec();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};
