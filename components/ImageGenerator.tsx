'use client';

import { useState, useEffect, useRef, FormEvent } from "react";
import Image from "next/image";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface Prediction {
  id: string;
  status: string;
  output?: string[];
  detail?: string;
}

export default function ImageGenerator() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const promptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const prompt = promptInputRef.current?.value || '';
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    let prediction: Prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail || "An error occurred");
      setLoading(false);
      return;
    }
    setPrediction(prediction);

    // Polling the status of the prediction
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await sleep(1000);
      const statusResponse = await fetch(`/api/predictions/${prediction.id}`);
      prediction = await statusResponse.json();
      if (statusResponse.status !== 200) {
        setError(prediction.detail || "An error occurred");
        setLoading(false);
        return;
      }
      setPrediction(prediction);
    }
    setLoading(false);
  };

  return (
    <div className="container max-w-2xl mx-auto p-5">


      <form className="w-full flex" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-grow"
          name="prompt"
          placeholder="Type your description"
          ref={promptInputRef}
          disabled={loading}
        />
        <button className="genebtt expanded" type="submit" disabled={loading}>
          {loading ? "Generating..." : "GENERATE!"}
        </button>
      </form>

      {error && <div className="text-red-500 mt-3">{error}</div>}

      {loading && <p className="py-3 text-sm opacity-50">Generating image, please wait...</p>}

      {prediction && (
        <>
          {prediction.output && (
            <div className="image-wrapper mt-5">
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
          <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
        </>
      )}
    </div>
  );
}
