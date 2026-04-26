import { ProductEditorPage } from "../[id]/page";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; slug?: string; sku?: string }>;
}) {
  const resolvedSearchParams = searchParams
    ? await searchParams
    : await Promise.resolve<{ error?: string; slug?: string; sku?: string }>(
        {},
      );

  return (
    <ProductEditorPage
      productId={null}
      errorCode={resolvedSearchParams.error}
      errorSlug={resolvedSearchParams.slug}
      errorSku={resolvedSearchParams.sku}
    />
  );
}
