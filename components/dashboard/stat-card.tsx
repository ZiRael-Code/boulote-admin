import Image from "next/image";

type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon?: string;
};

export function StatCard({ title, value, change, changePositive = true, icon = "/assets/icon/dashboard/people.svg" }: StatCardProps) {
  return (
    <div className="bg-white border border-border-500 rounded-md p-4 lg:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg lg:text-base font-normal text-secondary-500">
          {title}
        </p>
        <Image src={icon} alt="" width={24} height={24}/>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-2xl font-semibold text-secondary-500">{value}</p>
        {change && (
          <p
            className={`text-[10px] lg:text-xs font-medium lg:font-normal ${
              changePositive ? "text-success-800" : "text-error-600"
            }`}
          >
            {change}
          </p>
        )}
      </div>
    </div>
  );
}

