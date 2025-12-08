"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X, FileText } from "lucide-react";
import Button from "@/components/ui/button";

export default function ApplicationReviewPage() {
  const router = useRouter();
  const [qualityAssessment, setQualityAssessment] = useState("excellent");
  const [experienceLevel, setExperienceLevel] = useState("mid-level");
  const [reviewNotes, setReviewNotes] = useState(
    "Strong technical background with relevant experience in data science and ML. Portfolio demonstrates practical application of skills. Resume is well-structured and shows career progression. All required documents provided. Recommended for approval."
  );
  const [recommendForMentor, setRecommendForMentor] = useState(false);

  return (
    <div className="flex flex-col gap-8 px-8 py-8 max-w-7xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold text-secondary-500">Application Review</h1>
      </div>

      <div className="bg-[#FCFDCA8F] border border-[#FFD46982] rounded-lg p-4 flex items-center justify-between">
        <div className="">
          <p className="text-lg font-semibold">Pending Review</p>
          <p className="text-sm text-neutral-500 mt-4 ">
            Applied on March 12, 2024 - Waiting 4 days
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-success-500 text-white px-6 py-2 h-auto">
            <span className="text-sm font-medium">Approve</span>
          </Button>
          <Button className="bg-error-500 text-white px-6 py-2 h-auto">
            <span className="text-sm font-medium">Reject</span>
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-[#C7D7E8] flex items-center justify-center shrink-0">
          <span className="text-2xl font-medium text-secondary-500">JD</span>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-secondary-500">John Doe</h2>
          <p className="text-base text-secondary-500">Senior Frontend Developer</p>
        </div>
      </div>

      <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-6">
        <h3 className="text-lg font-semibold text-secondary-500">Review Checklist</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-secondary-500">Professional Information Complete</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-secondary-500">Resume Uploaded</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-secondary-500">Portfolio/work samples</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-secondary-500">References (optional - Not provided)</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-secondary-500">Professional experience detailed</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-secondary-500">Skills & Expertise listed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">FULL NAME</p>
          <p className="text-sm text-secondary-500">John Doe</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">EMAIL</p>
          <p className="text-sm text-secondary-500">johndoe@gmail.com</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">PHONE NUMBER</p>
          <p className="text-sm text-secondary-500">+234-5672-7387</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">LOCATION</p>
          <p className="text-sm text-secondary-500">Lagos, Nigeria</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">EXPERIENCE LEVEL</p>
          <p className="text-sm text-secondary-500">Senior (5+ years)</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">LINKEDIN PROFILE</p>
          <p className="text-sm text-primary-500">Link</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-secondary-500">Professional Summary</h3>
        <p className="text-sm text-secondary-500 leading-relaxed">
          Experienced full-stack developer with 5+ years of expertise in modern web technologies. Passionate about creating scalable, user-friendly
          applications. Strong background in both frontend and backend development with a focus on clean, maintainable code.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-secondary-500">Primary skills</h3>
        <div className="flex flex-wrap gap-3">
          {["React", "Typescript", "Javascript", "Node.js", "HTML/CSS", "Git", "Figma", "Power BI", "Terminal flow"].map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-primary-50 rounded-full text-sm text-secondary-500"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-secondary-500">Work Experience</h3>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold text-secondary-500">Data Scientist</p>
                <p className="text-sm text-neutral-500">Techcorp Analytics - Jan 2022-Present</p>
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li className="text-sm text-secondary-500">Developed Predictive models that improved customer retention by 2%</li>
              <li className="text-sm text-secondary-500">Developed Predictive models that improved customer retention by 2%</li>
              <li className="text-sm text-secondary-500">Developed Predictive models that improved customer retention by 2%</li>
              <li className="text-sm text-secondary-500">Developed Predictive models that improved customer retention by 2%</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold text-secondary-500">Junior Data Analyst</p>
                <p className="text-sm text-neutral-500">Techcorp Analytics - Jan 2022-Present</p>
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li className="text-sm text-secondary-500">Developed Predictive models that improved customer retention by 2%</li>
              <li className="text-sm text-secondary-500">Developed Predictive models that improved customer retention by 2%</li>
              <li className="text-sm text-secondary-500">Developed Predictive models that improved customer retention by 2%</li>
              <li className="text-sm text-secondary-500">Developed Predictive models that improved customer retention by 2%</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-secondary-500">Education & Certifications</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold text-secondary-500">Master of Science in Data Science</p>
            <p className="text-sm text-neutral-500">New York University - 2019-2021</p>
            <p className="text-sm text-neutral-500">GPA: 3.8/4.0</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold text-secondary-500">Certifications</p>
            <ul className="list-disc pl-5 space-y-1">
              <li className="text-sm text-secondary-500">Google Cloud professional Data Engineer</li>
              <li className="text-sm text-secondary-500">AWSNCertified Machine Learning</li>
              <li className="text-sm text-secondary-500">Google Cloud professional Data Engineer</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-secondary-500">Uploaded Documents</h3>
        <div className="flex flex-col gap-3">
          <div className="border border-border-500 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-10 h-10 text-neutral-500" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-secondary-500">Resume.pdf</p>
                <p className="text-xs text-neutral-500">Uploaded Mar 12, 2024</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border border-neutral-500 px-6 py-2">
                <span className="text-sm">View</span>
              </Button>
              <Button variant="outline" className="border border-neutral-500 px-6 py-2">
                <span className="text-sm">Download</span>
              </Button>
            </div>
          </div>

          <div className="border border-border-500 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-10 h-10 text-neutral-500" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-secondary-500">Portfolio & Projects</p>
                <p className="text-xs text-neutral-500">Uploaded Mar 12, 2024</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border border-neutral-500 px-6 py-2">
                <span className="text-sm">View</span>
              </Button>
              <Button variant="outline" className="border border-neutral-500 px-6 py-2">
                <span className="text-sm">Download</span>
              </Button>
            </div>
          </div>

          <div className="border border-border-500 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-10 h-10 text-neutral-500" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-secondary-500">Certificates.pdf</p>
                <p className="text-xs text-neutral-500">3 certifications</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border border-neutral-500 px-6 py-2">
                <span className="text-sm">View</span>
              </Button>
              <Button variant="outline" className="border border-neutral-500 px-6 py-2">
                <span className="text-sm">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-secondary-500">Admin Assessment</h3>
        
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-secondary-500">Quality Assessment</p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="quality"
                checked={qualityAssessment === "excellent"}
                onChange={() => setQualityAssessment("excellent")}
                className="w-4 h-4"
              />
              <span className="text-sm text-secondary-500">Excellent</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="quality"
                checked={qualityAssessment === "good"}
                onChange={() => setQualityAssessment("good")}
                className="w-4 h-4"
              />
              <span className="text-sm text-secondary-500">Good</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="quality"
                checked={qualityAssessment === "needs-improvement"}
                onChange={() => setQualityAssessment("needs-improvement")}
                className="w-4 h-4"
              />
              <span className="text-sm text-secondary-500">Need Improvement</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="quality"
                checked={qualityAssessment === "insufficient"}
                onChange={() => setQualityAssessment("insufficient")}
                className="w-4 h-4"
              />
              <span className="text-sm text-secondary-500">Insufficient</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-secondary-500">Experience Level Match</p>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full h-12 px-4 border border-neutral-500 rounded-md text-sm bg-white"
          >
            <option value="mid-level">Mid-level (3-5 years)</option>
            <option value="junior">Junior (0-2 years)</option>
            <option value="senior">Senior (5+ years)</option>
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-secondary-500">Review Notes</p>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="w-full h-32 px-4 py-3 border border-neutral-500 rounded-md text-sm resize-none"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={recommendForMentor}
            onChange={(e) => setRecommendForMentor(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-secondary-500">
            Recommend for Mentor Program (based on experience and skills)
          </span>
        </label>
      </div>

      <div className="bg-border-500 border border-neutral-500 rounded-lg p-4 flex flex-col gap-2">
        <p className="text-sm font-semibold text-warning-800">Ready to make a decision?</p>
        <p className="text-sm text-warning-700">
          This application has been thoroughly reviewed and is ready for approval.
        </p>
      </div>

      <div className="flex gap-4 justify-end">
        <Button className="bg-success-500 text-white px-8 py-3">
          <span className="text-base font-medium">Approve</span>
        </Button>
        <Button className="bg-error-500 text-white px-8 py-3">
          <span className="text-base font-medium">Reject</span>
        </Button>
      </div>
    </div>
  );
}
