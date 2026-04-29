import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroOverlayText: string;
  aboutTagline: string;
  aboutDescription: string;
  aboutVision: string;
  aboutVisionDetail: string;
  aboutValues: { title: string; desc: string }[];
  aboutCtaHeading: string;
  aboutCtaButton: string;
}

const SettingsSchema: Schema<ISettings> = new Schema(
  {
    heroTitle: { type: String, default: "The New Standard" },
    heroSubtitle: { type: String, default: "DRIP, DETAIL, DOMINANCE" },
    heroImage: { type: String, default: "" },
    heroButtonText: { type: String, default: "Explore Collection" },
    heroButtonLink: { type: String, default: "/shop" },
    heroOverlayText: { type: String, default: "CORASE" },
    aboutTagline: { type: String, default: "A streetwear brand born from the intersection of art, architecture and the urban underground." },
    aboutDescription: { type: String, default: "Designed for the bold, the restless, and the visionaries. CORASE is more than a brand; it's a movement towards minimal excellence in urban fashion." },
    aboutVision: { type: String, default: "We source the heaviest, most premium core-spun cotton to create silhouettes that drape perfectly. Every stitch, every print, and every distress mark is calculated to absolute perfection. Welcome to the future of the archive." },
    aboutVisionDetail: { type: String, default: "" },
    aboutValues: { type: [{ title: String, desc: String }], default: [
      { title: "PREMIUM FABRIC", desc: "250gsm core-spun cotton, pre-washed for a lived-in feel that only improves over time." },
      { title: "LIMITED DROPS", desc: "Every release is tightly controlled. Once it's gone, it's gone. No restocks, no compromises." },
      { title: "ETHICAL CRAFT", desc: "Made in small batches by artisan print houses that share our obsession with quality." },
      { title: "ARCHIVE FOREVER", desc: "Every piece becomes part of the CORASE archive — a permanent record of a moment in time." },
    ]},
    aboutCtaHeading: { type: String, default: "WEAR THE ARCHIVE" },
    aboutCtaButton: { type: String, default: "EXPLORE COLLECTION" },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
