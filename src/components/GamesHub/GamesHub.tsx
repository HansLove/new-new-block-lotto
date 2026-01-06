import {
  BoltIcon,
  ClockIcon,
  CpuChipIcon,
  CubeTransparentIcon,
  HeartIcon,
  PuzzlePieceIcon,
  SparklesIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  route: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Numbers' | 'Cards' | 'Divination' | 'Games' | 'Sequences';
}

const GamesHub = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const games: GameCard[] = [
    {
      id: 'random-number',
      title: 'Random Number Generator',
      description: 'Generate truly random numbers with cryptographic verification',
      icon: CpuChipIcon,
      color: 'from-blue-500 to-blue-600',
      route: '/games/random-number',
      difficulty: 'Easy',
      category: 'Numbers',
    },
    {
      id: 'pick-a-card',
      title: 'Pick a Card',
      description: 'Draw random cards from various decks with beautiful animations',
      icon: HeartIcon,
      color: 'from-red-500 to-red-600',
      route: '/games/pick-a-card',
      difficulty: 'Easy',
      category: 'Cards',
    },
    {
      id: 'magic-8-ball',
      title: 'Magic 8-Ball',
      description: 'Get mystical answers to your burning questions',
      icon: SparklesIcon,
      color: 'from-purple-500 to-purple-600',
      route: '/games/magic-8-ball',
      difficulty: 'Easy',
      category: 'Divination',
    },
    {
      id: 'shuffle-deck',
      title: 'Shuffle Deck',
      description: 'Shuffle and deal cards with perfect randomness',
      icon: PuzzlePieceIcon,
      color: 'from-green-500 to-green-600',
      route: '/games/shuffle-deck',
      difficulty: 'Medium',
      category: 'Cards',
    },
    {
      id: 'sequencer',
      title: 'Sequencer',
      description: 'Generate random sequences and patterns',
      icon: BoltIcon,
      color: 'from-yellow-500 to-yellow-600',
      route: '/games/sequencer',
      difficulty: 'Medium',
      category: 'Sequences',
    },
    {
      id: 'squares',
      title: 'Squares Game',
      description: 'Strategic game using random number generation',
      icon: StarIcon,
      color: 'from-indigo-500 to-indigo-600',
      route: '/games/squares',
      difficulty: 'Hard',
      category: 'Games',
    },
    {
      id: 'roll-a-dice',
      title: 'Roll a Dice',
      description: 'Roll virtual dice with true randomness',
      icon: CubeTransparentIcon,
      color: 'from-orange-500 to-orange-600',
      route: '/games/rollAdice',
      difficulty: 'Easy',
      category: 'Numbers',
    },
    {
      id: 'flip-a-coin',
      title: 'Flip a Coin',
      description: 'Flip virtual coins with verified randomness',
      icon: ClockIcon,
      color: 'from-teal-500 to-teal-600',
      route: '/games/flipAcoin',
      difficulty: 'Easy',
      category: 'Numbers',
    },
  ];

  const categories = ['All', ...Array.from(new Set(games.map(game => game.category)))];

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGameClick = (route: string) => {
    navigate(route);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400 bg-green-400/10';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'Hard':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" />
        <div className="absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="mb-6 flex items-center justify-center">
            <CubeTransparentIcon className="mr-4 h-16 w-16 text-purple-400" />
            <h1 className="text-5xl font-bold text-white">Games Hub</h1>
          </div>
          <p className="mx-auto max-w-3xl text-xl text-slate-300">
            Experience the power of true randomness through our collection of interactive games. Each game demonstrates
            the cryptographic verification and unpredictability that makes Caos Engine the most reliable randomness
            platform
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mx-auto mb-8 max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 pl-12 text-white placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <CubeTransparentIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGames.map(game => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game.route)}
              className="group transform cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50">
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                />

                <div className="relative p-6">
                  {/* Icon */}
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${game.color} mb-4 p-4 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25`}
                  >
                    <game.icon className="h-full w-full text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-purple-300">
                    {game.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-sm text-slate-400">{game.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getDifficultyColor(game.difficulty)}`}
                    >
                      {game.difficulty}
                    </span>
                    <div className="text-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <CubeTransparentIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredGames.length === 0 && (
          <div className="py-16 text-center">
            <CubeTransparentIcon className="mx-auto mb-4 h-16 w-16 text-slate-600" />
            <h3 className="mb-2 text-xl font-semibold text-slate-400">No games found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="text-center">
          <div className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-blue-600">
            <CpuChipIcon className="mr-2 h-5 w-5" />
            Explore API Documentation
          </div>
          <p className="mt-4 text-slate-400">Want to integrate true randomness into your own applications?</p>
        </div>
      </div>
    </div>
  );
};

export default GamesHub;
