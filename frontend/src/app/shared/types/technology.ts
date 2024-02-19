export enum Category {
  Tools = "Tools",
  Techniques = "Techniques",
  Platforms = "Platforms",
}

export enum Ring {
  Assess = "Assess",
  Trial = "Trial",
  Hold = "Hold",
  Adopt = "Adopt",
}

export interface Technology {
  id?: string;
  name: string;
  category: Category;
  ring?: Ring;
  description: string;
  ring_reason?: string;
  created_at?: Date;
  published?: boolean;
  published_at?: Date;
}
