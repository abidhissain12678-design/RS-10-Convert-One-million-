import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  jazzcash: string;
  easypaisa: string;
  bank: string;
  withdrawLimit: string;
  ytLink: string;
  ytSlogan: string;
  ttLink: string;
  ttSlogan: string;
  twLink: string;
  twSlogan: string;
  fbLink: string;
  fbSlogan: string;
  liLink: string;
  liSlogan: string;
  waLink: string;
  waSlogan: string;
  igLink: string;
  igSlogan: string;
  notice: string;
}

const SettingsSchema: Schema = new Schema({
  jazzcash: { type: String, default: '0300-1234567' },
  easypaisa: { type: String, default: '0345-1234567' },
  bank: { type: String, default: 'HBL - 1234567890123456' },
  withdrawLimit: { type: String, default: '500' },
  ytLink: { type: String, default: '' },
  ytSlogan: { type: String, default: 'Subscribe for Updates' },
  ttLink: { type: String, default: '' },
  ttSlogan: { type: String, default: 'Follow for Fun' },
  twLink: { type: String, default: '' },
  twSlogan: { type: String, default: 'Latest Updates' },
  fbLink: { type: String, default: '' },
  fbSlogan: { type: String, default: 'Join Our Community' },
  liLink: { type: String, default: '' },
  liSlogan: { type: String, default: 'Professional Network' },
  waLink: { type: String, default: '' },
  waSlogan: { type: String, default: 'Get Alerts on WhatsApp' },
  igLink: { type: String, default: '' },
  igSlogan: { type: String, default: 'See Our Stories' },
  notice: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);