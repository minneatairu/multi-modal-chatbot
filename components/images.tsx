'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function ImageGenerator() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);  // Add a loading state
  const promptInputRef = useRef(null);

  useEffect(() => {
    promptInputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Start loading
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });

    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      setLoading(false); // Stop loading on error
      return;
    }
    setPrediction(prediction);

    // Polling the status of the prediction
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const statusResponse = await fetch(`/api/predictions/${prediction.id}`);
      prediction = await statusResponse.json();
      if (statusResponse.status !== 200) {
        setError(prediction.detail);
        setLoading(false);
        return;
      }
      setPrediction(prediction);
    }
    setLoading(false); // Stop loading when the result is fetched
  };

  return (
    <div className="container max-w-2xl mx-auto p-5">
      <h1 className="py-6 text-center font-bold text-2xl">
        Dream something with{" "}
        <a href="https://replicate.com/stability-ai/sdxl?utm_source=project&utm_project=getting-started">
          SDXL
        </a>
      </h1>

      <form className="w-full flex" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-grow"
          name="prompt"
          placeholder="Enter a prompt to display an image"
          ref={promptInputRef}
          disabled={loading}  // Disable input while loading
        />
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Generating..." : "Go!"} {/* Loading state on button */}
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
