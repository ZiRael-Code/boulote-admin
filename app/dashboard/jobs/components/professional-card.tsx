"use client";

export type ProfessionalCardData = {
  initials: string;
  name: string;
  role: string;
  reviewCount: number;
  successRate: number;
  yearsExperience: number;
  projectsCompleted: number;
  aiMatch: string;
  skills: string[];
};

export type MatchScoreData = {
  matchScore: number;
  reasoning: string;
};

type ProfessionalCardProps = {
  professional: ProfessionalCardData;
  matchScore?: MatchScoreData;
  isSelected?: boolean;
  onSelect?: () => void;
};

export function ProfessionalCard({
  professional,
  matchScore,
  isSelected,
  onSelect,
}: ProfessionalCardProps) {
  return (
    <div
      className={`border rounded-md p-6 flex gap-4 items-start cursor-pointer transition-all ${
        isSelected
          ? "border-primary-500 bg-primary-50"
          : "border-border-500 hover:border-primary-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex-1 flex gap-4">
        <div className="w-[70px] h-[70px] rounded-full bg-[#CFD3D7] flex items-center justify-center shrink-0">
          <span className="text-[16.8px] font-medium">{professional.initials}</span>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4">
              <p className="text-base font-medium text-secondary-500">
                {professional.name}
              </p>
              <p className="text-base font-normal text-neutral-500">
                {professional.role}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-warning-500 text-2xl">★</span>
              <p className="text-base font-normal text-neutral-500">
                ({professional.reviewCount} reviews) • {professional.successRate}% success rate
              </p>
            </div>
            {matchScore && (
              <div className="mt-2 bg-primary-50 p-2 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary-600">
                    {matchScore.matchScore}% Match
                  </span>
                </div>
                {matchScore.reasoning && (
                  <p className="text-xs text-neutral-600 mt-1">
                    {matchScore.reasoning}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                {professional.yearsExperience}+
              </p>
              <p className="text-xs font-normal text-neutral-500">YEARS EXP</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                {professional.projectsCompleted}
              </p>
              <p className="text-xs font-normal text-neutral-500">PROJECTS</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                {matchScore ? `${matchScore.matchScore}%` : professional.aiMatch}
              </p>
              <p className="text-xs font-normal text-neutral-500">AI MATCH</p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            {professional.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]"
              >
                <span className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <input
        type="checkbox"
        checked={isSelected || false}
        onChange={onSelect}
        onClick={(e) => e.stopPropagation()}
        className="w-6 h-6 shrink-0 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
      />
    </div>
  );
}
