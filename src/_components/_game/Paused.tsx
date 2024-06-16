'use client';

import { useGameContext, fredokaBold, InputBox } from '@/app/context'; // imports context, font, and InputBox type
import { Pause, X } from 'lucide-react'; // icons

const PausedModal = ({ stopGame }: { stopGame: (won: boolean) => void }) => {
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');

    const { isRunning, setIsRunning, gamePaused, setGamePaused, inputs, guessLength } = context;
    const colClasses = ['grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6', 'grid-cols-7'];

    /* 
        this functional component will return an absolutely positioned pop-up, which displays
        the current state of the game without providing any hints, because the game is paused
        while this component is visible. there are two buttons in this component, one to give up
        the current game and one to continue the current game
    */
    return !isRunning && gamePaused ? (
        <div className='absolute flex flex-col items-center left-1/2 -translate-x-1/2 max-mobile:w-[304px] w-[344px] z-50'>
            <h1 className={`${fredokaBold.className} text-3xl`}>Game Paused</h1>
            <div className={`grid grid-rows-6 ${colClasses[guessLength - 3]} gap-2 mt-2 mb-4`}>
                {' '}
                {/* mini version of input boxes, without any letters */}
                {inputs.map((box: InputBox) => {
                    let color =
                        box.color.toLowerCase() == 'green'
                            ? 'bg-[#6aaa64]'
                            : box.color.toLowerCase() == 'yellow'
                            ? 'bg-[#c9b458]'
                            : box.color.toLowerCase() == 'gray'
                            ? 'bg-[#787c7e]'
                            : 'dark:border-gray-400';

                    return <div key={box.id} className={`w-6 h-6 border border-black shadow-sm ${color}`}></div>;
                })}
            </div>
            {/* these are the two buttons, the first will resume the game as normal, and the second will result in a loss to the current game (affecting stats) */}
            <div className='flex gap-5 px-5 w-full'>
                <button
                    className={`${fredokaBold.className} cursor-pointer hover:bg-[#4d4d4d] dark:bg-foreground dark:text-background dark:hover:bg-white tracking-[0.065em] text-lg w-full h-11 transition-all bg-black text-white rounded-full flex items-center justify-center gap-2 shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
                    onClick={() => {
                        setIsRunning(true);
                        setGamePaused(false);
                    }}
                >
                    <Pause />
                    Resume
                </button>
                <button
                    className={`${fredokaBold.className} cursor-pointer hover:bg-[#e6e6e6] dark:bg-background dark:text-foreground dark:hover:bg-[#4d4d4d] tracking-[0.065em] text-lg w-full h-11 transition-all bg-white text-black rounded-full flex items-center justify-center gap-2 shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
                    onClick={() => {
                        stopGame(false);
                        localStorage.setItem('currentGame', 'null');
                    }}
                >
                    <X />
                    Give Up
                </button>
            </div>
        </div>
    ) : (
        // if the game isn't paused, returns an empty div which doesn't affect anything
        <div className='absolute'></div>
    );
};

export default PausedModal;
