import axios from "axios";
import { convertFromSchema, type structure } from "minimal-form";
import EasyForm from "minimal-form";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

interface ScenarioStepsType {
  name: string;
  structure: structure;
}
export default function LoginForm() {
  const [steps, stepsHnadler] = useState<ScenarioStepsType[]>();
  const [activeStep, activeStepHandler] = useState<
    ScenarioStepsType | undefined
  >();
  const [loading, loadingHandler] = useState(true);
  const { handleSubmit, control } = useForm();
  const { go_after_login_url, backendUrl } = useAuth();

  const request = axios.create({
    baseURL: backendUrl,
  });

  // fetch data from steps
  useEffect(() => {
    async function fetchSteps() {
      const response = await request.get("options");
      const data = Object.entries(response.data).map(([opt, schema]) => ({
        name: opt,
        structure: convertFromSchema(schema),
      }));
      activeStepHandler(data[0]);
      stepsHnadler(data);
      loadingHandler(false);
    }
    fetchSteps();
  }, []);

  const onSubmit = async (data: any) => {
    const response = await request.post("validate/" + activeStep!.name, data);

    // if response say go next step
    if (response.status === 202) {
      const nextIndex =
        (steps?.findIndex((d) => d.name === activeStep?.name) || 0) + 1;
      activeStepHandler(steps?.[nextIndex]);
    }
    // if response say authenticate is finished
    else if (response.status === 200) {
      window.location.href = go_after_login_url;
    }
    // if response say have a wrong in this request
    else if (response.status === 400) {
      activeStepHandler(steps?.[0]);
    }
  };

  // loading check
  if (loading) return <p>loading ...</p>;

  // show forms from steps
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <EasyForm control={control} structure={activeStep!.structure} />
      <button type="submit">Submit</button>
    </form>
  );
}
