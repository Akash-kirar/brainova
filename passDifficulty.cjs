const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');
const games = [
  'ColorMatchFocusGame', 'CubeRotationPuzzleGame', 'EquationBuilderGame', 'HiddenPatternPuzzleGame',
  'MathSprintGame', 'NumberComparisonGame', 'OddOneOutGame', 'PatternLogicGame', 'PuzzleMatchGame',
  'SequenceLogicGame', 'SlidingPuzzleGame', 'SmartGridPuzzleGame', 'CardMatchGame', 'ColorMemoryGame',
  'ImageMemoryGame', 'MemoryGridGame', 'NumberRecallGame', 'PatternRecallGame', 'SequenceRecallGame',
  'WordMemoryGame', 'WordRecallGame', 'ColorReactionGame', 'FastButtonGame', 'FlashTapGame', 'FocusTapGame',
  'ReactionLightGame', 'ReactionSpeedGame', 'ReactionTapGame', 'ReactionTimerGame', 'SpeedCircleGame',
  'TapTheMovingDotGame', 'MissingLetterGame', 'VocabularyBuilderGame', 'VocabularyMatchGame', 'WordBuilderGame',
  'WordSearchGame', 'WordSequenceGame', 'WordSpeedGame'
];

games.forEach(game => {
  content = content.replace(new RegExp('<' + game + '\\\\s', 'g'), '<' + game + ' difficulty={gameDifficulty} ');
});

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('App.tsx updated');
