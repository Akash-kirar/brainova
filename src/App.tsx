/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Brain, Cpu, TrendingUp, ChevronRight, Sparkles, Mail, Lock, User, ArrowLeft, Flame, Zap, Target, Activity, Play, Lightbulb, Calculator, Trophy, Star, Grid, RotateCcw, Box, Puzzle, Search, Clock, Type, Shuffle, BookOpen, ListOrdered, Link, CheckCircle, Copy, Bot, Home, Gamepad2, Sparkle, Settings, FileText, Shield, HelpCircle, Download, Trash2, MessageSquare, Sliders, Globe, X, Mic, Send, CircleDollarSign, Heart, Flag, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import GameCarousel from './components/GameCarousel';
import MemoryGridGame from './components/MemoryGridGame';
import ReactionSpeedGame from './components/ReactionSpeedGame';
import CardMatchGame from './components/CardMatchGame';
import SequenceRecallGame from './components/SequenceRecallGame';
import PatternRecallGame from './components/PatternRecallGame';
import ImageMemoryGame from './components/ImageMemoryGame';
import ColorMemoryGame from './components/ColorMemoryGame';
import NumberRecallGame from './components/NumberRecallGame';
import WordRecallGame from './components/WordRecallGame';
import OddOneOutGame from './components/OddOneOutGame';
import FocusTapGame from './components/FocusTapGame';
import ColorMatchFocusGame from './components/ColorMatchFocusGame';
import SlidingPuzzleGame from './components/SlidingPuzzleGame';
import PatternLogicGame from './components/PatternLogicGame';
import SequenceLogicGame from './components/SequenceLogicGame';
import SmartGridPuzzleGame from './components/SmartGridPuzzleGame';
import CubeRotationPuzzleGame from './components/CubeRotationPuzzleGame';
import PuzzleMatchGame from './components/PuzzleMatchGame';
import HiddenPatternPuzzleGame from './components/HiddenPatternPuzzleGame';
import MathSprintGame from './components/MathSprintGame';
import NumberComparisonGame from './components/NumberComparisonGame';
import EquationBuilderGame from './components/EquationBuilderGame';
import ReactionTapGame from './components/ReactionTapGame';
import ColorReactionGame from './components/ColorReactionGame';
import FastButtonGame from './components/FastButtonGame';
import ReactionLightGame from './components/ReactionLightGame';
import SpeedCircleGame from './components/SpeedCircleGame';
import ReactionTimerGame from './components/ReactionTimerGame';
import TapTheMovingDotGame from './components/TapTheMovingDotGame';
import FlashTapGame from './components/FlashTapGame';
import WordBuilderGame from './components/WordBuilderGame';
import VocabularyMatchGame from './components/VocabularyMatchGame';
import MissingLetterGame from './components/MissingLetterGame';
import WordSearchGame from './components/WordSearchGame';
import WordMemoryGame from './components/WordMemoryGame';
import WordSequenceGame from './components/WordSequenceGame';
import WordSpeedGame from './components/WordSpeedGame';
import VocabularyBuilderGame from './components/VocabularyBuilderGame';
import DailyTraining from './components/DailyTraining';
import { useProgress } from './hooks/useProgress';
import { t, Language } from './i18n';

const games = [
  { id: 'memory-grid', title: "Memory Grid", category: "Memory", icon: <Brain className="w-5 h-5 text-indigo-400" />, color: "bg-indigo-500/10" },
  { id: 'card-match', title: "Card Match", category: "Memory", icon: <Sparkles className="w-5 h-5 text-purple-400" />, color: "bg-purple-500/10" },
  { id: 'sequence-recall', title: "Sequence Recall", category: "Memory", icon: <Target className="w-5 h-5 text-emerald-400" />, color: "bg-emerald-500/10" },
  { id: 'pattern-recall', title: "Pattern Recall", category: "Memory", icon: <Zap className="w-5 h-5 text-amber-400" />, color: "bg-amber-500/10" },
];

