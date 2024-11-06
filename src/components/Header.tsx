import React from 'react';
import { Brain } from 'lucide-react';

export const Header = () => (
  <div className="flex items-center justify-center mb-12">
    <Brain className="w-10 h-10 text-purple-400 animate-pulse mr-3" />
    <h1 className="text-4xl font-bold text-white tracking-tight">
      AI Accelerator
    </h1>
  </div>
);