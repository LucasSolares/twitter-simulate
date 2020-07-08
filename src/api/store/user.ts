import { UserModel, UserInterface } from "../util/model";
import { Validation } from "../util/interfaces/validation";
import {
    DocumentQuery,
    MongooseFilterQuery,
    MongooseUpdateQuery,
} from "mongoose";

export const addUser = async (
    user: UserInterface,
    validation: Validation = {
        condition: true,
        error: { code: 500, message: "Internal Server Error" },
    }
) => {
    try {
        if (!validation.condition) {
            throw validation.error;
        }
        return new UserModel(user).save();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const listUsers = async (
    userId?: string,
    specialQuery: MongooseFilterQuery<UserInterface> = {},
    toPopulates?: string[]
) => {
    try {
        let queryToExecute: DocumentQuery<
            UserInterface[] | UserInterface,
            UserInterface
        >;

        if (userId) {
            queryToExecute = UserModel.findOne({ _id: userId });
        } else {
            queryToExecute = UserModel.find(specialQuery);
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

export const updateUser = async (
    userToUpdate: MongooseUpdateQuery<UserInterface>,
    userId?: string,
    query?: MongooseFilterQuery<UserInterface>
) => {
    try {
        let queryToExecute: DocumentQuery<
            UserInterface[] | UserInterface,
            UserInterface
        >;
        if (!userId && !query) {
            throw { code: 400, message: `You don't send an userId or query` };
        }

        if (userId) {
            queryToExecute = UserModel.findByIdAndUpdate(userId, userToUpdate, {
                new: true,
            });
        } else {
            queryToExecute = UserModel.updateMany(query, userToUpdate);
        }
        return await queryToExecute.exec();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const deleteUser = async (
    userId?: string,
    query?: MongooseFilterQuery<UserInterface>
) => {
    try {
        let queryToExecute: DocumentQuery<UserInterface, UserInterface>;
        if (!userId && !query) {
            throw { code: 400, message: `You don't send an userId or query` };
        }

        if (userId) {
            queryToExecute = UserModel.findByIdAndDelete(userId);
        } else {
            return await UserModel.deleteMany(query);
        }

        return await queryToExecute.exec();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};
