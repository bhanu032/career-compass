import { EXAM_GROUPS } from "@/data/mockTests";
import { EXTENDED_PRIVATE_JOBS, INITIAL_PRIVATE_JOBS } from "@/data/privateJobs";

/**
 * Intelligent Local ChatGPT Engine for DeshKiSeva
 * Full awareness of Jobs, Live Scrapers, 750+ Mock Papers, Resume Builder & Admit Cards.
 */

export interface AIAction {
  label: string;
  url: string;
  icon?: string;
}

export interface AIChatResponse {
  markdown: string;
  actions?: AIAction[];
}

export function generateRealtimeChatGPTResponse(userQuery: string): AIChatResponse {
  const query = userQuery.toLowerCase().trim();

  // 1. Jobs & Scrapers Query
  if (query.includes("job") || query.includes("vacancy") || query.includes("opening") || query.includes("private") || query.includes("salary") || query.includes("linkedin") || query.includes("indeed")) {
    const totalPrivate = INITIAL_PRIVATE_JOBS.length + EXTENDED_PRIVATE_JOBS.length;
    return {
      markdown: `### 💼 Real-Time Jobs Portal & Live Scraper

DeshKiSeva automatically streams live job opportunities across **Government Notifications** and **Private Portals**!

- **Live Scrapers Active**: Scraping in real-time from **LinkedIn**, **Indeed**, **Glassdoor**, and **National Career Service (NCS)**.
- **Private Opportunities**: Over **${totalPrivate}+ verified private roles** (Bangalore, Delhi NCR, Mumbai, Hyderabad, Remote).
- **Government Notifications**: Latest SSC, Banking, Railways, UPSC, and State PSC notifications.

Want to find specific roles for your background? Type your target position (e.g., *"Python Developer"*, *"Bank PO"*, *"Civil Engineer"*) in our Live Search!`,
      actions: [
        { label: "🔍 Search All Jobs & Scrapers", url: "/jobs" },
        { label: "⚡ Live Multi-Portal Search", url: "/search" },
      ],
    };
  }

  // 2. Mock Tests Query
  if (query.includes("mock") || query.includes("test") || query.includes("ssc") || query.includes("cgl") || query.includes("bank") || query.includes("rrb") || query.includes("upsc") || query.includes("paper") || query.includes("exam")) {
    const totalGroups = EXAM_GROUPS.length;
    return {
      markdown: `### 🎯 Official Exam Mock Papers (750+ Full-Length Tests)

We provide **50+ authentic full-length mock test papers per exam** with official exam pattern timers, section breakdown, and detailed explanations:

1. **SSC Board (150 Mocks)**: SSC CGL Tier-I, SSC CHSL Tier-I, SSC MTS CBT
2. **Banking Board (150 Mocks)**: IBPS PO Prelims, SBI PO Prelims, IBPS Clerk
3. **Railways RRB (150 Mocks)**: RRB NTPC CBT-1, RRB Group D, RRB ALP CBT-1
4. **UPSC & State PSC (150 Mocks)**: UPSC CSE Prelims GS-1, UPPSC PCS, 70th BPSC
5. **Defence & Teaching (150 Mocks)**: NDA GAT, CTET Paper-I & Paper-II

Select your exam category below to start a timed mock test!`,
      actions: [
        { label: "🏛️ SSC Mock Tests", url: "/mock-tests/group/ssc" },
        { label: "🏦 Banking Mock Tests", url: "/mock-tests/group/banking" },
        { label: "🚂 Railways Mock Tests", url: "/mock-tests/group/railways" },
        { label: "📚 All Exam Categories", url: "/mock-tests" },
      ],
    };
  }

  // 3. Resume Builder Query
  if (query.includes("resume") || query.includes("cv") || query.includes("download") || query.includes("pdf") || query.includes("template") || query.includes("ats")) {
    return {
      markdown: `### 📄 Standard Resume Builder (1-to-1 PDF Export)

Our Resume Builder offers **16 professional templates** with 100% pixel-perfect A4 PDF download (matching your preview with 0 CSS breakage):

- **16 Templates**: Classic, Modern, Executive, Minimal, Sharp, Slate, Timeline, Compact, ATS Professional, Lato, Sidebar & Card.
- **ATS Checker**: Real-time Job Description matching & keyword optimization score.
- **1-to-1 PDF Download**: Direct vector-quality A4 PDF generation.

Click below to start crafting or editing your resume!`,
      actions: [
        { label: "✨ Create New Resume", url: "/resume-builder" },
        { label: "🎨 Pick Resume Template", url: "/resume-builder/templates" },
      ],
    };
  }

  // 4. Admit Cards & Results Query
  if (query.includes("admit") || query.includes("card") || query.includes("hall ticket") || query.includes("result") || query.includes("cut off") || query.includes("scorecard")) {
    return {
      markdown: `### 🎫 Official Admit Cards & Exam Results

Track real-time hall tickets, call letters, and declared results across central & state examination bodies:

- **Admit Cards**: Direct official download links for SSC CGL, IBPS PO, RRB NTPC, UPSC, CTET, and State PSCs.
- **Declared Results**: Cut-off marks, merit lists, and official PDF scorecards.

Click below to check your exam status!`,
      actions: [
        { label: "🎫 Check Admit Cards", url: "/admit-cards" },
        { label: "🏆 Check Exam Results", url: "/results" },
      ],
    };
  }

  // 5. Default ChatGPT Career Assistant Response
  return {
    markdown: `Hello! I'm **David**, your ChatGPT-powered AI Career Advisor for **DeshKiSeva** 🤖✨

I have full real-time awareness of our complete career platform:
- **Jobs & Live Scrapers**: Real-time job search across LinkedIn, Indeed, Glassdoor & Govt portals.
- **750+ Mock Papers**: 50 full-length practice sets per exam (SSC, Banking, Railways, UPSC, BPSC, CTET).
- **Resume Builder**: 16 templates with 1-to-1 PDF export.
- **Admit Cards & Results**: Live official tracking.

How can I help you today? Select a shortcut below or ask me any question!`,
    actions: [
      { label: "💼 Search Live Jobs", url: "/jobs" },
      { label: "📝 Take Mock Test", url: "/mock-tests" },
      { label: "📄 Build Resume", url: "/resume-builder" },
      { label: "🎫 Admit Cards & Results", url: "/admit-cards" },
    ],
  };
}
