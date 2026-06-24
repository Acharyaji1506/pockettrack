export type Category = {
  id: string;
  name: string;
  is_default: boolean;
};

export type Expense = {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  note: string | null;
  spent_on: string; // YYYY-MM-DD
  categories: { name: string } | null;
};
