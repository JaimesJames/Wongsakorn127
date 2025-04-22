import { Identify } from "../../models/share.model";

export const convertDocToInfo = (doc: any): Identify => {
    const data = doc.data();
    return {
        username: data.username,
        email: data.email
    };
};