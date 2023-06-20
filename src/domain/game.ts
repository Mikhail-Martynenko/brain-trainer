import {Statistics, Game} from '@/domain/domain';
import TaskGenerator from "@/domain/taskGenerator";
import ResolverImpl from "@/domain/resolver";
import CurrentSession from "@/domain/session";

export const MAX_DIFFICULTY_LEVEL = 10 as const;

class GameController implements Game {
    statistics: Statistics;
    session: CurrentSession;
    config;
    generator: TaskGenerator;
    resolver: ResolverImpl;

    constructor() {
        this.statistics = {
            sessions: [],
        };

        this.session = new CurrentSession("1", new Date(), null, 0, 0, 7);
        this.generator = new TaskGenerator();
        this.resolver = new ResolverImpl();
        this.config = {level: 1}
    }
}

const game = new GameController()

export default game;
