// Student offers (/offers and the homepage "Student offers" section). Researched at each brand's official page, or
// GitHub's Student Developer Pack page for pack partners, and kept to offers students in India can claim. Copy is
// ours. Re-check links with `npm run offers:check`; fetch a new offer's logo from its `site` with
// `npm run offers:logos`. Held back until checked by hand (price or terms not confirmed on the brand's own page):
// Raycast, IBM SkillsBuild, Adobe, Lucidchart, SOLIDWORKS, Autodesk, Tableau, YouTube Premium, Apple Music, Akasa Air,
// IndiGo, Air India, SpiceJet (local-docs/offers-catalog-draft.md).

export const OFFERS_CHECKED_AT = "2026-11-25";
export const OFFERS_PATH = "/offers";

// No Figma for this page (SPEC-VS-DESIGN OF rows): the site's dark band, filter bar, cards and numbered steps.
export const offersPage = {
  metaTitle: "Student offers",
  metaDescription:
    "Free software, cloud credits, courses and discounts students in India can claim: GitHub Student Pack, JetBrains, Azure, Figma, Notion, Spotify and more.",
  hero: {
    eyebrow: "Student offers",
    title: "Free tools and discounts\nfor students in India",
    subtitle: "Software, cloud credits, courses and more that you can claim with your student status. Every offer links straight to the brand's official page.",
    stats: {
      offers: "Offers",
      free: "Free to claim",
      categories: "Categories",
      checked: (date: string) => `Last checked ${date}`,
    },
  },
  directory: {
    label: "Student offers",
    all: "All",
    searchLabel: "Search offers",
    searchPlaceholder: "Search, e.g. “design” or “cloud credits”",
    results: (count: number) => (count === 1 ? "1 offer found" : `${count} offers found`),
    pagination: "Offer pages",
    pageOf: (page: number, count: number) => `page ${page} of ${count}`,
    showing: (from: number, to: number, total: number) => (total <= to - from + 1 ? `Showing all ${total}` : `Showing ${from}–${to} of ${total}`),
    empty: "No offers match your search.",
    clear: "Clear filters",
  },
  steps: {
    eyebrow: "How it works",
    title: "Claim an offer\nin three steps",
    description: "Most offers only need proof that you're a student. Mentorle never sits in between: you claim each one on the brand's own site.",
    items: [
      {
        number: "01",
        label: "Verify",
        title: "Get verified as a student",
        description: (packCount: number) =>
          `Use your college email or student ID. Start with GitHub Education: it unlocks ${packCount} of the offers here.`,
      },
      { number: "02", label: "Pick", title: "Find what you need", description: () => "Search or filter by category, then open Details to check who can claim an offer." },
      { number: "03", label: "Claim", title: "Claim on the official site", description: () => "Claim offer takes you to the brand's page. We don't collect your details." },
    ],
  },
  note: "Offers are run by the brands, not Mentorle, and can change or end without notice. Check the terms on the official page before you sign up.",
};

export const offerCardCopy = {
  claim: "Claim offer",
  details: "Details",
  kind: { free: "Free", discount: "Discount" },
  via: { "github-pack": "GitHub Student Pack", sheerid: "SheerID", unidays: "UNiDAYS" },
  opensInNewTab: "(opens in a new tab)",
  dialog: {
    close: "Close",
    eligibility: "Who can claim",
    howTo: "How to claim",
    steps: {
      "github-pack": (brand: string) => [
        "Apply to GitHub Education with your college email or student ID. Approval usually takes a few days.",
        `Open the Student Developer Pack and find ${brand}.`,
        "Follow the partner's link to activate the offer.",
      ],
      sheerid: (brand: string) => ["Open the official page.", "Verify that you're a student with SheerID (college email or ID).", `The student price applies to your ${brand} account.`],
      unidays: (brand: string) => ["Open the official page.", "Verify that you're a student with UNiDAYS (college email or ID).", `Claim the ${brand} offer once you're verified.`],
      direct: (brand: string) => ["Open the official page.", "Sign up with your college email, or follow the student verification there.", `The ${brand} offer is applied once you're verified.`],
    },
    note: "Run by the brand. Terms can change: check them on the official page.",
  },
};

export const homeOffers = {
  eyebrow: "Student offers",
  title: "Free tools for\nyour student years",
  description: (count: number) => `${count} tools, credits and discounts students in India can claim, from GitHub and JetBrains to Figma and Spotify.`,
  action: "View all offers",
};

