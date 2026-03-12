import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

const PromptManager = ({ type }: { type: "cv" | "cover-letter" }) => {
  const isCV = type === "cv";
  
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {isCV ? "CV Generation Prompts" : "Cover Letter Prompts"}
        </h1>
        <p className="text-muted-foreground">
          Configure AI prompts for {isCV ? "CV optimization" : "cover letter generation"}. Changes take effect immediately.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">System Prompt</CardTitle>
          <CardDescription>The main instruction set for the AI model</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            className="min-h-[200px] font-mono text-sm"
            defaultValue={isCV 
              ? "You are an expert CV optimizer specializing in ATS-compliant resumes for the German and international job market. Analyze the provided CV and job description, then restructure the CV to maximize ATS compatibility while maintaining professional quality.\n\nKey objectives:\n- Extract and highlight relevant keywords from the job description\n- Structure experience using action verbs and quantifiable achievements\n- Ensure proper formatting for ATS parsing\n- Maintain professional tone appropriate for the target market"
              : "You are an expert cover letter writer for the German and international job market. Generate a professional, compelling cover letter based on the candidate's CV and the target job description.\n\nKey objectives:\n- Personalize the letter for the specific company and role\n- Highlight relevant experience and achievements\n- Maintain appropriate formal tone for the German market\n- Keep the letter concise (max 1 page)\n- Include a strong opening and clear call to action"
            }
          />
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save System Prompt
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Generation Parameters</CardTitle>
          <CardDescription>Fine-tune the AI output behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Temperature</Label>
              <Input type="number" defaultValue="0.7" step="0.1" min="0" max="2" className="mt-1.5" />
            </div>
            <div>
              <Label>Max Tokens</Label>
              <Input type="number" defaultValue="2000" step="100" className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Tone</Label>
            <Input defaultValue={isCV ? "Professional, concise, achievement-oriented" : "Formal, engaging, personalized"} className="mt-1.5" />
          </div>
          <div>
            <Label>Keyword Extraction Strategy</Label>
            <Textarea 
              className="mt-1.5 font-mono text-sm min-h-[80px]"
              defaultValue="Extract keywords from: job title, required skills, preferred qualifications, and company values. Weight technical skills 2x over soft skills."
            />
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Parameters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptManager;
