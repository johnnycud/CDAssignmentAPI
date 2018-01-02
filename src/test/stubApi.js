import _ from 'lodash';

class StubAPI {

    constructor() {
        this.teachers = [
            {
                name: "Jim Hoskins",
                score: 31,
                id: 1,
            },
            {
                name: "Andrew Chalkley",
                score: 35,
                id: 2,
            },
            {
                name: "Alena Holligan",
                score: 42,
                id: 3,
            },
        ];
        var nextId = 4;
        
    }

    delete(k) {
        let elements = _.remove(this.players,
            (player) => player.id === k
        );
        return elements;
    }
    getAll() {
        return this.players;
    }

    add(n, s) {
        let len = this.players.length;
        let newLen = this.players.push({
            name: n, score: s
        });
        return newLen > len;
    }

    update(key, n, s) {
        var index = _.findIndex(this.players,
            (player) => player.id === key
        );
        if (index !== -1) {
            this.players.splice(index, 1,
                { name: n, score: s });
            return true;
        }
        return false;
    }

}

export default (new StubAPI());