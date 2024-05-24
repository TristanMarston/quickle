'use client';

import React, { createContext, useState, useContext } from 'react';
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

    return (
        <GameContext.Provider
            value={{ isRunning, setIsRunning, gamePaused, setGamePaused, inputs, setInputs, keyboard, setKeyboard, gamesPlayed, setGamesPlayed, prevGames, setPrevGames, modalOpened, setModalOpened }}
        >
            {children}
        </GameContext.Provider>
    );
};