export const offerCategories = [
  { slug: "ai", label: "AI & machine learning" },
  { slug: "developer", label: "Developer tools" },
  { slug: "cloud", label: "Cloud & infrastructure" },
  { slug: "learning", label: "Learning & courses" },
  { slug: "design", label: "Design & creative" },
  { slug: "engineering", label: "Engineering & science" },
  { slug: "productivity", label: "Productivity & study" },
  { slug: "lifestyle", label: "Lifestyle & travel" },
] as const;

export type OfferCategory = (typeof offerCategories)[number]["slug"];

export type Offer = {
  slug: string;
  brand: string;
  category: OfferCategory;
  title: string; // the offer itself, in one line
  description: string; // what the product is
  eligibility: string;
  claimUrl: string; // the brand's (or GitHub's) official page
  site: string; // the brand's homepage (logo source: npm run offers:logos)
  kind: "free" | "discount";
  via?: "github-pack" | "sheerid" | "unidays"; // how students verify, when it's a third party
  logo?: string; // file in public/offers/logos, written by npm run offers:logos from the brand's site; otherwise a lettered tile
  featured?: boolean; // shown on the homepage
};

export const offers: Offer[] = [
  { slug: "google-ai-plus-gemini", brand: "Google AI Plus (Gemini)", category: "ai", title: "Student plan free for 1 year", description: "More Gemini from Google for studying, writing and projects.", eligibility: "University students 18+, verified yearly", claimUrl: "https://gemini.google/students/", site: "https://gemini.google.com", logo: "google-ai-plus-gemini.webp", kind: "free", featured: true },
  { slug: "github-copilot", brand: "GitHub Copilot", category: "ai", title: "Copilot Student free: unlimited completions, chat and agent", description: "An AI pair programmer in VS Code, JetBrains IDEs and on GitHub.", eligibility: "Verified via GitHub Education (rechecked monthly)", claimUrl: "https://github.com/education/students", site: "https://github.com/features/copilot", logo: "github-copilot.svg", kind: "free", via: "github-pack" },
  { slug: "lovable", brand: "Lovable", category: "ai", title: "50% off Pro for 12 months", description: "Build working web apps by describing them in plain English.", eligibility: "School email or student ID", claimUrl: "https://lovable.dev/students", site: "https://lovable.dev", logo: "lovable.webp", kind: "discount" },
  { slug: "deepnote", brand: "Deepnote", category: "ai", title: "Team plan free (AI data notebooks)", description: "Collaborative data notebooks with AI help, for Python and SQL work.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://deepnote.com", logo: "deepnote.svg", kind: "free", via: "github-pack" },
  { slug: "camber", brand: "Camber", category: "ai", title: "Student plan free (coding agent for data work)", description: "A coding agent for data and research work that runs analysis on your own data.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://cambercloud.com", logo: "camber.webp", kind: "free", via: "github-pack" },
  { slug: "github-student-developer-pack", brand: "GitHub Student Developer Pack", category: "developer", title: "80+ partner tools free (domains, hosting, credits, courses)", description: "GitHub's bundle of real developer tools, free while you study. Many offers below come from it.", eligibility: "Students 13+ with school email or ID", claimUrl: "https://education.github.com/pack", site: "https://education.github.com", logo: "github-student-developer-pack.webp", kind: "free", featured: true },
  { slug: "github-pro", brand: "GitHub Pro", category: "developer", title: "Free Pro + 3,000 Actions minutes and 180 Codespaces hours a month", description: "GitHub's paid plan with more Actions minutes, Codespaces hours and private-repo features.", eligibility: "GitHub Education", claimUrl: "https://github.com/education/students", site: "https://github.com", logo: "github-pro.svg", kind: "free", via: "github-pack" },
  { slug: "github-codespaces", brand: "GitHub Codespaces", category: "developer", title: "Pro-level Codespaces access", description: "A full coding environment in the browser, ready in seconds.", eligibility: "GitHub Education", claimUrl: "https://education.github.com/pack", site: "https://github.com/features/codespaces", logo: "github-codespaces.svg", kind: "free", via: "github-pack" },
  { slug: "jetbrains", brand: "JetBrains", category: "developer", title: "All JetBrains IDEs free, renewed yearly", description: "Professional IDEs: IntelliJ IDEA, PyCharm, WebStorm, CLion and more.", eligibility: "School email, ISIC or GitHub Education", claimUrl: "https://www.jetbrains.com/academy/student-pack/", site: "https://jetbrains.com", logo: "jetbrains.webp", kind: "free", featured: true },
  { slug: "gitkraken-gitlens", brand: "GitKraken + GitLens", category: "developer", title: "Free 6 months, then up to 80% off Pro", description: "A visual Git client plus GitLens for VS Code.", eligibility: "GitHub Student Pack", claimUrl: "https://www.gitkraken.com/github-student-developer-pack-bundle", site: "https://gitkraken.com", logo: "gitkraken-gitlens.webp", kind: "free", via: "github-pack" },
  { slug: "tower", brand: "Tower", category: "developer", title: "6 months of Tower Pro free, then 70% off (up to 4 years)", description: "A polished Git client for Mac and Windows.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://git-tower.com", logo: "tower.svg", kind: "free", via: "github-pack" },
  { slug: "1password", brand: "1Password", category: "developer", title: "Free for 2 years, incl. developer tools", description: "A password manager, with SSH and secrets tools for developers.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://1password.com", logo: "1password.svg", kind: "free", via: "github-pack" },
  { slug: "termius", brand: "Termius", category: "developer", title: "Pro and Team features free while a student", description: "A modern SSH client for desktop and mobile.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://termius.com", logo: "termius.webp", kind: "free", via: "github-pack" },
  { slug: "clerk", brand: "Clerk", category: "developer", title: "Pro plan free while a student", description: "Ready-made sign-up, login and user management for your apps.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://clerk.com", logo: "clerk.svg", kind: "free", via: "github-pack" },
  { slug: "stripe", brand: "Stripe", category: "developer", title: "$25 in Stripe credits", description: "Payments for your projects; credits cover processing fees.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://stripe.com", logo: "stripe.svg", kind: "free", via: "github-pack" },
  { slug: "sentry", brand: "Sentry", category: "developer", title: "Free education account (50K errors, 100K transactions), renewable", description: "Error and performance monitoring that shows exactly where your code broke.", eligibility: "Students & teachers", claimUrl: "https://sentry.io/for/education/", site: "https://sentry.io", logo: "sentry.webp", kind: "free", via: "github-pack" },
  { slug: "new-relic", brand: "New Relic", category: "developer", title: "New Relic free while a student ($300/month value)", description: "Full-stack observability: logs, metrics and traces in one place.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://newrelic.com", logo: "new-relic.webp", kind: "free", via: "github-pack" },
  { slug: "datadog", brand: "Datadog", category: "developer", title: "Pro account with 10 servers, free for 2 years", description: "Monitoring for servers, apps and logs, used by big engineering teams.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://datadoghq.com", logo: "datadog.webp", kind: "free", via: "github-pack" },
  { slug: "doppler", brand: "Doppler", category: "developer", title: "Team plan free while a student", description: "Keeps API keys and secrets in sync across your projects.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://doppler.com", logo: "doppler.svg", kind: "free", via: "github-pack" },
  { slug: "browserstack", brand: "BrowserStack", category: "developer", title: "Automate Mobile plan free for 1 year", description: "Test websites and apps on real devices and browsers in the cloud.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://browserstack.com", logo: "browserstack.webp", kind: "free", via: "github-pack" },
  { slug: "lambdatest", brand: "LambdaTest", category: "developer", title: "Live plan free for 1 year", description: "Cross-browser testing on thousands of browser and OS combinations.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://lambdatest.com", logo: "lambdatest.webp", kind: "free", via: "github-pack" },
  { slug: "requestly", brand: "Requestly", category: "developer", title: "Professional plan free for 1 year (worth $270)", description: "Intercept, mock and debug HTTP requests while you build.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://requestly.com", logo: "requestly.webp", kind: "free", via: "github-pack" },
  { slug: "polypane", brand: "Polypane", category: "developer", title: "Individual plan free for 1 year", description: "A browser for developers that shows many screen sizes at once.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://polypane.app", logo: "polypane.webp", kind: "free", via: "github-pack" },
  { slug: "bootstrap-studio", brand: "Bootstrap Studio", category: "developer", title: "Free license while a student", description: "A drag-and-drop app for building responsive Bootstrap websites.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://bootstrapstudio.io", logo: "bootstrap-studio.webp", kind: "free", via: "github-pack" },
  { slug: "codecov", brand: "Codecov", category: "developer", title: "Free on public and private repos", description: "Code coverage reports on every pull request.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://about.codecov.io", logo: "codecov.webp", kind: "free", via: "github-pack" },
  { slug: "travis-ci", brand: "Travis CI", category: "developer", title: "Private builds free while a student", description: "Continuous integration that builds and tests your repos.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://travis-ci.com", logo: "travis-ci.webp", kind: "free", via: "github-pack" },
  { slug: "codescene", brand: "CodeScene", category: "developer", title: "Free student account for private repos", description: "Finds hotspots and technical debt in your codebase.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://codescene.com", logo: "codescene.webp", kind: "free", via: "github-pack" },
  { slug: "deepscan", brand: "DeepScan", category: "developer", title: "6 months free", description: "Static analysis that catches JavaScript and TypeScript bugs.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://deepscan.io", logo: "deepscan.webp", kind: "free", via: "github-pack" },
  { slug: "popsql", brand: "PopSQL", category: "developer", title: "Premium free while a student", description: "A collaborative SQL editor with charts and shared queries.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://popsql.com", logo: "popsql.webp", kind: "free", via: "github-pack" },
  { slug: "sqlgate", brand: "SQLGate", category: "developer", title: "Standard features free for 1 year", description: "A database IDE for MySQL, PostgreSQL, Oracle and more.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://sqlgate.com", kind: "free", via: "github-pack" },
  { slug: "configcat", brand: "ConfigCat", category: "developer", title: "Pro plan free while a student", description: "Feature flags to switch features on and off without redeploying.", eligibility: "GitHub Student Pack", claimUrl: "https://configcat.com/student/", site: "https://configcat.com", logo: "configcat.webp", kind: "free", via: "github-pack" },
  { slug: "devcycle", brand: "DevCycle", category: "developer", title: "Starter plan free for 1 year", description: "Feature flags and safe rollouts for your apps.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://devcycle.com", logo: "devcycle.svg", kind: "free", via: "github-pack" },
  { slug: "testmail", brand: "Testmail", category: "developer", title: "Essential plan free while a student", description: "Test email flows with unlimited inboxes and an API.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://testmail.app", logo: "testmail.webp", kind: "free", via: "github-pack" },
  { slug: "poeditor", brand: "POEditor", category: "developer", title: "Plus plan free for 1 year", description: "Translate and localise your apps with a team.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://poeditor.com", logo: "poeditor.webp", kind: "free", via: "github-pack" },
  { slug: "honeybadger", brand: "Honeybadger", category: "developer", title: "Small account free for 1 year", description: "Error tracking and uptime monitoring.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://honeybadger.io", logo: "honeybadger.svg", kind: "free", via: "github-pack" },
  { slug: "blackfire", brand: "Blackfire", category: "developer", title: "Developer subscription free", description: "Profiles code performance to find slow spots.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://blackfire.io", logo: "blackfire.webp", kind: "free", via: "github-pack" },
  { slug: "xojo", brand: "Xojo", category: "developer", title: "Xojo Pro license free while a student", description: "Build desktop, web and mobile apps with one language.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://xojo.com", logo: "xojo.webp", kind: "free", via: "github-pack" },
  { slug: "vaadin", brand: "Vaadin", category: "developer", title: "Pro subscription license free", description: "Build web apps in Java with ready-made UI components.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://vaadin.com", logo: "vaadin.webp", kind: "free", via: "github-pack" },
  { slug: "working-copy", brand: "Working Copy", category: "developer", title: "All Pro features free (Git on iPhone/iPad)", description: "A full Git client for iPhone and iPad.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://workingcopy.app", logo: "working-copy.webp", kind: "free", via: "github-pack" },
  { slug: "microsoft-visual-studio-dev-essentials", brand: "Microsoft Visual Studio Dev Essentials", category: "developer", title: "Visual Studio Community, Pluralsight access and Azure credit", description: "Microsoft's free developer bundle: Visual Studio, training and cloud credit.", eligibility: "Anyone (free)", claimUrl: "https://education.github.com/pack", site: "https://visualstudio.microsoft.com", logo: "microsoft-visual-studio-dev-essentials.webp", kind: "free", via: "github-pack" },
  { slug: "unity", brand: "Unity", category: "developer", title: "Unity Student plan free", description: "The game and real-time 3D engine behind many indie and mobile games.", eligibility: "Students 16+ at accredited institutions", claimUrl: "https://unity.com/products/unity-student", site: "https://unity.com", logo: "unity.svg", kind: "free" },
  { slug: "microsoft-azure-for-students", brand: "Microsoft Azure for Students", category: "cloud", title: "$100 credit + 25+ free services, no card, renews yearly", description: "Microsoft's cloud: VMs, databases, Azure OpenAI and more, with no card needed.", eligibility: "Students 18+ with school email", claimUrl: "https://azure.microsoft.com/en-us/free/students", site: "https://azure.microsoft.com", logo: "microsoft-azure-for-students.svg", kind: "free", featured: true },
  { slug: "heroku", brand: "Heroku", category: "cloud", title: "$13/month platform credit for 24 months", description: "Deploy apps with a git push, no server setup.", eligibility: "GitHub Student Pack, 18+", claimUrl: "https://www.heroku.com/github-students/", site: "https://heroku.com", logo: "heroku.webp", kind: "free", via: "github-pack" },
  { slug: "mongodb", brand: "MongoDB", category: "cloud", title: "$50 Atlas credit + free certification ($150 value)", description: "A popular document database, hosted on MongoDB Atlas.", eligibility: "GitHub Student Pack", claimUrl: "https://www.mongodb.com/students", site: "https://mongodb.com", logo: "mongodb.webp", kind: "free", via: "github-pack" },
  { slug: "appwrite", brand: "Appwrite", category: "cloud", title: "Education plan (Pro-level, 2 projects) free for 6 months", description: "An open-source backend: auth, database, storage and functions.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://appwrite.io", logo: "appwrite.svg", kind: "free", via: "github-pack" },
  { slug: "localstack", brand: "LocalStack", category: "cloud", title: "Free license for the AWS emulator", description: "Run AWS services on your own machine to build and test for free.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://localstack.cloud", logo: "localstack.webp", kind: "free", via: "github-pack" },
  { slug: "carto", brand: "CARTO", category: "cloud", title: "Account upgrades free for 2 years", description: "Maps and location analytics for spatial data projects.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://carto.com", logo: "carto.svg", kind: "free", via: "github-pack" },
  { slug: "namecheap", brand: "Namecheap", category: "cloud", title: "Free .me domain for 1 year + 1 SSL certificate", description: "Domains and hosting; your own .me address for a portfolio.", eligibility: "University students", claimUrl: "https://nc.me/", site: "https://namecheap.com", logo: "namecheap.webp", kind: "free", via: "github-pack" },
  { slug: "name-com", brand: "Name.com", category: "cloud", title: "Free domain on 25+ extensions (.dev, .app, .live…)", description: "Pick a free domain from 25+ endings like .dev, .app and .live.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://name.com", logo: "name-com.webp", kind: "free", via: "github-pack" },
  { slug: "tech-domains", brand: ".TECH Domains", category: "cloud", title: "Free .tech domain for 1 year", description: "A .tech domain for your portfolio or project.", eligibility: "GitHub Student Pack", claimUrl: "https://get.tech/github-student-developer-pack", site: "https://get.tech", kind: "free", via: "github-pack" },
  { slug: "github-pages", brand: "GitHub Pages", category: "cloud", title: "Free hosting: one personal site + unlimited project sites", description: "Free website hosting straight from a GitHub repo.", eligibility: "Anyone (free)", claimUrl: "https://pages.github.com/", site: "https://pages.github.com", logo: "github-pages.webp", kind: "free", via: "github-pack" },
  { slug: "arduino", brand: "Arduino", category: "cloud", title: "Arduino Cloud free for 6 months + hardware discounts", description: "Arduino Cloud to program and control your hardware projects online.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://arduino.cc", logo: "arduino.svg", kind: "free", via: "github-pack" },
  { slug: "adafruit", brand: "Adafruit", category: "cloud", title: "1 year of Adafruit IO+ + hardware discounts", description: "Adafruit IO to connect IoT projects, plus hardware discounts.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://adafruit.com", logo: "adafruit.webp", kind: "free", via: "github-pack" },
  { slug: "zyte", brand: "Zyte", category: "cloud", title: "1 Scrapy Cloud unit free forever", description: "Cloud hosting for Scrapy web-scraping spiders.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://zyte.com", logo: "zyte.webp", kind: "free", via: "github-pack" },
  { slug: "imgbot", brand: "Imgbot", category: "cloud", title: "Free image optimisation for private repos", description: "Automatically compresses the images in your repos.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://imgbot.net", logo: "imgbot.webp", kind: "free", via: "github-pack" },
  { slug: "simple-analytics", brand: "Simple Analytics", category: "cloud", title: "Starter plan free for 1 year (100k views/month)", description: "Privacy-friendly website analytics without cookies.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://simpleanalytics.com", logo: "simple-analytics.webp", kind: "free", via: "github-pack" },
  { slug: "pageclip", brand: "Pageclip", category: "cloud", title: "Basic plan free while a student", description: "A simple backend to collect form submissions from static sites.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://pageclip.co", kind: "free", via: "github-pack" },
  { slug: "astra-security", brand: "Astra Security", category: "cloud", title: "6 months of website firewall and malware scanner", description: "A website firewall and malware scanner.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://getastra.com", logo: "astra-security.webp", kind: "free", via: "github-pack" },
  { slug: "aws-educate", brand: "AWS Educate", category: "learning", title: "Free cloud labs and courses, no card", description: "Self-paced AWS courses and hands-on labs, with no card or credits needed.", eligibility: "Anyone 13+ with an email", claimUrl: "https://aws.amazon.com/education/awseducate/", site: "https://aws.amazon.com", logo: "aws-educate.webp", kind: "free" },
  { slug: "google-cloud-for-students", brand: "Google Cloud for Students", category: "learning", title: "Free labs, skill badges and courses (Google Skills)", description: "Hands-on Google Cloud labs and skill badges you can show employers.", eligibility: "Students", claimUrl: "https://cloud.google.com/edu/students", site: "https://cloud.google.com", logo: "google-cloud-for-students.webp", kind: "free" },
  { slug: "microsoft-learn-student-hub", brand: "Microsoft Learn Student Hub", category: "learning", title: "Free training, Azure credit and student programs", description: "Microsoft's free training paths, student programs and Azure credit in one place.", eligibility: "Students", claimUrl: "https://learn.microsoft.com/en-us/training/student-hub/", site: "https://learn.microsoft.com", logo: "microsoft-learn-student-hub.webp", kind: "free" },
  { slug: "nptel", brand: "NPTEL", category: "learning", title: "Free courses from the IITs and IISc (optional paid certificate exam)", description: "Courses from IIT and IISc professors; learning is free and the certificate exam is optional.", eligibility: "Anyone", claimUrl: "https://nptel.ac.in/", site: "https://nptel.ac.in", logo: "nptel.webp", kind: "free" },
  { slug: "cisco-networking-academy", brand: "Cisco Networking Academy", category: "learning", title: "Free courses in networking, cybersecurity and Python", description: "Courses in networking, cybersecurity, Python and IoT from Cisco.", eligibility: "Anyone", claimUrl: "https://www.netacad.com/", site: "https://netacad.com", logo: "cisco-networking-academy.svg", kind: "free" },
  { slug: "datacamp", brand: "DataCamp", category: "learning", title: "3 months free", description: "Interactive courses in Python, SQL, data science and AI.", eligibility: "GitHub Student Pack", claimUrl: "https://education.github.com/pack", site: "https://datacamp.com", logo: "datacamp.webp", kind: "free", via: "github-pack" },
  { slug: "educative", brand: "Educative", category: "learning", title: "6 months free + 30% off interview prep", description: "Text-based coding courses and interview prep with in-browser practice.", eligibility: "GitHub Student Pack", claimUrl: "https://www.educative.io/github-students", site: "https://educative.io", logo: "educative.webp", kind: "free", via: "github-pack" },
  { slug: "frontend-masters", brand: "Frontend Masters", category: "learning", title: "6 months of all courses free", description: "In-depth JavaScript, React and front-end courses by industry experts.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://frontendmasters.com", logo: "frontend-masters.webp", kind: "free", via: "github-pack" },
  { slug: "boot-dev", brand: "Boot.dev", category: "learning", title: "3 months free (Python, Go, backend, DevOps)", description: "A hands-on backend curriculum: Python, Go, SQL and DevOps.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://boot.dev", logo: "boot-dev.webp", kind: "free", via: "github-pack" },
  { slug: "scrimba", brand: "Scrimba", category: "learning", title: "1 month of Pro free", description: "Interactive screencasts where you edit the teacher's code.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://scrimba.com", logo: "scrimba.webp", kind: "free", via: "github-pack" },
  { slug: "codedex", brand: "Codédex", category: "learning", title: "1 month of Codédex Club free", description: "Beginner-friendly coding lessons with a game-like feel.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://codedex.io", logo: "codedex.svg", kind: "free", via: "github-pack" },
  { slug: "codecademy", brand: "Codecademy", category: "learning", title: "Pro Student up to 50% off", description: "Interactive courses and career paths in coding and data.", eligibility: "Student verification", claimUrl: "https://www.codecademy.com/student-center", site: "https://codecademy.com", logo: "codecademy.webp", kind: "discount" },
  { slug: "algoexpert", brand: "AlgoExpert", category: "learning", title: "20 interview questions free + 10% off", description: "Coding interview questions with video explanations.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://algoexpert.io", logo: "algoexpert.webp", kind: "discount", via: "github-pack" },
  { slug: "interview-cake", brand: "Interview Cake", category: "learning", title: "Full interview prep course free for 1 week", description: "A coding interview prep course that teaches how to approach problems.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://interviewcake.com", logo: "interview-cake.webp", kind: "free", via: "github-pack" },
  { slug: "gorails", brand: "GoRails", category: "learning", title: "All lessons free for 12 months", description: "Screencasts for learning Ruby on Rails.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://gorails.com", logo: "gorails.svg", kind: "free", via: "github-pack" },
  { slug: "symfonycasts", brand: "SymfonyCasts", category: "learning", title: "3 months free", description: "Video courses on PHP and the Symfony framework.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://symfonycasts.com", logo: "symfonycasts.webp", kind: "free", via: "github-pack" },
  { slug: "figma", brand: "Figma", category: "design", title: "Free Professional plan incl. AI tools", description: "The design tool for UI, prototypes and whiteboards, with AI built in.", eligibility: "Verified students", claimUrl: "https://www.figma.com/education/", site: "https://figma.com", logo: "figma.svg", kind: "free", featured: true },
  { slug: "framer", brand: "Framer", category: "design", title: "Free Basic plan (worth $120/yr) to host a portfolio", description: "Design and publish websites visually, with hosting and CMS.", eligibility: "Students", claimUrl: "https://www.framer.com/education/students/", site: "https://framer.com", logo: "framer.webp", kind: "free" },
  { slug: "sketch", brand: "Sketch", category: "design", title: "Free for 1 year (Mac, web and iPhone apps)", description: "UI design for Mac, with a web app for sharing and prototyping.", eligibility: "Students & educators", claimUrl: "https://www.sketch.com/education/", site: "https://sketch.com", logo: "sketch.svg", kind: "free" },
  { slug: "miro", brand: "Miro", category: "design", title: "Free Education plan", description: "An online whiteboard for group projects and brainstorming.", eligibility: "Students & educators", claimUrl: "https://miro.com/education-whiteboard/", site: "https://miro.com", logo: "miro.webp", kind: "free" },
  { slug: "visme", brand: "Visme", category: "design", title: "Starter plan free for 3 months", description: "Make presentations, infographics and reports.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://visme.co", logo: "visme.webp", kind: "free", via: "github-pack" },
  { slug: "icons8", brand: "Icons8", category: "design", title: "3 months of icons, photos, illustrations and music", description: "Icons, photos, illustrations and music for your projects.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://icons8.com", logo: "icons8.webp", kind: "free", via: "github-pack" },
  { slug: "iconscout", brand: "IconScout", category: "design", title: "60 premium icons a month for 1 year", description: "Premium icons, illustrations and 3D assets.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://iconscout.com", logo: "iconscout.webp", kind: "free", via: "github-pack" },
  { slug: "themeisle", brand: "Themeisle", category: "design", title: "Neve Agency WordPress theme free for 1 year", description: "Neve Agency, a fast WordPress theme with ready-made sites.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://themeisle.com", logo: "themeisle.webp", kind: "free", via: "github-pack" },
  { slug: "avid", brand: "Avid", category: "design", title: "Education pricing on Pro Tools and Sibelius", description: "Pro Tools for music production and Sibelius for notation.", eligibility: "University and school students", claimUrl: "https://www.avid.com/academic-eligibility", site: "https://avid.com", logo: "avid.svg", kind: "discount" },
  { slug: "ansys", brand: "Ansys", category: "engineering", title: "Free student versions of simulation software", description: "Industry-standard simulation software for engineering students.", eligibility: "Students", claimUrl: "https://ansys.synopsys.com/academic/students", site: "https://ansys.com", logo: "ansys.svg", kind: "free" },
  { slug: "mathematica", brand: "Mathematica", category: "engineering", title: "Student licences (semester, annual, 4-year)", description: "Wolfram's computing environment for maths, science and engineering.", eligibility: "Students", claimUrl: "https://www.wolfram.com/mathematica/pricing/students/", site: "https://wolfram.com", logo: "mathematica.svg", kind: "discount" },
  { slug: "labview-community-edition", brand: "LabVIEW Community Edition", category: "engineering", title: "Free for non-commercial use", description: "NI's graphical programming for measurement and control projects.", eligibility: "Anyone (non-commercial)", claimUrl: "https://www.ni.com/en/shop/labview/select-edition/labview-community-edition.html", site: "https://ni.com", logo: "labview-community-edition.webp", kind: "free" },
  { slug: "overleaf", brand: "Overleaf", category: "engineering", title: "40% academic discount + lower India pricing", description: "Write LaTeX papers and theses online, with collaborators.", eligibility: "Students at degree-granting institutions", claimUrl: "https://www.overleaf.com/user/subscription/plans", site: "https://overleaf.com", logo: "overleaf.svg", kind: "discount" },
  { slug: "wolfram-alpha", brand: "Wolfram|Alpha", category: "engineering", title: "Pro for Students pricing (step-by-step solutions)", description: "Step-by-step solutions for maths, physics and chemistry.", eligibility: "Students", claimUrl: "https://www.wolframalpha.com/pro/pricing/students", site: "https://wolframalpha.com", logo: "wolfram-alpha.webp", kind: "discount" },
  { slug: "notion", brand: "Notion", category: "productivity", title: "Education Plan free (+ extra AI via GitHub Pack)", description: "Notes, docs, tasks and wikis in one workspace.", eligibility: "Institution email", claimUrl: "https://www.notion.com/product/notion-for-education", site: "https://notion.com", logo: "notion.svg", kind: "free" },
  { slug: "microsoft-365", brand: "Microsoft 365", category: "productivity", title: "Office 365 A1 free (Word, Excel, PowerPoint, Teams)", description: "Word, Excel, PowerPoint, OneNote and Teams in the browser.", eligibility: "Eligible school email", claimUrl: "https://www.microsoft.com/en-in/education/products/office", site: "https://microsoft365.com", logo: "microsoft-365.webp", kind: "free" },
  { slug: "craft", brand: "Craft", category: "productivity", title: "Free Education plan for 1 year (renewable), or 40% off Plus", description: "A note-taking app with AI writing and real-time collaboration.", eligibility: "School email", claimUrl: "https://www.craft.do/education", site: "https://craft.do", logo: "craft.webp", kind: "free" },
  { slug: "evernote", brand: "Evernote", category: "productivity", title: "40% off Advanced (annual)", description: "Capture notes, web pages and handouts and find them anywhere.", eligibility: "New subscribers, UNiDAYS", claimUrl: "https://evernote.com/unidays", site: "https://evernote.com", logo: "evernote.svg", kind: "discount", via: "unidays" },
  { slug: "dashlane", brand: "Dashlane", category: "productivity", title: "Premium free for 6 months", description: "A password manager with a built-in VPN.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://dashlane.com", logo: "dashlane.webp", kind: "free", via: "github-pack" },
  { slug: "pomodone", brand: "PomoDone", category: "productivity", title: "Lite plan free for 2 years", description: "A Pomodoro timer that works with your task lists.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://pomodoneapp.com", logo: "pomodone.webp", kind: "free", via: "github-pack" },
  { slug: "todiagram", brand: "ToDiagram", category: "productivity", title: "Pro plan free", description: "Turn JSON, YAML and other data into interactive diagrams.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://todiagram.com", logo: "todiagram.webp", kind: "free", via: "github-pack" },
  { slug: "hazeover", brand: "HazeOver", category: "productivity", title: "Free app licence (Mac)", description: "Dims background windows on your Mac to help you focus.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://hazeover.com", logo: "hazeover.webp", kind: "free", via: "github-pack" },
  { slug: "appfigures", brand: "Appfigures", category: "productivity", title: "Analytics free for 1 year", description: "App store analytics and rankings for your apps.", eligibility: "Verified students", claimUrl: "https://education.github.com/pack", site: "https://appfigures.com", logo: "appfigures.webp", kind: "free", via: "github-pack" },
  { slug: "spotify-premium-student", brand: "Spotify Premium Student", category: "lifestyle", title: "₹69 for 2 months, then ₹69/month (up to 4 years)", description: "Ad-free music, offline downloads and unlimited skips.", eligibility: "18+, accredited college (SheerID)", claimUrl: "https://www.spotify.com/in-en/student/", site: "https://spotify.com", logo: "spotify-premium-student.webp", kind: "discount", via: "sheerid", featured: true },
  { slug: "apple-education-store", brand: "Apple Education Store", category: "lifestyle", title: "Education pricing on Mac and iPad (+ seasonal Back to School gifts)", description: "Apple's education prices on Mac and iPad, with seasonal Back to School extras.", eligibility: "College students, newly accepted students, parents", claimUrl: "https://www.apple.com/in-edu/store", site: "https://apple.com", logo: "apple-education-store.webp", kind: "discount", via: "unidays" },
  { slug: "samsung-student-advantage", brand: "Samsung Student Advantage", category: "lifestyle", title: "Up to 10% off, no-cost EMI and upgrade bonus", description: "Samsung's student store for phones, tablets and laptops.", eligibility: "Student email ID", claimUrl: "https://www.samsung.com/in/offer/student-discount/", site: "https://samsung.com", logo: "samsung-student-advantage.webp", kind: "discount" },
  { slug: "isic-india", brand: "ISIC India", category: "lifestyle", title: "International Student ID: discounts in India and 100 countries", description: "The international student ID card, with discounts in India and abroad.", eligibility: "Students (paid card)", claimUrl: "https://www.isic.co.in/", site: "https://isic.co.in", logo: "isic-india.webp", kind: "free" },
];
