'use client';

// importing all packages/data
import { createContext, useState, useContext, useEffect } from 'react';
import { keyboardData } from '../../public/pagedata'; // has all information about keys
import toast from 'react-hot-toast'; // for little information displayed at top of screen, like "you win!" or "you lose!"
import { Fredoka } from 'next/font/google'; // primary font I use for this project

// defining my fonts and the font weights
export const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });
export const fredokaBold = Fredoka({ weight: '700', subsets: ['latin'] });

// types (classes-ish)
export type InputBox = {
    id: number;
    text: string;
    locked: boolean;
    color: string;
};

export type Key = {
    key: string;
    color: string;
    class?: string;
};

export type Game = {
    guess: number;
    guesses: string[];
    finalWord: string;
    stopwatch: string;
    won?: boolean;
    id?: string;
    hardMode?: boolean;
    sessionID?: string | null | undefined;
};

// all of the state (global variables) that I'm exporting out of this file to use anywhere
type Context = {
    isRunning: boolean;
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
    gamePaused: boolean;
    setGamePaused: React.Dispatch<React.SetStateAction<boolean>>;
    inputs: InputBox[];
    setInputs: React.Dispatch<React.SetStateAction<InputBox[]>>;
    keyboard: Key[][];
    setKeyboard: React.Dispatch<React.SetStateAction<Key[][]>>;
    gamesPlayed: Game[];
    setGamesPlayed: React.Dispatch<React.SetStateAction<Game[]>>;
    prevGames: Game[];
    setPrevGames: React.Dispatch<React.SetStateAction<Game[]>>;
    modalOpened: boolean;
    setModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
    stopwatchVisible: boolean;
    setStopwatchVisible: React.Dispatch<React.SetStateAction<boolean>>;
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    settingsModalOpened: boolean;
    setSettingsModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
    hardMode: boolean;
    setHardMode: React.Dispatch<React.SetStateAction<boolean>>;
    shownStats: string;
    setShownStats: React.Dispatch<React.SetStateAction<string>>;
    isOver: boolean;
    setIsOver: React.Dispatch<React.SetStateAction<boolean>>;
    stopwatchTime: string;
    setStopwatchTime: React.Dispatch<React.SetStateAction<string>>;
    guess: number;
    setGuess: React.Dispatch<React.SetStateAction<number>>;
};

// helper functions, exported to use anywhere in project

/* 
    this helper function generates a random id with a length of whatever is passed
    as a parameter to the generateID function. this generateID helper function is used
    to generate id's for the session and games to ensure there are no duplicates
*/
export const generateID = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
    return result;
};

/*
    this helper function removes any duplicate games from a games (Game[])
    array using the assigned ID's in the stopGame() function, returning the games array without
    any duplicate games. 
*/
export const removeDuplicates = (games: Game[]): Game[] => {
    const seenIds = new Map<string | undefined, Game>();

    games.forEach((game) => {
        if (game.id && !seenIds.has(game.id)) seenIds.set(game.id, game);
        else if (!game.id) seenIds.set(undefined, game);
    });

    return Array.from(seenIds.values());
};


/* 
    this helper function takes in a number of milliseconds, and formats it like 
    this: "hr:mn:sc:mil". So, if a minute has passed, it will format it to "00:01:00.000"
    
*/
export const formatTime = (elapsedTime: number) => {
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

/* 
    this helper function reverses the previous one, by taking in a formatted string, then
    returning the number of milliseconds that have passed. all times will be formatted in
    the same way, so i don't have to worry about this specific parsing of the string not working
*/
export const parseTime = (duration: string): number => {
    const [time, milliseconds] = duration.split('.');
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const mil = parseInt(milliseconds.slice(0, 2), 10);

    return hours * 3600000 + minutes * 60000 + seconds * 1000 + mil * 10;
};

// this helper function takes in a string message, then displays a toast with an "X", representing failure
export const failToast = (message: string) => {
    toast.error(message, {
        duration: 2000,
        position: 'top-center',
        className: `${fredokaBold.className} text-white text-lg`,
    });
};

// this helper function takes in a string message, then displays a toast with a check, representing success
export const successToast = (message: string) => {
    toast.success(message, {
        duration: 2000,
        position: 'top-center',
        className: `${fredokaBold.className} text-white text-lg`,
    });
};

// Create the context
const GameContext = createContext<Context | undefined>(undefined);

// Create a custom hook to use the context
export const useGameContext = () => useContext(GameContext);

// Create the provider component
export const GameProvider = ({ children }: any) => {
    // the following three variables are very similar, but have different functionalities
    const [isRunning, setIsRunning] = useState(false);  // this state says whether or not a game is CURRENTLY running (timer going)
    const [gamePaused, setGamePaused] = useState(false); // this state says whether or not a game is paused
    const [isOver, setIsOver] = useState(false); // this state says whether a game has either been won or lost, resets if the board is reset
    const [inputs, setInputs] = useState<InputBox[]>(() => {
        const newInputs: InputBox[] = [];
        for (let i = 0; i < 30; i++) newInputs[i] = { id: i, text: '', locked: false, color: 'none' };
        return newInputs;
    });
    const [keyboard, setKeyboard] = useState<Key[][]>(keyboardData);
    const [gamesPlayed, setGamesPlayed] = useState<Game[]>([]);
    const [prevGames, setPrevGames] = useState<Game[]>([]);
    const [modalOpened, setModalOpened] = useState(false);
    const [stopwatchVisible, setStopwatchVisible] = useState(true);
    const [settingsModalOpened, setSettingsModalOpened] = useState(false);
    const [hardMode, setHardMode] = useState(false);
    const [shownStats, setShownStats] = useState('total');
    const [stopwatchTime, setStopwatchTime] = useState<string>('00:00:00.000');
    const [guess, setGuess] = useState(1);

    const [darkMode, setDarkMode] = useState(false);

    /* 
        this useEffect() runs right after launch, depicted by the empty dependency array ([]),
        and accesses local storage to set the local variables of darkMode and hardMode, in addition
        to setting the sessionStorage to have an ID which refreshes every time the browser is reloaded
    */
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') setDarkMode(true);

        const isHard = localStorage.getItem('hardMode');
        if (isHard === 'true') setHardMode(true);

        const sessionID = generateID(Math.random() * 10 + 5);
        sessionStorage.setItem('sessionID', sessionID);
    }, []);

    /*
        this useEffect() runs whenever the darkMode state is changed, and it sets the localStorage
        value of 'darkMode' so that it saves even if the browser is closed
    */
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    /*
        same thing with the previous useEffect(), this runs whenever the hardMode state is changed,
        and it sets the localStorage value of 'hardMode' so that it saves.
    */
    useEffect(() => {
        if (hardMode) localStorage.setItem('hardMode', 'true');
        else localStorage.setItem('hardMode', 'false');
    }, [hardMode]);

    return (
        <GameContext.Provider
            value={{
                isRunning,
                setIsRunning,
                gamePaused,
                setGamePaused,
                inputs,
                setInputs,
                keyboard,
                setKeyboard,
                gamesPlayed,
                setGamesPlayed,
                prevGames,
                setPrevGames,
                modalOpened,
                setModalOpened,
                stopwatchVisible,
                setStopwatchVisible,
                darkMode,
                setDarkMode,
                settingsModalOpened,
                setSettingsModalOpened,
                hardMode,
                setHardMode,
                shownStats,
                setShownStats,
                isOver,
                setIsOver,
                stopwatchTime,
                setStopwatchTime,
                guess,
                setGuess
            }}
        >
            {children} {/* refers to all the children of the provider, found in page.tsx */}
        </GameContext.Provider>
    );
};
