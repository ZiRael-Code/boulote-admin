import Image from "next/image";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
};

export function StatCard({ title, value, change }: StatCardProps) {
  return (
    <div className="bg-white border border-border-500 rounded-md p-4 lg:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg lg:text-base font-normal text-secondary-500">
          {title}
        </p>
        <Image src="/assets/icon/dashboard/people.svg" alt="Icon" width={24} height={24}/>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-2xl font-semibold text-secondary-500">{value}</p>
        <p className="text-[10px] lg:text-xs font-medium lg:font-normal text-success-800">
          {change}
        </p>
      </div>
    </div>
  );
}

