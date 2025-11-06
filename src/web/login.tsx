import axios from "axios";
import { convertFromSchema, type structure } from "minimal-form";
import EasyForm from "minimal-form";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface ScenarioStepsType {
  [key: string]: structure;
}

interface LoginFormProps {
  baseURL: string;
}

export default function LoginForm({ baseURL }: LoginFormProps) {
  const [steps, stepsHnadler] = useState<ScenarioStepsType>({});
  const [activeStep, activeStepHandler] = useState("");
  const [loading, loadingHandler] = useState(true);
  const { handleSubmit, control } = useForm();

  const request = axios.create({
    baseURL,
  });

  // fetch data from steps
  useEffect(() => {
    async function fetchSteps() {
      const response = await request.get("/options");
      const data = Object.entries(response.data).map(([opt, schema]) => [
        opt,
        convertFromSchema(schema),
      ]);
      activeStepHandler(data[0][0] as unknown as string);
      stepsHnadler(Object.fromEntries(data));
      loadingHandler(false);
    }
    fetchSteps();
  }, []);

  const onSubmit = (data: any) => {};

  // loading check
  if (loading) return <p>loading ...</p>;

  // show forms from steps
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <EasyForm control={control} structure={steps[activeStep]} />
      <button type="submit">Submit</button>
    </form>
  );
}
