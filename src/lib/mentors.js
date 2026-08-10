/**
 * Mentors directory helpers.
 *
 * Source of truth for WHO is a mentor: public.mentor_profiles (user_id).
 * Public site shows is_active = true profiles.
 * Display fields are enriched from mentor_data + users.
 */

import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { nameToSlug } from "@/lib/slugUtils";

const PROFILE_SELECT =
  "id, user_id, slug, is_active, headline, current_role, current_organization, expertise, years_experience, bio, linkedin_url, portfolio_url, experiences, professional_status, company_url, designation, created_at";

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function titleFromSlug(slug) {
  if (!slug || typeof slug !== "string") return null;
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function nonEmpty(value) {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/**
 * Derive a public company logo URL from a company website URL.
 * Uses Clearbit Logo API with Google Favicon as a soft fallback option for callers.
 */
export function getCompanyLogoUrl(companyUrl) {
  if (!companyUrl || typeof companyUrl !== "string") return null;

  try {
    const normalized = companyUrl.trim().startsWith("http")
      ? companyUrl.trim()
      : `https://${companyUrl.trim()}`;
    const hostname = new URL(normalized).hostname.replace(/^www\./i, "");
    if (!hostname) return null;
    return `https://logo.clearbit.com/${hostname}`;
  } catch {
    return null;
  }
}

export function getCompanyLogoFallbackUrl(companyUrl) {
  if (!companyUrl || typeof companyUrl !== "string") return null;

  try {
    const normalized = companyUrl.trim().startsWith("http")
      ? companyUrl.trim()
      : `https://${companyUrl.trim()}`;
    const hostname = new URL(normalized).hostname.replace(/^www\./i, "");
    if (!hostname) return null;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return null;
  }
}

/**
 * Make profile images loadable for anonymous visitors.
 * Converts expired/auth-only signed storage URLs to public object URLs.
 */
export function resolveProfileUrl(supabase, profileUrl) {
  if (!profileUrl || typeof profileUrl !== "string") return null;

  let url = profileUrl.trim();
  if (!url) return null;

  if (url.includes("/storage/v1/object/sign/")) {
    url = url
      .replace("/storage/v1/object/sign/", "/storage/v1/object/public/")
      .replace(/([?&])token=[^&]*/g, "")
      .replace(/\?&/, "?")
      .replace(/[?&]$/, "")
      .replace(/\?$/, "");
    return url;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const path = url.replace(/^\/+/, "");
  const objectPath = path.startsWith("media/")
    ? path.slice("media/".length)
    : path;

  const { data } = supabase.storage.from("media").getPublicUrl(objectPath);
  return data?.publicUrl || null;
}

function createPrivilegedClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const serviceKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    ""
  ).trim();

  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function getClients() {
  const anon = await createServerSupabaseClient();
  const admin = createPrivilegedClient();
  return { anon, admin, read: admin || anon };
}

export function normalizeMentor({
  dataRow = null,
  profileRow = null,
  userRow = null,
  supabase = null,
} = {}) {
  const userId = profileRow?.user_id || dataRow?.user_id || userRow?.id;
  if (!userId) return null;

  const name =
    nonEmpty(dataRow?.name) ||
    nonEmpty(userRow?.full_name) ||
    titleFromSlug(profileRow?.slug) ||
    null;

  const expertise = asArray(profileRow?.expertise).length
    ? asArray(profileRow.expertise)
    : asArray(dataRow?.expertise_area);

  const experienceYears =
    profileRow?.years_experience ||
    dataRow?.experience_years ||
    null;

  const bio = nonEmpty(profileRow?.bio) || nonEmpty(dataRow?.bio) || "";

  const currentRole =
    nonEmpty(profileRow?.designation) ||
    nonEmpty(profileRow?.current_role) ||
    nonEmpty(dataRow?.current_role) ||
    nonEmpty(profileRow?.headline) ||
    null;

  const designation =
    nonEmpty(profileRow?.designation) || currentRole;

  const companyUrl = nonEmpty(profileRow?.company_url);

  const slug =
    nonEmpty(profileRow?.slug) ||
    (name ? nameToSlug(name) : null) ||
    userId;

  const profileUrl =
    nonEmpty(dataRow?.profile_url) ||
    nonEmpty(userRow?.avatar_url) ||
    null;

  return {
    user_id: userId,
    name,
    email: dataRow?.email || userRow?.email || null,
    bio,
    current_role: currentRole,
    designation,
    company_url: companyUrl,
    companyLogoUrl: getCompanyLogoUrl(companyUrl),
    companyLogoFallbackUrl: getCompanyLogoFallbackUrl(companyUrl),
    headline: nonEmpty(profileRow?.headline),
    current_organization: nonEmpty(profileRow?.current_organization),
    Industry: nonEmpty(dataRow?.Industry),
    location: nonEmpty(dataRow?.location),
    expertise_area: expertise,
    experience_years: experienceYears,
    badge: nonEmpty(dataRow?.badge),
    professional_status: nonEmpty(profileRow?.professional_status),
    profile_url: profileUrl,
    profilePicUrl: supabase
      ? resolveProfileUrl(supabase, profileUrl)
      : profileUrl,
    youtube: nonEmpty(dataRow?.youtube),
    linkedin_url:
      nonEmpty(profileRow?.linkedin_url) ||
      nonEmpty(dataRow?.linkedin_url) ||
      null,
    portfolio_url:
      nonEmpty(profileRow?.portfolio_url) ||
      nonEmpty(dataRow?.portfolio_url) ||
      null,
    github_url: nonEmpty(dataRow?.github_url),
    languages_spoken: asArray(dataRow?.languages_spoken),
    past_experience: profileRow?.experiences || dataRow?.past_experience || null,
    reviews: dataRow?.reviews || null,
    status: dataRow?.status || null,
    is_active: profileRow?.is_active ?? null,
    slug,
    profile_id: profileRow?.id || null,
    created_at: profileRow?.created_at || dataRow?.created_at || null,
  };
}

async function fetchUsersByIds(client, userIds) {
  if (!userIds.length) return [];

  const { data, error } = await client
    .from("users")
    .select("id, email, full_name, avatar_url")
    .in("id", userIds);

  if (error) {
    console.warn("users enrich failed:", error.message);
    return [];
  }
  return data || [];
}

async function fetchMentorDataByUserIds(client, userIds) {
  if (!userIds.length) return [];

  const { data, error } = await client
    .from("mentor_data")
    .select("*")
    .in("user_id", userIds);

  if (error) {
    console.warn("mentor_data enrich failed:", error.message);
    return [];
  }
  return data || [];
}

/**
 * Public mentors directory.
 * Master list = mentor_profiles (is_active), enriched by mentor_data + users.
 */
export async function fetchPublicMentors({ badge = null, limit = null } = {}) {
  const { anon, read } = await getClients();

  // 1) Master list from mentor_profiles
  const { data: profiles, error: profilesError } = await anon
    .from("mentor_profiles")
    .select(PROFILE_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (profilesError) {
    throw new Error(`mentor_profiles fetch failed: ${profilesError.message}`);
  }

  const activeProfiles = profiles || [];
  if (!activeProfiles.length) return [];

  const userIds = activeProfiles.map((p) => p.user_id);

  // 2) Enrich from mentor_data + users
  const [dataRows, userRows] = await Promise.all([
    fetchMentorDataByUserIds(read, userIds),
    fetchUsersByIds(read, userIds),
  ]);

  const dataByUserId = new Map(dataRows.map((row) => [row.user_id, row]));
  const userById = new Map(userRows.map((row) => [row.id, row]));

  let mentors = activeProfiles
    .map((profile) => {
      const dataRow = dataByUserId.get(profile.user_id) || null;

      if (badge) {
        const mentorBadge = dataRow?.badge;
        if (
          !mentorBadge ||
          !String(mentorBadge)
            .toLowerCase()
            .includes(String(badge).toLowerCase())
        ) {
          return null;
        }
      }

      return normalizeMentor({
        profileRow: profile,
        dataRow,
        userRow: userById.get(profile.user_id) || null,
        supabase: anon,
      });
    })
    .filter(Boolean);

  mentors.sort((a, b) => {
    if (a.profilePicUrl && !b.profilePicUrl) return -1;
    if (!a.profilePicUrl && b.profilePicUrl) return 1;
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  if (limit) mentors = mentors.slice(0, limit);
  return mentors;
}

/**
 * Resolve a single public mentor by UUID, profile slug, or name slug.
 * Always starts from mentor_profiles when possible.
 */
export async function fetchPublicMentorByParam(param) {
  if (!param) return null;

  const { anon, read } = await getClients();
  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      param
    );

  let profile = null;

  if (isUUID) {
    const { data } = await anon
      .from("mentor_profiles")
      .select("*")
      .eq("user_id", param)
      .maybeSingle();
    profile = data;
  } else {
    const { data: bySlug } = await anon
      .from("mentor_profiles")
      .select("*")
      .eq("slug", param)
      .maybeSingle();
    profile = bySlug;

    // Fallback: find via mentor_data name, then load profile by user_id
    if (!profile) {
      const nameGuess = titleFromSlug(param);
      const { data: byName } = await read
        .from("mentor_data")
        .select("user_id")
        .ilike("name", nameGuess)
        .limit(1);

      const userId = byName?.[0]?.user_id;
      if (userId) {
        const { data } = await anon
          .from("mentor_profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        profile = data;
      } else {
        const { data: fuzzy } = await read
          .from("mentor_data")
          .select("user_id")
          .ilike("name", `%${nameGuess}%`)
          .limit(1);
        const fuzzyId = fuzzy?.[0]?.user_id;
        if (fuzzyId) {
          const { data } = await anon
            .from("mentor_profiles")
            .select("*")
            .eq("user_id", fuzzyId)
            .maybeSingle();
          profile = data;
        }
      }
    }
  }

  // Public profiles only
  if (!profile || profile.is_active !== true) return null;

  const [dataRows, userRows] = await Promise.all([
    fetchMentorDataByUserIds(read, [profile.user_id]),
    fetchUsersByIds(read, [profile.user_id]),
  ]);

  return normalizeMentor({
    profileRow: profile,
    dataRow: dataRows[0] || null,
    userRow: userRows[0] || null,
    supabase: anon,
  });
}
