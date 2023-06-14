import {createStore} from 'vuex';
import {Session, Statistics} from "@/domain/domain";

const sessionStore = createStore<Statistics>({
    state: {
        sessions: [
            {
                id: Date.now().toString(),
                startTime: new Date(),
                endTime: null,
                score: 25,
                missed: 5,
            }
        ],
    },
    getters: {
        getLastSession: state => state.sessions[state.sessions.length - 1],
        getAccuracy: (state) => {
            const lastSession = state.sessions[state.sessions.length - 1];
            if (!lastSession) return 0;
            const total = lastSession.score + lastSession.missed;
            if (total === 0) return 0;
            return (lastSession.score / total) * 100 >> 0 ;
        },
    },
    actions: {
        startSession({state}, session: Session) {
            state.sessions.push(session);
            console.log(state, 'STATE')
        },
        endSession({state}, session: Session) {
            const index = state.sessions.findIndex(s => s.id === session.id);
            if (index === -1) return;
            state.sessions.splice(index, 1, session);
        },
        incrementScore({state}) {
            const lastSession = state.sessions[state.sessions.length - 1];
            if (!lastSession) return;
            lastSession.score += 1;
        },
        incrementMissed({state}) {
            const lastSession = state.sessions[state.sessions.length - 1];
            if (!lastSession) return;
            lastSession.missed += 1;
        },
    }
});

export default sessionStore;