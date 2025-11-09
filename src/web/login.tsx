"use client";

import axios from "axios";
import { convertFromSchema, type structure } from "minimal-form";
import EasyForm from "minimal-form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

interface ScenarioStepsType {
  name: string;
  structure: structure;
}

interface LoginFormProps {
  on_after_login?: (response_data: any) => void;
  on_after_step?: (step_key: string) => void;
  backendUrl: string;
}

export default function LoginForm({
  on_after_login,
  on_after_step,
  backendUrl,
}: LoginFormProps) {
  const [steps, stepsHnadler] = useState<ScenarioStepsType[]>();
  const [activeStep, activeStepHandler] = useState<
    ScenarioStepsType | undefined
  >();
  const [loading, loadingHandler] = useState(true);
  const [userID, userIDHandler] = useState("");
  const [stepPayload, stepPayloadHandler] = useState<any>({});
  const { handleSubmit, control } = useForm();
  const { setUserData, setPermits } = useAuth();

  const request = axios.create({
    baseURL: backendUrl,
  });

  // fetch data from steps
  useEffect(() => {
    async function fetchSteps() {
      const response = await request.get("options/");
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
    // valudate step and send data to server
    const response = await request.post("validate/" + activeStep!.name, {
      options: data,
      payload: stepPayload,
      user_id: userID,
    });
    // if response say go next step
    if (response.status === 202) {
      const nextIndex =
        (steps?.findIndex((d) => d.name === activeStep?.name) || 0) + 1;
      activeStepHandler(steps?.[nextIndex]);
      if (on_after_step) on_after_step(steps?.[nextIndex]?.name || "");
    }
    // if response say authenticate is finished
    else if (response.status === 200) {
      setUserData(response.data.user);
      setPermits(response.data.user.permits);
      if (on_after_login) on_after_login(response.data);
    }
    // if response say have a wrong in this request
    else if (response.status === 400) {
      activeStepHandler(steps?.[0]);
    }
    userIDHandler(response.data.user_id);
    stepPayloadHandler(response.data.payload);
  };

  // loading check
  if (loading) return <p>loading ...</p>;
  console.log("activeStep", activeStep?.structure);

  // show forms from steps
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <EasyForm control={control} structure={activeStep?.structure || {}} />
      <button type="submit">Submit</button>
    </form>
  );
}
