import { Account } from "./authentication.types";

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
  created_by?: Account;
  created_at?: Date;
  published_at?: Date;
  published?: Boolean;
  changed_by?: Account;
  changed_at?: Date;
}

export interface PublishDetails {
  id: string;
  ring: Ring;
  ring_reason: string;
  publish: boolean;
}
