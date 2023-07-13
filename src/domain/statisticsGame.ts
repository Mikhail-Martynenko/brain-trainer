import {Session, Statistics} from "@/domain/domain";

const NEW_USER_WELCOMING_BONUS_SESSION = {
    id: Date.now().toString(),
    startTime: new Date(),
    endTime: new Date(),
    score: 25,
    missed: 5,
    timer: 7,
};

class StatisticsGame {
    statistics: Statistics;

    constructor() {
        this.statistics = {
            sessions: [NEW_USER_WELCOMING_BONUS_SESSION],
        };
    }

    getLastSession() {
        return this.statistics.sessions[this.statistics.sessions.length - 1];
    }

    getAccuracy() {
        const lastSession = this.getLastSession();
        if (!lastSession) return 0;
        const total = lastSession.score + lastSession.missed;
        if (total === 0) return 0;
        return (lastSession.score / total) * 100 >> 0;
    }

    startSession(session: Session) {
        this.statistics.sessions.push(session);
    }

    incrementScore() {
        const lastSession = this.getLastSession();
        if (!lastSession) return;
        lastSession.score += 1;
    }

    incrementMissed() {
        const lastSession = this.getLastSession();
        if (!lastSession) return;
        lastSession.missed += 1;
    }
}

const statisticsGame = new StatisticsGame();

export default statisticsGame;
