import { reactive } from 'vue';
import { Statistics, Session, Game } from '@/domain/domain';
import generator from '@/domain/generator';
import resolver from '@/domain/resolver';

const statistics: Statistics = reactive({
    sessions: [],
});

const session: Session = {
    id: '',
    startTime: new Date(),
    endTime: null,
    score: 0,
};

const game: Game = {
    statistics,
    config: { level: 1 },
    session,
    generator,
    resolver,
};

export default game;
