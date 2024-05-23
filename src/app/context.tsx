'use client';

import React, { createContext, useState, useContext } from 'react';

type InputBox = {
    id: number;
    text: string;
    locked: boolean;
    color: string;
};

type Context = {
    isRunning: boolean;
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
    gamePaused: boolean;
    setGamePaused: React.Dispatch<React.SetStateAction<boolean>>;
    inputs: InputBox[];
    setInputs: React.Dispatch<React.SetStateAction<InputBox[]>>;
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

    return <GameContext.Provider value={{ isRunning, setIsRunning, gamePaused, setGamePaused, inputs, setInputs }}>{children}</GameContext.Provider>;
};
