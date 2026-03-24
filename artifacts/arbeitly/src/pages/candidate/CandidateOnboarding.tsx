import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle, Lock } from "lucide-react";
import { useCustomers } from "@/context/CustomersContext";
import { Link } from "react-router-dom";

type Section = {
  title: string;
  fields: { key: string; label: string }[];
};

const sections: Section[] = [
  {
    title: "Personal Details",
    fields: [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "applicationEmail", label: "Application Email" },
      { key: "phone", label: "Phone Number" },
      { key: "linkedin", label: "LinkedIn Profile" },
      { key: "dob", label: "Date of Birth" },
      { key: "placeOfBirth", label: "Place of Birth" },
      { key: "address", label: "Address" },
    ],
  },
  {
    title: "Professional Background",
    fields: [
      { key: "currentJobTitle", label: "Current / Last Job Title" },
      { key: "currentEmployer", label: "Current / Last Employer" },
      { key: "currentField", label: "Current Field" },
      { key: "yearsExperience", label: "Years of Experience" },
      { key: "currentSalary", label: "Current Salary (EUR)" },
      { key: "workedInGermany", label: "Worked in Germany" },
      { key: "noticePeriod", label: "Notice Period" },
      { key: "highestStudy", label: "Highest Level of Study" },
      { key: "degreeTitle", label: "Degree / Training Title" },
      { key: "university", label: "University / Institute" },
      { key: "universityLocation", label: "University Location" },
    ],
  },
  {
    title: "Skills & Career Goals",
    fields: [
      { key: "topSkills", label: "Top 5 Skills" },
      { key: "certifications", label: "Certifications" },
      { key: "careerGoal", label: "Primary Career Goal" },
      { key: "targetRoles", label: "Target Job Titles / Roles" },
      { key: "targetIndustries", label: "Target Industries" },
      { key: "employmentType", label: "Type of Employment" },
      { key: "preferredLocation", label: "Preferred Job Location" },
      { key: "openToRelocation", label: "Open to Relocation" },
      { key: "preferredSalary", label: "Preferred Salary Range" },
      { key: "targetCompanies", label: "Target Companies" },
      { key: "openToCareerChange", label: "Open to Career Change" },
    ],
  },
  {
    title: "Final Details",
    fields: [
      { key: "germanLevel", label: "German Language Level" },
      { key: "drivingLicense", label: "Driving License" },
      { key: "transitionMotivation", label: "Transition Motivation" },
      { key: "trainingNeeds", label: "Training Needs" },
      { key: "howHeard", label: "How Did You Hear About Us" },
      { key: "additionalInfo", label: "Additional Information" },
    ],
  },
];

const CandidateOnboarding = () => {
  const { currentCustomer } = useCustomers();
  const onboarding = currentCustomer?.onboarding;

  const hasData = onboarding && Object.values(onboarding).some((v) => v);

  if (!hasData) {
    return (
      <div className="p-6 max-w-2xl">
        <div className="text-center py-16 space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">Onboarding Not Completed</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Complete your onboarding so we can match you with the best job opportunities.
          </p>
          <Button asChild className="rounded-full">
            <Link to="/onboarding">Start Onboarding</Link>
          </Button>
        </div>
      </div>
    );
  }

  const filledCount = Object.values(onboarding).filter((v) => v).length;
  const totalCount = sections.reduce((acc, s) => acc + s.fields.length, 0);

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My Onboarding</h1>
          <p className="text-muted-foreground">Your answers from the onboarding process</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-500 font-medium">
          <CheckCircle className="h-4 w-4" />
          {filledCount} / {totalCount} filled
        </div>
      </div>

      {/* Read-only notice */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-400/20 bg-amber-500/5 px-4 py-3">
        <Lock className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-300/90">
          Your onboarding answers are locked and cannot be changed. Contact your advisor if any information needs updating.
        </p>
      </div>

      {sections.map((section) => {
        const filledFields = section.fields.filter(
          ({ key }) => onboarding[key as keyof typeof onboarding],
        );
        if (filledFields.length === 0) return null;

        return (
          <Card key={section.title}>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {filledFields.map(({ key, label }) => {
                  const value = onboarding[key as keyof typeof onboarding];
                  return (
                    <div key={key}>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-sm text-card-foreground break-words">{value}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

    </div>
  );
};

export default CandidateOnboarding;
