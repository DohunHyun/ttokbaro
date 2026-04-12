export const DASHBOARD_REGIONS = {
  seoul: {
    slug: "seoul",
    label: "서울",
    headline: "서울 선거 대시보드",
    supported: true,
    scopeLabel: "특별시",
  },
  incheon: {
    slug: "incheon",
    label: "인천",
    headline: "인천 선거 대시보드",
    supported: false,
    scopeLabel: "광역시",
  },
  busan: {
    slug: "busan",
    label: "부산",
    headline: "부산 선거 대시보드",
    supported: false,
    scopeLabel: "광역시",
  },
  daegu: {
    slug: "daegu",
    label: "대구",
    headline: "대구 선거 대시보드",
    supported: false,
    scopeLabel: "광역시",
  },
  gwangju: {
    slug: "gwangju",
    label: "광주",
    headline: "광주 선거 대시보드",
    supported: false,
    scopeLabel: "광역시",
  },
  daejeon: {
    slug: "daejeon",
    label: "대전",
    headline: "대전 선거 대시보드",
    supported: false,
    scopeLabel: "광역시",
  },
  ulsan: {
    slug: "ulsan",
    label: "울산",
    headline: "울산 선거 대시보드",
    supported: false,
    scopeLabel: "광역시",
  },
  sejong: {
    slug: "sejong",
    label: "세종",
    headline: "세종 선거 대시보드",
    supported: false,
    scopeLabel: "특별자치시",
  },
  gyeonggi: {
    slug: "gyeonggi",
    label: "경기",
    headline: "경기 선거 대시보드",
    supported: false,
    scopeLabel: "도",
  },
  gangwon: {
    slug: "gangwon",
    label: "강원",
    headline: "강원 선거 대시보드",
    supported: false,
    scopeLabel: "특별자치도",
  },
  chungbuk: {
    slug: "chungbuk",
    label: "충북",
    headline: "충북 선거 대시보드",
    supported: false,
    scopeLabel: "도",
  },
  chungnam: {
    slug: "chungnam",
    label: "충남",
    headline: "충남 선거 대시보드",
    supported: false,
    scopeLabel: "도",
  },
  jeonbuk: {
    slug: "jeonbuk",
    label: "전북",
    headline: "전북 선거 대시보드",
    supported: false,
    scopeLabel: "특별자치도",
  },
  jeonnam: {
    slug: "jeonnam",
    label: "전남",
    headline: "전남 선거 대시보드",
    supported: false,
    scopeLabel: "도",
  },
  gyeongbuk: {
    slug: "gyeongbuk",
    label: "경북",
    headline: "경북 선거 대시보드",
    supported: false,
    scopeLabel: "도",
  },
  gyeongnam: {
    slug: "gyeongnam",
    label: "경남",
    headline: "경남 선거 대시보드",
    supported: false,
    scopeLabel: "도",
  },
  jeju: {
    slug: "jeju",
    label: "제주",
    headline: "제주 선거 대시보드",
    supported: false,
    scopeLabel: "특별자치도",
  },
} as const;

export type DashboardRegionSlug = keyof typeof DASHBOARD_REGIONS;

export const DASHBOARD_ELECTIONS = [
  {
    electionType: "SUPERINTENDENT",
    electionSlug: "superintendent",
    fallbackLabel: "교육감",
  },
  {
    electionType: "MAYOR",
    electionSlug: "mayor",
    fallbackLabel: "광역단체장",
  },
  {
    electionType: "DISTRICT_HEAD",
    electionSlug: "district-head",
    fallbackLabel: "기초단체장",
  },
  {
    electionType: "CITY_COUNCIL_DISTRICT",
    electionSlug: "city-council-district",
    fallbackLabel: "지역구 시의원",
  },
  {
    electionType: "CITY_COUNCIL_PR",
    electionSlug: "city-council-pr",
    fallbackLabel: "비례대표 시의원",
  },
  {
    electionType: "DISTRICT_COUNCIL_DISTRICT",
    electionSlug: "district-council-district",
    fallbackLabel: "지역구 구의원",
  },
  {
    electionType: "DISTRICT_COUNCIL_PR",
    electionSlug: "district-council-pr",
    fallbackLabel: "비례대표 구의원",
  },
] as const;

export type DashboardElectionType = (typeof DASHBOARD_ELECTIONS)[number]["electionType"];
export type DashboardElectionSlug = (typeof DASHBOARD_ELECTIONS)[number]["electionSlug"];

export function getDashboardRegion(regionSlug: string) {
  return DASHBOARD_REGIONS[regionSlug as DashboardRegionSlug] ?? null;
}

export function getElectionByType(electionType: string) {
  return (
    DASHBOARD_ELECTIONS.find((item) => item.electionType === electionType) ?? null
  );
}

export function getElectionBySlug(electionSlug: string) {
  return (
    DASHBOARD_ELECTIONS.find((item) => item.electionSlug === electionSlug) ?? null
  );
}

export function electionTypeToSlug(electionType: string) {
  return getElectionByType(electionType)?.electionSlug ?? null;
}

export function electionSlugToType(electionSlug: string) {
  return getElectionBySlug(electionSlug)?.electionType ?? null;
}

export const SEOUL_DISTRICTS = [
  { slug: "jongno", label: "종로구", group: "도심권" },
  { slug: "jung", label: "중구", group: "도심권" },
  { slug: "yongsan", label: "용산구", group: "도심권" },
  { slug: "seongdong", label: "성동구", group: "동북권" },
  { slug: "gwangjin", label: "광진구", group: "동북권" },
  { slug: "dongdaemun", label: "동대문구", group: "동북권" },
  { slug: "jungnang", label: "중랑구", group: "동북권" },
  { slug: "seongbuk", label: "성북구", group: "동북권" },
  { slug: "gangbuk", label: "강북구", group: "동북권" },
  { slug: "dobong", label: "도봉구", group: "동북권" },
  { slug: "nowon", label: "노원구", group: "동북권" },
  { slug: "eunpyeong", label: "은평구", group: "서북권" },
  { slug: "seodaemun", label: "서대문구", group: "서북권" },
  { slug: "mapo", label: "마포구", group: "서북권" },
  { slug: "yangcheon", label: "양천구", group: "서남권" },
  { slug: "gangseo", label: "강서구", group: "서남권" },
  { slug: "guro", label: "구로구", group: "서남권" },
  { slug: "geumcheon", label: "금천구", group: "서남권" },
  { slug: "yeongdeungpo", label: "영등포구", group: "서남권" },
  { slug: "dongjak", label: "동작구", group: "서남권" },
  { slug: "gwanak", label: "관악구", group: "서남권" },
  { slug: "seocho", label: "서초구", group: "동남권" },
  { slug: "gangnam", label: "강남구", group: "동남권" },
  { slug: "songpa", label: "송파구", group: "동남권" },
  { slug: "gangdong", label: "강동구", group: "동남권" },
] as const;

export type SeoulDistrictSlug = (typeof SEOUL_DISTRICTS)[number]["slug"];

export function getSeoulDistrict(districtSlug: string) {
  return SEOUL_DISTRICTS.find((district) => district.slug === districtSlug) ?? null;
}
