export default async function SeoulDistrictPage({
  params: _params,
}: {
  params: Promise<{ districtSlug: string }>;
}) {
  await _params;
  return null;
}
