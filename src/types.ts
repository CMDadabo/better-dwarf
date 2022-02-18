export interface Citizen {
  id: number;
  name: string;
  family_head_id?: number;
  family_head_name?: string;
  is_deity?: boolean;
  all_hf_links: HFLink[];
}

export enum HFLinkType {
  Mother = "MOTHER",
  Deity = "DEITY",
}

export interface HFLink {
  id: number;
  name: string;
  strength: number;
  type: HFLinkType;
}

export interface Node {
  id: number;
  name: string;
  family_head_id?: number;
  family_head_name?: string;
  is_deity?: boolean;
}

export interface Link {
  source: number;
  target: number;
  strength: number;
  type: HFLinkType;
}
