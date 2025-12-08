"use client";

import { useState, useEffect, useRef } from "react";
import { X, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TagsInput({ value = [], onChange, label = "Tags" }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [existingTags, setExistingTags] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    fetchExistingTags();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchExistingTags = async () => {
    try {
      const response = await fetch("/api/posts/tags");
      if (response.ok) {
        const { data } = await response.json();
        setExistingTags(data || []);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.trim()) {
      const filtered = existingTags
        .filter(tag => 
          tag.toLowerCase().includes(val.toLowerCase()) && 
          !value.includes(tag)
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <div className="relative">
        <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px]">
          {value.map((tag, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              <Tag className="w-3 h-3" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={value.length === 0 ? "Type and press Enter to add tags" : ""}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 min-w-[150px]"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Tag className="w-4 h-4 text-gray-400" />
                <span>{suggestion}</span>
                <span className="ml-auto text-xs text-gray-400">Existing</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Press Enter or comma to add a tag. Existing tags will be suggested.
      </p>
    </div>
  );
}

