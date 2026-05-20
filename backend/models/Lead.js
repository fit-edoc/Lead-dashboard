import mongoose, { Schema, Document } from 'mongoose';
export var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NEW"] = "New";
    LeadStatus["CONTACTED"] = "Contacted";
    LeadStatus["QUALIFIED"] = "Qualified";
    LeadStatus["LOST"] = "Lost";
})(LeadStatus || (LeadStatus = {}));
export var LeadSource;
(function (LeadSource) {
    LeadSource["WEBSITE"] = "Website";
    LeadSource["INSTAGRAM"] = "Instagram";
    LeadSource["REFERRAL"] = "Referral";
})(LeadSource || (LeadSource = {}));
const LeadSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: Object.values(LeadStatus), default: LeadStatus.NEW },
    source: { type: String, enum: Object.values(LeadSource), required: true },
}, { timestamps: true });
export default mongoose.model('Lead', LeadSchema);
//# sourceMappingURL=Lead.js.map