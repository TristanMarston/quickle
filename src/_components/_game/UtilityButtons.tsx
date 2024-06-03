// imports all helper functions, icons, fonts, etc.
import { useGameContext, fredokaLight, parseTime, Game, formatTime } from '@/app/context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // premade component from shadcn/ui
import { CirclePause, Eye, EyeOff, RotateCcw, X } from 'lucide-react';
import { Nunito } from 'next/font/google';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const nunitoLight = Nunito({ weight: '500', subsets: ['latin'] }); // specific font for timer, doesn't shake like Fredoka which is used everywhere else in the project

const UtilityButtons = ({ stopGame }: { stopGame: (won: boolean) => void }) => {
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');

    const { stopwatchVisible, isRunning, gamePaused, setStopwatchVisible, setIsOver, setIsRunning, setGamePaused, setInputs, stopwatchTime, setStopwatchTime, guess, setGuess } =
        context;

    let elapsedTime = 0; // holds the number of milliseconds elapsed once the game has been started, to be formatted later

    // this useEffect() runs whenever stopwatchTime is changed, setting the elapsedTime variable to have the correct # of milliseconds
    useEffect(() => {
        elapsedTime = parseTime(stopwatchTime); // uses utility function from context.tsx
    }, [stopwatchTime]);

    /* 
        this useEffect() handles all the logic for the timer running, and will rerun every
        time the isRunning state is changed, stopping the timer from running if the game
        isn't actually running. to change the timer, this uses an interval which runs every
        10 milliseconds, adding 10 to the elapsedTime, and making sure that localStorage has
        the most up-to-date time, stopping the possibility of cheating
    */
    useEffect(() => {
        let intervalId: any = null;

        if (isRunning) {
            intervalId = setInterval(() => {
                const gameString: string | null = localStorage.getItem('currentGame'); // grabs the currentGame from local storage
                let game: Game;

                // if there is a currentGame, sets the elapsedTime variable to the number of milliseconds found in local storage
                if (gameString != null) {
                    game = JSON.parse(gameString) as Game;
                    if (game != null) {
                        const currentStopwatch = game.stopwatch;
                        if (currentStopwatch != null) elapsedTime = parseTime(currentStopwatch);
                    }
                }

                elapsedTime += 10; // adds 10 milliseconds to the time elapsed
                // formats and sets the actual timer displayed on the screen and sets the localStorage
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

    /* 
        this is the functional component returned from this file, displaying all of the buttons right above
        the input boxes. you can hide the timer by clicking the eye icon, which shifts the justification of
        the buttons to reduce white space.
    */
    return (
        <div className='flex justify-between items-center mb-3 w-[344px] max-mablet:w-[304px]'>
            <div className={`flex w-full transition-all ${!stopwatchVisible ? 'gap-[40%]' : 'gap-3 max-mablet:gap-2'}`}> {/* left side of buttons, shifts whether the stopwatch is visible or not */}
                {/* X icon in the far left, which stops the game, resulting in a loss, if clicked */}
                <X
                    className={`text-[#ed3a3a] w-8 h-8 max-mablet:w-7 max-mablet:h-7 hover:scale-105 transition-all cursor-pointer ${gamePaused ? 'opacity-0' : 'opacity-100'}`}
                    onClick={() => {
                        if (isRunning && !gamePaused) stopGame(false);
                    }}
                    strokeWidth={2.5}
                />
                {/* if the stopwatchVisible state is true, then a regular eye icon will be displayed, otherwise an eye with a line through it will be displayed (toggles visibility with click) */}
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
            {/* 
                this is the actual timer, and a 'tooltip' component is used so that, if the timer is hovered, then
                it will display the text 'copy to clipboard', because if you click the timer then it will copy your
                current time to the clipboard.
            */}
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
            {/* right side of buttons, has the same justification logic as the left side */}
            <div className={`flex w-full justify-end transition-all ${!stopwatchVisible ? 'gap-[40%]' : 'gap-3 max-mablet:gap-2'}`}>
                {/* this is the pause button, which will set the game to paused when clicked and will be hidden if the game is paused */}
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
                {/* this is the restart button, which, if no guesses have been made, will essentially just reset the timer (hidden if game paused) */}
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
