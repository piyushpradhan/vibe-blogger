"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Zap } from "lucide-react";

type AIModel = "gemini" | "gpt" | "claude";

interface AIModelSelectorProps {
  onClose: () => void;
  currentModel: AIModel;
  onModelChange?: (model: AIModel) => void;
}

const MODEL_OPTIONS: { value: AIModel; label: string }[] = [
  { value: "gemini", label: "Gemini (Default)" },
  { value: "gpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
];

const MODEL_PROVIDERS: Record<AIModel, string> = {
  gemini: "Google",
  gpt: "OpenAI",
  claude: "Anthropic",
};

export function AIModelSelector({
  onClose,
  currentModel,
  onModelChange,
}: AIModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<AIModel>(currentModel);
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModelChange = (value: string) => {
    const newModel = value as AIModel;
    setSelectedModel(newModel);
    onModelChange?.(newModel);
    setError(null);
  };

  const validateApiKey = (key: string): boolean => {
    // Basic validation - you might want to add more specific validation
    return key.length > 0;
  };

  const handleGenerate = async () => {
    if (needsApiKey && !validateApiKey(apiKey)) {
      setError("Please enter a valid API key");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Here you would redirect to the generated blog
      window.location.href = `/dashboard/generated/1`;
    } catch (err) {
      setError("Failed to generate blog. Please try again.");
      setIsGenerating(false);
    }
  };

  const needsApiKey = selectedModel !== "gemini";

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedModel}
        onValueChange={handleModelChange}
        className="space-y-2"
      >
        {MODEL_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>

      {needsApiKey && (
        <div className="mt-4 space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder={`Enter your ${MODEL_PROVIDERS[selectedModel]} API key`}
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setError(null);
            }}
            className="w-full"
            aria-invalid={!!error}
          />
          <p className="text-muted-foreground text-xs">
            Your API key is required to use {MODEL_PROVIDERS[selectedModel]} and
            will not be stored on our servers.
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button
          onClick={handleGenerate}
          className="flex-1 gap-1"
          disabled={(needsApiKey && !apiKey) || isGenerating}
          aria-busy={isGenerating}
        >
          <Zap className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Blog"}
        </Button>
        <Button variant="outline" onClick={onClose} disabled={isGenerating}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
