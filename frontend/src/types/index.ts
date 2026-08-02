export type UserRole = "admin" | "user";

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  state: string | null;
  qualification: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface Job {
  id: number;
  title: string;
  organization: string;
  department: string | null;
  state: string | null;
  city: string | null;
  qualification: string | null;
  category: string | null;
  salary: string | null;
  salary_min: number | null;
  salary_max: number | null;
  age_limit: string | null;
  application_mode: string | null;
  application_url: string | null;
  notification_pdf: string | null;
  last_date: string | null;
  published_date: string | null;
  description: string | null;
  selection_process: string | null;
  vacancies: number | null;
  experience: string | null;
  job_type: string | null;
  source: string | null;
  // Rich structured fields (JSON strings, parse before use)
  important_dates: string | null;   // [{label: string, value: string}]
  application_fee: string | null;   // [{label: string, value: string}]
  vacancy_details: string | null;   // [{post_name: string, total: string, eligibility: string}]
  important_links: string | null;   // [{label: string, url: string, link_text: string}]
  how_to_apply: string | null;      // string[]
  short_info: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface JobSearchParams {
  q?: string;
  state?: string;
  qualification?: string;
  organization?: string;
  category?: string;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  last_date_before?: string;
  last_date_after?: string;
  active_only?: boolean;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface OrganizationCount {
  organization: string;
  count: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface HomeData {
  latest_jobs: Job[];
  top_organizations: OrganizationCount[];
  popular_categories: CategoryCount[];
  closing_soon: Job[];
  latest_admit_cards: Job[];
  latest_results: Job[];
}

export interface AdminStats {
  total_jobs: number;
  todays_jobs: number;
  total_users: number;
  total_scrapers: number;
  jobs_per_day: { date: string; count: number }[];
  jobs_per_organization: OrganizationCount[];
  recent_jobs: Job[];
}

export interface ScraperLog {
  id: number;
  source: string;
  status: "success" | "failed" | "partial";
  items_found: number;
  items_created: number;
  items_updated: number;
  duration_ms: number;
  message: string | null;
  started_at: string;
  finished_at: string;
}

export interface ScraperRunResult {
  source: string;
  status: string;
  found: number;
  created: number;
  updated: number;
}

export interface ApiMessage {
  detail: string;
}
