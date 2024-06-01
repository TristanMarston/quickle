'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { keyboardData } from '../../public/pagedata';
import toast from 'react-hot-toast';
import { Fredoka } from 'next/font/google';

export const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });
export const fredokaBold = Fredoka({ weight: '700', subsets: ['latin'] });

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
};

// helper functions
export const generateID = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
    return result;
};

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

export const parseTime = (duration: string): number => {
    const [time, milliseconds] = duration.split('.');
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const mil = parseInt(milliseconds.slice(0, 2), 10);

    return hours * 3600000 + minutes * 60000 + seconds * 1000 + mil * 10;
};

export const failToast = (message: string) => {
    toast.error(message, {
        duration: 2000,
        position: 'top-center',
        className: `${fredokaBold.className} text-white text-lg`,
    });
};

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
    const [isRunning, setIsRunning] = useState(false);
    const [gamePaused, setGamePaused] = useState(false);
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
    const [isOver, setIsOver] = useState(false);

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') setDarkMode(true);

        const isHard = localStorage.getItem('hardMode');
        if (isHard === 'true') setHardMode(true);

        const sessionID = generateID(Math.random() * 10 + 5);
        sessionStorage.setItem('sessionID', sessionID);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

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
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
