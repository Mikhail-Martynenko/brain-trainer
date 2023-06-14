import {Statistics, Session, Game} from '@/domain/domain';
import generator from '@/domain/generator';
import resolver from '@/domain/resolver';

export const maxDifficultyLevel = 10; // Максимальный уровень сложности

const statistics: Statistics = {
    sessions: [],
};

const session: Session = {
    id: Date.now().toString(),
    startTime: new Date(),
    endTime: null,
    score: 0,
    missed: 0,
    timer: 0
};

const game: Game = {
    statistics,
    config: {level: 1},
    session,
    generator,
    resolver,
};

export default game;
