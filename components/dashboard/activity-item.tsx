import Image from "next/image";

type ActivityItemProps = {
  title: string;
  description: string;
  time: string;
  icon: string;
};

export function ActivityItem({
  title,
  description,
  time,
  icon,
}: ActivityItemProps) {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        <Image src={icon} alt="Icon" width={24} height={24} className={`w-12 h-12`} />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="text-lg lg:text-xl font-medium text-secondary-500">
          {title}
        </h3>
        <div className="flex flex-col gap-2">
          <p className="text-sm lg:text-base font-normal text-secondary-500 lg:text-neutral-500">
            {description}
          </p>
          <p className="text-sm lg:text-base font-normal text-secondary-500 lg:text-neutral-500">
            {time}
          </p>
        </div>
      </div>
    </div>
  );
}

