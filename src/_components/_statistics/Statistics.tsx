'use client';

import { useGameContext, Stats } from '@/app/context';
import { X } from 'lucide-react'; // X icon for modal
import { Fredoka } from 'next/font/google'; // specific font weight local to this file
import { useEffect, useState } from 'react';
import ShownSliders from './ShownSliders'; // functional component for sliders at the bottom of modal
import { Game, formatTime, parseTime, fredokaBold, fredokaLight, generateID, removeDuplicates } from '@/app/context'; // helper functions, types, fonts

const fredokaSemiBold = Fredoka({ weight: '500', subsets: ['latin'] });

const Statistics = () => {
    const context = useGameContext();
    if (context === undefined) throw new Error('useContext(GameContext) must be used within a GameContext.Provider');

    const { prevGames, setPrevGames, setModalOpened, shownStats, formattedStats, setFormattedStats } = context;
    // base statistics, when no games have been played yet

    // this useEffect() runs when the browser is launched, grabbing the current games played from local storage and removing any duplicates using the utility function in context.tsx
    useEffect(() => {
        const gamesPlayedString = localStorage.getItem('gamesPlayed');

        if (gamesPlayedString !== null) {
            setPrevGames([...removeDuplicates(JSON.parse(gamesPlayedString) as Game[])]);
        }
    }, []);

    /* 
        this useEffect() will run whenever prevGames or shownStats is changed, and it updates the
        current formattedStatistics to show the most recent statistics or sorted statistics, depending
        on what the shownStats is.
    */
    useEffect(() => {
        // making a temporary formatted stats object
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

        let totalTime = 0; // will have the total time in ms, later used to calculate average

        prevGames.forEach((game: Game) => { // iterates through all the games ever played
            // this if statement filters which stats you're currently looking at, whether it's the total, normal, hard, or session
            if (
                (shownStats.toLowerCase() == 'hard' && game.hardMode) ||
                (shownStats.toLowerCase() == 'normal' && !game.hardMode) ||
                (shownStats.toLowerCase() == 'session' && game.sessionID == sessionStorage.getItem('sessionID')) || // checks that the game has the same sessionID as the current sessionID stored in sessionStorage
                shownStats.toLowerCase() == 'total'
            ) {
                // adds properties of current game to the statistics

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

        // these two are calculated after the totals have been calculated
        stats.averageTime = formatTime(totalTime / (stats.timesWon == 0 ? 1 : stats.timesWon));
        stats.winPercentage = parseFloat(((stats.timesWon / (stats.timesPlayed == 0 ? 1 : stats.timesPlayed)) * 100).toFixed()); // need to round it to a whole number

        setFormattedStats(stats); // lastly, setting the state, which changes what's displayed in the statistics page
    }, [prevGames, shownStats]);

    return (
        <div className='w-full px-6 py-4'>
            {/* X icon in the top right of the modal, the premade one didn't work with code */}
            <X className='absolute right-4 text-gray-400 w-4 h-4 hover:scale-105 transition-all cursor-pointer' onClick={() => setModalOpened(false)} />
            <h1 className={`${fredokaBold.className} text-4xl text-center mb-3`}>Statistics</h1>
            <div className='flex w-full justify-between mb-4'>
                {/* making display array inline to save having to write similar code 4 times */}
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
                {/* iterates through the guessNumbers array in the formattedStats to save writing too much code */}
                {formattedStats.guessNumbers.slice(0, 6).map((amount, index) => (
                    <div className={`${fredokaLight.className} flex gap-2 items-center`} key={index + amount + generateID(index * 2)}> {/* had an issue with duplicate keys, had to use generateID to stop multiple from rendering */}
                        <p className='w-2'>{index + 1}</p>
                        <div
                            style={{ width: `${amount !== 0 ? (amount / formattedStats.timesWon) * 100 : 4}%` }} // has different width depending on how many times it has been guessed in that many attempts
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
            <ShownSliders /> {/* has all the sliders at the bottom of the page, Statistics is the parent and this is the only place ShownSliders is called */}
        </div>
    );
};

export default Statistics;
