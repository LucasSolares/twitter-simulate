import { AuthModel, AuthInterface } from "../util/model";
import { Validation } from "../util/interfaces/validation";
import {
    DocumentQuery,
    MongooseFilterQuery,
    MongooseUpdateQuery,
} from "mongoose";

export const addAuth = async (
    auth: AuthInterface,
    validation: Validation = {
        condition: true,
        error: { code: 500, message: "Internal Server Error" },
    }
) => {
    try {
        if (!validation.condition) {
            throw validation.error;
        }
        return new AuthModel(auth).save();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const listAuth = async (
    authId?: string,
    specialQuery: MongooseFilterQuery<AuthInterface> = {},
    toPopulates?: string[]
) => {
    try {
        let queryToExecute: DocumentQuery<
            AuthInterface[] | AuthInterface,
            AuthInterface
        >;

        if (authId) {
            queryToExecute = AuthModel.findOne({ _id: authId });
        } else {
            queryToExecute = AuthModel.find(specialQuery);
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

export const updateAuth = async (
    authToUpdate: MongooseUpdateQuery<AuthInterface>,
    authId?: string,
    query?: MongooseFilterQuery<AuthInterface>
) => {
    try {
        let queryToExecute: DocumentQuery<
            AuthInterface[] | AuthInterface,
            AuthInterface
        >;
        if (!authId && !query) {
            throw { code: 400, message: `You don't send an authId or query` };
        }

        if (authId) {
            queryToExecute = AuthModel.findByIdAndUpdate(authId, authToUpdate, {
                new: true,
            });
        } else {
            queryToExecute = AuthModel.updateMany(query, authToUpdate);
        }
        return await queryToExecute.exec();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};

export const deleteAuth = async (
    authId?: string,
    query?: MongooseFilterQuery<AuthInterface>
) => {
    try {
        let queryToExecute: DocumentQuery<AuthInterface, AuthInterface>;
        if (!authId && !query) {
            throw { code: 400, message: `You don't send an authId or query` };
        }

        if (authId) {
            queryToExecute = AuthModel.findByIdAndDelete(authId);
        } else {
            return await AuthModel.deleteMany(query);
        }

        return await queryToExecute.exec();
    } catch (error) {
        throw { code: error.code, message: error.message };
    }
};
