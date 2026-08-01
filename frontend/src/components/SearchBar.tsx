import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { INDIAN_STATES, QUALIFICATIONS } from "@/utils/constants";

export function SearchBar(): JSX.Element {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [state, setState] = useState("");
  const [qualification, setQualification] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (state) params.set("state", state);
    if (qualification) params.set("qualification", qualification);
    navigate(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg sm:grid-cols-[1.6fr_1fr_1fr_auto] dark:border-slate-800 dark:bg-slate-900"
    >
      <label className="sr-only" htmlFor="keyword">Search keyword</label>
      <input
        id="keyword"
        className="input"
        placeholder="Search by post, department or keyword"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <label className="sr-only" htmlFor="state">State</label>
      <select id="state" className="input" value={state} onChange={(event) => setState(event.target.value)}>
        <option value="">All states</option>
        {INDIAN_STATES.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <label className="sr-only" htmlFor="qualification">Qualification</label>
      <select
        id="qualification"
        className="input"
        value={qualification}
        onChange={(event) => setQualification(event.target.value)}
      >
        <option value="">Any qualification</option>
        {QUALIFICATIONS.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <button type="submit" className="btn-primary sm:px-6">
        <Search className="h-4 w-4" />
        Search
      </button>
    </form>
  );
}
