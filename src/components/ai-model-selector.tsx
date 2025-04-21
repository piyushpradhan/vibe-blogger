"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Zap } from "lucide-react";

interface AIModelSelectorProps {
  onClose: () => void;
  currentModel: "gemini" | "gpt" | "claude";
  onModelChange?: (model: "gemini" | "gpt" | "claude") => void;
}

export function AIModelSelector({
  onClose,
  currentModel,
  onModelChange,
}: AIModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleModelChange = (value: string) => {
    const newModel = value as "gemini" | "gpt" | "claude";
    setSelectedModel(newModel);
    onModelChange?.(newModel);
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      // Here you would redirect to the generated blog
      window.location.href = `/dashboard/generated/1`;
    }, 2000);
  };

  const needsApiKey = selectedModel !== "gemini";

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedModel}
        onValueChange={handleModelChange}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="gemini" id="gemini" />
          <Label htmlFor="gemini">Gemini (Default)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="gpt" id="gpt" />
          <Label htmlFor="gpt">ChatGPT</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="claude" id="claude" />
          <Label htmlFor="claude">Claude</Label>
        </div>
      </RadioGroup>

      {needsApiKey && (
        <div className="mt-4 space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder={`Enter your ${selectedModel === "gpt" ? "OpenAI" : "Anthropic"} API key`}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">
            Your API key is required to use{" "}
            {selectedModel === "gpt" ? "ChatGPT" : "Claude"} and will not be
            stored on our servers.
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button
          onClick={handleGenerate}
          className="flex-1 gap-1"
          disabled={(needsApiKey && !apiKey) || isGenerating}
        >
          <Zap className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Blog"}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
