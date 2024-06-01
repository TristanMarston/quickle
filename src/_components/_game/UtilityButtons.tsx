import { useGameContext, fredokaLight, parseTime, Game, formatTime } from '@/app/context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CirclePause, Eye, EyeOff, RotateCcw, X } from 'lucide-react';
import { Nunito } from 'next/font/google';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const nunitoLight = Nunito({ weight: '500', subsets: ['latin'] });

const UtilityButtons = ({ stopGame }: { stopGame: (won: boolean) => void }) => {
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');

    const { stopwatchVisible, isRunning, gamePaused, setStopwatchVisible, setIsOver, setIsRunning, setGamePaused, setInputs, stopwatchTime, setStopwatchTime, guess, setGuess } =
        context;

    let elapsedTime = 0;

    useEffect(() => {
        elapsedTime = parseTime(stopwatchTime);
    }, [stopwatchTime]);

    useEffect(() => {
        let intervalId: any = null;

        if (isRunning) {
            intervalId = setInterval(() => {
                const gameString: string | null = localStorage.getItem('currentGame');
                let game: Game;
                if (gameString != null) {
                    game = JSON.parse(gameString) as Game;
                    if (game != null) {
                        const currentStopwatch = game.stopwatch;
                        if (currentStopwatch != null) elapsedTime = parseTime(currentStopwatch);
                    }
                }

                elapsedTime += 10;
                setStopwatchTime(() => {
                    if (gameString != null && game != null) {
                        game.stopwatch = formatTime(elapsedTime);
                        localStorage.setItem('currentGame', JSON.stringify(game));
                    }

                    return formatTime(elapsedTime);
                });
            }, 10);
        } else {
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning]);

    return (
        <div className='flex justify-between items-center mb-3 w-[344px] max-mablet:w-[304px]'>
            <div className={`flex w-full transition-all ${!stopwatchVisible ? 'gap-[40%]' : 'gap-3 max-mablet:gap-2'}`}>
                <X
                    className={`text-[#ed3a3a] w-8 h-8 max-mablet:w-7 max-mablet:h-7 hover:scale-105 transition-all cursor-pointer ${gamePaused ? 'opacity-0' : 'opacity-100'}`}
                    onClick={() => {
                        if (isRunning && !gamePaused) stopGame(false);
                    }}
                    strokeWidth={2.5}
                />
                {stopwatchVisible ? (
                    <Eye
                        className={`text-[#076cad] w-8 h-8 max-mablet:w-7 max-mablet:h-7 hover:scale-105 transition-all cursor-pointer ${gamePaused ? 'opacity-0' : 'opacity-100'}`}
                        onClick={() => setStopwatchVisible(false)}
                        strokeWidth={2.5}
                    />
                ) : (
                    <EyeOff
                        className={`text-[#076cad] w-8 h-8 max-mablet:w-7 max-mablet:h-7 hover:scale-105 transition-all cursor-pointer ${gamePaused ? 'opacity-0' : 'opacity-100'}`}
                        onClick={() => setStopwatchVisible(true)}
                        strokeWidth={2.5}
                    />
                )}
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger
                        className={`${nunitoLight.className} ${!stopwatchVisible ? 'hidden' : 'block'} text-2xl cursor-pointer select-none`}
                        onClick={() => {
                            toast.success('Copied to Clipboard!', {
                                duration: 3000,
                                position: 'bottom-right',
                                className: `${fredokaLight.className}`,
                            });
                            navigator.clipboard.writeText(stopwatchTime);
                        }}
                    >
                        {stopwatchTime}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className={`${fredokaLight.className}`}>copy to clipboard</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className={`flex w-full justify-end transition-all ${!stopwatchVisible ? 'gap-[40%]' : 'gap-3 max-mablet:gap-2'}`}>
                <CirclePause
                    className={`text-[#6207ad] w-8 h-8 max-mablet:w-7 max-mablet:h-7 hover:scale-105 transition-all cursor-pointer ${gamePaused ? 'opacity-0' : 'opacity-100'}`}
                    onClick={() => {
                        if (isRunning) {
                            setIsRunning(false);
                            setIsOver(false);
                            setGamePaused(true);
                        }
                    }}
                    strokeWidth={2.5}
                />
                <RotateCcw
                    className={`${guess == 1 ? 'text-[#10b710] cursor-pointer' : 'text-[#e2e0dd] cursor-not-allowed'} ${
                        gamePaused ? 'opacity-0' : 'opacity-100'
                    } w-8 h-8 hover:scale-105 transition-all cursor-pointer max-mablet:w-7 max-mablet:h-7`}
                    onClick={() => {
                        if (guess == 1) {
                            setIsRunning(false);
                            setInputs((prev) => {
                                let tempInputs = [...prev];
                                tempInputs.forEach((input) => {
                                    input.text = '';
                                    input.color = 'none';
                                });
                                return tempInputs;
                            });
                            elapsedTime = 0;
                            setStopwatchTime('00:00:00.000');
                        }
                    }}
                    strokeWidth={2.5}
                />
            </div>
        </div>
    );
};

export default UtilityButtons;
