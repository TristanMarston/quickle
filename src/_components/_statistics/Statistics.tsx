'use client';

import { useGameContext } from '@/app/context';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Power, RotateCcw, X } from 'lucide-react';
import { Fredoka } from 'next/font/google';
import { useEffect, useState } from 'react';
import ShownSliders from './ShownSliders';

const fredokaBold = Fredoka({ weight: '700', subsets: ['latin'] });
const fredokaSemiBold = Fredoka({ weight: '500', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

type Game = {
    guess: number;
    guesses: string[];
    finalWord: string;
    stopwatch: string;
    won?: boolean;
    id?: string;
    hardMode?: boolean;
    sessionID?: string;
};

type Stats = {
    guessNumbers: [number, number, number, number, number, number];
    currentStreak: number;
    bestStreak: number;
    timesPlayed: number;
    timesWon: number;
    timesLost: number;
    averageTime: string;
    fastestTime: string;
    winPercentage: number;
    statType: string;
};

const Statistics = () => {
    const context = useGameContext();
    if (context === undefined) {
        throw new Error('useContext(GameContext) must be used within a GameContext.Provider');
    }

    const { prevGames, setPrevGames, modalOpened, setModalOpened, shownStats, setShownStats } = context;
    const [formattedStats, setFormattedStats] = useState<Stats>({
        guessNumbers: [0, 0, 0, 0, 0, 0],
        currentStreak: 0,
        bestStreak: 0,
        timesPlayed: 0,
        timesWon: 0,
        timesLost: 0,
        averageTime: '00:00:00.000',
        fastestTime: '00:00:00.000',
        winPercentage: 0,
        statType: 'normal',
    });
    const [alertDialogOpened, setAlertDialogOpened] = useState(false);

    useEffect(() => {
        const gamesPlayedString = localStorage.getItem('gamesPlayed');

        if (gamesPlayedString !== null) {
            setPrevGames([...removeDuplicates(JSON.parse(gamesPlayedString) as Game[])]);
        }
    }, []);

    useEffect(() => {
        const stats: Stats = {
            guessNumbers: [0, 0, 0, 0, 0, 0],
            currentStreak: 0,
            bestStreak: 0,
            timesPlayed: 0,
            timesWon: 0,
            timesLost: 0,
            averageTime: '00:00:00.000',
            fastestTime: '00:00:00.000',
            winPercentage: 0,
            statType: shownStats,
        };

        let totalTime = 0;

        prevGames.forEach((game: Game) => {
            if (
                (shownStats.toLowerCase() == 'hard' && game.hardMode) ||
                (shownStats.toLowerCase() == 'normal' && !game.hardMode) ||
                (shownStats.toLowerCase() == 'session' && game.sessionID == sessionStorage.getItem('sessionID')) ||
                shownStats.toLowerCase() == 'total'
            ) {
                stats.timesPlayed++;

                if (game.won) {
                    stats.currentStreak++;
                    stats.timesWon++;
                    stats.guessNumbers[game.guess - 1]++;
                    stats.fastestTime = parseTime(game.stopwatch) < parseTime(stats.fastestTime) || parseTime(stats.fastestTime) == 0 ? game.stopwatch : stats.fastestTime;
                    totalTime += parseTime(game.stopwatch);
                } else {
                    stats.currentStreak = 0;
                    stats.timesLost++;
                }

                stats.bestStreak = stats.currentStreak > stats.bestStreak ? stats.currentStreak : stats.bestStreak;
            }
        });

        stats.averageTime = formatTime(totalTime / (stats.timesWon == 0 ? 1 : stats.timesWon));
        stats.winPercentage = parseFloat(((stats.timesWon / (stats.timesPlayed == 0 ? 1 : stats.timesPlayed)) * 100).toFixed());
        // for (let i = 0; i < stats.guessNumbers.length; i++) stats.guessNumbers[i] -= 1;

        setFormattedStats(stats);
    }, [prevGames, shownStats]);

    useEffect(() => console.log(formattedStats.guessNumbers.length), [formattedStats]);

    const formatTime = (elapsedTime: number) => {
        let milliseconds = Math.floor((elapsedTime % 1000) / 10);
        let seconds = Math.floor((elapsedTime % 60000) / 1000);
        let minutes = Math.floor((elapsedTime % 3600000) / 60000);
        let hours = Math.floor(elapsedTime / 3600000);
        return (
            (hours ? (hours > 9 ? hours : '0' + hours) : '00') +
            ':' +
            (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') +
            ':' +
            (seconds ? (seconds > 9 ? seconds : '0' + seconds) : '00') +
            '.' +
            (milliseconds > 9 ? milliseconds + '0' : '0' + milliseconds + '0')
        );
    };

    const parseTime = (duration: string): number => {
        const [time, milliseconds] = duration.split('.');
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const mil = parseInt(milliseconds.slice(0, 2), 10);

        return hours * 3600000 + minutes * 60000 + seconds * 1000 + mil * 10;
    };

    const removeDuplicates = (games: Game[]): Game[] => {
        const seenIds = new Map<string | undefined, Game>();

        games.forEach((game) => {
            if (game.id && !seenIds.has(game.id)) seenIds.set(game.id, game);
            else if (!game.id) seenIds.set(undefined, game);
        });

        return Array.from(seenIds.values());
    };

    const generateID = (length: number) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    };

    return (
        <div className='w-full px-6 py-4'>
            <X className='absolute right-4 text-gray-400 w-4 h-4 hover:scale-105 transition-all cursor-pointer' onClick={() => setModalOpened(false)} />
            <h1 className={`${fredokaBold.className} text-4xl text-center mb-3`}>Statistics</h1>
            <div className='flex w-full justify-between mb-4'>
                {[
                    { text: 'games played', stat: formattedStats.timesPlayed },
                    { text: 'success percentage', stat: `${isNaN(formattedStats.winPercentage) ? 0 : formattedStats.winPercentage}%` },
                    { text: 'current streak', stat: formattedStats.currentStreak },
                    { text: 'best streak', stat: formattedStats.bestStreak },
                ].map((info) => (
                    <div className='flex flex-col justify-center items-center' key={info.text}>
                        <p className={`${fredokaBold.className} text-3xl max-mablet:text-[1.65rem] tracking-wider`}>{info.stat}</p>
                        <p className={`${fredokaSemiBold.className} text-xl max-mablet:text-base text-center`}>
                            {info.text.split(' ')[0]}
                            <br />
                            {info.text.split(' ')[1]}
                        </p>
                    </div>
                ))}
            </div>
            <h3 className={`${fredokaSemiBold.className} text-2xl text-center`}>guess distribution</h3>
            <div className='flex flex-col gap-2 mb-4'>
                {formattedStats.guessNumbers.slice(0, 6).map((amount, index) => (
                    <div className={`${fredokaLight.className} flex gap-2 items-center`} key={index + amount + generateID(index * 2)}>
                        <p className='w-2'>{index + 1}</p>
                        <div
                            style={{ width: `${amount !== 0 ? (amount / formattedStats.timesWon) * 100 : 4}%` }}
                            className={`bg-gray-500 h-4 flex items-center ${amount === 0 ? 'justify-center' : 'justify-end p-2'}`}
                        >
                            <p className={`${fredokaSemiBold.className} text-white text-sm`}>{amount}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex justify-between mb-3'>
                <div className='flex flex-col items-center w-full'>
                    <h3 className={`${fredokaSemiBold.className} text-2xl max-mablet:text-[1.35rem] max-mobile:text-xl`}>fastest time</h3>
                    <h5 className={`${fredokaLight.className} text-lg max-mablet:text-base`}>{formattedStats.fastestTime}</h5>
                </div>
                <div className='flex flex-col items-center w-full'>
                    <h3 className={`${fredokaSemiBold.className} text-2xl max-mablet:text-[1.35rem] max-mobile:text-xl`}>average time</h3>
                    <h5 className={`${fredokaLight.className} text-lg max-mablet:text-base`}>{formattedStats.timesWon === 0 ? '00:00:00.000' : formattedStats.averageTime}</h5>
                </div>
            </div>
            {/* <div className='flex gap-5 px-5 w-full'>
                <AlertDialog open={alertDialogOpened} onOpenChange={setAlertDialogOpened}>
                    <AlertDialogTrigger
                        className={`${fredokaBold.className} cursor-pointer hover:bg-[#4d4d4d] tracking-[0.065em] text-lg w-full h-11 transition-all bg-black text-white rounded-full flex items-center justify-center gap-2 shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
                        onClick={() => {
                            setModalOpened(false);
                            setAlertDialogOpened(true);
                        }}
                    >
                        <RotateCcw />
                        Reset Stats
                    </AlertDialogTrigger>
                    <AlertDialogContent className={`${fredokaLight.className}`}>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <button
                    className={`${fredokaBold.className} cursor-pointer hover:bg-[#e6e6e6] tracking-[0.065em] text-lg w-full h-11 transition-all bg-white text-black rounded-full flex items-center justify-center gap-2 shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
                >
                    <Power />
                    Start Session
                </button>
            </div> */}
            <ShownSliders />
        </div>
    );
};

export default Statistics;
