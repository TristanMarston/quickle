'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { keyboardData } from '../../public/pagedata';

type InputBox = {
    id: number;
    text: string;
    locked: boolean;
    color: string;
};

type Key = {
    key: string;
    color: string;
    class?: string;
};

type Game = {
    guess: number;
    guesses: string[];
    finalWord: string;
    stopwatch: string;
    won?: boolean;
    id?: string;
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

    const generateID = (length: number) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    };

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
