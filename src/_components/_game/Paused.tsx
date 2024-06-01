'use client';

import { useGameContext, fredokaBold } from '@/app/context';
import { Pause, X } from 'lucide-react';
import { InputBox } from '@/app/context';

const PausedModal = ({ stopGame }: { stopGame: (won: boolean) => void }) => {
    const context = useGameContext();
    if (context === undefined) {
        throw new Error('useContext(GameContext) must be used within a GameContext.Provider');
    }
    const { isRunning, setIsRunning, gamePaused, setGamePaused, inputs } = context;

    return !isRunning && gamePaused ? (
        <div className='absolute flex flex-col items-center max-mobile:w-[304px] w-[344px] z-50'>
            <h1 className={`${fredokaBold.className} text-3xl`}>Game Paused</h1>
            <div className='grid grid-rows-6 grid-cols-5 gap-2 mt-2 mb-4'>
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
        <div className='absolute'></div>
    );
};

export default PausedModal;
