export interface FoundItem {
  item_name: string;
  category: string;
  description: string;
  location: string;
  date_found: string;
  contact_name: string;
  contact_phone: string;
}

export interface FoundItemRecord extends FoundItem {
  item_id: string;
  user_id: string;
}