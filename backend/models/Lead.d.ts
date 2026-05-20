import mongoose, { Document } from 'mongoose';
export declare enum LeadStatus {
    NEW = "New",
    CONTACTED = "Contacted",
    QUALIFIED = "Qualified",
    LOST = "Lost"
}
export declare enum LeadSource {
    WEBSITE = "Website",
    INSTAGRAM = "Instagram",
    REFERRAL = "Referral"
}
export interface ILead extends Document {
    name: string;
    email: string;
    status: LeadStatus;
    source: LeadSource;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ILead, {}, {}, {}, mongoose.Document<unknown, {}, ILead, {}, mongoose.DefaultSchemaOptions> & ILead & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILead>;
export default _default;
//# sourceMappingURL=Lead.d.ts.map