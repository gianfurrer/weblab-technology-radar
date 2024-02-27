export enum Category {
  Tools = "Tools",
  Techniques = "Techniques",
  Platforms = "Platforms",
  LanguagesFrameworks = "Languages & Frameworks",
}

export enum Ring {
  Assess = "Assess",
  Trial = "Trial",
  Hold = "Hold",
  Adopt = "Adopt",
}

export interface RingHistory {
  ring: Ring;
  ring_reason: string;
  changed_at: Date;
  changed_by: string;
}

export interface Technology {
  id?: string;
  name: string;
  category: Category;
  ring?: Ring;
  description: string;
  ring_reason?: string;
  created_by?: string;
  created_at?: Date;
  published?: boolean;
  published_at?: Date;
  changed_by?: string;
  changed_at?: Date;
  ring_history?: RingHistory[];
}

export interface PublishDetails {
  id: string;
  ring: Ring;
  ring_reason: string;
  publish: boolean;
}