const allGames = [
  { id: 'memory-grid', title: 'Memory Grid', category: 'Memory', description: 'Remember highlighted squares', icon: <Brain className="w-8 h-8 text-indigo-400" />, color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'card-match', title: 'Card Match', category: 'Memory', description: 'Match identical cards', icon: <Sparkles className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'sequence-recall', title: 'Sequence Recall', category: 'Memory', description: 'Remember number sequence', icon: <Target className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'pattern-recall', title: 'Pattern Recall', category: 'Memory', description: 'Remember shapes pattern', icon: <Zap className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'image-memory', title: 'Image Memory', category: 'Memory', description: 'Remember pictures', icon: <Lightbulb className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'color-memory', title: 'Color Memory', category: 'Memory', description: 'Remember color order', icon: <Brain className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'number-recall', title: 'Number Recall', category: 'Memory', description: 'Remember numbers quickly', icon: <Calculator className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'word-recall', title: 'Word Recall', category: 'Memory', description: 'Remember word list', icon: <Sparkles className="w-8 h-8 text-pink-400" />, color: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { id: 'flash-memory', title: 'Flash Memory', category: 'Memory', description: 'Memorize items in seconds', icon: <Zap className="w-8 h-8 text-yellow-400" />, color: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'object-position', title: 'Object Position', category: 'Memory', description: 'Remember object positions', icon: <Target className="w-8 h-8 text-green-400" />, color: 'bg-green-500/10', border: 'border-green-500/20' },
  { id: 'sound-memory', title: 'Sound Memory', category: 'Memory', description: 'Remember sound order', icon: <Activity className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'memory-path', title: 'Memory Path', category: 'Memory', description: 'Remember a path on grid', icon: <Brain className="w-8 h-8 text-indigo-400" />, color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'memory-tiles', title: 'Memory Tiles', category: 'Memory', description: 'Tap tiles in correct order', icon: <Sparkles className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'symbol-match', title: 'Symbol Match', category: 'Memory', description: 'Match symbol pairs', icon: <Lightbulb className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'memory-matrix', title: 'Memory Matrix', category: 'Memory', description: 'Remember large grid pattern', icon: <Target className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'fast-recall', title: 'Fast Recall', category: 'Memory', description: 'Quick memory test', icon: <Zap className="w-8 h-8 text-orange-400" />, color: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'picture-recall', title: 'Picture Recall', category: 'Memory', description: 'Remember picture details', icon: <Brain className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'number-pattern', title: 'Number Pattern Memory', category: 'Memory', description: 'Remember number patterns', icon: <Calculator className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'memory-flip', title: 'Memory Flip Challenge', category: 'Memory', description: 'Flip and remember', icon: <Sparkles className="w-8 h-8 text-pink-400" />, color: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { id: 'speed-memory', title: 'Speed Memory Challenge', category: 'Memory', description: 'Fast-paced memory', icon: <Zap className="w-8 h-8 text-yellow-400" />, color: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  
  // Focus & Attention Games
  { id: 'find-different-shape', title: 'Find the Different Shape', category: 'Focus', description: 'Spot the unique shape', icon: <Target className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'odd-one-out', title: 'Odd One Out', category: 'Focus', description: 'Find the odd item out', icon: <Lightbulb className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'focus-tap', title: 'Focus Tap', category: 'Focus', description: 'Tap target quickly', icon: <Zap className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'moving-target-tap', title: 'Moving Target Tap', category: 'Focus', description: 'Tap moving targets', icon: <Activity className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'color-match-focus', title: 'Color Match Focus', category: 'Focus', description: 'Match word and color', icon: <Brain className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'find-hidden-object', title: 'Find Hidden Object', category: 'Focus', description: 'Spot hidden items', icon: <Target className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'distraction-filter', title: 'Distraction Filter', category: 'Focus', description: 'Ignore wrong objects', icon: <Sparkles className="w-8 h-8 text-pink-400" />, color: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { id: 'focus-circle', title: 'Focus Circle', category: 'Focus', description: 'Track moving circle', icon: <Activity className="w-8 h-8 text-indigo-400" />, color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'visual-search', title: 'Visual Search', category: 'Focus', description: 'Search for specific items', icon: <Lightbulb className="w-8 h-8 text-yellow-400" />, color: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'target-finder', title: 'Target Finder', category: 'Focus', description: 'Find the specific target', icon: <Target className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'focus-lines', title: 'Focus Lines', category: 'Focus', description: 'Follow correct path', icon: <Zap className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'quick-select', title: 'Quick Select', category: 'Focus', description: 'Select items quickly', icon: <Activity className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'spot-difference', title: 'Spot the Difference', category: 'Focus', description: 'Find differences in images', icon: <Brain className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'multi-object-tracking', title: 'Multi Object Tracking', category: 'Focus', description: 'Track multiple objects', icon: <Target className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'attention-grid', title: 'Attention Grid', category: 'Focus', description: 'Focus on grid patterns', icon: <Sparkles className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  
  // Logic & Puzzle Games
  { id: 'sudoku-lite', title: 'Sudoku Lite', category: 'Logic', description: 'Mini 4x4 Sudoku', icon: <Grid className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'pattern-logic', title: 'Pattern Logic', category: 'Logic', description: 'Find the next pattern', icon: <Brain className="w-8 h-8 text-indigo-400" />, color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'sequence-logic', title: 'Sequence Logic', category: 'Logic', description: 'Find the next number', icon: <Calculator className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'smart-grid', title: 'Smart Grid Puzzle', category: 'Logic', description: 'Turn off all lights', icon: <Lightbulb className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'cube-rotation', title: 'Cube Rotation Puzzle', category: 'Logic', description: 'Match the target grid', icon: <Box className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'puzzle-match', title: 'Puzzle Match', category: 'Logic', description: 'Match logical pairs', icon: <Puzzle className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'hidden-pattern', title: 'Hidden Pattern Puzzle', category: 'Logic', description: 'Find the missing piece', icon: <Search className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'block-puzzle', title: 'Block Puzzle', category: 'Logic', description: 'Fit blocks in grid', icon: <Cpu className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'shape-fit', title: 'Shape Fit Puzzle', category: 'Logic', description: 'Fit shapes together', icon: <Target className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'number-puzzle', title: 'Number Puzzle', category: 'Logic', description: 'Solve number logic', icon: <Calculator className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'grid-logic', title: 'Grid Logic', category: 'Logic', description: 'Solve grid puzzles', icon: <Grid className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'maze-solver', title: 'Maze Solver', category: 'Logic', description: 'Find the exit', icon: <Activity className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'rotate-puzzle', title: 'Rotate Puzzle', category: 'Logic', description: 'Rotate to solve', icon: <RotateCcw className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'pattern-builder', title: 'Pattern Builder', category: 'Logic', description: 'Build the pattern', icon: <Sparkles className="w-8 h-8 text-pink-400" />, color: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { id: 'shape-logic', title: 'Shape Logic', category: 'Logic', description: 'Shape-based logic', icon: <Target className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'connect-lines', title: 'Connect Lines Puzzle', category: 'Logic', description: 'Connect matching dots', icon: <Activity className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'sliding-puzzle', title: 'Sliding Puzzle', category: 'Logic', description: 'Slide tiles to order', icon: <Grid className="w-8 h-8 text-indigo-400" />, color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'puzzle-grid', title: 'Puzzle Grid', category: 'Logic', description: 'Grid-based puzzles', icon: <Cpu className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'brain-blocks', title: 'Brain Blocks', category: 'Logic', description: 'Block logic puzzles', icon: <Brain className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'logic-path', title: 'Logic Path', category: 'Logic', description: 'Find the logical path', icon: <Target className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  
  // Math & Calculation Games
  { id: 'quick-addition', title: 'Quick Addition', category: 'Math', description: 'Fast addition problems', icon: <Calculator className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'fast-subtraction', title: 'Fast Subtraction', category: 'Math', description: 'Quick subtraction', icon: <Calculator className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'multiplication-sprint', title: 'Multiplication Sprint', category: 'Math', description: 'Speed multiplication', icon: <Calculator className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'division-master', title: 'Division Master', category: 'Math', description: 'Master division', icon: <Calculator className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'number-comparison', title: 'Number Comparison', category: 'Math', description: 'Which is larger?', icon: <Calculator className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'mental-math', title: 'Mental Math Challenge', category: 'Math', description: 'Mixed operations', icon: <Brain className="w-8 h-8 text-indigo-400" />, color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'equation-builder', title: 'Equation Builder', category: 'Math', description: 'Build the target number', icon: <Calculator className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'math-sequence', title: 'Math Sequence', category: 'Math', description: 'Find the missing number', icon: <Calculator className="w-8 h-8 text-pink-400" />, color: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { id: 'speed-calculation', title: 'Speed Calculation', category: 'Math', description: 'Calculate quickly', icon: <Zap className="w-8 h-8 text-yellow-400" />, color: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'missing-number', title: 'Missing Number', category: 'Math', description: 'Find the missing part', icon: <Search className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'math-grid', title: 'Math Grid', category: 'Math', description: 'Grid-based math', icon: <Grid className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'arithmetic-race', title: 'Arithmetic Race', category: 'Math', description: 'Race against time', icon: <Activity className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'calculation-memory', title: 'Calculation Memory', category: 'Math', description: 'Remember calculations', icon: <Brain className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'math-duel', title: 'Math Duel', category: 'Math', description: 'Duel with math', icon: <Target className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },

  // Reaction Speed Games
  { id: 'reaction-tap', title: 'Reaction Tap', category: 'Reaction Speed', description: 'Tap when green', icon: <Zap className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'color-reaction', title: 'Color Reaction', category: 'Reaction Speed', description: 'Match color and word', icon: <Activity className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'tap-the-target', title: 'Tap the Target', category: 'Reaction Speed', description: 'Tap targets quickly', icon: <Target className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'fast-button', title: 'Fast Button', category: 'Reaction Speed', description: 'Tap as fast as possible', icon: <Zap className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'reaction-light', title: 'Reaction Light', category: 'Reaction Speed', description: 'Traffic light reaction', icon: <Lightbulb className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'tap-when-green', title: 'Tap When Green', category: 'Reaction Speed', description: 'Wait for green', icon: <Target className="w-8 h-8 text-green-400" />, color: 'bg-green-500/10', border: 'border-green-500/20' },
  { id: 'speed-circle', title: 'Speed Circle', category: 'Reaction Speed', description: 'Tap shrinking circles', icon: <Activity className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'quick-reflex', title: 'Quick Reflex', category: 'Reaction Speed', description: 'Test your reflexes', icon: <Zap className="w-8 h-8 text-pink-400" />, color: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { id: 'reaction-timer', title: 'Reaction Timer', category: 'Reaction Speed', description: 'Measure reaction time', icon: <Clock className="w-8 h-8 text-yellow-400" />, color: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'tap-the-moving-dot', title: 'Tap the Moving Dot', category: 'Reaction Speed', description: 'Track and tap', icon: <Target className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'reflex-challenge', title: 'Reflex Challenge', category: 'Reaction Speed', description: 'Ultimate reflex test', icon: <Zap className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'speed-match', title: 'Speed Match', category: 'Reaction Speed', description: 'Match quickly', icon: <Activity className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'flash-tap', title: 'Flash Tap', category: 'Reaction Speed', description: 'Tap flashing items', icon: <Lightbulb className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'quick-click', title: 'Quick Click', category: 'Reaction Speed', description: 'Click as fast as you can', icon: <Target className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'lightning-reaction', title: 'Lightning Reaction', category: 'Reaction Speed', description: 'Lightning fast taps', icon: <Zap className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'word-builder', title: 'Word Builder', category: 'Language & Word', description: 'Build words from letters', icon: <Type className="w-8 h-8 text-indigo-400" />, color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'word-scramble', title: 'Word Scramble', category: 'Language & Word', description: 'Unscramble the letters', icon: <Shuffle className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'vocabulary-match', title: 'Vocabulary Match', category: 'Language & Word', description: 'Match words to meanings', icon: <BookOpen className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'letter-sequence', title: 'Letter Sequence', category: 'Language & Word', description: 'Find the next letter', icon: <ListOrdered className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'word-memory', title: 'Word Memory', category: 'Language & Word', description: 'Remember the words', icon: <Brain className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'find-the-word', title: 'Find the Word', category: 'Language & Word', description: 'Find hidden words', icon: <Search className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { id: 'missing-letter', title: 'Missing Letter', category: 'Language & Word', description: 'Fill in the blank', icon: <Type className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'word-puzzle', title: 'Word Puzzle', category: 'Language & Word', description: 'Solve word puzzles', icon: <Puzzle className="w-8 h-8 text-pink-400" />, color: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { id: 'word-association', title: 'Word Association', category: 'Language & Word', description: 'Link related words', icon: <Link className="w-8 h-8 text-yellow-400" />, color: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'spelling-challenge', title: 'Spelling Challenge', category: 'Language & Word', description: 'Spell correctly', icon: <CheckCircle className="w-8 h-8 text-green-400" />, color: 'bg-green-500/10', border: 'border-green-500/20' },
  { id: 'word-speed-test', title: 'Word Speed Test', category: 'Language & Word', description: 'Fast word recognition', icon: <Zap className="w-8 h-8 text-orange-400" />, color: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'letter-grid-search', title: 'Letter Grid Search', category: 'Language & Word', description: 'Search in grid', icon: <Grid className="w-8 h-8 text-purple-400" />, color: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'synonym-match', title: 'Synonym Match', category: 'Language & Word', description: 'Match synonyms', icon: <Copy className="w-8 h-8 text-indigo-400" />, color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'word-pattern', title: 'Word Pattern', category: 'Language & Word', description: 'Find word patterns', icon: <Activity className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'vocabulary-builder', title: 'Vocabulary Builder', category: 'Language & Word', description: 'Learn new words', icon: <BookOpen className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const gameCategories = [
  { id: 'memory', title: 'Memory', description: 'Enhance recall & retention', icon: <Brain className="w-8 h-8 text-indigo-400" />, color: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'logic', title: 'Logic', description: 'Boost problem solving', icon: <Lightbulb className="w-8 h-8 text-amber-400" />, color: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'focus', title: 'Focus', description: 'Improve attention span', icon: <Target className="w-8 h-8 text-emerald-400" />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'math', title: 'Math', description: 'Improve calculation speed', icon: <Calculator className="w-8 h-8 text-blue-400" />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'speed', title: 'Reaction Speed', description: 'Lightning fast reflexes', icon: <Zap className="w-8 h-8 text-rose-400" />, color: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'language', title: 'Language & Word', description: 'Expand vocabulary', icon: <Type className="w-8 h-8 text-cyan-400" />, color: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
];

const planQuestions = [
  { id: 1, question: "q1", options: ["q1o1", "q1o2", "q1o3", "q1o4"] },
  { id: 2, question: "q2", options: ["q2o1", "q2o2", "q2o3", "q2o4"] },
  { id: 3, question: "q3", options: ["q3o1", "q3o2", "q3o3", "q3o4"] },
  { id: 4, question: "q4", options: ["q4o1", "q4o2", "q4o3", "q4o4"] },
  { id: 5, question: "q5", options: ["q5o1", "q5o2", "q5o3", "q5o4"] },
  { id: 6, question: "q6", options: ["q6o1", "q6o2", "q6o3", "q6o4"] },
  { id: 7, question: "q7", options: ["q7o1", "q7o2", "q7o3", "q7o4"] },
  { id: 8, question: "q8", options: ["q8o1", "q8o2", "q8o3", "q8o4"] },
  { id: 9, question: "q9", options: ["q9o1", "q9o2", "q9o3", "q9o4"] },
  { id: 10, question: "q10", options: ["q10o1", "q10o2", "q10o3", "q10o4"] },
];

export default function App() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    if (hour < 22) return 'Good Evening';
    return 'Good Night';
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'select' | 'login' | 'signup'>('select');
  const [currentTab, setCurrentTab] = useState<'home' | 'games' | 'coach' | 'stats' | 'profile'>('home');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [likedGames, setLikedGames] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileTab, setProfileTab] = useState<'performance' | 'achievements'>('performance');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isStarredGamesOpen, setIsStarredGamesOpen] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [isXpRoadmapOpen, setIsXpRoadmapOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'light' | 'dark' | 'reading' | 'high-contrast'>('dark');
  const [showAllQuickTraining, setShowAllQuickTraining] = useState(false);
  const [mixedGames, setMixedGames] = useState<typeof allGames>([]);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isPlanGeneratorOpen, setIsPlanGeneratorOpen] = useState(false);
  const [planStep, setPlanStep] = useState(0);
  const [planAnswers, setPlanAnswers] = useState<Record<number, string>>({});
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<{ title: string, description: string, games: typeof allGames } | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  const [profileName, setProfileName] = useState('Akash');
  const [signupName, setSignupName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setIsProfileSettingsOpen(false);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      setProfileName(tempName.trim());
    }
    setIsEditNameOpen(false);
  };
  
  const { stats, recordGame } = useProgress();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleLikedGame = (gameId: string) => {
    setLikedGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  // Format weekly performance for the chart
  const chartData = stats.weeklyPerformance.length > 0 
    ? stats.weeklyPerformance.map(d => ({
        day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        score: d.score
      }))
    : [
        { day: 'Mon', score: 0 },
        { day: 'Tue', score: 0 },
        { day: 'Wed', score: 0 },
        { day: 'Thu', score: 0 },
        { day: 'Fri', score: 0 },
        { day: 'Sat', score: 0 },
        { day: 'Sun', score: 0 },
      ];



  const getModeStyles = () => {
    switch (displayMode) {
      case 'light':
        return { filter: 'invert(1) hue-rotate(180deg)' };
      case 'reading':
        return { filter: 'sepia(0.6) contrast(0.9) brightness(0.9)' };
      case 'high-contrast':
        return { filter: 'contrast(1.4) saturate(1.5)' };
      default:
        return {};
    }
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_60%)]" />
        
        <div className="flex-1 flex flex-col items-center justify-center z-10">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full" />
            <Brain className="w-24 h-24 text-indigo-400 relative z-10" />
          </div>
          <p className="text-indigo-400 font-bold uppercase tracking-wider">{t('indiaApnaApp', language)}</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] font-sans text-white relative overflow-hidden" style={getModeStyles()}>
          
          {activeGame === 'memory-grid' ? (
            <MemoryGridGame 
              onBack={() => setActiveGame(null)} 
              onTrainingComplete={(score) => recordGame({ gameType: 'memory', score, difficulty: 'normal' })}
            />
          ) : activeGame === 'card-match' ? (
            <CardMatchGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'memory', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'sequence-recall' ? (
            <SequenceRecallGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'memory', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'pattern-recall' ? (
            <PatternRecallGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'memory', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'image-memory' ? (
            <ImageMemoryGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'memory', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'color-memory' ? (
            <ColorMemoryGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'memory', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'number-recall' ? (
            <NumberRecallGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'memory', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'word-recall' ? (
            <WordRecallGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'memory', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'odd-one-out' ? (
            <OddOneOutGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'focus', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'focus-tap' ? (
            <FocusTapGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'focus', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'color-match-focus' ? (
            <ColorMatchFocusGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'focus', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'sliding-puzzle' ? (
            <SlidingPuzzleGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'logic', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'pattern-logic' ? (
            <PatternLogicGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'logic', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'sequence-logic' ? (
            <SequenceLogicGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'logic', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'smart-grid' ? (
            <SmartGridPuzzleGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'logic', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'cube-rotation' ? (
            <CubeRotationPuzzleGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'logic', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'puzzle-match' ? (
            <PuzzleMatchGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'logic', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'hidden-pattern' ? (
            <HiddenPatternPuzzleGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'logic', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'quick-addition' ? (
            <MathSprintGame 
              operation="addition"
              title="Quick Addition"
              description="Solve as many addition problems as you can in 60 seconds."
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'math', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'fast-subtraction' ? (
            <MathSprintGame 
              operation="subtraction"
              title="Fast Subtraction"
              description="Solve as many subtraction problems as you can in 60 seconds."
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'math', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'multiplication-sprint' ? (
            <MathSprintGame 
              operation="multiplication"
              title="Multiplication Sprint"
              description="Solve as many multiplication problems as you can in 60 seconds."
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'math', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'division-master' ? (
            <MathSprintGame 
              operation="division"
              title="Division Master"
              description="Solve as many division problems as you can in 60 seconds."
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'math', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'mental-math' ? (
            <MathSprintGame 
              operation="mixed"
              title="Mental Math Challenge"
              description="Solve mixed arithmetic problems as fast as you can."
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'math', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'number-comparison' ? (
            <NumberComparisonGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'math', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'equation-builder' ? (
            <EquationBuilderGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'math', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'reaction-tap' ? (
            <ReactionTapGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, reactionTime) => recordGame({ gameType: 'speed', score, difficulty: 'normal', reactionTime })}
            />
          ) : activeGame === 'color-reaction' ? (
            <ColorReactionGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'speed', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'tap-the-target' ? (
            <ReactionSpeedGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, reactionTime) => recordGame({ gameType: 'speed', score, difficulty: 'normal', reactionTime })}
            />
          ) : activeGame === 'fast-button' ? (
            <FastButtonGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'speed', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'reaction-light' ? (
            <ReactionLightGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, reactionTime) => recordGame({ gameType: 'speed', score, difficulty: 'normal', reactionTime })}
            />
          ) : activeGame === 'speed-circle' ? (
            <SpeedCircleGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'speed', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'tap-when-green' || activeGame === 'lightning-reaction' ? (
            <ReactionTapGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, reactionTime) => recordGame({ gameType: 'speed', score, difficulty: 'normal', reactionTime })}
            />
          ) : activeGame === 'quick-reflex' || activeGame === 'reflex-challenge' ? (
            <ReactionSpeedGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, reactionTime) => recordGame({ gameType: 'speed', score, difficulty: 'normal', reactionTime })}
            />
          ) : activeGame === 'reaction-timer' ? (
            <ReactionTimerGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, reactionTime) => recordGame({ gameType: 'speed', score, difficulty: 'normal', reactionTime })}
            />
          ) : activeGame === 'tap-the-moving-dot' ? (
            <TapTheMovingDotGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, reactionTime) => recordGame({ gameType: 'speed', score, difficulty: 'normal', reactionTime })}
            />
          ) : activeGame === 'speed-match' ? (
            <ColorReactionGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'speed', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'flash-tap' ? (
            <FlashTapGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, reactionTime) => recordGame({ gameType: 'speed', score, difficulty: 'normal', reactionTime })}
            />
          ) : activeGame === 'quick-click' ? (
            <FastButtonGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'speed', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'word-builder' ? (
            <WordBuilderGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="builder"
            />
          ) : activeGame === 'word-scramble' ? (
            <WordBuilderGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="scramble"
            />
          ) : activeGame === 'word-puzzle' ? (
            <WordBuilderGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="puzzle"
            />
          ) : activeGame === 'vocabulary-match' ? (
            <VocabularyMatchGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="vocabulary"
            />
          ) : activeGame === 'synonym-match' ? (
            <VocabularyMatchGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="synonym"
            />
          ) : activeGame === 'word-association' ? (
            <VocabularyMatchGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="association"
            />
          ) : activeGame === 'missing-letter' ? (
            <MissingLetterGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="missing"
            />
          ) : activeGame === 'spelling-challenge' ? (
            <MissingLetterGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="spelling"
            />
          ) : activeGame === 'find-the-word' ? (
            <WordSearchGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="find"
            />
          ) : activeGame === 'letter-grid-search' ? (
            <WordSearchGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="grid"
            />
          ) : activeGame === 'word-memory' ? (
            <WordMemoryGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'letter-sequence' ? (
            <WordSequenceGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="sequence"
            />
          ) : activeGame === 'word-pattern' ? (
            <WordSequenceGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
              gameType="pattern"
            />
          ) : activeGame === 'word-speed-test' ? (
            <WordSpeedGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'vocabulary-builder' ? (
            <VocabularyBuilderGame 
              onBack={() => setActiveGame(null)} 
              onGameComplete={(score, maxLevel) => recordGame({ gameType: 'language', score, difficulty: 'normal', maxLevel })}
            />
          ) : activeGame === 'speed' ? (
            <ReactionSpeedGame 
              onBack={() => setActiveGame(null)} 
              onTrainingComplete={(score) => recordGame({ gameType: 'speed', score, difficulty: 'normal' })}
            />
          ) : activeGame === 'daily-training' ? (
            <DailyTraining 
              onBack={() => setActiveGame(null)} 
            />
          ) : activeGame ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-white/40" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('comingSoon', language)}</h2>
              <p className="text-white/60 mb-8">{t('inDevelopment', language)}</p>
              <button 
                onClick={() => setActiveGame(null)}
                className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Go Back
              </button>
            </div>
          ) : (
            <>
              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto hide-scrollbar pb-24 relative">
                {/* Global Header Actions */}
                <div className="px-6 pt-12 pb-2 flex justify-between items-center sticky top-0 bg-[#0a0a0c]/90 backdrop-blur-md z-30">
                  <div className="flex items-center gap-3">
                    {currentTab !== 'profile' ? (
                      <>
                        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 rounded-full">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-500 font-bold text-sm">12</span>
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-full">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          <span className="text-yellow-500 font-bold text-sm">150</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-amber-400 font-bold text-xs tracking-wider uppercase border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 rounded-full whitespace-nowrap">Unlock Brainova</span>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {currentTab === 'profile' && (
                      <div className="relative">
                        <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0"></div>
                        <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                    )}
                    <div className="relative">
                      <button onClick={() => setIsProfileSettingsOpen(!isProfileSettingsOpen)}>
                        <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      
                      <AnimatePresence>
                        {isProfileSettingsOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-40"
                              onClick={() => setIsProfileSettingsOpen(false)}
                            />
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-48 bg-[#1a1a1c] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                            >
                            <button 
                              onClick={() => {
                                fileInputRef.current?.click();
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-b border-white/5"
                            >
                              {t('changeProfilePhoto', language) || 'Change Profile Photo'}
                            </button>
                            <button 
                              onClick={() => {
                                setTempName(profileName);
                                setIsEditNameOpen(true);
                                setIsProfileSettingsOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-b border-white/5"
                            >
                              {t('changeName', language) || 'Change Name'}
                            </button>
                            <button 
                              onClick={() => {
                                setIsProfileSettingsOpen(false);
                                setIsModeModalOpen(true);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-b border-white/5"
                            >
                              {t('changeMode', language) || 'Change Mode'}
                            </button>
                            <button 
                              onClick={() => {
                                setIsProfileSettingsOpen(false);
                                setIsLanguageModalOpen(true);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                            >
                              {t('changeLanguage', language) || 'Change Language'}
                            </button>
                          </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
            
            {currentTab === 'home' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Header */}
                <div className="px-6 pt-6 pb-6 flex justify-between items-center">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">{getGreeting()},</p>
                    <h2 className="text-2xl font-bold">{profileName}</h2>
                  </div>
                  <button 
                    onClick={() => setIsXpRoadmapOpen(true)}
                    className="flex flex-col items-center hover:scale-105 transition-transform"
                  >
                    <div className="relative w-8 h-8 mb-1 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#4871b6] rotate-45 rounded-sm border-[3px] border-[#93bfe6] shadow-[inset_0_0_8px_rgba(0,0,0,0.3)]">
                        <div className="absolute inset-0 m-0.5 bg-[#324a76] shadow-[inset_0_0_4px_rgba(0,0,0,0.5)]"></div>
                      </div>
                      <span className="relative z-10 text-[#93bfe6] font-bold text-xs tracking-tighter" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>XP</span>
                    </div>
                    <span className="text-sm font-bold">36</span>
                  </button>
                </div>

                {/* New Daily Workout Card */}
                <div className="px-6 mb-8">
                  <div className="bg-[#1e293b] rounded-3xl p-8 flex flex-col items-center justify-center border border-white/5 shadow-lg relative overflow-hidden">
                    {/* Icon Area */}
                    <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                      {/* Segmented Ring */}
                      <svg className="absolute inset-0 w-full h-full text-slate-600" viewBox="0 0 100 100" style={{ transform: 'rotate(-45deg)' }}>
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="50 16" />
                      </svg>
                      {/* Brainova Theme Circle */}
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center z-10 shadow-inner">
                        <Brain className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{t('dailyWorkout', language)}</h3>
                    <p className="text-slate-400 text-sm mb-8">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} | 3 Games
                    </p>
                    
                    <button 
                      onClick={() => setActiveGame('daily-training')}
                      className="w-full max-w-[200px] bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg text-lg"
                    >
                      Start
                    </button>
                  </div>
                </div>

                {/* Favorite Games */}
                {likedGames.length > 0 && (
                  <div className="mb-8">
                    <div className="px-6 flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">{t('favoriteGames', language) || "Starred Games"}</h3>
                    </div>
                    <GameCarousel className="flex gap-4 pb-4 px-6 hide-scrollbar">
                      {allGames.filter(g => likedGames.includes(g.id)).map((game, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setActiveGame(game.id)}
                          className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 hover:bg-[#2a2a2c] transition-colors cursor-pointer group relative flex-shrink-0 w-[calc(40vw-22px)] sm:w-[160px] snap-start"
                        >
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLikedGame(game.id);
                            }}
                            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
                          >
                            <Star className={`w-4 h-4 ${likedGames.includes(game.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'}`} />
                          </button>
                          <div className={`w-12 h-12 rounded-xl ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            {game.icon}
                          </div>
                          <h4 className="font-bold mb-1 truncate">{game.title}</h4>
                          <p className="text-sm text-white/50">{game.category}</p>
                        </div>
                      ))}
                    </GameCarousel>
                  </div>
                )}

                {/* More Workouts */}
                <div className="px-6 mb-24">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">More Workouts</h3>
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
                      UNLOCK <Lock className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        title: "Math",
                        desc: "Challenge your estimation and calculation skills.",
                        icon: <Calculator className="w-6 h-6 text-white" />,
                        bgColor: "bg-pink-500",
                        progress: "0/5"
                      },
                      {
                        title: "Language",
                        desc: "Dive deep into your vocabulary and reading skills.",
                        icon: <Type className="w-6 h-6 text-white" />,
                        bgColor: "bg-teal-500",
                        progress: "0/5"
                      },
                      {
                        title: "Favorites",
                        desc: "Treat your brain to the games you play the most.",
                        icon: <Heart className="w-6 h-6 text-white" />,
                        bgColor: "bg-orange-400",
                        progress: "0/5"
                      },
                      {
                        title: "Strengthen",
                        desc: "Play your weakest games and raise your low game scores.",
                        icon: <Flag className="w-6 h-6 text-white" />,
                        bgColor: "bg-cyan-600",
                        progress: "0/5"
                      },
                      {
                        title: "Quick",
                        desc: "Race through short games in 8 minutes or less.",
                        icon: <Clock className="w-6 h-6 text-white" />,
                        bgColor: "bg-green-500",
                        progress: "0/5"
                      }
                    ].map((workout, idx) => (
                      <div 
                        key={idx} 
                        className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/10 flex items-center gap-4 relative overflow-hidden cursor-pointer hover:bg-[#2a2a2c] transition-colors"
                      >
                        <div className="absolute top-3 right-4 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                          <span className="text-xs text-white/80 font-medium">{workout.progress}</span>
                        </div>
                        
                        <div className="relative">
                          <div className={`w-14 h-14 rounded-full ${workout.bgColor} flex items-center justify-center`}>
                            {workout.icon}
                          </div>
                          <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-[#111] rounded-full flex items-center justify-center border-2 border-[#1a1a1c]">
                            <Lock className="w-3 h-3 text-white/80" />
                          </div>
                        </div>
                        
                        <div className="flex-1 pr-8">
                          <h4 className="font-bold text-base mb-1">{workout.title}</h4>
                          <p className="text-sm text-white/60 leading-snug">{workout.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentTab === 'games' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="px-6 pt-6 pb-6">
                  <h2 className="text-3xl font-bold mb-2">{t('allGames', language)}</h2>
                  <p className="text-white/60 text-sm mb-6">{t('selectGame', language)}</p>
                  
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      placeholder={t('searchGames', language)}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#1a1a1c] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-8 pb-24">
                  {Array.from(new Set(allGames.map(g => g.category)))
                    .filter(category => {
                      const categoryGames = allGames.filter(g => g.category === category);
                      const filteredGames = categoryGames.filter(g => 
                        g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        g.description.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      return filteredGames.length > 0;
                    })
                    .map(category => (
                    <div key={category}>
                      <h3 className="text-xl font-bold mb-4 text-white/80 px-6">{t(category.toLowerCase(), language)} {t('games', language)}</h3>
                      <GameCarousel className="flex gap-4 pb-4 px-6 hide-scrollbar">
                        {allGames.filter(g => g.category === category && (
                          g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.description.toLowerCase().includes(searchQuery.toLowerCase())
                        )).map(game => (
                          <button 
                            key={game.id} 
                            onClick={() => setActiveGame(game.id)}
                            className="w-[calc(40vw-22px)] sm:w-[160px] shrink-0 bg-[#1a1a1c] border border-white/5 rounded-3xl p-5 flex flex-col items-start hover:bg-[#2a2a2c] transition-colors group text-left relative overflow-hidden snap-start"
                          >
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLikedGame(game.id);
                              }}
                              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 transition-colors z-20"
                            >
                              <Star className={`w-5 h-5 ${likedGames.includes(game.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'}`} />
                            </div>
                            <div className={`absolute top-0 right-0 w-24 h-24 ${game.color} rounded-full blur-2xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity`} />
                            <div className={`w-12 h-12 rounded-2xl ${game.color} border ${game.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10`}>
                              {game.icon}
                            </div>
                            <h3 className="text-lg font-bold mb-1 relative z-10">{game.title}</h3>
                            <p className="text-xs text-white/50 leading-relaxed relative z-10">{game.description}</p>
                          </button>
                        ))}
                      </GameCarousel>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentTab === 'coach' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="px-6 pt-6 pb-6">
                  <h2 className="text-3xl font-bold mb-2 leading-tight">
                    Your personal coach,<br/>
                    <span className="inline-flex items-center mt-1">
                      <motion.span 
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={{ clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "linear" }}
                        className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent pr-1"
                      >
                        Brainova Ai
                      </motion.span>
                    </span>
                  </h2>
                  <p className="text-white/60 text-sm">Your personalized training plan and insights.</p>
                </div>

                <div className="px-6 space-y-6">
                  <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <Bot className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">{t('todaysAnalysis', language)}</h3>
                        <p className="text-sm text-white/70 leading-relaxed">
                          Your memory scores are improving! I recommend focusing on Logic games today to balance your cognitive profile.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1a1a1c] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold mb-4">{t('whatToImprove', language)}</h3>
                    <p className="text-sm text-white/60 mb-4">Tell Brainova AI what you want to focus on, like "improve calculation speed" or "better focus".</p>
                    <div className="relative flex items-center">
                      <input 
                        type="text" 
                        placeholder="e.g., I want to improve my focus..." 
                        className="w-full bg-[#2a2a2c] border border-white/10 rounded-2xl py-4 pl-4 pr-24 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                      <div className="absolute right-2 flex items-center gap-1">
                        <button className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                          <Mic className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors">
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-bold">{t('personalizedPlan', language)}</h3>
                      </div>
                      <p className="text-sm text-white/70 mb-6">{t('letNovaCreate', language)}</p>
                      <button 
                        onClick={() => {
                          setPlanStep(0);
                          setPlanAnswers({});
                          setGeneratedPlan(null);
                          setIsPlanGeneratorOpen(true);
                        }}
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                      >
                        {t('createMyPlan', language)}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#1a1a1c] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold mb-4">{t('recommendedTraining', language)}</h3>
                    <div className="space-y-4">
                      {allGames.filter(g => g.category === 'Logic').slice(0, 2).map(game => (
                        <button 
                          key={game.id}
                          onClick={() => setActiveGame(game.id)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#2a2a2c] hover:bg-[#3a3a3c] transition-colors text-left"
                        >
                          <div className={`w-12 h-12 rounded-xl ${game.color} flex items-center justify-center shrink-0`}>
                            {game.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold">{game.title}</h4>
                            <p className="text-xs text-white/50">{game.category}</p>
                          </div>
                          <Play className="w-5 h-5 text-white/40" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentTab === 'stats' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="px-6 pt-6 pb-6">
                  <h2 className="text-3xl font-bold mb-2">{t('yourProgress', language)}</h2>
                  <p className="text-white/60 text-sm">Track your cognitive improvement.</p>
                </div>

                <div className="px-6 mb-8 grid grid-cols-2 gap-4">
                  <div className="bg-[#1a1a1c] rounded-3xl p-5 border border-white/5">
                    <div className="flex items-center gap-2 text-rose-400 mb-2">
                      <Flame className="w-5 h-5" />
                      <span className="font-medium">{t('dailyStreak', language)}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{stats.dailyStreak}</span>
                      <span className="text-white/50 text-sm">{t('days', language)}</span>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1c] rounded-3xl p-5 border border-white/5">
                    <div className="flex items-center gap-2 text-indigo-400 mb-2">
                      <Trophy className="w-5 h-5" />
                      <span className="font-medium">{t('gamesPlayed', language)}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{stats.totalGamesPlayed}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Chart */}
                <div className="px-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{t('activity', language)}</h3>
                    <div className="flex bg-[#1a1a1c] rounded-lg p-1 border border-white/5">
                      <button className="px-3 py-1 rounded-md bg-white/10 text-xs font-medium text-white">{t('daily', language)}</button>
                      <button className="px-3 py-1 rounded-md text-xs font-medium text-white/50 hover:text-white transition-colors">{t('monthly', language)}</button>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1c] rounded-3xl p-5 border border-white/5 h-48 flex items-end justify-between gap-2">
                    {/* Mock Daily Chart Bars */}
                    {[40, 60, 30, 80, 50, 90, 70].map((height, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full bg-white/5 rounded-t-sm relative flex-1 flex items-end">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                            className={`w-full rounded-t-sm ${i === 6 ? 'bg-indigo-500' : 'bg-indigo-500/40'}`}
                          />
                        </div>
                        <span className="text-[10px] text-white/40 font-medium">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last Activity */}
                <div className="px-6 mb-6">
                  <h3 className="text-lg font-bold mb-4">{t('lastActivity', language)}</h3>
                  <div className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-medium">{t('sequenceRecall', language)}</div>
                        <div className="text-sm text-white/50">{t('today', language)}, 10:42 AM</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">{t('level', language)} 4</div>
                      <div className="text-xs text-white/50">Score: 1250</div>
                    </div>
                  </div>
                </div>

                <div className="px-6 mb-6">
                  <h3 className="text-lg font-bold mb-4">{t('highScores', language)}</h3>
                  <div className="space-y-4">
                    <div className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="font-medium">{t('memoryGames', language)}</span>
                      </div>
                      <span className="font-bold text-lg">{stats.highScores.memory}</span>
                    </div>
                    <div className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                          <Target className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="font-medium">{t('focusGames', language)}</span>
                      </div>
                      <span className="font-bold text-lg">{stats.highScores.focus}</span>
                    </div>
                    <div className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                          <Lightbulb className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="font-medium">{t('logicGames', language)}</span>
                      </div>
                      <span className="font-bold text-lg">{stats.highScores.logic}</span>
                    </div>
                    <div className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <Calculator className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="font-medium">{t('mathGames', language)}</span>
                      </div>
                      <span className="font-bold text-lg">{stats.highScores.math}</span>
                    </div>
                    <div className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-rose-400" />
                        </div>
                        <span className="font-medium">{t('reactionSpeed', language)}</span>
                      </div>
                      <span className="font-bold text-lg">{stats.highScores.speed}</span>
                    </div>
                    <div className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                          <Type className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="font-medium">{t('languageWord', language)}</span>
                      </div>
                      <span className="font-bold text-lg">{stats.highScores.language}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentTab === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pb-24 pt-6"
              >
                {/* Avatar & Basic Stats */}
                <div className="px-6 flex flex-col items-center justify-center mb-8 w-full text-center">
                  <div className="w-24 h-24 rounded-full bg-[#1e5b6b] flex items-center justify-center overflow-hidden mb-4 mx-auto">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" style={{ filter: displayMode === 'light' ? 'invert(1) hue-rotate(180deg)' : 'none' }} />
                    ) : (
                      <span className="text-4xl font-medium text-white">{profileName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-medium mb-8 text-center w-full">{profileName}</h2>
                  
                  <div className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto">
                    <div className="flex flex-col items-center justify-start">
                      <Flame className="w-8 h-8 text-orange-500 mb-2 fill-orange-500" />
                      <span className="text-[10px] text-cyan-400 font-bold tracking-wider mb-1 uppercase text-center">{t('dailyStreak', language)}</span>
                      <span className="text-sm font-medium">0 {t('days', language)}</span>
                    </div>
                    <div className="flex flex-col items-center justify-start">
                      <CircleDollarSign className="w-8 h-8 text-yellow-500 mb-2 fill-yellow-500" />
                      <span className="text-[10px] text-cyan-400 font-bold tracking-wider mb-1 uppercase text-center">COINS</span>
                      <span className="text-sm font-medium">150</span>
                    </div>
                    <div className="flex flex-col items-center justify-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                        <span className="text-white font-bold text-xs">{t('xp', language)}</span>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-bold tracking-wider mb-1 uppercase text-center">{t('totalXp', language)}</span>
                      <span className="text-sm font-medium">36</span>
                    </div>
                  </div>
                </div>

                {/* Premium Upgrade Card */}
                <div className="px-6 mb-8">
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <h3 className="text-xl font-bold text-amber-400">{t('brainovaPro', language)}</h3>
                      </div>
                      <p className="text-white/80 text-sm mb-4">{t('unlockAllGames', language)}</p>
                      <button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl transition-colors">
                        {t('upgradeNow', language)}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="px-6 mb-8">
                  <div className="flex border-b border-white/10">
                    <button 
                      onClick={() => setProfileTab('performance')}
                      className={`flex-1 pb-4 text-sm font-medium transition-colors ${profileTab === 'performance' ? 'text-white border-b-2 border-white' : 'text-white/40 hover:text-white/60'}`}
                    >
                      {t('performance', language)}
                    </button>
                    <button 
                      onClick={() => setProfileTab('achievements')}
                      className={`flex-1 pb-4 text-sm font-medium transition-colors ${profileTab === 'achievements' ? 'text-white border-b-2 border-white' : 'text-white/40 hover:text-white/60'}`}
                    >
                      {t('achievements', language)}
                    </button>
                  </div>
                </div>

                {/* Performance Content */}
                {profileTab === 'performance' && (
                  <div className="px-6">
                    <div className="flex items-center justify-center mb-6 relative">
                      <h3 className="text-4xl font-light">{t('epq', language)}</h3>
                      <button className="absolute right-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs text-white/60">?</button>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex justify-center gap-3 mb-10">
                      <button className="px-4 py-1 rounded-full bg-white/20 text-[10px] font-bold tracking-wider">{t('all', language)}</button>
                      <button className="w-7 h-7 rounded-full border border-teal-400 text-teal-400 flex items-center justify-center text-[10px] font-bold">W</button>
                      <button className="w-7 h-7 rounded-full border border-orange-400 text-orange-400 flex items-center justify-center text-[10px] font-bold">S</button>
                      <button className="w-7 h-7 rounded-full border border-pink-400 text-pink-400 flex items-center justify-center text-[10px] font-bold">R</button>
                      <button className="w-7 h-7 rounded-full border border-purple-400 text-purple-400 flex items-center justify-center text-[10px] font-bold">M</button>
                      <button className="w-7 h-7 rounded-full border border-amber-400 text-amber-400 flex items-center justify-center text-[10px] font-bold">M</button>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-6">
                      {/* Writing */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">{t('writing', language)}:</span>
                            <span className="text-base font-bold">1648</span>
                          </div>
                          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">{t('intermediate', language)}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 flex">
                          <div className="h-full bg-teal-400 w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-teal-400 w-[10%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[10%]"></div>
                        </div>
                      </div>

                      {/* Speaking */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">{t('speaking', language)}:</span>
                            <span className="text-base font-bold">1607</span>
                          </div>
                          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">{t('intermediate', language)}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 flex">
                          <div className="h-full bg-orange-400 w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-orange-400 w-[5%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[25%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[10%]"></div>
                        </div>
                      </div>

                      {/* Reading */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">{t('reading', language)}:</span>
                            <span className="text-base font-bold">1660</span>
                          </div>
                          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">{t('intermediate', language)}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 flex">
                          <div className="h-full bg-pink-400 w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-pink-400 w-[10%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[10%]"></div>
                        </div>
                      </div>

                      {/* Math */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">{t('math', language)}:</span>
                            <span className="text-base font-bold">2322</span>
                          </div>
                          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">{t('intermediate', language)}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 flex">
                          <div className="h-full bg-purple-400 w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-purple-400 w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[10%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[10%]"></div>
                        </div>
                      </div>

                      {/* Memory */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">{t('memory', language)}:</span>
                            <Lock className="w-3 h-3 text-white/40" />
                          </div>
                          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">{t('intermediate', language)}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 flex">
                          <div className="h-full bg-amber-400 w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-amber-400 w-[5%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[25%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[20%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[10%]"></div>
                        </div>
                      </div>

                      {/* Average */}
                      <div className="pt-4">
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">{t('average', language)}:</span>
                            <span className="text-base font-bold">1769</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-white/10 flex">
                          <div className="h-full bg-cyan-400 w-[30%] border-r border-[#0a0a0c]"></div>
                          <div className="h-full bg-transparent w-[70%]"></div>
                        </div>
                      </div>
                    </div>

                    {/* Rankings */}
                    <div className="mt-12 pt-8 border-t border-white/10 text-center relative">
                      <h3 className="text-4xl font-light mb-8">{t('rankings', language)}</h3>
                      <button className="absolute right-0 top-8 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs text-white/60">?</button>
                      
                      <div className="flex justify-center gap-4 mb-6">
                        <div className="flex flex-col items-center">
                          <div className="relative w-16 h-16 mb-2">
                            <div className="absolute inset-0 bg-yellow-400 rounded-full border-4 border-yellow-500 shadow-lg flex items-center justify-center">
                              <span className="text-yellow-700 font-bold text-2xl">1</span>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              <div className="w-3 h-4 bg-blue-500 transform -skew-x-12"></div>
                              <div className="w-3 h-4 bg-blue-500 transform skew-x-12"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="relative w-16 h-16 mb-2">
                            <div className="absolute inset-0 bg-gray-300 rounded-full border-4 border-gray-400 shadow-lg flex items-center justify-center">
                              <span className="text-gray-600 font-bold text-2xl">2</span>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              <div className="w-3 h-4 bg-blue-500 transform -skew-x-12"></div>
                              <div className="w-3 h-4 bg-blue-500 transform skew-x-12"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="relative w-16 h-16 mb-2">
                            <div className="absolute inset-0 bg-orange-400 rounded-full border-4 border-orange-500 shadow-lg flex items-center justify-center">
                              <span className="text-orange-700 font-bold text-2xl">3</span>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              <div className="w-3 h-4 bg-blue-500 transform -skew-x-12"></div>
                              <div className="w-3 h-4 bg-blue-500 transform skew-x-12"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-white/60 font-medium mb-6">{t('completeWorkouts', language)}</p>
                      
                      <button className="text-cyan-400 font-bold text-sm tracking-widest hover:text-cyan-300 transition-colors uppercase">
                        {t('goToTraining', language)}
                      </button>
                    </div>
                  </div>
                )}
                
                {profileTab === 'achievements' && (
                  <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">{t('noAchievements', language)}</p>
                  </div>
                )}

                {/* Support Information Section */}
                <div className="mt-8 border-t border-white/10">
                  <div className="px-6 py-4 bg-[#0a1922]">
                    <h3 className="text-sm font-medium text-white/80">{t('supportInformation', language)}</h3>
                  </div>
                  <div className="bg-[#06141c] flex flex-col">
                    <button 
                      onClick={() => setIsStarredGamesOpen(true)}
                      className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left"
                    >
                      <Star className="w-6 h-6 text-white/60" />
                      <span className="font-medium text-sm">{t('favoriteGames', language)}</span>
                    </button>
                    <button className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left">
                      <Settings className="w-6 h-6 text-white/60" />
                      <span className="font-medium text-sm">{t('settings', language)}</span>
                    </button>
                    <button 
                      onClick={() => setIsModeModalOpen(true)}
                      className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left"
                    >
                      <Moon className="w-6 h-6 text-white/60" />
                      <span className="font-medium text-sm">{t('changeMode', language)}</span>
                    </button>
                    <button 
                      onClick={() => setIsLanguageModalOpen(true)}
                      className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left"
                    >
                      <Globe className="w-6 h-6 text-white/60" />
                      <span className="font-medium text-sm">{t('language', language)}</span>
                    </button>
                    <button className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left">
                      <FileText className="w-6 h-6 text-white/60" />
                      <span className="font-medium text-sm">{t('termsOfUse', language)}</span>
                    </button>
                    <button className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left">
                      <Shield className="w-6 h-6 text-white/60" />
                      <span className="font-medium text-sm">{t('privacyPolicy', language)}</span>
                    </button>
                    <button className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left">
                      <HelpCircle className="w-6 h-6 text-white/60" />
                      <span className="font-medium text-sm">{t('help', language)}</span>
                    </button>
                    <button className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left">
                      <Download className="w-6 h-6 text-white/60" />
                      <span className="font-medium text-sm">{t('dataExport', language)}</span>
                    </button>
                    <button className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left">
                      <User className="w-6 h-6 text-white/60" />
                      <span className="font-medium text-sm">{t('deleteAccount', language)}</span>
                    </button>
                    <button className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left">
                      <MessageSquare className="w-6 h-6 text-white/60" />
                      <span className="font-medium text-sm">{t('yourFeedback', language)}</span>
                    </button>
                    <button className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left">
                      <Sliders className="w-6 h-6 text-white/60" />
                      <span className="font-medium text-sm">{t('privacySettings', language)}</span>
                    </button>
                    <button 
                      onClick={() => setIsAdminPanelOpen(true)}
                      className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors text-left"
                    >
                      <Lock className="w-6 h-6 text-emerald-400" />
                      <span className="font-medium text-sm text-emerald-400">{t('adminPanel', language)}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* XP Roadmap Modal */}
            <AnimatePresence>
              {isXpRoadmapOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  className="fixed inset-0 z-50 bg-[#0a0a0c] flex flex-col"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#4871b6] rotate-45 rounded-sm border-[2px] border-[#93bfe6]"></div>
                        <span className="relative z-10 text-[#93bfe6] font-bold text-[10px] tracking-tighter">XP</span>
                      </div>
                      <h2 className="text-xl font-bold text-[#93bfe6]">Your Journey</h2>
                    </div>
                    <button 
                      onClick={() => setIsXpRoadmapOpen(false)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 relative">
                    {/* Progress Line */}
                    <div className="absolute left-10 top-12 bottom-12 w-1 bg-white/10 rounded-full"></div>
                    <div className="absolute left-10 top-12 h-1/4 w-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>

                    <div className="space-y-12 relative">
                      {/* Starter Stage */}
                      <div className="flex items-center gap-6">
                        <div className="relative z-10 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.6)]">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 bg-[#1a1a1c] border border-indigo-500/30 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                          <h3 className="font-bold text-lg text-indigo-400 mb-1">Starter</h3>
                          <p className="text-sm text-white/60 mb-2">0 - 100 XP</p>
                          <p className="text-sm">You've taken the first step on your cognitive journey.</p>
                        </div>
                      </div>

                      {/* Learner Stage */}
                      <div className="flex items-center gap-6">
                        <div className="relative z-10 w-8 h-8 rounded-full bg-[#1a1a1c] border-2 border-indigo-500 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        </div>
                        <div className="flex-1 bg-[#1a1a1c] border border-white/10 rounded-2xl p-4 opacity-90">
                          <h3 className="font-bold text-lg text-white mb-1">Learner</h3>
                          <p className="text-sm text-white/60 mb-2">100 - 500 XP</p>
                          <p className="text-sm">Building foundational skills and daily habits.</p>
                          <div className="mt-3 bg-white/5 rounded-full h-2 overflow-hidden">
                            <div className="bg-indigo-500 h-full" style={{ width: '36%' }}></div>
                          </div>
                          <p className="text-xs text-white/40 mt-1 text-right">36 / 100 XP</p>
                        </div>
                      </div>

                      {/* Skilled Stage */}
                      <div className="flex items-center gap-6">
                        <div className="relative z-10 w-8 h-8 rounded-full bg-[#1a1a1c] border-2 border-white/20 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="flex-1 bg-[#1a1a1c] border border-white/5 rounded-2xl p-4 opacity-50">
                          <h3 className="font-bold text-lg text-white/60 mb-1">Skilled</h3>
                          <p className="text-sm text-white/40 mb-2">500 - 2,000 XP</p>
                          <p className="text-sm text-white/60">Demonstrating consistent cognitive improvement.</p>
                        </div>
                      </div>

                      {/* Expert Stage */}
                      <div className="flex items-center gap-6">
                        <div className="relative z-10 w-8 h-8 rounded-full bg-[#1a1a1c] border-2 border-white/20 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="flex-1 bg-[#1a1a1c] border border-white/5 rounded-2xl p-4 opacity-50">
                          <h3 className="font-bold text-lg text-white/60 mb-1">Expert</h3>
                          <p className="text-sm text-white/40 mb-2">2,000 - 5,000 XP</p>
                          <p className="text-sm text-white/60">Mastering complex mental challenges with ease.</p>
                        </div>
                      </div>

                      {/* Master Stage */}
                      <div className="flex items-center gap-6">
                        <div className="relative z-10 w-8 h-8 rounded-full bg-[#1a1a1c] border-2 border-white/20 flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="flex-1 bg-[#1a1a1c] border border-white/5 rounded-2xl p-4 opacity-50">
                          <h3 className="font-bold text-lg text-yellow-500/60 mb-1">Master</h3>
                          <p className="text-sm text-white/40 mb-2">5,000+ XP</p>
                          <p className="text-sm text-white/60">The pinnacle of cognitive performance.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mode Modal */}
            <AnimatePresence>
              {isModeModalOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  className="fixed inset-0 z-50 bg-[#0a0a0c] flex flex-col"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <Moon className="w-6 h-6 text-indigo-400" />
                      <h2 className="text-xl font-bold text-indigo-400">{t('changeMode', language)}</h2>
                    </div>
                    <button 
                      onClick={() => setIsModeModalOpen(false)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => {
                          setDisplayMode('light');
                          setIsModeModalOpen(false);
                        }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border ${displayMode === 'light' ? 'bg-indigo-500/20 border-indigo-500' : 'bg-[#1a1a1c] border-white/5 hover:bg-[#2a2a2c]'} transition-colors text-left`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${displayMode === 'light' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60'}`}>
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Light Mode</h3>
                          <p className="text-sm text-white/60">Standard bright mode for well-lit environments.</p>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => {
                          setDisplayMode('dark');
                          setIsModeModalOpen(false);
                        }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border ${displayMode === 'dark' ? 'bg-indigo-500/20 border-indigo-500' : 'bg-[#1a1a1c] border-white/5 hover:bg-[#2a2a2c]'} transition-colors text-left`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${displayMode === 'dark' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60'}`}>
                          <Moon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Dark Mode</h3>
                          <p className="text-sm text-white/60">Dark theme for low-light environments and eye comfort.</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => {
                          setDisplayMode('reading');
                          setIsModeModalOpen(false);
                        }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border ${displayMode === 'reading' ? 'bg-indigo-500/20 border-indigo-500' : 'bg-[#1a1a1c] border-white/5 hover:bg-[#2a2a2c]'} transition-colors text-left`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${displayMode === 'reading' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60'}`}>
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Reading Mode</h3>
                          <p className="text-sm text-white/60">Warmer, sepia-like tone to reduce blue light and eye strain.</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => {
                          setDisplayMode('high-contrast');
                          setIsModeModalOpen(false);
                        }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border ${displayMode === 'high-contrast' ? 'bg-indigo-500/20 border-indigo-500' : 'bg-[#1a1a1c] border-white/5 hover:bg-[#2a2a2c]'} transition-colors text-left`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${displayMode === 'high-contrast' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60'}`}>
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">High Contrast / Vivid</h3>
                          <p className="text-sm text-white/60">Maximizes visibility and productivity with distinct colors.</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Starred Games Modal */}
            <AnimatePresence>
              {isStarredGamesOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  className="fixed inset-0 z-50 bg-[#0a0a0c] flex flex-col"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      <h2 className="text-xl font-bold text-yellow-400">{t('favoriteGames', language)}</h2>
                    </div>
                    <button 
                      onClick={() => setIsStarredGamesOpen(false)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    {likedGames.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Star className="w-16 h-16 text-white/20 mb-4" />
                        <h3 className="text-xl font-bold mb-2">{t('favoriteGames', language)}</h3>
                        <p className="text-white/60 max-w-xs">{t('noStarredGames', language) || 'You have not starred any games yet. Star games to see them here.'}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {allGames.filter(g => likedGames.includes(g.id)).map((game, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => {
                              setActiveGame(game.id);
                              setIsStarredGamesOpen(false);
                            }}
                            className="bg-[#1a1a1c] rounded-2xl p-4 border border-white/5 hover:bg-[#2a2a2c] transition-colors cursor-pointer group relative"
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLikedGame(game.id);
                              }}
                              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
                            >
                              <Star className={`w-4 h-4 ${likedGames.includes(game.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'}`} />
                            </button>
                            <div className={`w-12 h-12 rounded-xl ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                              {game.icon}
                            </div>
                            <h4 className="font-bold mb-1 truncate">{game.title}</h4>
                            <p className="text-xs text-white/60 truncate">{game.category}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Admin Panel Modal */}
            <AnimatePresence>
              {isAdminPanelOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  className="fixed inset-0 z-50 bg-[#0a0a0c] flex flex-col"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <Lock className="w-6 h-6 text-emerald-400" />
                      <h2 className="text-xl font-bold text-emerald-400">{t('adminPanel', language)}</h2>
                    </div>
                    <button 
                      onClick={() => setIsAdminPanelOpen(false)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-[#1a1a1c] border border-white/10 rounded-2xl p-6 mb-6">
                      <h3 className="text-lg font-bold mb-4">{t('systemStatus', language)}</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">{t('server', language)}</span>
                          <span className="text-emerald-400 font-medium flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            Online
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">{t('activeUsers', language)}</span>
                          <span className="font-medium">1,248</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">{t('databaseLoad', language)}</span>
                          <span className="font-medium text-yellow-400">42%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a1c] border border-white/10 rounded-2xl p-6">
                      <h3 className="text-lg font-bold mb-4">{t('quickActions', language)}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="bg-white/5 hover:bg-white/10 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors">
                          <User className="w-6 h-6 text-cyan-400" />
                          <span className="text-sm font-medium">{t('manageUsers', language)}</span>
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors">
                          <Gamepad2 className="w-6 h-6 text-purple-400" />
                          <span className="text-sm font-medium">{t('gameSettings', language)}</span>
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors">
                          <Activity className="w-6 h-6 text-orange-400" />
                          <span className="text-sm font-medium">{t('analytics', language)}</span>
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors">
                          <Settings className="w-6 h-6 text-gray-400" />
                          <span className="text-sm font-medium">{t('systemConfig', language)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Plan Generator Modal */}
            <AnimatePresence>
              {isPlanGeneratorOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm"
                  onClick={() => setIsPlanGeneratorOpen(false)}
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#1a1a1c] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl relative flex flex-col max-h-[90vh]"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6 shrink-0">
                      <h3 className="font-bold text-xl">{t('novaPlanGenerator', language)}</h3>
                      <button 
                        onClick={() => setIsPlanGeneratorOpen(false)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/50 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="overflow-y-auto flex-1 pr-2 -mr-2">
                      {isGeneratingPlan ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                            <Bot className="w-10 h-10 text-indigo-400" />
                          </div>
                          <h4 className="text-2xl font-bold mb-3">{t('analyzingProfile', language)}</h4>
                          <p className="text-white/60 text-base">{t('novaCrafting', language)}</p>
                        </div>
                      ) : generatedPlan ? (
                        <div className="space-y-8 py-4">
                          <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                              <CheckCircle className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h4 className="text-3xl font-bold mb-3">{t(generatedPlan.title, language)}</h4>
                            <p className="text-white/60 text-base leading-relaxed">{t(generatedPlan.description, language)}</p>
                          </div>
                          
                          <div className="space-y-4">
                            <h5 className="font-bold text-sm text-white/80 uppercase tracking-wider mb-2">{t('yourCustomRoutine', language)}</h5>
                            {generatedPlan.games.map(game => (
                              <button 
                                key={game.id}
                                onClick={() => {
                                  setIsPlanGeneratorOpen(false);
                                  setActiveGame(game.id);
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#2a2a2c] hover:bg-[#3a3a3c] transition-colors text-left"
                              >
                                <div className={`w-14 h-14 rounded-xl ${game.color} flex items-center justify-center shrink-0`}>
                                  {game.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-lg">{game.title}</h4>
                                  <p className="text-sm text-white/50">{game.category}</p>
                                </div>
                                <Play className="w-6 h-6 text-white/30" />
                              </button>
                            ))}
                          </div>
                          
                          <button 
                            onClick={() => setIsPlanGeneratorOpen(false)}
                            className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg transition-colors mt-4"
                          >
                            {t('startTraining', language)}
                          </button>
                        </div>
                      ) : (
                        <div className="py-2">
                          <div className="flex items-center justify-between mb-8">
                            <span className="text-sm font-medium text-indigo-400">{t('question', language)} {planStep + 1} {t('of', language)} {planQuestions.length}</span>
                            <div className="flex gap-1">
                              {planQuestions.map((_, i) => (
                                <div key={i} className={`h-1.5 w-3 sm:w-4 rounded-full ${i <= planStep ? 'bg-indigo-500' : 'bg-white/10'}`} />
                              ))}
                            </div>
                          </div>
                          
                          <h4 className="text-2xl font-bold mb-8 leading-tight">{t(planQuestions[planStep].question, language)}</h4>
                          
                          <div className="space-y-3">
                            {planQuestions[planStep].options.map((option, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  const newAnswers = { ...planAnswers, [planStep]: option };
                                  setPlanAnswers(newAnswers);
                                  
                                  if (planStep < planQuestions.length - 1) {
                                    setPlanStep(planStep + 1);
                                  } else {
                                    // Generate plan
                                    setIsGeneratingPlan(true);
                                    setTimeout(() => {
                                      setIsGeneratingPlan(false);
                                      setGeneratedPlan({
                                        title: "focusLogicMaster",
                                        description: "focusLogicDesc",
                                        games: [
                                          allGames.find(g => g.id === 'sudoku') || allGames[0],
                                          allGames.find(g => g.id === 'sequence') || allGames[1],
                                          allGames.find(g => g.id === 'reaction') || allGames[2]
                                        ]
                                      });
                                    }, 2500);
                                  }
                                }}
                                className="w-full p-5 rounded-2xl bg-[#2a2a2c] hover:bg-indigo-500/20 border border-transparent hover:border-indigo-500/50 transition-all text-left font-medium text-lg"
                              >
                                {t(option, language)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pro Modal */}
            <AnimatePresence>
              {isProModalOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm"
                  onClick={() => setIsProModalOpen(false)}
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#2c1b00] border border-[#ff9900]/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
                    onClick={e => e.stopPropagation()}
                  >
                    <button 
                      onClick={() => setIsProModalOpen(false)}
                      className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="w-7 h-7 text-[#ff9900] fill-[#ff9900]" />
                      <h2 className="text-2xl font-bold text-[#ff9900]">{t('brainovaPro', language)}</h2>
                    </div>
                    <p className="text-white/90 mb-8 leading-relaxed text-lg">
                      {t('unlockAllGames', language)}
                    </p>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setIsProModalOpen(false)}
                        className="w-full py-4 bg-[#ff9900] hover:bg-[#e68a00] text-black font-bold rounded-2xl transition-colors text-lg"
                      >
                        Upgrade Now
                      </button>
                      <button 
                        onClick={() => setIsProModalOpen(false)}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-colors text-lg flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Watch Ad to Unlock
                      </button>
                      <button 
                        onClick={() => {
                          setIsProModalOpen(false);
                          setCurrentTab('coach');
                        }}
                        className="w-full py-2 text-white/50 hover:text-white font-medium transition-colors text-sm"
                      >
                        {t('skipForNow', language)}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Name Modal */}
            <AnimatePresence>
              {isEditNameOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    className="bg-[#1a1a1c] border border-white/10 rounded-3xl p-6 w-full max-w-sm"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">{t('changeName', language) || 'Change Name'}</h3>
                      <button onClick={() => setIsEditNameOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3 text-white mb-6 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Enter your name"
                      autoFocus
                    />
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsEditNameOpen(false)}
                        className="flex-1 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleNameSave}
                        className="flex-1 py-3 rounded-xl font-bold bg-indigo-500 hover:bg-indigo-600 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Language Modal */}
            <AnimatePresence>
              {isLanguageModalOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm"
                  onClick={() => setIsLanguageModalOpen(false)}
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#1a1a1c] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
                    onClick={e => e.stopPropagation()}
                  >
                    <button 
                      onClick={() => setIsLanguageModalOpen(false)}
                      className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3 mb-6">
                      <Globe className="w-7 h-7 text-indigo-400" />
                      <h2 className="text-2xl font-bold text-white">{t('selectLanguage', language) || "Select Language"}</h2>
                    </div>
                    <div className="w-full space-y-3 max-h-[50vh] overflow-y-auto hide-scrollbar pb-4 px-2 -mx-2">
                      {[
                        { code: 'en', name: 'English' },
                        { code: 'hi', name: 'हिंदी (Hindi)' },
                        { code: 'bn', name: 'বাংলা (Bengali)' },
                        { code: 'mr', name: 'मराठी (Marathi)' },
                        { code: 'te', name: 'తెలుగు (Telugu)' },
                        { code: 'ta', name: 'தமிழ் (Tamil)' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as Language);
                            setIsLanguageModalOpen(false);
                          }}
                          className={`w-full p-4 rounded-2xl border transition-all text-lg font-medium ${
                            language === lang.code 
                              ? 'bg-indigo-500/20 border-indigo-500/50 text-white' 
                              : 'bg-[#2a2a2c] border-white/5 text-white/70 hover:bg-[#3a3a3c] hover:text-white'
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Bottom Navigation Mock */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0a0c]/90 backdrop-blur-md border-t border-white/5 flex justify-around items-center px-6 z-20">
            <button 
              onClick={() => setCurrentTab('home')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'home' ? 'text-white' : 'text-white/40 hover:text-white'}`}
            >
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">{t('home', language)}</span>
            </button>
            <button 
              onClick={() => setCurrentTab('games')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'games' ? 'text-white' : 'text-white/40 hover:text-white'}`}
            >
              <Gamepad2 className="w-6 h-6" />
              <span className="text-[10px] font-medium">{t('games', language)}</span>
            </button>
            <button 
              onClick={() => setIsProModalOpen(true)}
              className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'coach' ? 'text-white' : 'text-white/40 hover:text-white'}`}
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-[10px] font-medium">AI</span>
            </button>
            <button 
              onClick={() => setCurrentTab('stats')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'stats' ? 'text-white' : 'text-white/40 hover:text-white'}`}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-[10px] font-medium">{t('stats', language)}</span>
            </button>
            <button 
              onClick={() => setCurrentTab('profile')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentTab === 'profile' ? 'text-white' : 'text-white/40 hover:text-white'}`}
            >
              <User className="w-6 h-6" />
              <span className="text-[10px] font-medium">{t('profile', language)}</span>
            </button>
          </div>
          </>
          )}
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] font-sans text-white relative overflow-hidden" style={getModeStyles()}>
          {/* Auth Content Area */}
          <div className="flex-1 flex flex-col px-8 pt-20 pb-12 overflow-y-auto hide-scrollbar">
            <AnimatePresence mode="wait">
              {authMode === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col items-center text-center h-full justify-center"
                >
                  <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
                    <Brain className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{t('welcomeToBrainova', language)}</h2>
                  <p className="text-white/60 mb-8">{t('signupLoginText', language)}</p>
                  
                  <div className="w-full space-y-4 mb-8">
                    <input 
                      type="email" 
                      placeholder={t('enterEmail', language)} 
                      className="w-full px-4 py-3 bg-[#1a1a1c] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <input 
                      type="password" 
                      placeholder={t('password', language)} 
                      className="w-full px-4 py-3 bg-[#1a1a1c] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button 
                      onClick={() => setIsLoggedIn(true)}
                      className="w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors"
                    >
                      {t('logIn', language)}
                    </button>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <button 
                      onClick={() => setIsLoggedIn(true)}
                      className="w-full py-4 rounded-2xl bg-white text-black font-semibold text-lg hover:scale-[0.98] transition-transform flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      {t('continueWithGoogle', language)}
                    </button>
                  </div>

                  <div className="mt-8 text-sm text-white/60">
                    {t('dontHaveAccount', language)}{' '}
                    <button onClick={() => setAuthMode('signup')} className="text-indigo-400 font-semibold hover:text-indigo-300">
                      {t('signUp', language)}
                    </button>
                  </div>

                  <button 
                    onClick={() => { setIsCompleted(false); setCurrentStep(0); }}
                    className="mt-auto pt-8 text-xs text-white/30 hover:text-white transition-colors"
                  >
                    {t('restartOnboarding', language)}
                  </button>
                </motion.div>
              )}

              {authMode === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col h-full"
                >
                  <button 
                    onClick={() => setAuthMode('select')}
                    className="w-10 h-10 rounded-full bg-[#1a1a1c] flex items-center justify-center mb-8 hover:bg-[#2a2a2c] transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <h2 className="text-3xl font-bold mb-2">{t('welcomeBack', language)}</h2>
                  <p className="text-white/60 mb-8">{t('loginToContinue', language)}</p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input 
                        type="email" 
                        placeholder={t('emailAddress', language)} 
                        className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input 
                        type="password" 
                        placeholder={t('password', language)} 
                        className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-8">
                    <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {t('adminPanel', language)}
                    </button>
                    <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                      {t('forgotPassword', language)}
                    </button>
                  </div>

                  <button 
                    onClick={() => setIsLoggedIn(true)}
                    className="w-full py-4 rounded-2xl bg-white text-black font-semibold text-lg hover:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    {t('logIn', language)}
                  </button>

                  <div className="mt-auto pt-8 text-center text-sm text-white/60">
                    {t('dontHaveAccount', language)}{' '}
                    <button onClick={() => setAuthMode('signup')} className="text-indigo-400 font-semibold hover:text-indigo-300">
                      {t('signUp', language)}
                    </button>
                  </div>
                </motion.div>
              )}

              {authMode === 'signup' && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col h-full"
                >
                  <button 
                    onClick={() => setAuthMode('select')}
                    className="w-10 h-10 rounded-full bg-[#1a1a1c] flex items-center justify-center mb-8 hover:bg-[#2a2a2c] transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <h2 className="text-3xl font-bold mb-2">{t('createAccount', language)}</h2>
                  <p className="text-white/60 mb-8">{t('startJourney', language)}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input 
                        type="text" 
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder={t('fullName', language)} 
                        className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input 
                        type="email" 
                        placeholder={t('emailAddress', language)} 
                        className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input 
                        type="password" 
                        placeholder={t('password', language)} 
                        className="w-full bg-[#1a1a1c] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (signupName.trim()) {
                        setProfileName(signupName.trim());
                      }
                      setIsLoggedIn(true);
                    }}
                    className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-semibold text-lg hover:bg-indigo-600 hover:scale-[0.98] transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  >
                    {t('signUp', language)}
                  </button>

                  <div className="mt-auto pt-8 text-center text-sm text-white/60">
                    {t('alreadyHaveAccount', language)}{' '}
                    <button onClick={() => setAuthMode('login')} className="text-indigo-400 font-semibold hover:text-indigo-300">
                      {t('logIn', language)}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0a0a0c] font-sans text-white relative overflow-hidden" style={getModeStyles()}>
        
        {/* Dynamic Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b ${currentStep === 0 ? 'from-indigo-500/20 to-purple-500/20' : currentStep <= planQuestions.length ? 'from-emerald-500/20 to-teal-500/20' : 'from-amber-500/20 to-orange-500/20'} opacity-40 transition-colors duration-700 ease-in-out`} />
        
        {/* Top Navigation */}
        <div className="relative z-30 flex justify-end px-6 pt-14 pb-2">
          {currentStep > 0 && currentStep <= planQuestions.length && (
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-sm font-medium text-white/50 hover:text-white transition-colors px-4 py-2 -ml-4 mr-auto"
            >
              {t('back', language) || "Back"}
            </button>
          )}
          {currentStep <= planQuestions.length && (
            <button 
              onClick={() => setIsCompleted(true)}
              className="text-sm font-medium text-white/50 hover:text-white transition-colors px-4 py-2 -mr-4"
            >
              {t('skip', language)}
            </button>
          )}
        </div>

        {/* Content Area */}
        {currentStep === 0 && (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key="language"
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center text-center w-full max-w-md"
              >
                <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8">
                  <Globe className="w-12 h-12 text-indigo-400" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-4 leading-tight">
                  {t('selectLanguage', language) || "Select Language"}
                </h2>
                <p className="text-[15px] text-white/60 leading-relaxed font-medium mb-8">
                  {t('chooseLanguageDesc', language) || "Choose your preferred language to continue."}
                </p>
                
                <div className="w-full space-y-3 max-h-[40vh] overflow-y-auto hide-scrollbar pb-4 px-2 -mx-2">
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'hi', name: 'हिंदी (Hindi)' },
                    { code: 'bn', name: 'বাংলা (Bengali)' },
                    { code: 'mr', name: 'मराठी (Marathi)' },
                    { code: 'te', name: 'తెలుగు (Telugu)' },
                    { code: 'ta', name: 'தமிழ் (Tamil)' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as Language);
                      }}
                      className={`w-full p-4 rounded-2xl border transition-all text-lg font-medium ${
                        language === lang.code 
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-white' 
                          : 'bg-[#1a1a1c] border-white/5 text-white/70 hover:bg-[#2a2a2c] hover:text-white'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full mt-4 h-14 rounded-2xl bg-white text-black font-semibold text-lg flex items-center justify-center gap-2 hover:scale-[0.98] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                >
                  {t('continue', language) || "Continue"}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {currentStep > 0 && currentStep <= planQuestions.length && (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="text-sm font-medium text-indigo-400">
                    {t('question', language)} {currentStep} {t('of', language)} {planQuestions.length}
                  </span>
                  <div className="flex gap-1">
                    {planQuestions.map((_, i) => (
                      <div key={i} className={`h-1.5 w-3 sm:w-4 rounded-full ${i < currentStep ? 'bg-indigo-500' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
                
                <h4 className="text-2xl font-bold mb-8 leading-tight text-center">
                  {t(planQuestions[currentStep - 1].question, language)}
                </h4>
                
                <div className="space-y-3">
                  {planQuestions[currentStep - 1].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const newAnswers = { ...planAnswers, [currentStep - 1]: option };
                        setPlanAnswers(newAnswers);
                        
                        if (currentStep < planQuestions.length) {
                          setCurrentStep(currentStep + 1);
                        } else {
                          setCurrentStep(currentStep + 1);
                          // Generate plan
                          setIsGeneratingPlan(true);
                          setTimeout(() => {
                            setIsGeneratingPlan(false);
                            setGeneratedPlan({
                              title: "focusLogicMaster",
                              description: "focusLogicDesc",
                              games: [
                                allGames.find(g => g.id === 'sudoku') || allGames[0],
                                allGames.find(g => g.id === 'sequence') || allGames[1],
                                allGames.find(g => g.id === 'reaction') || allGames[2]
                              ]
                            });
                            setCurrentStep(currentStep + 2);
                          }, 2500);
                        }
                      }}
                      className="w-full p-5 rounded-2xl bg-[#1a1a1c] hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/50 transition-all text-left font-medium text-lg"
                    >
                      {t(option, language)}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {currentStep === planQuestions.length + 1 && (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center text-center w-full max-w-md"
              >
                <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                  <Bot className="w-12 h-12 text-indigo-400" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-4 leading-tight">
                  {t('analyzingProfile', language) || "Analyzing Profile..."}
                </h2>
                <p className="text-[15px] text-white/60 leading-relaxed font-medium">
                  {t('creatingPlan', language) || "Creating your personalized training plan based on your answers."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {currentStep === planQuestions.length + 2 && (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex flex-col items-center text-center w-full max-w-md"
              >
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8 relative">
                  <Sparkles className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-4 leading-tight">
                  {t('planReady', language) || "Your Plan is Ready!"}
                </h2>
                <p className="text-[15px] text-white/60 leading-relaxed font-medium mb-12">
                  {t('planReadyDesc', language) || "We've created a personalized training plan to help you achieve your goals."}
                </p>
                
                <button
                  onClick={() => {
                    setIsCompleted(true);
                    setCurrentTab('coach');
                  }}
                  className="w-full h-14 rounded-2xl bg-white text-black font-semibold text-lg flex items-center justify-center gap-2 hover:scale-[0.98] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                >
                  {t('getStarted', language)}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
    </div>
  );
}

