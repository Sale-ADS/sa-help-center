import Image from 'next/image';

export function DocsNavBrand() {
  return (
    <span className="inline-flex items-center">
      <Image
        src="/images/saleads-app-icon.png"
        alt="SaleAds.ai"
        width={30}
        height={30}
        className="h-[30px] w-[30px] rounded-lg object-cover"
        priority
      />
    </span>
  );
}
